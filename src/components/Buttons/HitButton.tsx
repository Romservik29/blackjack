import React from 'react'

type HitButtonProps = {
    style?: React.CSSProperties
    placeId: number
    handIdx: number
}

export default function HitButton({ hit }: { hit: () => void }) {
    return (
        <button onClick={hit}>
            hit
        </button>
    )
}
