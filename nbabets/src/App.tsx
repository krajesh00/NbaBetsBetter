import { useEffect, useState } from "react";
import "./App.css";
import { getPlayers, getStat } from "./loader";
import { PartialBet, Player, StatResult, statNames } from "./model";
import { PlayerSelector } from "./components/PlayerSelector";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Combobox } from "./components/ui/combobox";
import { Button } from "./components/ui/button";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [bet, setBet] = useState<PartialBet>({});
  const [breakpoint, setBreakpoint] = useState<number>(0);
  const [selectedStat, setSelectedStat] = useState("");

  const [displayedStat, setDisplayedStat] = useState<StatResult>();

  const onSubmit = () => {
    console.log(bet);
    // TODO: Construct, validate, and submit bet
  };

  // Load player list on component mount
  useEffect(() => {
    getPlayers().then((ps) => setPlayers(ps));
  }, []);

  useEffect(() => {
    bet.player && selectedStat && getStat(bet.player, selectedStat, 30).then(setDisplayedStat);
  }, [bet.player, selectedStat]);

  return (
    <>
      <div>
        <PlayerSelector
          players={players}
          selectedPlayer={bet?.player}
          setSelectedPlayer={(p) => setBet((b) => ({ ...b, player: p }))}
        />
      </div>

      <Combobox
        items={statNames}
        value={selectedStat}
        setValue={setSelectedStat}
        itemType="stat"
      />

      <Label htmlFor="breakpoint">Breakpoint</Label>
      <Input
        id="breakpoint"
        type="number"
        value={breakpoint}
        onChange={(e) => setBreakpoint(parseFloat(e.target.value))}
        min={0}
      />

      <Button onClick={onSubmit}>Submit</Button>
      {displayedStat && (
        <div>
          <h2>{displayedStat.stat}</h2>
          <LineChart width={400} height={400} data={displayedStat.data}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="label" />
            <YAxis />
          </LineChart>
        </div>
      )}
    </>
  );
}

export default App;
