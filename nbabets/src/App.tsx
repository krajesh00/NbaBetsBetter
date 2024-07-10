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
  // Server data
  const [players, setPlayers] = useState<Player[]>([]);
  // Load player list on component mount
  useEffect(() => {
    getPlayers().then((ps) => setPlayers(ps));
  }, []);


  // User data
  const [bet, setBet] = useState<PartialBet>({});
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();
  const [breakpoint, setBreakpoint] = useState<number>(0);
  const [selectedStat, setSelectedStat] = useState("");

  const [displayedStat, setDisplayedStat] = useState<StatResult>();

  const onSubmit = () => {
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
    setBet({
      player: selectedPlayer,
      breakpoint: breakpoint,
      stat: selectedStat,
    });


    console.log(bet);
  };


  useEffect(() => {
    selectedPlayer && selectedStat && getStat(selectedPlayer, selectedStat, 30).then(setDisplayedStat);
  }, [selectedPlayer, selectedStat]);

  return (
    <>
      <div>
        <PlayerSelector
          players={players}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={(p) => setSelectedPlayer(p)}
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
