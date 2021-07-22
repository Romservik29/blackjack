import {observer} from 'mobx-react-lite';
import {useStore} from '../store';
import {ScoreContainer} from './Score';

export default observer(() => {
  const gameStore = useStore('Game');
  const {score} = gameStore.dealer.hand;
  return (
    <>{
            gameStore.status > 1 ?
                < ScoreContainer
                  style={{position: 'absolute', left: '50%', top: '35%', zIndex: 3}}
                >
                  {score}
                </ScoreContainer > :
                null
    }
    </>
  );
});
