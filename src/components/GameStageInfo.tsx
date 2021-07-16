import { observer } from 'mobx-react-lite'
import { useStore } from '../store'
export default observer(() => {
    const { gameStageInfo } = useStore("Game")
    return (
        <span>
            {gameStageInfo}
        </span>
    )
})