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
      <div style={{ padding: 20 }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <div
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#4a6080",
              }}
            >
              <Icon name="search" size={16} />
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search heroes…"
              autoFocus
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px 10px 38px",
                background: "#0a1220",
                border: "1px solid #1e3050",
                borderRadius: 8,
                color: "#c8d8f0",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>
          {(["all", "str", "agi", "int"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAttr(a)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid",
                borderColor: attr === a ? ATTR_COLORS[a] : "#1e3050",
                background: attr === a ? ATTR_COLORS[a] + "22" : "transparent",
                color: attr === a ? ATTR_COLORS[a] : "#4a6080",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {a === "all" ? "All" : a.toUpperCase()}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 8,
            maxHeight: 480,
            overflowY: "auto",
          }}
        >
          {filtered.map((h) => {
            const ac = ATTR_COLORS[h.primary_attr] ?? "#4a6080";
            return (
              <button
                key={h.id}
                onClick={() => {
                  onAdd(h);
                  onClose();
                }}
                style={{
                  background: "#0a1220",
                  border: "1px solid #1e3050",
                  borderRadius: 8,
                  padding: "10px 12px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = ac;
                  (e.currentTarget as HTMLButtonElement).style.background =
                    ac + "11";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#1e3050";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#0a1220";
                }}
              >
                <HeroBadge hero={h} size="sm" />
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                color: "#4a6080",
                padding: 40,
                fontSize: 14,
              }}
            >
              No heroes found
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
