import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStore } from '../store'
import GameButtons from './Buttons/GameButtons'

export default observer(() => {
    const gameStore = useStore("Game")
    return (
        <>
            {gameStore.status > 1 &&
                gameStore.handsHasBet.map((hand) => <GameButtons placeId={hand.placeId} handIdx={hand.idx} />)
            }
        </>
    )
})
