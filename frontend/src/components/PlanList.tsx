import { useState } from "react";
import type { JSX } from "react";
import { uid, useDraftStore } from "../stores/store";
import { Modal, Icon } from "./SharedUI";
import { useNavigate } from "react-router-dom";

export default function PlanList(): JSX.Element {
  const { plans, createPlan, deletePlan } = useDraftStore();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  const handleCreate = (): void => {
    if (!name.trim()) return;
    const newId = uid();
    createPlan(name.trim(), desc.trim(), newId);
    setShowCreate(false);
    navigate(`/plan/${newId}`);
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "#060d18", color: "#c8d8f0" }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, #0a1628 0%, #060d18 100%)",
          borderBottom: "1px solid #1e3050",
          padding: "28px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#c84040",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="shield" size={20} />
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                color: "#e0eeff",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Dota 2 Draft Planner
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "#4a6080" }}>
              {plans.length} draft plan{plans.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "32px 40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#8090b0",
              letterSpacing: 1,
              textTransform: "uppercase",
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            Draft Plans
          </h2>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: "#c84040",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            <Icon name="plus" size={16} /> New Plan
          </button>
        </div>

        {plans.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 40px",
              border: "1px dashed #1e3050",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
            <p style={{ margin: 0, fontSize: 16, color: "#4a6080" }}>
              No draft plans yet
            </p>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#2a3a52" }}>
              Create your first draft plan to get started
            </p>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: "#0a1220",
                border: "1px solid #1e3050",
                borderRadius: 12,
                padding: 20,
                cursor: "pointer",
                transition: "border-color 0.15s, transform 0.1s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "#c84040";
                (e.currentTarget as HTMLDivElement).style.transform =
                  "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "#1e3050";
                (e.currentTarget as HTMLDivElement).style.transform = "none";
              }}
              onClick={() => navigate(`/plan/${plan.id}`)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: "0 0 4px",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#e0eeff",
                      fontFamily: "'Rajdhani', sans-serif",
                    }}
                  >
                    {plan.name}
                  </h3>
                  {plan.desc && (
                    <p
                      style={{
                        margin: "0 0 12px",
                        fontSize: 13,
                        color: "#4a6080",
                      }}
                    >
                      {plan.desc}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {(
                      [
                        {
                          label: "Bans",
                          count: plan.bans.length,
                          color: "#c84040",
                        },
                        {
                          label: "Picks",
                          count: plan.picks.length,
                          color: "#44cc88",
                        },
                        {
                          label: "Threats",
                          count: plan.threats.length,
                          color: "#ffaa00",
                        },
                        {
                          label: "Items",
                          count: plan.timings.length,
                          color: "#4080c8",
                        },
                      ] as const
                    ).map(({ label, count, color }) => (
                      <span
                        key={label}
                        style={{ fontSize: 12, color: "#4a6080" }}
                      >
                        <span style={{ color, fontWeight: 700 }}>{count}</span>{" "}
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlan(plan.id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2a3a52",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                    flexShrink: 0,
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
              <div style={{ marginTop: 14, fontSize: 12, color: "#2a3a52" }}>
                Created {new Date(plan.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreate && (
        <Modal onClose={() => setShowCreate(false)} title="New Draft Plan">
          <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  color: "#4a6080",
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Plan Name *
              </label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. Patch 7.38 Aggressive Draft"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 14px",
                  background: "#0a1220",
                  border: "1px solid #2a4060",
                  borderRadius: 8,
                  color: "#c8d8f0",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  color: "#4a6080",
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Description (optional)
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Brief description of the strategy…"
                rows={3}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 14px",
                  background: "#0a1220",
                  border: "1px solid #2a4060",
                  borderRadius: 8,
                  color: "#c8d8f0",
                  fontSize: 14,
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>
            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
              <button
                onClick={() => setShowCreate(false)}
                style={{
                  padding: "10px 20px",
                  background: "none",
                  border: "1px solid #1e3050",
                  borderRadius: 8,
                  color: "#4a6080",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                style={{
                  padding: "10px 20px",
                  background: name.trim() ? "#c84040" : "#1e3050",
                  border: "none",
                  borderRadius: 8,
                  color: name.trim() ? "#fff" : "#4a6080",
                  cursor: name.trim() ? "pointer" : "not-allowed",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Create Plan
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
