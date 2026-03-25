export type PrimaryAttr = "str" | "agi" | "int" | "all";
export type HeroSize = "xs" | "sm" | "md" | "lg";
export type TabKey = "bans" | "picks" | "threats" | "timings";
export type Priority = "High" | "Medium" | "Low";
export type Role =
  | "Carry"
  | "Mid"
  | "Offlane"
  | "Soft Support"
  | "Hard Support"
  | "Flex";

export interface OpenDotaHero {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: PrimaryAttr;
  attack_type: string;
  roles: string[];
}

export interface BanEntry {
  id: string;
  heroId: number;
  note: string;
}

export interface PickEntry {
  id: string;
  heroId: number;
  role: Role | "";
  priority: Priority | "";
  note: string;
}

export interface ThreatEntry {
  id: string;
  heroId: number;
  note: string;
}

export interface TimingEntry {
  id: string;
  item: string;
  explanation: string;
}

export interface DraftPlan {
  id: string;
  name: string;
  desc: string;
  createdAt: number;
  bans: BanEntry[];
  picks: PickEntry[];
  threats: ThreatEntry[];
  timings: TimingEntry[];
}
