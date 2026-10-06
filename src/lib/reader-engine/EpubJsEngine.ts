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

  async open(data: ArrayBuffer, container: HTMLElement): Promise<TocItem[]> {
    // Clean up any previous book
    this.destroy();

    this.book = ePub(data);

    // Wait for book metadata and navigation to load
    await this.book.ready;
    await this.book.loaded.navigation;

    // Map TOC
    const nav = this.book.navigation;
    this.toc = nav?.toc ? mapNavItems(nav.toc) : [];

    // Create rendition: scrolled continuous mode (ADR-007)
    this.rendition = this.book.renderTo(container, {
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
        }
      }
    );

    await this.rendition.display();
    return this.toc;
  }

  async next(): Promise<void> {
    await this.rendition?.next();
  }

  async prev(): Promise<void> {
    await this.rendition?.prev();
  }

  async goTo(target: string): Promise<void> {
    await this.rendition?.display(target);
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
  }
}
