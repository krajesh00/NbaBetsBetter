import { useEffect, useState } from "react";
import "./App.css";
import { getPlayers } from "./loader";
import { PartialBet, Player } from "./model";
import { PlayerSelector } from "./components/PlayerSelector";

function App() {

  const [players, setPlayers] = useState<Player[]>([]);

  const [bet, setBet] = useState<PartialBet>({});

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
    </>
  );
}

export default App;
