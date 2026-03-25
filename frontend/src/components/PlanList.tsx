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
    <div className="min-h-screen bg-[#060d18] text-[#c8d8f0]">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#0a1628] to-[#060d18] border-b border-[#1e3050] py-7 px-10">
        <div className="flex items-center gap-4 mb-1">
          <div className="w-10 h-10 rounded-lg bg-[#c84040] flex items-center justify-center shrink-0">
            <Icon name="shield" size={20} />
          </div>
          <div>
            <h1 className="m-0 text-[28px] font-extrabold text-[#e0eeff] font-['Rajdhani'] tracking-widest uppercase">
              Dota 2 Draft Planner
            </h1>
            <p className="m-0 text-[13px] text-[#4a6080]">
              {plans.length} draft plan{plans.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-8 px-10">
        {/* Section Header & Create Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="m-0 text-base font-bold text-[#8090b0] tracking-widest uppercase font-['Rajdhani']">
            Draft Plans
          </h2>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#c84040] border-none rounded-lg text-white cursor-pointer text-sm font-bold font-['Rajdhani'] tracking-wider uppercase hover:bg-[#a03030] transition-colors"
          >
            <Icon name="plus" size={16} /> New Plan
          </button>
        </div>

        {/* Empty State */}
        {plans.length === 0 && (
          <div className="text-center py-20 px-10 border border-dashed border-[#1e3050] rounded-xl">
            <div className="text-5xl mb-4">🛡️</div>
            <p className="m-0 text-base text-[#4a6080]">No draft plans yet</p>
            <p className="mt-2 mb-0 text-[13px] text-[#2a3a52]">
              Create your first draft plan to get started
            </p>
          </div>
        )}

        {/* Plan Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => navigate(`/plan/${plan.id}`)}
              className="group bg-[#0a1220] border border-[#1e3050] rounded-xl p-5 cursor-pointer transition-all duration-150 ease-in-out hover:border-[#c84040] hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="m-0 mb-1 text-lg font-bold text-[#e0eeff] font-['Rajdhani'] group-hover:text-white transition-colors">
                    {plan.name}
                  </h3>
                  {plan.desc && (
                    <p className="m-0 mb-3 text-[13px] text-[#4a6080] line-clamp-2">
                      {plan.desc}
                    </p>
                  )}

                  {/* Stats Badges */}
                  <div className="flex gap-3 flex-wrap">
                    {(
                      [
                        {
                          label: "Bans",
                          count: plan.bans.length,
                          colorClass: "text-[#c84040]",
                        },
                        {
                          label: "Picks",
                          count: plan.picks.length,
                          colorClass: "text-[#44cc88]",
                        },
                        {
                          label: "Threats",
                          count: plan.threats.length,
                          colorClass: "text-[#ffaa00]",
                        },
                        {
                          label: "Items",
                          count: plan.timings.length,
                          colorClass: "text-[#4080c8]",
                        },
                      ] as const
                    ).map(({ label, count, colorClass }) => (
                      <span key={label} className="text-xs text-[#4a6080]">
                        <span className={`${colorClass} font-bold`}>
                          {count}
                        </span>{" "}
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlan(plan.id);
                  }}
                  className="bg-transparent border-none text-[#2a3a52] cursor-pointer p-1 flex shrink-0 hover:text-[#c84040] transition-colors"
                  aria-label="Delete Plan"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>

              <div className="mt-3.5 text-xs text-[#2a3a52]">
                Created {new Date(plan.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)} title="New Draft Plan">
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-xs text-[#4a6080] mb-1.5 uppercase tracking-wider">
                Plan Name *
              </label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. Patch 7.38 Aggressive Draft"
                className="w-full box-border px-3.5 py-2.5 bg-[#0a1220] border border-[#2a4060] rounded-lg text-[#c8d8f0] text-sm outline-none focus:border-[#4a6080] transition-colors"
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs text-[#4a6080] mb-1.5 uppercase tracking-wider">
                Description (optional)
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Brief description of the strategy…"
                rows={3}
                className="w-full box-border px-3.5 py-2.5 bg-[#0a1220] border border-[#2a4060] rounded-lg text-[#c8d8f0] text-sm outline-none resize-y focus:border-[#4a6080] transition-colors"
              />
            </div>
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setShowCreate(false)}
                className="px-5 py-2.5 bg-transparent border border-[#1e3050] rounded-lg text-[#4a6080] cursor-pointer text-sm hover:bg-[#1e3050] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                className={`px-5 py-2.5 border-none rounded-lg text-sm font-bold transition-colors ${
                  name.trim()
                    ? "bg-[#c84040] text-white cursor-pointer hover:bg-[#a03030]"
                    : "bg-[#1e3050] text-[#4a6080] cursor-not-allowed"
                }`}
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
