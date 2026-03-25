import { useState, useEffect } from "react";
import type { ReactNode, JSX } from "react";
import type { HeroSize, OpenDotaHero } from "../types/types";
import { HERO_IMG } from "../constants/constants";

export type IconName =
  | "plus"
  | "trash"
  | "back"
  | "edit"
  | "ban"
  | "star"
  | "sword"
  | "clock"
  | "search"
  | "close"
  | "chart"
  | "shield"
  | "check"
  | "eye";
interface IconProps {
  name: IconName;
  size?: number;
}

export const Icon = ({ name, size = 16 }: IconProps): JSX.Element | null => {
  const icons: Record<IconName, JSX.Element> = {
    plus: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    trash: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="3,6 5,6 21,6" />
        <path d="M19,6l-1,14H6L5,6" />
        <path d="M10,11v6M14,11v6" />
        <path d="M9,6V4h6v2" />
      </svg>
    ),
    back: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <polyline points="15,18 9,12 15,6" />
      </svg>
    ),
    eye: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M1,12S5,5 12,5s11,7 11,7-4,7-11,7S1,12,1,12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    edit: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M11,4H4a2,2,0,0,0-2,2v14a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V13" />
        <path d="M18.5,2.5a2.121,2.121,0,0,1,3,3L12,15l-4,1,1-4Z" />
      </svg>
    ),
    ban: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    ),
    star: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ),
    sword: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14.5,17.5L3,6V3h3l11.5,11.5" />
        <path d="M13,19l6-6" />
        <path d="M2,14l4,4-4,4 4-4" />
        <path d="M20.5,6a3,3,0,0,0-3-3L15,5.5l2,2" />
      </svg>
    ),
    clock: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    search: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    close: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    chart: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
    shield: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12,22s8-4 8-10V5l-8-3L4,5v7c0,6,8,10,8,10z" />
      </svg>
    ),
    check: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <polyline points="20,6 9,17 4,12" />
      </svg>
    ),
  } as any;
  return icons[name] ?? null;
};

export function HeroBadge({
  hero,
  size = "sm",
}: {
  hero: OpenDotaHero | undefined;
  size?: HeroSize;
}): JSX.Element {
  const [imgOk, setImgOk] = useState(true);
  const px = size === "lg" ? 56 : size === "md" ? 40 : 28;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: px,
          height: px * 0.56,
          borderRadius: 4,
          overflow: "hidden",
          background: "#1a2332",
          flexShrink: 0,
          border: "1px solid #2a3a52",
        }}
      >
        {imgOk && hero?.name ? (
          <img
            src={HERO_IMG(hero.name.replace("npc_dota_hero_", ""))}
            alt={hero.localized_name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgOk(false)}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: "#4a6080",
              fontWeight: 700,
            }}
          >
            {hero?.localized_name?.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      {size !== "xs" && (
        <span
          style={{
            fontSize: size === "lg" ? 14 : 12,
            color: "#c8d8f0",
            fontWeight: 600,
          }}
        >
          {hero?.localized_name}
        </span>
      )}
    </div>
  );
}

export function Modal({
  onClose,
  children,
  title,
  wide,
}: {
  onClose: () => void;
  children: ReactNode;
  title: string;
  wide?: boolean;
}): JSX.Element {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,8,20,0.88)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0d1a2d",
          border: "1px solid #1e3050",
          borderRadius: 12,
          width: "100%",
          maxWidth: wide ? 960 : 560,
          maxHeight: "92vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #1e3050",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "#e0eeff",
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: 1,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#4a6080",
              cursor: "pointer",
              padding: 4,
              display: "flex",
            }}
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

export function NoteEditor({
  value,
  onChange,
  placeholder = "Add a note…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}): JSX.Element {
  const [editing, setEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>(value);

  if (!editing) {
    return (
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}
      >
        {value ? (
          <span style={{ fontSize: 12, color: "#6080a0", fontStyle: "italic" }}>
            {value}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "#2a3a52", fontStyle: "italic" }}>
            {placeholder}
          </span>
        )}
        <button
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#4a6080",
            cursor: "pointer",
            padding: 2,
            opacity: 0.6,
            display: "flex",
          }}
        >
          <Icon name="edit" size={12} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onChange(draft);
            setEditing(false);
          }
          if (e.key === "Escape") setEditing(false);
        }}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: "#0a1220",
          border: "1px solid #2a4060",
          borderRadius: 6,
          padding: "4px 8px",
          color: "#c8d8f0",
          fontSize: 12,
          outline: "none",
        }}
      />
      <button
        onClick={() => {
          onChange(draft);
          setEditing(false);
        }}
        style={{
          background: "#1e5040",
          border: "none",
          borderRadius: 6,
          color: "#44cc88",
          cursor: "pointer",
          padding: "4px 8px",
          display: "flex",
        }}
      >
        <Icon name="check" size={14} />
      </button>
    </div>
  );
}

export function EmptyState({
  icon,
  text,
  sub,
}: {
  icon: IconName;
  text: string;
  sub: string;
}): JSX.Element {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 40px",
        border: "1px dashed #1e3050",
        borderRadius: 12,
      }}
    >
      <div style={{ marginBottom: 12, color: "#2a3a52" }}>
        <Icon name={icon} size={32} />
      </div>
      <p style={{ margin: "0 0 4px", fontSize: 15, color: "#4a6080" }}>
        {text}
      </p>
      <p style={{ margin: 0, fontSize: 13, color: "#2a3a52" }}>{sub}</p>
    </div>
  );
}
