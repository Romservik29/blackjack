import { observer } from "mobx-react-lite"
import { Deck } from "../app/Deck"
import { TablePlace } from "../app/TablePlace"
import Hand from './Hand'
interface TablePlaceProps {
    place: TablePlace,
    deck: Deck
    takedChips: number,
    playerID: string,
    betChips: (playerId: string, placeId: number, chips: number) => void
}
export default observer(({betChips, place, takedChips, playerID, deck }: TablePlaceProps) => {
    const onClick = () => {
        if (place.playerID === null) {
            place.setPlayer(playerID)
        } else {
            betChips(playerID, place.id, takedChips)
        }
    }
    return (
        <div onClick={onClick}>
            <p>Place</p>
            {place.playerID
                && <span>
                    id:{place.playerID}
                </span>}
            <p />
            {place.bet > 0 &&
                <span>
                    bet:{place.bet}
                </span>
            }
            {place.hands.map((hand, idx) => <Hand key={idx} place={place} hand={hand} deck={deck} />)}
        </div >
    )
})
