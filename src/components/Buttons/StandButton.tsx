import React from 'react'

export default function StandButton({ stand }: { stand: () => void }) {
    return (
        <button onClick={stand}>
            stand
        </button>
    )
}
