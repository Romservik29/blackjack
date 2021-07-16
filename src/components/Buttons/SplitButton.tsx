import React from 'react'

export default function SplitButton({ split }: { split: () => void }) {
    return (
        <button onClick={split}>
            split
        </button>
    )
}
