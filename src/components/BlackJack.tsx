import React from 'react'
import { useState } from 'react'
import Table from './Table'
export default function BlackJack() {
    const [userID] = useState("Andrey")
    return (
        <div>
            <Table userID={userID} />
        </div>
    )
}
