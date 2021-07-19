import { observer } from 'mobx-react-lite'
import { useStore } from '../store'
import Score from './Score'

export default observer(() => {
    const storeGame = useStore("Game")
    const { score } = storeGame.dealer.hand
    return (
        <Score value={score} top={"35%"} left={"50%"} />
    )
})
