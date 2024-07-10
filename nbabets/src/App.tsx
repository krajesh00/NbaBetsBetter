import { useEffect, useState } from "react";
import "./App.css";
import { checkBet, getPlayers, getStat } from "./loader";
import {
  BetResult,
  Player,
  StatResult,
  statNames,
} from "./model";
import { PlayerSelector } from "./components/PlayerSelector";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Combobox } from "./components/ui/combobox";
import { Button } from "./components/ui/button";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

function App() {
  // Server data
  const [players, setPlayers] = useState<Player[]>([]);

  // Load player list on component mount
  useEffect(() => {
    getPlayers().then((ps) => setPlayers(ps));
  }, []);

  // User data
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();
  const [breakpoint, setBreakpoint] = useState<number>(0);
  const [selectedStat, setSelectedStat] = useState("");
  const [lookbackWindow, setLookbackWindow] = useState(30);
  const [underMultiplier, setUnderMultiplier] = useState(0);
  const [overMultiplier, setOverMultiplier] = useState(0);

  const [displayedStat, setDisplayedStat] = useState<StatResult>();
  const [betResult, setBetResult] = useState<BetResult>();

  const onSubmit = async () => {
    // TODO: Construct, validate, and submit bet
    if (!selectedPlayer) {
      console.error("No player selected");
      return;
    }
    if (!selectedStat) {
      console.error("No stat selected");
      return;
    }

    // Construct bet
    const bet = {
      player: selectedPlayer,
      breakpoint: breakpoint,
      stat: selectedStat,

      // TODO: Remove default values
      lookbackWindow,
      overMultiplier,
      underMultiplier,
    };

    try {
      const result = await checkBet(bet);
      setBetResult(result);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    selectedPlayer &&
      selectedStat &&
      getStat(selectedPlayer, selectedStat, 30).then(setDisplayedStat);
  }, [selectedPlayer, selectedStat]);

  return (
    <>
      <div className="grid grid-cols-2 grid-rows-3">
        <div>
          <Label htmlFor="player">Player</Label>
          <div id="player">
            <PlayerSelector
              players={players}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={(p) => setSelectedPlayer(p)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="stat">Stat</Label>
          <div id="stat">
            <Combobox
              items={statNames}
              value={selectedStat}
              setValue={setSelectedStat}
              itemType="stat"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="breakpoint">Breakpoint</Label>
          <Input
            id="breakpoint"
            type="number"
            value={breakpoint}
            onChange={(e) => setBreakpoint(parseFloat(e.target.value))}
            min={0}
          />
        </div>

        <div>
          <Label htmlFor="lookback">Lookback Window</Label>
          <Input
            id="lookback"
            type="number"
            value={lookbackWindow}
            onChange={(e) => setLookbackWindow(parseInt(e.target.value))}
            min={1}
          />
        </div>
        <div>
          <Label htmlFor="under-mult">Under Multiplier</Label>
          <Input
            id="under-mult"
            type="number"
            value={underMultiplier}
            onChange={(e) => setUnderMultiplier(parseFloat(e.target.value))}
            min={1}
          />
        </div>
        <div>
          <Label htmlFor="over-mult">Over Multiplier</Label>
          <Input
            id="over-mult"
            type="number"
            value={overMultiplier}
            onChange={(e) => setOverMultiplier(parseFloat(e.target.value))}
            min={1}
          />
        </div>
      </div>

      <Button onClick={onSubmit}>Submit</Button>
      <div>
        <h2>
          {displayedStat?.stat ?? "Select a player and a stat to view history"}
        </h2>
        <LineChart width={400} height={400} data={displayedStat?.data}>
          {displayedStat && (
            <>
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="label" />
              <YAxis />
            </>
          )}
        </LineChart>
      </div>
    </>
  );
}

export default App;
