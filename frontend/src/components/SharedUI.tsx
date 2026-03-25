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

// ─── HeroBadge ───
export function HeroBadge({
  hero,
  size = "sm",
}: {
  hero: OpenDotaHero | undefined;
  size?: HeroSize;
}): JSX.Element {
  const [imgOk, setImgOk] = useState(true);

  const sizeClasses = {
    xs: "w-7 h-4",
    sm: "w-7 h-4",
    md: "w-10 h-[22px]",
    lg: "w-14 h-[31px]",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded overflow-hidden bg-[#1a2332] shrink-0 border border-[#2a3a52]`}
      >
        {imgOk && hero?.name ? (
          <img
            src={HERO_IMG(hero.name.replace("npc_dota_hero_", ""))}
            alt={hero.localized_name}
            className="w-full h-full object-cover"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-[#4a6080] font-bold">
            {hero?.localized_name?.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      {size !== "xs" && (
        <span
          className={`text-[#c8d8f0] font-semibold ${size === "lg" ? "text-sm" : "text-xs"}`}
        >
          {hero?.localized_name}
        </span>
      )}
    </div>
  );
}

// ─── Modal ───
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
      className="fixed inset-0 bg-[#000814]/90 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-[#0d1a2d] border border-[#1e3050] rounded-xl w-full ${wide ? "max-w-5xl" : "max-w-xl"} max-h-[92vh] overflow-hidden flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.8)]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between py-5 px-6 border-b border-[#1e3050] shrink-0">
          <h2 className="m-0 text-lg font-bold text-[#e0eeff] font-['Rajdhani'] tracking-wide">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-[#4a6080] cursor-pointer p-1 flex hover:text-white transition-colors"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

// ─── NoteEditor ───
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
      <div className="flex items-center gap-2 mt-1">
        {value ? (
          <span className="text-xs text-[#6080a0] italic">{value}</span>
        ) : (
          <span className="text-xs text-[#2a3a52] italic">{placeholder}</span>
        )}
        <button
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
          className="bg-transparent border-none text-[#4a6080] cursor-pointer p-0.5 opacity-60 flex hover:opacity-100 transition-opacity"
        >
          <Icon name="edit" size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-1.5 mt-1">
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
        className="flex-1 bg-[#0a1220] border border-[#2a4060] rounded-md px-2 py-1 text-[#c8d8f0] text-xs outline-none focus:border-[#4a6080] transition-colors"
      />
      <button
        onClick={() => {
          onChange(draft);
          setEditing(false);
        }}
        className="bg-[#1e5040] border-none rounded-md text-[#44cc88] cursor-pointer px-2 py-1 flex hover:bg-[#1e6040] transition-colors"
      >
        <Icon name="check" size={14} />
      </button>
    </div>
  );
}

// ─── EmptyState ───
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
    <div className="text-center py-[60px] px-10 border border-dashed border-[#1e3050] rounded-xl flex flex-col items-center">
      <div className="mb-3 text-[#2a3a52]">
        <Icon name={icon} size={32} />
      </div>
      <p className="m-0 mb-1 text-[15px] text-[#4a6080]">{text}</p>
      <p className="m-0 text-[13px] text-[#2a3a52]">{sub}</p>
    </div>
  );
}
