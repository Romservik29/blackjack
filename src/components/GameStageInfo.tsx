import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { useStore } from '../store'

const Container = styled.span`
font-size: 3em;
color: white;
`
export default observer(() => {
    const { gameStageInfo } = useStore("Game")
    return (
        <Container>
            {gameStageInfo}
        </Container>
    )
})