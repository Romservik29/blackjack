import { observer } from 'mobx-react-lite'
import { useStore } from '../../store'
import styled from 'styled-components'

type GameButtonsProps = {
    placeId: number,
    handIdx: number,
}

const GameButtonsContainer = styled.div`
    display: flex;
`
const Button = styled.div`
font-size: 1em;
font-weight: 700;
cursor: pointer;
color: white;
border-radius: 50%;
width: 3em;
height: 3em;
display: flex;
justify-content: center;
align-items: center;
background-color: ${(props: { bgColor: string }) => props.bgColor};
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
    const isStand = gameStore.getPlace(placeId).hands[handIdx].isStandOrOver
    return (
        <GameButtonsContainer>
            {isStand
                ? <Button bgColor="red" onClick={stand} children="౼" />
                : <><Button bgColor="orange" onClick={double} children="2x" />
                    <Button bgColor="green" onClick={hit} children="+" />
                    <Button bgColor="red" onClick={stand} children="౼" />
                    <Button bgColor="teal" onClick={split} children="<>" />
                </>
            }
        </GameButtonsContainer>
    )
})
