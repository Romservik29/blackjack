import { useState } from 'react'
import { Player } from '../app/Player'
import { Game } from '../app/game'
import { observer } from 'mobx-react-lite'
import PlayerBJ from './PlayerBJ'
import TablePlace from './TablePlace'

export default observer(({ userID }: { userID: string }) => {
    const [takedChips, setTakedChips] = useState(0)
    const [game] = useState(new Game("Nikolay", userID))
    const variantsChips = [100, 200, 500, 1000]
    return (
        <div>
            <h1>{game.status}</h1>
            {game.places.map(
                (place) => <TablePlace
                    betChips={game.addChipsToBet}
                    deck={game.deck}
                    place={place}
                    playerID={game.player.id}
                    takedChips={takedChips}
                />)}
            {
                game.players.map((player: Player) => <PlayerBJ player={player} />)
            }
            <div>
                chips:
                {variantsChips.map(chips => <span style={{ border: '1px solid green', cursor: 'pointer' }} onClick={() => setTakedChips(chips)}>{chips}</span>)}
            </div>
        </div>
    )
})
