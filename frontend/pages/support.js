import React, { useEffect, useContext } from 'react'
import { GlobalState } from '../utils/context'

const support = () => {
    const { verifyLogin } = useContext(GlobalState)

    useEffect(() => {
        verifyLogin()
    })

    return (
        <div className="h-screen">
            ยังไม่เปิดให้บริการ
        </div>
    )
}

export default support
