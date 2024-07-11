export type Team = {};
export type Player = {
  name: string;
  id: string;
};
export type PartialBet = {
  player?: Player;
  stat?: string;
  overMultiplier?: number;
  underMultiplier?: number;
  breakpoint?: number;
  playerTeam?: Team;
  opposingTeam?: Team;
  lookbackWindow?: number;
};

export type Bet = {
  player: Player;
  stat: string;
  overMultiplier: number;
  underMultiplier: number;
  breakpoint: number;
  playerTeam?: Team;
  opposingTeam?: Team;
  lookbackWindow: number;
};

export type BetResult = {
  b_expected_multiplier_over: number;
  b_expected_multiplier_under: number;
  b_confidence_over: number;
  b_confidence_under: number;
  n_expected_multiplier_over: number;
  n_expected_multiplier_under: number;
  n_confidence_over: number;
  n_confidence_under: number;
  mean_points: number;
  std_dev_points: number;
  n_games: number;
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
