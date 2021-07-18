import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { GameStatus } from '../../app/game'
import { useStore } from '../../store'
import Button from '../Buttons/Button'
import Chips from '../Chips'

const StyledMiddleBar = styled.div`
position: absolute;
display: flex;
justify-content: center;
flex-direction: column;
align-items: center;
z-index: 3;
top: 30%;
width: 100%;
height: 15%;
`

const Timer = styled.span`
font-size: 2em;
color: white;
font-weight: bolder;
`

export default observer(() => {
    const gameStore = useStore("Game")
    function deal() {
        gameStore.deal()
    }
    return (
        gameStore.status === GameStatus.WAITING_BETS
            ? <StyledMiddleBar>
                {< Chips />}
                <Timer>{gameStore.timer}</Timer>
                {gameStore.hasBet &&
                    <Button onClick={deal}>
                        Deal
                    </Button>
                }
            </StyledMiddleBar>
            : null
    )
})
