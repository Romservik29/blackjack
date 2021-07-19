import { observer } from "mobx-react-lite"
import { useStore } from "../store"
import DealerScore from "./DealerScore"
import Score from './Score'

export default observer(() => {
    const gameStore = useStore("Game")
    const { allHandScors } = gameStore
    return (
        <>
            {gameStore.status > 1 &&
                allHandScors.map((score) =>
                    scoreTopLeft(score.value, score.placeIdx, score.handIdx))

            }
            {gameStore.status > 1 &&
                <DealerScore />
            }
        </>
    )
})

const scoreTopLeft = (value: number, placeIdx: number, handIdx: number) => {
    const top: string = 70 + (placeIdx % 2 === 0 ? 0 : 10) + "%";
    const left: string = 27 + (placeIdx * 18.5) + (handIdx * 5) + "%";
    return <Score value={value} top={top} left={left} />
}