import {observer} from 'mobx-react-lite';
import {useStore} from '../store';
import {ScoreContainer} from './Score';

export default observer(() => {
  const gameStore = useStore('Game');
  const {hand} = gameStore.dealer;

  if (gameStore.isBetsOpen) {
    return null;
  }

  const score = gameStore.isResolved ? hand.score : hand.getFullScore();
  return (
    <>{
      <ScoreContainer
        style={{position: 'absolute', left: '50%', top: '35%', zIndex: 3}}
      >
        {score}
      </ScoreContainer >
    }
    </>
  );
});
