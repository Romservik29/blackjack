import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStore } from '../store'

type ChipProps = {
    value: number
}

export default observer((props: ChipProps) => {
    const gameStore = useStore("Game")
    function onClick() {
        gameStore.player.setChipInHand(props.value)
    }
    const { chipInHand } = gameStore.player
    const color = chipInHand === props.value ? "red" : "blue"
    return (
        <button onClick={onClick} style={{ color: color }}>
            {props.value}
        </button>
    )
})
