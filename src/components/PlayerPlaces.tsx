import {observer} from 'mobx-react-lite';
import React from 'react';
import {useStore} from '../store';
import PlayerPlace from './PlayerPlace';

export default observer(() => {
  const gameStore = useStore('Game');
  return <>{
        gameStore.status > 1 ?
            gameStore
                .handsHasBet
                .map(((hand, idx) =>
                  <PlayerPlace
                    key={idx}
                    gameStatus={gameStore.status}
                    playerHand={hand}
                    dealerHand={gameStore.dealer.hand}
                  />)) :
            null
  }
  </>;
});
