import { useState } from "react";
import type { JSX } from "react";
import { useDraftStore, uid } from "../stores/store";
import type {
  DraftPlan,
  OpenDotaHero,
  TabKey,
  BanEntry,
  PickEntry,
  ThreatEntry,
  TimingEntry,
  Role,
  Priority,
} from "../types/types";
import { PRIORITY_COLORS, ROLES } from "../constants/constants";
import {
  Icon,
  HeroBadge,
  NoteEditor,
  EmptyState,
  type IconName,
} from "./SharedUI";
import HeroBrowser from "./HeroBrowser";
import SummaryModal from "./SummaryModal";
import { useNavigate, useParams } from "react-router-dom";

export default function PlanDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plans, heroes, updatePlan } = useDraftStore();

  const plan = plans.find((p) => p.id === id);

  if (!plan) {
    return (
      <div className="p-10 text-center text-[#c8d8f0]">
        <h2>Draft Plan not found.</h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 mt-4 bg-[#1e3050] text-white rounded hover:bg-[#2a4060] transition-colors"
        >
          Go Back to List
        </button>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<TabKey>("bans");
  const [showBrowser, setShowBrowser] = useState<boolean>(false);
  const [browserTarget, setBrowserTarget] = useState<TabKey>("bans");
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [addingTiming, setAddingTiming] = useState<boolean>(false);
  const [timingItem, setTimingItem] = useState<string>("");
  const [timingNote, setTimingNote] = useState<string>("");

  const heroMap: Record<number, OpenDotaHero> = {};
  heroes.forEach((h) => {
    heroMap[h.id] = h;
  });

  const patch = (partial: Partial<DraftPlan>): void => {
    updatePlan({ ...plan, ...partial });
  };

  const addHeroToBans = (hero: OpenDotaHero): void => {
    if (plan.bans.find((i) => i.heroId === hero.id)) return;
    patch({ bans: [...plan.bans, { id: uid(), heroId: hero.id, note: "" }] });
  };

  const addHeroToPicks = (hero: OpenDotaHero): void => {
    if (plan.picks.find((i) => i.heroId === hero.id)) return;
    patch({
      picks: [
        ...plan.picks,
        { id: uid(), heroId: hero.id, role: "", priority: "", note: "" },
      ],
    });
  };

  const addHeroToThreats = (hero: OpenDotaHero): void => {
    if (plan.threats.find((i) => i.heroId === hero.id)) return;
    patch({
      threats: [...plan.threats, { id: uid(), heroId: hero.id, note: "" }],
    });
  };

  const handleAddHero = (hero: OpenDotaHero): void => {
    if (browserTarget === "bans") addHeroToBans(hero);
    else if (browserTarget === "picks") addHeroToPicks(hero);
    else if (browserTarget === "threats") addHeroToThreats(hero);
  };

  const updateBan = (id: string, p: Partial<BanEntry>): void =>
    patch({ bans: plan.bans.map((b) => (b.id === id ? { ...b, ...p } : b)) });

  const updatePick = (id: string, p: Partial<PickEntry>): void =>
    patch({
      picks: plan.picks.map((pk) => (pk.id === id ? { ...pk, ...p } : pk)),
    });

  const updateThreat = (id: string, p: Partial<ThreatEntry>): void =>
    patch({
      threats: plan.threats.map((t) => (t.id === id ? { ...t, ...p } : t)),
    });

  const updateTiming = (id: string, p: Partial<TimingEntry>): void =>
    patch({
      timings: plan.timings.map((t) => (t.id === id ? { ...t, ...p } : t)),
    });

  const excludeIds = (tab: TabKey): number[] => {
    const banIds = plan.bans.map((b) => b.heroId);
    const pickIds = plan.picks.map((p) => p.heroId);
    const threatIds = plan.threats.map((t) => t.heroId);

    if (tab === "bans") return [...banIds, ...pickIds];
    if (tab === "picks") return [...pickIds, ...banIds];
    if (tab === "threats") return threatIds;
    return [];
  };

  const addTiming = (): void => {
    if (!timingItem.trim()) return;
    patch({
      timings: [
        ...plan.timings,
        { id: uid(), item: timingItem.trim(), explanation: timingNote.trim() },
      ],
    });
    setTimingItem("");
    setTimingNote("");
    setAddingTiming(false);
  };

  const tabs: Array<{
    key: TabKey;
    label: string;
    icon: IconName;
    count: number;
  }> = [
    { key: "bans", label: "Ban List", icon: "ban", count: plan.bans.length },
    {
      key: "picks",
      label: "Preferred Picks",
      icon: "star",
      count: plan.picks.length,
    },
    {
      key: "threats",
      label: "Enemy Threats",
      icon: "sword",
      count: plan.threats.length,
    },
    {
      key: "timings",
      label: "Item Timings",
      icon: "clock",
      count: plan.timings.length,
    },
  ];

  // Map tabs to their specific Tailwind button classes
  const tabButtonClasses: Record<TabKey, string> = {
    bans: "bg-[#c84040] text-white hover:bg-[#a03030]",
    picks: "bg-[#44cc88] text-[#060d18] hover:bg-[#32a86d]",
    threats: "bg-[#ffaa00] text-[#060d18] hover:bg-[#cc8800]",
    timings: "bg-[#4080c8] text-white hover:bg-[#3060a0]",
  };

  const addLabels: Record<TabKey, string> = {
    bans: "Add Hero",
    picks: "Add Hero",
    threats: "Add Threat",
    timings: "Add Timing",
  };

  // Shared row styling extracted to a constant
  const rowClasses =
    "bg-[#0a1220] border border-[#1e3050] rounded-xl p-3.5 flex items-start gap-3.5 transition-colors hover:border-[#2a4060]";

  return (
    <div className="min-h-screen bg-[#060d18] text-[#c8d8f0]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0a1628] to-[#060d18] border-b border-[#1e3050] py-5 px-8 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-transparent border border-[#1e3050] rounded-lg text-[#4a6080] cursor-pointer py-2 px-3 flex items-center gap-1.5 hover:bg-[#1e3050] hover:text-white transition-colors"
        >
          <Icon name="back" size={16} />
        </button>
        <div className="flex-1">
          <h1 className="m-0 text-2xl font-extrabold text-[#e0eeff] font-['Rajdhani'] tracking-wider">
            {plan.name}
          </h1>
          {plan.desc && (
            <p className="m-0 text-[13px] text-[#4a6080]">{plan.desc}</p>
          )}
        </div>
        <button
          onClick={() => setShowSummary(true)}
          className="flex items-center gap-2 py-2.5 px-4.5 bg-[#1e3050] border border-[#2a4060] rounded-lg text-[#c8d8f0] cursor-pointer text-[13px] font-bold font-['Rajdhani'] tracking-wider hover:bg-[#2a4060] hover:text-white transition-colors"
        >
          <Icon name="chart" size={16} /> Summary
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1e3050] px-8 bg-[#0a1220] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-3.5 px-5 bg-transparent border-none border-b-2 cursor-pointer text-[13px] font-bold font-['Rajdhani'] tracking-wider uppercase flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "border-[#c84040] text-[#e0eeff]"
                : "border-transparent text-[#4a6080] hover:text-[#c8d8f0]"
            }`}
          >
            <Icon name={tab.icon} size={14} />
            {tab.label}
            {tab.count > 0 && (
              <span className="bg-[#c84040] text-white rounded-full text-[11px] px-1.5 py-px font-bold">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="py-7 px-8">
        {/* Shared Section Header */}
        {activeTab !== "timings" && (
          <div className="flex justify-between items-center mb-5">
            <p className="m-0 text-[13px] text-[#4a6080]">
              {activeTab === "bans" && "Heroes you want to ban in the draft."}
              {activeTab === "picks" &&
                "Heroes you prefer to pick. Set role, priority, and notes."}
              {activeTab === "threats" &&
                "Enemy heroes your team needs to counter."}
            </p>
            <button
              onClick={() => {
                setBrowserTarget(activeTab);
                setShowBrowser(true);
              }}
              className={`flex items-center gap-2 py-2.5 px-4.5 border-none rounded-lg cursor-pointer text-[13px] font-bold transition-colors ${tabButtonClasses[activeTab]}`}
            >
              <Icon name="plus" size={14} /> {addLabels[activeTab]}
            </button>
          </div>
        )}

        {/* BAN LIST */}
        {activeTab === "bans" && (
          <div className="grid gap-2.5">
            {plan.bans.length === 0 && (
              <EmptyState
                icon="ban"
                text="No bans added yet"
                sub="Add heroes you want to ban"
              />
            )}
            {plan.bans.map((item) => (
              <div key={item.id} className={rowClasses}>
                <div className="w-1 self-stretch bg-[#c84040] rounded-sm shrink-0" />
                <div className="flex-1 min-w-0">
                  <HeroBadge hero={heroMap[item.heroId]} size="md" />
                  <NoteEditor
                    value={item.note}
                    onChange={(v) => updateBan(item.id, { note: v })}
                    placeholder="Why ban this hero?"
                  />
                </div>
                <button
                  onClick={() =>
                    patch({ bans: plan.bans.filter((b) => b.id !== item.id) })
                  }
                  className="bg-transparent border-none text-[#2a3a52] cursor-pointer p-1 flex hover:text-[#c84040] transition-colors"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PREFERRED PICKS */}
        {activeTab === "picks" && (
          <div className="grid gap-2.5">
            {plan.picks.length === 0 && (
              <EmptyState
                icon="star"
                text="No preferred picks yet"
                sub="Add heroes you want to pick"
              />
            )}
            {plan.picks.map((item) => (
              <div key={item.id} className={rowClasses}>
                <div
                  className="w-1 self-stretch rounded-sm shrink-0"
                  style={{
                    backgroundColor:
                      PRIORITY_COLORS[item.priority as Priority] ?? "#44cc88",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <HeroBadge hero={heroMap[item.heroId]} size="md" />
                    <select
                      value={item.role}
                      onChange={(e) =>
                        updatePick(item.id, {
                          role: e.target.value as Role | "",
                        })
                      }
                      className="bg-[#0a1220] border border-[#1e3050] rounded-md text-[#8090b0] text-xs py-1 px-2 outline-none focus:border-[#4a6080]"
                    >
                      <option value="">Role…</option>
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <select
                      value={item.priority}
                      onChange={(e) =>
                        updatePick(item.id, {
                          priority: e.target.value as Priority | "",
                        })
                      }
                      className="bg-[#0a1220] border border-[#1e3050] rounded-md text-xs py-1 px-2 outline-none focus:border-[#4a6080]"
                      style={{
                        color:
                          PRIORITY_COLORS[item.priority as Priority] ??
                          "#8090b0",
                      }}
                    >
                      <option value="">Priority…</option>
                      {(["High", "Medium", "Low"] as Priority[]).map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <NoteEditor
                    value={item.note}
                    onChange={(v) => updatePick(item.id, { note: v })}
                    placeholder="Notes about this pick…"
                  />
                </div>
                <button
                  onClick={() =>
                    patch({ picks: plan.picks.filter((p) => p.id !== item.id) })
                  }
                  className="bg-transparent border-none text-[#2a3a52] cursor-pointer p-1 flex hover:text-[#c84040] transition-colors"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ENEMY THREATS */}
        {activeTab === "threats" && (
          <div className="grid gap-2.5">
            {plan.threats.length === 0 && (
              <EmptyState
                icon="sword"
                text="No threats added yet"
                sub="Add enemy heroes to counter"
              />
            )}
            {plan.threats.map((item) => (
              <div key={item.id} className={rowClasses}>
                <div className="w-1 self-stretch bg-[#ffaa00] rounded-sm shrink-0" />
                <div className="flex-1 min-w-0">
                  <HeroBadge hero={heroMap[item.heroId]} size="md" />
                  <NoteEditor
                    value={item.note}
                    onChange={(v) => updateThreat(item.id, { note: v })}
                    placeholder="Why is this hero a threat? How to counter?"
                  />
                </div>
                <button
                  onClick={() =>
                    patch({
                      threats: plan.threats.filter((t) => t.id !== item.id),
                    })
                  }
                  className="bg-transparent border-none text-[#2a3a52] cursor-pointer p-1 flex hover:text-[#c84040] transition-colors"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ITEM TIMINGS */}
        {activeTab === "timings" && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <p className="m-0 text-[13px] text-[#4a6080]">
                Key item timing milestones for your draft strategy.
              </p>
              <button
                onClick={() => setAddingTiming(true)}
                className="flex items-center gap-2 py-2.5 px-4.5 bg-[#4080c8] border-none rounded-lg text-white cursor-pointer text-[13px] font-bold hover:bg-[#326aa6] transition-colors"
              >
                <Icon name="plus" size={14} /> Add Timing
              </button>
            </div>

            {addingTiming && (
              <div className="bg-[#0a1220] border border-[#2a4060] rounded-xl p-4 mb-4 shadow-lg">
                <div className="flex gap-2.5 mb-2.5 flex-wrap">
                  <input
                    autoFocus
                    value={timingItem}
                    onChange={(e) => setTimingItem(e.target.value)}
                    placeholder='e.g. "BKB ~18 min"'
                    className="flex-1 min-w-[160px] py-2 px-3 bg-[#060d18] border border-[#1e3050] rounded-lg text-[#c8d8f0] text-[13px] outline-none focus:border-[#4a6080] transition-colors"
                  />
                  <input
                    value={timingNote}
                    onChange={(e) => setTimingNote(e.target.value)}
                    placeholder="Why this timing matters…"
                    className="flex-[2] min-w-[200px] py-2 px-3 bg-[#060d18] border border-[#1e3050] rounded-lg text-[#c8d8f0] text-[13px] outline-none focus:border-[#4a6080] transition-colors"
                    onKeyDown={(e) => e.key === "Enter" && addTiming()}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setAddingTiming(false);
                      setTimingItem("");
                      setTimingNote("");
                    }}
                    className="py-2 px-3.5 bg-transparent border border-[#1e3050] rounded-lg text-[#4a6080] cursor-pointer text-[13px] hover:bg-[#1e3050] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTiming}
                    className="py-2 px-3.5 bg-[#4080c8] border-none rounded-lg text-white cursor-pointer text-[13px] font-bold hover:bg-[#326aa6] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {plan.timings.length === 0 && !addingTiming && (
              <EmptyState
                icon="clock"
                text="No timings added yet"
                sub="Track key item timings for your strategy"
              />
            )}

            <div className="grid gap-2.5">
              {plan.timings.map((t) => (
                <div key={t.id} className={rowClasses}>
                  <div className="w-1 self-stretch bg-[#4080c8] rounded-sm shrink-0" />
                  <div className="flex-1">
                    <div className="text-[15px] font-bold text-[#4080c8] font-['Rajdhani']">
                      {t.item}
                    </div>
                    <NoteEditor
                      value={t.explanation}
                      onChange={(v) => updateTiming(t.id, { explanation: v })}
                      placeholder="Why this timing is important…"
                    />
                  </div>
                  <button
                    onClick={() =>
                      patch({
                        timings: plan.timings.filter((x) => x.id !== t.id),
                      })
                    }
                    className="bg-transparent border-none text-[#2a3a52] cursor-pointer p-1 flex hover:text-[#c84040] transition-colors"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showBrowser && (
        <HeroBrowser
          heroes={heroes}
          onClose={() => setShowBrowser(false)}
          onAdd={handleAddHero}
          title={
            browserTarget === "bans"
              ? "Add to Ban List"
              : browserTarget === "picks"
                ? "Add to Preferred Picks"
                : "Add Enemy Threat"
          }
          exclude={excludeIds(browserTarget)}
        />
      )}

      {showSummary && (
        <SummaryModal
          plan={plan}
          heroMap={heroMap}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}
