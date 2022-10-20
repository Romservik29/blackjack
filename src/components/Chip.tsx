import {observer} from 'mobx-react-lite';
import React from 'react';
import {useStore} from '../store';


type ChipProps = {
    value: number
}

const defaultColor = 'blue';

const chipColorTuple: [number, string][] = [
  [Number.POSITIVE_INFINITY, defaultColor],
  [500, 'yellow'],
  [250, 'green'],
  [100, 'grey'],
  [50, 'pink'],
  [0, 'red'],
];

function getChipColor(value: number): string {
  return chipColorTuple.find((t) => value >= t[0])?.[1] ?? defaultColor;
}

export default observer(({value}: ChipProps) => {
  const gameStore = useStore('Game');
  const onClick = React.useCallback(() => gameStore.player.setChipInHand(value), []);

  const opacity = gameStore.player.chipInHand === value ? 0.5 : 0;

  return (
    <svg
      style={{cursor: 'pointer'}}
      viewBox="0 0 64 64"
      fill="none"
      onClick={onClick}>
      <circle
        opacity="1"
        cx="32"
        cy="32"
        r="32"
        fill={getChipColor(value)}
      />
      <circle
        opacity="1"
        cx="32"
        cy="32"
        r="28"
        stroke="black"
        strokeWidth="8"
        strokeDasharray="15 14"
        style={{transform: 'rotate(17deg)', transformOrigin: 'center'}}
      />
      <circle
        opacity={opacity}
        cx="32"
        cy="32"
        r="28"
        stroke="white"
        strokeWidth="8"
      />
      <text
        fill="black"
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        style={{pointerEvents: 'none', fontWeight: 600}}>
        {value}
      </text>
    </svg>
  );
});
