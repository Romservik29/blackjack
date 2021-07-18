import styled from 'styled-components'
import { GameStatus } from '../../app/game'
import { useStore } from '../../store'
import Chips from '../Chips'

const StyledMiddleBar = styled.div`
position: absolute;
display: flex;
justify-content: center;
align-items: center;
z-index: 3;
top: 30%;
width: 100%;
height: 15%;
`

export default function MiddleBar() {
    const gameStore = useStore("Game")
    return (
        <StyledMiddleBar>
            {gameStore.status === GameStatus.WAITING_BETS && < Chips />}
        </StyledMiddleBar>
    )
}
