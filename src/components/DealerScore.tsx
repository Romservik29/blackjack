import { observer } from 'mobx-react-lite'
import { useStore } from '../store'
import { ScoreContainer } from './Score'

export default observer(() => {
    const storeGame = useStore("Game")
    const { score } = storeGame.dealer.hand
    return (
        <ScoreContainer style={{ position: 'absolute', left: "50%", top: "35%", zIndex: 3 }}>
            {score}
        </ScoreContainer>
    )
})
