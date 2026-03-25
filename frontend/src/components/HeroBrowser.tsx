import { useState } from "react";
import type { JSX } from "react";
import type { OpenDotaHero } from "../types/types";
import { ATTR_COLORS } from "../constants/constants";
import { Modal, Icon, HeroBadge } from "./SharedUI";

interface HeroBrowserProps {
  heroes: OpenDotaHero[];
  onAdd: (hero: OpenDotaHero) => void;
  onClose: () => void;
  title: string;
  exclude?: number[];
}

export default function HeroBrowser({
  heroes,
  onAdd,
  onClose,
  title,
  exclude = [],
}: HeroBrowserProps): JSX.Element {
  const [q, setQ] = useState<string>("");
  const [attr, setAttr] = useState<string>("all");

  const filtered = heroes.filter((h) => {
    const matchQ = h.localized_name.toLowerCase().includes(q.toLowerCase());
    const matchA = attr === "all" || h.primary_attr === attr;
    const notExcluded = !exclude.includes(h.id);
    return matchQ && matchA && notExcluded;
  });

  return (
    <Modal onClose={onClose} title={title} wide>
      <div className="p-5">
        {/* Search & Filters */}
        <div className="flex flex-wrap gap-2.5 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6080]">
              <Icon name="search" size={16} />
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search heroes…"
              autoFocus
              className="w-full box-border py-2.5 pr-3 pl-[38px] bg-[#0a1220] border border-[#1e3050] rounded-lg text-[#c8d8f0] text-sm outline-none focus:border-[#4a6080] transition-colors"
            />
          </div>

          {(["all", "str", "agi", "int"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAttr(a)}
              style={{
                borderColor: attr === a ? ATTR_COLORS[a] : "#1e3050",
                backgroundColor:
                  attr === a ? ATTR_COLORS[a] + "22" : "transparent",
                color: attr === a ? ATTR_COLORS[a] : "#4a6080",
              }}
              className="px-4 py-2 rounded-lg border text-[13px] font-semibold uppercase transition-colors cursor-pointer hover:bg-[#1e3050]/50"
            >
              {a === "all" ? "All" : a.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2 max-h-[480px] overflow-y-auto pr-1">
          {filtered.map((h) => {
            const ac = ATTR_COLORS[h.primary_attr] ?? "#4a6080";
            const acBg = ac + "11";

            return (
              <button
                key={h.id}
                onClick={() => {
                  onAdd(h);
                  onClose();
                }}
                style={{ "--ac": ac, "--ac-bg": acBg } as React.CSSProperties}
                className="bg-[#0a1220] border border-[#1e3050] rounded-lg py-2.5 px-3 cursor-pointer text-left flex items-center gap-2.5 transition-colors hover:[border-color:var(--ac)] hover:[background-color:var(--ac-bg)]"
              >
                <HeroBadge hero={h} size="sm" />
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full text-center text-[#4a6080] p-10 text-sm">
              No heroes found
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
