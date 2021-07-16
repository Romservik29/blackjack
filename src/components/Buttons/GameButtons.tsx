import { observer } from 'mobx-react-lite'
import { useStore } from '../../store'
import DoubleButton from './DoubleButton'
import HitButton from './HitButton'
import SplitButton from './SplitButton'
import StandButton from './StandButton'
import styled from 'styled-components'

type GameButtonsProps = {
    placeId: number,
    handIdx: number
}

const GameButtonsContainer = styled.div`
    position: absolute;
    border: 1px solid black;
    left: ${(props: { top: number }) => props.top + "px"};
    z-index: 3;
`

export default observer(({ placeId, handIdx }: GameButtonsProps) => {
    const gameStore = useStore("Game")
    const handScore = gameStore.places[placeId].hands[handIdx].score
    function hit() {
        gameStore.hit(placeId, handIdx)
    }
    function double() {
        gameStore.double(placeId, handIdx)
    }
    function split() {
        gameStore.split(placeId, handIdx)
    }
    function stand() {
        gameStore.stand(placeId, handIdx)
    }

    return (
        <GameButtonsContainer top={placeId * 200}>
            <HitButton hit={hit} />
            <DoubleButton double={double} />
            <SplitButton split={split} />
            <StandButton stand={stand} />
            <div>{handScore}</div>
        </GameButtonsContainer>
    )
})
