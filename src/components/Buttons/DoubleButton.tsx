import React from 'react'

export default function DoubleButton({ double }: { double: () => void }) {
    return (
        <button onClick={double}>
            double
        </button>
    )
}
