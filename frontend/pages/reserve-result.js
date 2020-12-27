import React, { useEffect, useContext } from 'react'
import { GlobalState } from '../utils/context'

const reserveResult = () => {
    const { verifyLogin } = useContext(GlobalState)

    useEffect(() => {
        verifyLogin()
    })
    return (
        <div className="min-h-screen">
            ยังไม่เปิดให้บริการ
        </div>
    )
}

export default reserveResult
