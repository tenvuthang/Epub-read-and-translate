import { useRef, useImperativeHandle, forwardRef } from "react";
import type { ReaderEngine, TocItem } from "../lib/reader-engine";
import "./ReaderView.css";

export interface ReaderViewHandle {
  goTo: (href: string) => void;
}

interface ReaderViewProps {
  engine: ReaderEngine | null;
  onError: (msg: string) => void;
}

export const ReaderView = forwardRef<ReaderViewHandle, ReaderViewProps>(
  ({ engine, onError }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      goTo: (href: string) => {
        engine?.goTo(href).catch(() => {
          onError("Không thể chuyển tới chương này.");
        });
      },
    }));

    return (
      <div className="reader-wrapper">
        <div ref={containerRef} className="reader-container" id="epub-container" />
      </div>
    );
  }
);

ReaderView.displayName = "ReaderView";

// Keep TocItem in scope for future use
export type { TocItem };
