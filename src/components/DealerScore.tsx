import {observer} from 'mobx-react-lite';
import {useStore} from '../store';
import {ScoreContainer} from './Score';

export default observer(() => {
  const gameStore = useStore('Game');
  const {hand} = gameStore.dealer;

  return (
    <>{
      gameStore.status > 1 ?
        < ScoreContainer
          style={{position: 'absolute', left: '50%', top: '35%', zIndex: 3}}
        >
          {gameStore.status === 2 ? hand.score : hand.getFullScore()}
        </ScoreContainer > :
        null
    }
    </>
  );
});
