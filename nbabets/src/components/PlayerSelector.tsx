import { Player } from "../model";
import { useCallback, useMemo } from "react";
import { Combobox } from "./ui/combobox";

type PlayerSelectorProps = {
  players: Player[];
  selectedPlayer: Player | undefined;
  setSelectedPlayer: (player: Player) => void;
};

export function PlayerSelector({
  players,
  selectedPlayer,
  setSelectedPlayer,
}: PlayerSelectorProps) {
  const items = useMemo(
    () => players.map((p) => ({ value: p.name, label: p.name })),
    [players]
  );

  const onSelect = useCallback(
    (value: string) => {
      const player = players.find((p) => p.name === value);
      if (player) {
        setSelectedPlayer(player);
      }
    },
    [players, setSelectedPlayer]
  );

  return (
    <Combobox
      items={items}
      value={selectedPlayer?.name ?? ""}
      setValue={onSelect}
      itemType="player"
    />
  );
}
