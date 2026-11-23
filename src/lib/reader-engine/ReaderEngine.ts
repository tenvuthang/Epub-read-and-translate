/**
 * ReaderEngine interface (ADR-004)
 * UI components must use ONLY this interface — never import epubjs directly.
 */

export interface TocItem {
  id: string;
  label: string;
  href: string;
  subitems?: TocItem[];
}

export interface ReaderEngine {
  /**
   * Open an EPUB from raw bytes and render into the given DOM element.
   * Optionally restores an initial CFI location.
   * Returns the table of contents.
   */
  open(
    data: ArrayBuffer,
    container: HTMLElement,
    initialLocation?: string
  ): Promise<TocItem[]>;

  /** Subscribe to location changes (CFI) while reading */
  onLocationChange?(callback: ((cfi: string) => void) | null): void;

  /** Navigate to the next section/spine item */
  next(): Promise<void>;

  /** Navigate to the previous section/spine item */
  prev(): Promise<void>;

  /** Navigate to a location by CFI or href */
  goTo(target: string): Promise<void>;

  /** Get the current CFI location string (for saving progress) */
  getCurrentCfi(): string | null;

  /** Get the table of contents */
  getToc(): TocItem[];

  /** Clean up resources */
  destroy(): void;
}
