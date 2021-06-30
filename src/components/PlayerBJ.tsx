import { observer } from 'mobx-react-lite'
import { Player } from '../app/Player'

interface PlayerProps{
    player: Player
}

export default observer(({ player }: PlayerProps) => {
    return (
        <div>
            <p>chips:{player?.chips}</p>
            <p>id:{player?.id}</p>
        </div>
    )
}
)