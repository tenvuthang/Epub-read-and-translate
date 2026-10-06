import { useState, useRef, useCallback } from "react";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { EpubJsEngine } from "./lib/reader-engine/EpubJsEngine";
import type { ReaderEngine, TocItem } from "./lib/reader-engine";
import { Sidebar } from "./components/Sidebar";
import "./App.css";

// ── localStorage helpers for reading position (≤ 20 lines, ADR optional) ──
const POSITION_KEY = "epub-reader:positions";

function savePosition(filePath: string, cfi: string) {
  try {
    const stored = JSON.parse(localStorage.getItem(POSITION_KEY) ?? "{}");
    stored[filePath] = cfi;
    localStorage.setItem(POSITION_KEY, JSON.stringify(stored));
  } catch (_) {}
}

function loadPosition(filePath: string): string | null {
  try {
    const stored = JSON.parse(localStorage.getItem(POSITION_KEY) ?? "{}");
    return stored[filePath] ?? null;
  } catch (_) {
    return null;
  }
}
// ──────────────────────────────────────────────────────────────────────────

type AppStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "open"; fileName: string }
  | { type: "error"; message: string };

export default function App() {
  const [status, setStatus] = useState<AppStatus>({ type: "idle" });
  const [toc, setToc] = useState<TocItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // The engine instance lives in a ref so it doesn't trigger re-renders
  const engineRef = useRef<ReaderEngine | null>(null);
  // The DOM container for EPUB.js rendering
  const containerRef = useRef<HTMLDivElement>(null);
  // Current file path for position saving
  const filePathRef = useRef<string>("");

  const handleOpenEpub = useCallback(async () => {
    try {
      // Show file-open dialog filtered to .epub files
      const selected = await openDialog({
        multiple: false,
        filters: [{ name: "EPUB", extensions: ["epub"] }],
      });

      if (!selected || typeof selected !== "string") return; // user cancelled

      setStatus({ type: "loading" });

      // Save position for the previously open book
      if (filePathRef.current && engineRef.current) {
        const cfi = engineRef.current.getCurrentCfi();
        if (cfi) savePosition(filePathRef.current, cfi);
      }

      // Destroy previous engine
      engineRef.current?.destroy();
      engineRef.current = null;
      setToc([]);

      // Read file bytes via Tauri fs plugin
      const bytes = await readFile(selected);
      const buffer = bytes.buffer as ArrayBuffer;

      if (!containerRef.current) {
        setStatus({ type: "error", message: "Lỗi nội bộ: không tìm thấy vùng hiển thị." });
        return;
      }

      // Create engine and open book
      const engine = new EpubJsEngine();
      engineRef.current = engine;
      filePathRef.current = selected;

      // Clear previous content
      containerRef.current.innerHTML = "";

      const tocItems = await engine.open(buffer, containerRef.current);
      setToc(tocItems);

      // Restore previous position if any
      const savedCfi = loadPosition(selected);
      if (savedCfi) {
        await engine.goTo(savedCfi).catch(() => {
          // If restore fails, just stay at beginning — non-fatal
        });
      }

      const fileName = selected.split(/[\\/]/).pop() ?? selected;
      setStatus({ type: "open", fileName });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Không thể mở file. Có thể file không phải EPUB hợp lệ hoặc bị hỏng.";
      setStatus({ type: "error", message: msg });
      engineRef.current?.destroy();
      engineRef.current = null;
      setToc([]);
    }
  }, []);

  const handleNavigate = useCallback((href: string) => {
    engineRef.current?.goTo(href).catch(() => {
      setStatus((prev) =>
        prev.type === "open"
          ? prev
          : { type: "error", message: "Không thể chuyển tới chương này." }
      );
    });
  }, []);

  const handleDismissError = useCallback(() => {
    setStatus({ type: "idle" });
  }, []);

  const isOpen = status.type === "open";

  return (
    <div className="app-shell">
      {/* ── Top Toolbar ── */}
      <header className="toolbar">
        <div className="toolbar-left">
          {isOpen && (
            <button
              className="icon-btn"
              onClick={() => setSidebarOpen((v) => !v)}
              title={sidebarOpen ? "Ẩn mục lục" : "Hiện mục lục"}
            >
              ☰
            </button>
          )}
          <span className="app-title">EPUB Reader</span>
          {status.type === "open" && (
            <span className="file-name" title={status.fileName}>
              {status.fileName}
            </span>
          )}
        </div>
        <div className="toolbar-right">
          <button
            className="btn-open"
            onClick={handleOpenEpub}
            disabled={status.type === "loading"}
          >
            {status.type === "loading" ? "Đang mở..." : "Mở EPUB"}
          </button>
        </div>
      </header>

      {/* ── Error Banner ── */}
      {status.type === "error" && (
        <div className="error-banner" role="alert">
          <span>⚠ {status.message}</span>
          <button onClick={handleDismissError} className="error-close" aria-label="Đóng">
            ✕
          </button>
        </div>
      )}

      {/* ── Main Area ── */}
      <div className="main-area">
        {/* Sidebar (TOC) */}
        {isOpen && sidebarOpen && (
          <Sidebar toc={toc} onNavigate={handleNavigate} />
        )}

        {/* Reader / Welcome screen */}
        <div className="reader-wrapper">
          {/* EPUB.js mounts here */}
          <div
            ref={containerRef}
            className="epub-container"
            style={{ display: isOpen ? "block" : "none" }}
          />

          {/* Welcome / empty state */}
          {!isOpen && status.type !== "loading" && (
            <div className="welcome">
              <div className="welcome-icon">📖</div>
              <h2 className="welcome-title">EPUB Reader</h2>
              <p className="welcome-sub">Nhấn "Mở EPUB" để bắt đầu đọc.</p>
              <button className="btn-open large" onClick={handleOpenEpub}>
                Mở EPUB
              </button>
            </div>
          )}

          {status.type === "loading" && (
            <div className="welcome">
              <div className="loading-spinner" />
              <p className="welcome-sub">Đang tải sách...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
