import { Player, Team, PartialBet, BetResult, StatResult } from "./model";

export async function getPlayers(): Promise<Player[]> {
  wait(6000);
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

export async function checkBet(bet: PartialBet): Promise<BetResult> {
  console.log(bet);
  return {
    expected: 0,
    stddev: 1,
  };
}

export async function getStat(
  player: Player,
  stat: string,
  lookbackWindow: number
): Promise<StatResult> {
  return {
    stat: stat,
    data: [{ label: "2021-01-01", value: 0 }, { label: "2021-01-02", value: 1 }, { label: "2021-01-03", value: 2 }],
  };
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
