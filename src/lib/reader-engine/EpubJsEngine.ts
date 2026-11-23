/**
 * EpubJsEngine — EPUB.js implementation of ReaderEngine (ADR-004).
 *
 * This is the ONLY file that imports epubjs.
 * All UI components interact via the ReaderEngine interface.
 */
import ePub, { Book, Rendition, NavItem } from "epubjs";
import type { ReaderEngine, TocItem } from "./ReaderEngine";

function mapNavItems(items: NavItem[]): TocItem[] {
  return items.map((item) => ({
    id: item.id,
    label: item.label ? item.label.trim() : "(không có tên)",
    href: item.href,
    subitems:
      item.subitems && item.subitems.length > 0
        ? mapNavItems(item.subitems)
        : undefined,
  }));
}

export class EpubJsEngine implements ReaderEngine {
  private book: Book | null = null;
  private rendition: Rendition | null = null;
  private toc: TocItem[] = [];
  private currentCfi: string | null = null;
  private goToSeq = 0;
  private locationChangeCallback: ((cfi: string) => void) | null = null;

  onLocationChange(callback: ((cfi: string) => void) | null): void {
    this.locationChangeCallback = callback;
  }

  async open(
    data: ArrayBuffer,
    container: HTMLElement,
    initialLocation?: string
  ): Promise<TocItem[]> {
    // Clean up any previous book
    this.destroy();

    // 1. Kiểm tra 4 byte đầu (PK zip magic bytes: 0x50 0x4B 0x03 0x04)
    if (data.byteLength < 4) {
      throw new Error("File không phải EPUB hợp lệ");
    }
    const header = new Uint8Array(data, 0, 4);
    if (
      header[0] !== 0x50 ||
      header[1] !== 0x4b ||
      header[2] !== 0x03 ||
      header[3] !== 0x04
    ) {
      throw new Error("File không phải EPUB hợp lệ");
    }

    const book = ePub(data);
    this.book = book;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error("Không đọc được file EPUB (quá thời gian chờ)"));
      }, 20000);
    });

    const openPromise = (async () => {
      // Wait for book metadata and navigation to load
      await book.ready;
      await book.loaded.navigation;

      // Map TOC
      const nav = book.navigation;
      this.toc = nav?.toc ? mapNavItems(nav.toc) : [];

      // Create rendition: scrolled continuous mode (ADR-007)
      this.rendition = book.renderTo(container, {
        width: "100%",
        height: "100%",
        flow: "scrolled",
        manager: "continuous",
        spread: "none",
      });

      // Track location changes for CFI persistence
      this.rendition.on(
        "relocated",
        (location: { start: { cfi: string } }) => {
          if (location?.start?.cfi) {
            this.currentCfi = location.start.cfi;
            this.locationChangeCallback?.(location.start.cfi);
          }
        }
      );

      let restored = false;
      if (initialLocation && initialLocation.startsWith("epubcfi(")) {
        try {
          await this.rendition.display(initialLocation);
          const contents = this.rendition.getContents() as unknown as Array<unknown>;
          if (Array.isArray(contents) && contents.length > 0) {
            restored = true;
            await this.realignAfterImagesLoadOnce(initialLocation, ++this.goToSeq);
          }
        } catch {
          restored = false;
        }
      }

      if (!restored) {
        await this.rendition.display();
      }
      return this.toc;
    })();

    try {
      return await Promise.race([openPromise, timeoutPromise]);
    } catch (err) {
      this.destroy();
      throw err;
    } finally {
      if (timer) {
        clearTimeout(timer);
      }
    }
  }

  async next(): Promise<void> {
    await this.rendition?.next();
  }

  async prev(): Promise<void> {
    await this.rendition?.prev();
  }

  async goTo(target: string): Promise<void> {
    if (!this.rendition) return;

    const seq = ++this.goToSeq;
    await this.rendition.display(target);

    if (seq !== this.goToSeq || !this.rendition) return;
    await this.realignAfterImagesLoadOnce(target, seq);
  }

  /**
   * Chờ ảnh trong các section đang hiển thị tải xong (kèm timeout an toàn),
   * cập nhật lại kích thước view rồi căn chỉnh về mục tiêu tối đa MỘT lần.
   */
  private async realignAfterImagesLoadOnce(
    target: string,
    seq: number
  ): Promise<void> {
    if (!this.rendition || seq !== this.goToSeq) return;

    const contentsList =
      (this.rendition.getContents() as unknown as Array<{
        document?: Document;
        expand?: () => void;
      }>) ?? [];

    const pendingImages: HTMLImageElement[] = [];
    for (const content of contentsList) {
      const imgs = content?.document?.querySelectorAll("img");
      if (imgs) {
        imgs.forEach((img) => {
          if (!img.complete) {
            pendingImages.push(img);
          }
        });
      }
    }

    if (pendingImages.length > 0) {
      await Promise.race([
        Promise.all(
          pendingImages.map(
            (img) =>
              new Promise<void>((resolve) => {
                const done = () => {
                  img.removeEventListener("load", done);
                  img.removeEventListener("error", done);
                  resolve();
                };
                img.addEventListener("load", done, { once: true });
                img.addEventListener("error", done, { once: true });
              })
          )
        ),
        new Promise<void>((resolve) => setTimeout(resolve, 1500)),
      ]);
    }

    if (!this.rendition || seq !== this.goToSeq) return;

    // Kích hoạt expand() trên các contents để IframeView cập nhật chiều cao thật sau khi ảnh tải xong
    for (const content of contentsList) {
      try {
        content.expand?.();
      } catch (_) {
        // ignore
      }
    }

    // Nhường 2 nhịp animation frame để ResizeObserver và DOM hoàn tất reflow
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );

    if (!this.rendition || seq !== this.goToSeq) return;

    // Căn chỉnh lại về mục tiêu đúng 1 lần (lúc này section đã nằm trong manager.views nên sẽ nhảy thẳng tới đầu chương)
    await this.rendition.display(target);
  }

  getCurrentCfi(): string | null {
    return this.currentCfi;
  }

  getToc(): TocItem[] {
    return this.toc;
  }

  destroy(): void {
    try {
      this.rendition?.destroy();
    } catch (_) {
      // ignore destroy errors
    }
    try {
      this.book?.destroy();
    } catch (_) {
      // ignore destroy errors
    }
    this.book = null;
    this.rendition = null;
    this.toc = [];
    this.currentCfi = null;
    this.locationChangeCallback = null;
  }
}
