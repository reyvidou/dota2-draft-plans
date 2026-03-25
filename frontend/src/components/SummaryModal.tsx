import { type ReactNode, type JSX, useState } from "react";
import type {
  DraftPlan,
  OpenDotaHero,
  Priority,
  PickEntry,
} from "../types/types";
import { PRIORITY_COLORS } from "../constants/constants";
import { Modal, HeroBadge, Icon } from "./SharedUI";

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
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      let text = `🛡️ DRAFT PLAN: ${plan.name.toUpperCase()}\n`;
      if (plan.desc) text += `📝 ${plan.desc}\n`;
      text += `\n`;

      if (plan.bans.length > 0) {
        text += `🚫 BANS:\n`;
        plan.bans.forEach((b) => {
          const heroName = heroMap[b.heroId]?.localized_name || "Unknown Hero";
          text += `- ${heroName}${b.note ? ` (${b.note})` : ""}\n`;
        });
        text += `\n`;
      }

      if (plan.picks.length > 0) {
        text += `⭐ PREFERRED PICKS:\n`;
        plan.picks.forEach((p) => {
          const heroName = heroMap[p.heroId]?.localized_name || "Unknown Hero";
          const priority = p.priority ? `[${p.priority}] ` : "";
          const role = p.role ? ` - ${p.role}` : "";
          text += `${priority}${heroName}${role}${p.note ? `\n  ↳ ${p.note}` : ""}\n`;
        });
        text += `\n`;
      }

      if (plan.threats.length > 0) {
        text += `⚔️ ENEMY THREATS:\n`;
        plan.threats.forEach((t) => {
          const heroName = heroMap[t.heroId]?.localized_name || "Unknown Hero";
          text += `- ${heroName}${t.note ? ` (${t.note})` : ""}\n`;
        });
        text += `\n`;
      }

      if (plan.timings.length > 0) {
        text += `⏱️ KEY TIMINGS:\n`;
        plan.timings.forEach((t) => {
          text += `- ${t.item}${t.explanation ? `: ${t.explanation}` : ""}\n`;
        });
      }

      await navigator.clipboard.writeText(text.trim());

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy to clipboard.");
    }
  };

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
    <div className="mb-7">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-[3px] h-[18px] rounded-sm"
          style={{ backgroundColor: color }}
        />
        <h3
          className="m-0 text-[13px] font-bold uppercase tracking-widest font-['Rajdhani']"
          style={{ color }}
        >
          {title}
        </h3>
        <span className="text-xs text-[#4a6080]">({count})</span>
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
      <div className="p-6 sm:px-7">
        {/* Header Area */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
            {plan.desc && (
              <p className="m-0 text-sm text-[#6080a0] italic leading-relaxed">
                {plan.desc}
              </p>
            )}
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-[13px] font-bold font-['Rajdhani'] tracking-wider transition-all duration-200 shrink-0 ${
              copied
                ? "bg-[#1e5040] border border-[#44cc88] text-[#44cc88]"
                : "bg-[#1e3050] border border-[#2a4060] text-[#c8d8f0] hover:bg-[#2a4060] hover:text-white"
            }`}
          >
            <Icon name={copied ? "check" : "edit"} size={16} />
            {copied ? "COPIED!" : "COPY TO CLIPBOARD"}
          </button>
        </div>

        {/* Ban List Section */}
        <Section title="Ban List" color="#c84040" count={plan.bans.length}>
          {plan.bans.length === 0 ? (
            <span className="text-[13px] text-[#2a3a52]">No bans defined</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {plan.bans.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#c84040]/10 border border-[#c84040]/25 rounded-lg px-3 py-2 min-w-[140px]"
                >
                  <HeroBadge hero={heroMap[b.heroId]} size="sm" />
                  {b.note && (
                    <div className="text-[11px] text-[#6080a0] mt-1 italic">
                      {b.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Preferred Picks Section */}
        <Section
          title="Preferred Picks"
          color="#44cc88"
          count={plan.picks.length}
        >
          {plan.picks.length === 0 ? (
            <span className="text-[13px] text-[#2a3a52]">No picks defined</span>
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
                  <div key={prio} className="mb-3">
                    <div
                      className="text-[11px] font-bold mb-1.5 uppercase tracking-wider"
                      style={{
                        color: PRIORITY_COLORS[prio as Priority] ?? "#4a6080",
                      }}
                    >
                      {prio} Priority
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.map((p) => {
                        const borderColor =
                          PRIORITY_COLORS[p.priority as Priority] ?? "#44cc88";
                        return (
                          <div
                            key={p.id}
                            className="bg-[#44cc88]/10 rounded-lg px-3 py-2 min-w-[140px] border"
                            style={{ borderColor: `${borderColor}40` }}
                          >
                            <HeroBadge hero={heroMap[p.heroId]} size="sm" />
                            {p.role && (
                              <div className="text-[11px] text-[#4a6080] mt-1">
                                📍 {p.role}
                              </div>
                            )}
                            {p.note && (
                              <div className="text-[11px] text-[#6080a0] italic mt-0.5">
                                {p.note}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          )}
        </Section>

        {/* Enemy Threats Section */}
        <Section
          title="Enemy Threats"
          color="#ffaa00"
          count={plan.threats.length}
        >
          {plan.threats.length === 0 ? (
            <span className="text-[13px] text-[#2a3a52]">
              No threats defined
            </span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {plan.threats.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#ffaa00]/10 border border-[#ffaa00]/25 rounded-lg px-3 py-2 min-w-[140px]"
                >
                  <HeroBadge hero={heroMap[t.heroId]} size="sm" />
                  {t.note && (
                    <div className="text-[11px] text-[#6080a0] mt-1 italic">
                      {t.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Item Timings Section */}
        <Section
          title="Item Timings"
          color="#4080c8"
          count={plan.timings.length}
        >
          {plan.timings.length === 0 ? (
            <span className="text-[13px] text-[#2a3a52]">
              No timings defined
            </span>
          ) : (
            <div className="grid gap-2">
              {plan.timings.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#4080c8]/10 border border-[#4080c8]/25 rounded-lg py-2.5 px-3.5 flex gap-3.5 items-start"
                >
                  <span className="text-sm font-bold text-[#4080c8] font-['Rajdhani'] whitespace-nowrap">
                    ⏱ {t.item}
                  </span>
                  {t.explanation && (
                    <span className="text-[13px] text-[#8090b0] leading-relaxed">
                      {t.explanation}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Summary Footer Stats */}
        <div className="bg-[#0a1220] border border-[#1e3050] rounded-xl py-3 px-4 flex gap-6 flex-wrap justify-around sm:justify-start">
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
            <div key={s.label} className="text-center min-w-[60px]">
              <div
                className="text-[22px] font-extrabold font-['Rajdhani']"
                style={{ color: s.color }}
              >
                {s.count}
              </div>
              <div className="text-[11px] text-[#4a6080] uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
