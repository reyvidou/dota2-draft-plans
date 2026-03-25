import { useState } from "react";
import type { CSSProperties, JSX } from "react";
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

export default function PlanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plans, heroes, updatePlan } = useDraftStore();

  // Find the plan based on the URL parameter
  const plan = plans.find((p) => p.id === id);

  // If the user types a bad URL like /plan/does-not-exist
  if (!plan) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#c8d8f0" }}>
        <h2>Draft Plan not found.</h2>
        <button onClick={() => navigate("/")}>Go Back to List</button>
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

  const patch = (partial: Partial<DraftPlan>): void =>
    updatePlan({ ...plan, ...partial });

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

  const accentColors: Record<TabKey, string> = {
    bans: "#c84040",
    picks: "#44cc88",
    threats: "#ffaa00",
    timings: "#4080c8",
  };
  const addLabels: Record<TabKey, string> = {
    bans: "Add Hero",
    picks: "Add Hero",
    threats: "Add Threat",
    timings: "Add Timing",
  };

  const rowStyle: CSSProperties = {
    background: "#0a1220",
    border: "1px solid #1e3050",
    borderRadius: 10,
    padding: "14px 16px",
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "#060d18", color: "#c8d8f0" }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(180deg, #0a1628 0%, #060d18 100%)",
          borderBottom: "1px solid #1e3050",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "1px solid #1e3050",
            borderRadius: 8,
            color: "#4a6080",
            cursor: "pointer",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Icon name="back" size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
              color: "#e0eeff",
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: 1,
            }}
          >
            {plan.name}
          </h1>
          {plan.desc && (
            <p style={{ margin: 0, fontSize: 13, color: "#4a6080" }}>
              {plan.desc}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowSummary(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            background: "#1e3050",
            border: "1px solid #2a4060",
            borderRadius: 8,
            color: "#c8d8f0",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: 1,
          }}
        >
          <Icon name="chart" size={16} /> Summary
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #1e3050",
          padding: "0 32px",
          background: "#0a1220",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "14px 20px",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === tab.key
                  ? "2px solid #c84040"
                  : "2px solid transparent",
              color: activeTab === tab.key ? "#e0eeff" : "#4a6080",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: 1,
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name={tab.icon} size={14} />
            {tab.label}
            {tab.count > 0 && (
              <span
                style={{
                  background: "#c84040",
                  color: "#fff",
                  borderRadius: 10,
                  fontSize: 11,
                  padding: "1px 6px",
                  fontWeight: 700,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: "28px 32px" }}>
        {/* Section header shared */}
        {activeTab !== "timings" && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <p style={{ margin: 0, fontSize: 13, color: "#4a6080" }}>
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                background: accentColors[activeTab],
                border: "none",
                borderRadius: 8,
                color:
                  activeTab === "picks" || activeTab === "threats"
                    ? "#060d18"
                    : "#fff",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <Icon name="plus" size={14} /> {addLabels[activeTab]}
            </button>
          </div>
        )}

        {/* BAN LIST */}
        {activeTab === "bans" && (
          <div style={{ display: "grid", gap: 10 }}>
            {plan.bans.length === 0 && (
              <EmptyState
                icon="ban"
                text="No bans added yet"
                sub="Add heroes you want to ban"
              />
            )}
            {plan.bans.map((item) => (
              <div key={item.id} style={rowStyle}>
                <div
                  style={{
                    width: 4,
                    alignSelf: "stretch",
                    background: "#c84040",
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
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
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2a3a52",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#c84040")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#2a3a52")
                  }
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PREFERRED PICKS */}
        {activeTab === "picks" && (
          <div style={{ display: "grid", gap: 10 }}>
            {plan.picks.length === 0 && (
              <EmptyState
                icon="star"
                text="No preferred picks yet"
                sub="Add heroes you want to pick"
              />
            )}
            {plan.picks.map((item) => (
              <div key={item.id} style={rowStyle}>
                <div
                  style={{
                    width: 4,
                    alignSelf: "stretch",
                    background:
                      PRIORITY_COLORS[item.priority as Priority] ?? "#44cc88",
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <HeroBadge hero={heroMap[item.heroId]} size="md" />
                    <select
                      value={item.role}
                      onChange={(e) =>
                        updatePick(item.id, {
                          role: e.target.value as Role | "",
                        })
                      }
                      style={{
                        background: "#0a1220",
                        border: "1px solid #1e3050",
                        borderRadius: 6,
                        color: "#8090b0",
                        fontSize: 12,
                        padding: "4px 8px",
                        outline: "none",
                      }}
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
                      style={{
                        background: "#0a1220",
                        border: "1px solid #1e3050",
                        borderRadius: 6,
                        color:
                          PRIORITY_COLORS[item.priority as Priority] ??
                          "#8090b0",
                        fontSize: 12,
                        padding: "4px 8px",
                        outline: "none",
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
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2a3a52",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#c84040")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#2a3a52")
                  }
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ENEMY THREATS */}
        {activeTab === "threats" && (
          <div style={{ display: "grid", gap: 10 }}>
            {plan.threats.length === 0 && (
              <EmptyState
                icon="sword"
                text="No threats added yet"
                sub="Add enemy heroes to counter"
              />
            )}
            {plan.threats.map((item) => (
              <div key={item.id} style={rowStyle}>
                <div
                  style={{
                    width: 4,
                    alignSelf: "stretch",
                    background: "#ffaa00",
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
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
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2a3a52",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#c84040")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#2a3a52")
                  }
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <p style={{ margin: 0, fontSize: 13, color: "#4a6080" }}>
                Key item timing milestones for your draft strategy.
              </p>
              <button
                onClick={() => setAddingTiming(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  background: "#4080c8",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                <Icon name="plus" size={14} /> Add Timing
              </button>
            </div>
            {addingTiming && (
              <div
                style={{
                  background: "#0a1220",
                  border: "1px solid #2a4060",
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    autoFocus
                    value={timingItem}
                    onChange={(e) => setTimingItem(e.target.value)}
                    placeholder='e.g. "BKB ~18 min"'
                    style={{
                      flex: 1,
                      minWidth: 160,
                      padding: "9px 12px",
                      background: "#060d18",
                      border: "1px solid #1e3050",
                      borderRadius: 8,
                      color: "#c8d8f0",
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                  <input
                    value={timingNote}
                    onChange={(e) => setTimingNote(e.target.value)}
                    placeholder="Why this timing matters…"
                    style={{
                      flex: 2,
                      minWidth: 200,
                      padding: "9px 12px",
                      background: "#060d18",
                      border: "1px solid #1e3050",
                      borderRadius: 8,
                      color: "#c8d8f0",
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => {
                      setAddingTiming(false);
                      setTimingItem("");
                      setTimingNote("");
                    }}
                    style={{
                      padding: "8px 14px",
                      background: "none",
                      border: "1px solid #1e3050",
                      borderRadius: 8,
                      color: "#4a6080",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTiming}
                    style={{
                      padding: "8px 14px",
                      background: "#4080c8",
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
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
            <div style={{ display: "grid", gap: 10 }}>
              {plan.timings.map((t) => (
                <div key={t.id} style={rowStyle}>
                  <div
                    style={{
                      width: 4,
                      alignSelf: "stretch",
                      background: "#4080c8",
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#4080c8",
                        fontFamily: "'Rajdhani', sans-serif",
                      }}
                    >
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
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2a3a52",
                      cursor: "pointer",
                      padding: 4,
                      display: "flex",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#c84040")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#2a3a52")
                    }
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
