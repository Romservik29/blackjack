import { observer } from 'mobx-react-lite'
import React from 'react'
import { useMemo } from 'react'
import { GameStatus } from '../app/game'
import { useStore } from '../store'

export default observer(() => {
    const gameStore = useStore("Game")
    const { gameStageInfo } = gameStore

    return (
        <span>
            {gameStageInfo}
        </span>
    )
})