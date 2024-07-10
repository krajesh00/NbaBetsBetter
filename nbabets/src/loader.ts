import { Player, Team, BetResult, StatResult, Bet } from "./model";

const API_URL = "http://127.0.0.1:8000";

const default_opts: RequestInit = {
  method: "GET",
  headers: {
    mode: "cors",
  },
};

type APIPlayerList = Record<string, string>;

export async function getPlayers(): Promise<Player[]> {
  const url = `${API_URL}/players`;

  try {
    const res = await fetch(url, default_opts);
    const apiPlayers = (await res.json()) as APIPlayerList;
    const players = Object.entries(apiPlayers).map(([id, name]) => ({
      id,
      name,
    }));
    return players;
  } catch (e) {
    console.error(e);
  }

  return [
    {
      name: "Player 1",
      id: "1",
    },
    {
      name: "Player 2",
      id: "2",
    },
    {
      name: "Player 3",
      id: "3",
    },
  ];
}

export async function getTeams(): Promise<Team[]> {
  return [{}, {}, {}];
}

type APIBetResult = {
  expected_multiplier_over: number;
  expected_multiplier_under: number;
  confidence_interval_lower: number;
  confidence_interval_upper: number;
};

export async function checkBet(bet: Bet): Promise<BetResult> {
  const direction = "over";

  const url = `${API_URL}/statpredict/${bet.player?.id}/${bet.stat}/${bet.lookbackWindow}/${bet.breakpoint}/${direction}/${bet.overMultiplier}/${bet.underMultiplier}`;

  try {
    const res = await fetch(url, default_opts);
    const betResult = (await res.json()) as APIBetResult;
    // console.log(betResult);
    // TODO: Remove default values
    return { ...betResult, mean_points: 0 };
    // return betResult;
  } catch (e) {
    console.error(e);
  }

  return {
    expected_multiplier_over: 1,
    expected_multiplier_under: 1,
    confidence_interval_lower: 0,
    confidence_interval_upper: 0,
    mean_points: 0,
  };
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

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
