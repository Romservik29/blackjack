import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStore } from '../store'
import { PlaceBet } from './PlaceBet'

export default observer(() => {
    const gameStore = useStore("Game")
    return (
        <>
            {gameStore
                .placeHasBet
                .map((place) => <PlaceBet place={place} />)}
        </>
    )
})
