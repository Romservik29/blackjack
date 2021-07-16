import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStore } from '../store'

export default observer(() => {
    const store = useStore("Game")
    return (
        <div>
            chips:&nbsp; {store.player.chips}
        </div>
    )
})
