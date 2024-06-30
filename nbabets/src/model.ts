
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

export type StatResult = {
    stat: string;
    values: number[];
};