import { Player, Team, BetResult, StatResult, Bet } from "./model";

// const API_URL = "http://127.0.0.1:8000";
const API_URL = import.meta.env.VITE_API_URL;

console.log("API_URL", API_URL);
console.log("import.meta.env", import.meta.env);

const default_opts: RequestInit = {
  method: "GET",
  headers: {
    mode: "no-cors",
  },
};

type APIPlayerList = Record<string, string>;

/**
 *
 * @returns List of players
 * @throws Error if API request fails
 */
export async function getPlayers(): Promise<Player[]> {
  const url = `${API_URL}/players`;

  const res = await fetch(url, default_opts);
  const apiPlayers = (await res.json()) as APIPlayerList;
  const players = Object.entries(apiPlayers).map(([name, id]) => ({
    id,
    name,
  }));
  return players;
}

export async function getTeams(): Promise<Team[]> {
  return [{}, {}, {}];
}

type APIBetResult = {
  expected_multiplier_over: number;
  expected_multiplier_under: number;
  confidence_interval_lower: number;
  confidence_interval_upper: number;
  confidence_over: number;
  confidence_under: number;
  mean_points: number;
};

/**
 * Sends a bet to the API and returns the result
 * @param bet Data to send about bet
 * @returns BetResult
 * @throws Error if API request fails
 */
export async function checkBet(bet: Bet): Promise<BetResult> {
  const url = `${API_URL}/statpredict/${bet.player?.id}/${bet.stat}/${bet.lookbackWindow}/${bet.breakpoint}/${bet.overMultiplier}/${bet.underMultiplier}`;

  const res = await fetch(url, default_opts);
  const betResult = (await res.json()) as APIBetResult;

  return betResult;
}

type APIStatResult = {
  GAME_DATE: string;
} & {
  [key: string]: number;
};

export async function getStat(
  player: Player,
  stat: string,
  lookbackWindow: number
): Promise<StatResult> {
  const url = `${API_URL}/players/${player.id}/${stat}/${lookbackWindow}`;

  try {
    const res = await fetch(url, default_opts);
    const apiStatResult = (await res.json()) as APIStatResult[];

    const statResult: StatResult = {
      stat: stat,
      data: apiStatResult.map((r) => ({
        label: r.GAME_DATE,
        value: r[stat],
      })),
    };

    return statResult;
  } catch (e) {
    console.error(e);
  }

  return {
    stat: stat,
    data: [
      { label: "2021-01-01", value: 0 },
      { label: "2021-01-02", value: 1 },
      { label: "2021-01-03", value: 2 },
    ],
  };
}
