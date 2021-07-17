import { observer } from 'mobx-react-lite'
import { useStore } from '../store'
import styled from 'styled-components'

type GameButtonsProps = {
    placeId: number,
    handIdx: number
}

const GameButtonsContainer = styled.div`
    display: flex;
    position: absolute;
    top: 70%;
    left: ${(props: { left: number }) => props.left + "%"};
    z-index: 3;
`
const Button = styled.div`
font-size: 1em;
cursor: pointer;
`
export default observer(({ placeId, handIdx }: GameButtonsProps) => {
    const gameStore = useStore("Game")
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
    const left = 14 + (placeId * 30)
    return (
        <GameButtonsContainer left={left}>
            <Button onClick={double} children="2х" />
            <Button onClick={hit} children="+" />
            <Button onClick={stand} children="-" />
            <Button onClick={split} children="<>" />
        </GameButtonsContainer>
    )
})
