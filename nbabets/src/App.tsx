import { useEffect, useState } from "react";
import "./App.css";
import { getPlayers } from "./loader";
import { PartialBet, Player } from "./model";
import { PlayerSelector } from "./components/PlayerSelector";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

function App() {
  const [players, setPlayers] = useState<Player[]>([]);

  const [bet, setBet] = useState<PartialBet>({});

  const [breakpoint, setBreakpoint] = useState<number>(0);

  // useEffect(() => console.log(bet), [bet]);

  // Load player list on component mount
  useEffect(() => {
    getPlayers().then((ps) => setPlayers(ps));
  }, []);

  return (
    <>
      <div>
        <PlayerSelector
          players={players}
          selectedPlayer={bet?.player}
          setSelectedPlayer={(p) => setBet((b) => ({ ...b, player: p }))}
        />
      </div>
      <Label htmlFor="breakpoint">Breakpoint</Label>
      <Input
        id="breakpoint"
        type="number"
        value={breakpoint}
        onChange={(e) => setBreakpoint(parseFloat(e.target.value))}
        min={0}
      />
    </>
  );
}

export default App;
