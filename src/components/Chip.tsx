import {observer} from 'mobx-react-lite';
import {useStore} from '../store';


type ChipProps = {
    value: number
}

export default observer(({value}: ChipProps) => {
  const gameStore = useStore('Game');
  function onClick() {
    gameStore.player.setChipInHand(value);
  }
  const {chipInHand} = gameStore.player;
  const chipColor: string =
  value > 999 ? 'blue' : value > 499 ?
  'yellow' : value > 249 ?
  'green' : value > 99 ?
  'grey' : value > 49 ? 'pink' : 'red';

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
        fill={chipColor}
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
        opacity={chipInHand === value ? 0.5 : 0}
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
