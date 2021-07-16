import Chip from './Chip'

export default function Chips() {
    return (
        <div>
            {[100, 250, 500, 1000].map((value) => <Chip value={value} />)}
        </div>
    )
}
