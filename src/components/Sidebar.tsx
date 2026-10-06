import React from "react";
import type { TocItem } from "../lib/reader-engine";
import "./Sidebar.css";

interface SidebarProps {
  toc: TocItem[];
  onNavigate: (href: string) => void;
  currentHref?: string;
}

function TocNode({
  item,
  onNavigate,
  depth,
}: {
  item: TocItem;
  onNavigate: (href: string) => void;
  depth: number;
}) {
  return (
    <li>
      <button
        className="toc-item"
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => onNavigate(item.href)}
        title={item.label}
      >
        {item.label}
      </button>
      {item.subitems && item.subitems.length > 0 && (
        <ul className="toc-list">
          {item.subitems.map((sub) => (
            <TocNode
              key={sub.id || sub.href}
              item={sub}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export const Sidebar: React.FC<SidebarProps> = ({ toc, onNavigate }) => {
  if (toc.length === 0) {
    return (
      <aside className="sidebar">
        <div className="sidebar-header">Mục lục</div>
        <p className="toc-empty">Không có mục lục.</p>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">Mục lục</div>
      <nav>
        <ul className="toc-list toc-root">
          {toc.map((item) => (
            <TocNode
              key={item.id || item.href}
              item={item}
              onNavigate={onNavigate}
              depth={0}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};
