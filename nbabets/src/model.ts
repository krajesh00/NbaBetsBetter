export type Team = {};
export type Player = {
  name: string;
  id: string;
};
export type PartialBet = {
  player?: Player;
  overMultiplier?: number;
  underMultiplier?: number;
  breakpoint?: number;
  playerTeam?: Team;
  opposingTeam?: Team;
  lookbackWindow?: number;
};
export type BetResult = {
  expected: number;
  stddev: number;
};

export type StatData = {
  label: string;
  value: number;
};

export type StatResult = {
  stat: string;
  data: StatData[];
};

export type StatName = {
  label: string;
  value: string;
};

export const statNames: StatName[] = [
  { label: "WL", value: "WL" },
  { label: "MIN", value: "MIN" },
  { label: "FGM", value: "FGM" },
  { label: "FGA", value: "FGA" },
  { label: "FG_PCT", value: "FG_PCT" },
  { label: "FG3M", value: "FG3M" },
  { label: "FG3A", value: "FG3A" },
  { label: "FG3_PCT", value: "FG3_PCT" },
  { label: "FTM", value: "FTM" },
  { label: "FTA", value: "FTA" },
  { label: "FT_PCT", value: "FT_PCT" },
  { label: "OREB", value: "OREB" },
  { label: "DREB", value: "DREB" },
  { label: "REB", value: "REB" },
  { label: "AST", value: "AST" },
  { label: "TOV", value: "TOV" },
  { label: "STL", value: "STL" },
  { label: "BLK", value: "BLK" },
  { label: "BLKA", value: "BLKA" },
  { label: "PF", value: "PF" },
  { label: "PFD", value: "PFD" },
  { label: "PTS", value: "PTS" },
];
