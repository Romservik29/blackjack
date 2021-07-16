import { observer } from 'mobx-react-lite'
import React from 'react'
import { GameStatus } from '../app/game'
import { useStore } from '../store'

export default observer(() => {
    const storeGame = useStore("Game")
    const { score } = storeGame.dealer.hand
    return (
        <div style={{ position: "absolute", top: "42%", left: "50%", zIndex: 3}}>
            {storeGame.status !== GameStatus.WAITING_BETS && storeGame.status !== GameStatus.DEALING && score}
        </div>
    )
})
