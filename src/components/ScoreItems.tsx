import { observer } from "mobx-react-lite"
import { useStore } from "../store"
import DealerScore from "./DealerScore"
import Score from './Score'

export default observer(() => {
    const gameStore = useStore("Game")
    const { allHandScors } = gameStore
    return (
        <>
            {gameStore.status > 1
                &&
                allHandScors.map((score) =>
                    scoreTopLeft(score.value, score.placeIdx, score.handIdx))
                &&
                <DealerScore />
            }
        </>
    )
})

const scoreTopLeft = (value: number, placeIdx: number, handIdx: number) => {
    const top: string = 63 + "%";
    const left: string = 21 + (placeIdx * 25) + (handIdx * 5) + "%";
    return <Score value={value} top={top} left={left} />
}