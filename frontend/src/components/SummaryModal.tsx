import type { ReactNode, JSX } from "react";
import type {
  DraftPlan,
  OpenDotaHero,
  Priority,
  PickEntry,
} from "../types/types";
import { PRIORITY_COLORS } from "../constants/constants";
import { Modal, HeroBadge } from "./SharedUI";

interface SummaryModalProps {
  plan: DraftPlan;
  heroMap: Record<number, OpenDotaHero>;
  onClose: () => void;
}

export default function SummaryModal({
  plan,
  heroMap,
  onClose,
}: SummaryModalProps): JSX.Element {
  interface SectionProps {
    title: string;
    color: string;
    children: ReactNode;
    count: number;
  }

  const Section = ({
    title,
    color,
    children,
    count,
  }: SectionProps): JSX.Element => (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div
          style={{ width: 3, height: 18, background: color, borderRadius: 2 }}
        />
        <h3
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 700,
            color,
            textTransform: "uppercase",
            letterSpacing: 2,
            fontFamily: "'Rajdhani', sans-serif",
          }}
        >
          {title}
        </h3>
        <span style={{ fontSize: 12, color: "#4a6080" }}>({count})</span>
      </div>
      {children}
    </div>
  );

  const highPicks = plan.picks.filter((p) => p.priority === "High");
  const medPicks = plan.picks.filter((p) => p.priority === "Medium");
  const lowPicks = plan.picks.filter(
    (p) => p.priority === "Low" || !p.priority,
  );

  return (
    <Modal onClose={onClose} title={`Draft Summary — ${plan.name}`} wide>
      <div style={{ padding: "24px 28px" }}>
        {plan.desc && (
          <p
            style={{
              margin: "0 0 24px",
              fontSize: 14,
              color: "#6080a0",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            {plan.desc}
          </p>
        )}

        <Section title="Ban List" color="#c84040" count={plan.bans.length}>
          {plan.bans.length === 0 ? (
            <span style={{ fontSize: 13, color: "#2a3a52" }}>
              No bans defined
            </span>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {plan.bans.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: "#c8404015",
                    border: "1px solid #c8404040",
                    borderRadius: 8,
                    padding: "8px 12px",
                    minWidth: 140,
                  }}
                >
                  <HeroBadge hero={heroMap[b.heroId]} size="sm" />
                  {b.note && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "#6080a0",
                        marginTop: 4,
                        fontStyle: "italic",
                      }}
                    >
                      {b.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section
          title="Preferred Picks"
          color="#44cc88"
          count={plan.picks.length}
        >
          {plan.picks.length === 0 ? (
            <span style={{ fontSize: 13, color: "#2a3a52" }}>
              No picks defined
            </span>
          ) : (
            <div>
              {(
                [
                  ["High", highPicks],
                  ["Medium", medPicks],
                  ["Low/Unset", lowPicks],
                ] as [string, PickEntry[]][]
              ).map(([prio, group]) =>
                group.length > 0 ? (
                  <div key={prio} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: PRIORITY_COLORS[prio as Priority] ?? "#4a6080",
                        fontWeight: 700,
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {prio} Priority
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {group.map((p) => (
                        <div
                          key={p.id}
                          style={{
                            background: "#44cc8812",
                            border: `1px solid ${PRIORITY_COLORS[p.priority as Priority] ?? "#44cc88"}40`,
                            borderRadius: 8,
                            padding: "8px 12px",
                            minWidth: 140,
                          }}
                        >
                          <HeroBadge hero={heroMap[p.heroId]} size="sm" />
                          {p.role && (
                            <div
                              style={{
                                fontSize: 11,
                                color: "#4a6080",
                                marginTop: 4,
                              }}
                            >
                              📍 {p.role}
                            </div>
                          )}
                          {p.note && (
                            <div
                              style={{
                                fontSize: 11,
                                color: "#6080a0",
                                fontStyle: "italic",
                              }}
                            >
                              {p.note}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          )}
        </Section>

        <Section
          title="Enemy Threats"
          color="#ffaa00"
          count={plan.threats.length}
        >
          {plan.threats.length === 0 ? (
            <span style={{ fontSize: 13, color: "#2a3a52" }}>
              No threats defined
            </span>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {plan.threats.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: "#ffaa0012",
                    border: "1px solid #ffaa0040",
                    borderRadius: 8,
                    padding: "8px 12px",
                    minWidth: 140,
                  }}
                >
                  <HeroBadge hero={heroMap[t.heroId]} size="sm" />
                  {t.note && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "#6080a0",
                        marginTop: 4,
                        fontStyle: "italic",
                      }}
                    >
                      {t.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section
          title="Item Timings"
          color="#4080c8"
          count={plan.timings.length}
        >
          {plan.timings.length === 0 ? (
            <span style={{ fontSize: 13, color: "#2a3a52" }}>
              No timings defined
            </span>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {plan.timings.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: "#4080c812",
                    border: "1px solid #4080c840",
                    borderRadius: 8,
                    padding: "10px 14px",
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#4080c8",
                      fontFamily: "'Rajdhani', sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ⏱ {t.item}
                  </span>
                  {t.explanation && (
                    <span
                      style={{
                        fontSize: 13,
                        color: "#8090b0",
                        lineHeight: 1.5,
                      }}
                    >
                      {t.explanation}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        <div
          style={{
            background: "#0a1220",
            border: "1px solid #1e3050",
            borderRadius: 10,
            padding: "12px 16px",
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          {(
            [
              { label: "Bans", count: plan.bans.length, color: "#c84040" },
              { label: "Picks", count: plan.picks.length, color: "#44cc88" },
              {
                label: "Threats",
                count: plan.threats.length,
                color: "#ffaa00",
              },
              {
                label: "Timings",
                count: plan.timings.length,
                color: "#4080c8",
              },
            ] as const
          ).map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: s.color,
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                {s.count}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#4a6080",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
