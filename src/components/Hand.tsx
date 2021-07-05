import { Deck } from '../app/Deck'
import { observer } from 'mobx-react-lite'
import { PlayerHand } from '../app/PlayerHand'
import { TablePlace } from '../app/TablePlace'
interface HandProps {
    hand: PlayerHand
    deck: Deck
    place: TablePlace
}
export default observer(({ hand, deck, place }: HandProps) => {
    const hit = () => {
        const card = deck.takeCard()
        hand.hit(card)
    }
    const double = () => {
        const card = deck.takeCard()
        hand.double(card)
    }
    const split = () => {
        hand.split()
    }
    const stand = () => {
        hand.stand()
    }
    return (
        <div>
            <div>
                {hand.cards.map((card, idx) => <span key={idx}>{card.rank}{card.suit}</span>)}
            </div>
            <div>
                <span onClick={hit}>hit</span>
                <span onClick={double}>double</span>
                <span onClick={split}>split</span>
                <span onClick={stand}>stand</span>
            </div>
        </div>
    )
})
