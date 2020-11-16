import React, { useState, useContext, useEffect } from 'react'
import { GlobalState } from '../utils/context'
import useFetch from 'use-http'
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const Payment = () => {
    const [payment, setPayment] = useState('')
    const { AxiosConfig } = useContext(GlobalState)

    const [axiosConfig, setAxiosConfig] = AxiosConfig
    const { get, post, loading, error } = useFetch(`${ENDPOINT}:${PORT}/student/payment`, { ...axiosConfig, cachePolicy: "no-cache" })

    return (

        <div>
            {payment}
            <button onClick={async () => {
                const data = await get('/bill/2/2563/january/5835512091')
                console.log(data)
            }}>get</button>

            ยังไม่เปิดให้บริการ
        </div>
    )
}

export default Payment
