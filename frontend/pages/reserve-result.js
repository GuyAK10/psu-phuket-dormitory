import React, { useEffect, useContext } from 'react'
import { GlobalState } from '../utils/context'

const reserveResult = () => {
    const { verifyLogin } = useContext(GlobalState)

    useEffect(() => {
        verifyLogin()
    })
    return (
        <div>

        </div>
    )
}

export default reserveResult
