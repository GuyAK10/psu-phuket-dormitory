import React, { useEffect, useContext, useState } from 'react'
import { GlobalState } from '../utils/context'
import Router from 'next/router'
import useFetch from 'use-http'
import { message, Skeleton } from 'antd'
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const PaymentHistory = () => {
    const [headers, setHeaders] = useState({})
    const [bills, setBills] = useState({
        message: "ค้นหาเพื่อแสดงผลข้อมูล",
        data: []
    })
    const { Modal, Token, MenuBar } = useContext(GlobalState)
    const [menuBar, setMenuBar] = MenuBar
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = Token
    const [showModal, setShowModal] = Modal

    const { get, post, loading, error } = useFetch(`${ENDPOINT}:${PORT}/student/payment`, { ...headers, cachePolicy: "no-cache" })

    const getBill = async () => {
        setIsLoading(true)
        const data = await get(`/bills/${JSON.parse(sessionStorage.getItem('token')).id}`)
        if (data.success) {
            message.success(data.message)
            setBills(data)
        }
        else {
            message.error(data.message)
            setBills(data.message)
        }
        setIsLoading(false)
    }
    const getHeader = () => {
        if (sessionStorage.getItem('token'))
            setHeaders({
                headers: {
                    authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")).token}`,
                    type: JSON.parse(sessionStorage.getItem("token")).type
                },
                cachePolicy: "no-cache",
        })
    }
    const verifyLogin = () => {
        const session = sessionStorage.getItem("token")
        if (!session) {
            sessionStorage.removeItem('token')
            setToken(null)
            setShowModal(false)
            setMenuBar('ลงชื่อเข้าใช้')
            Router.push('login')
        }
    }
    useEffect(() => {
        getHeader()
        verifyLogin()
        getBill()
    }, [])

    return (
        <div className="flex flex-col min-h-screen pl-32 pr-32 pt-10">

            { isLoading
                ?
                <Skeleton />
                :
                bills.message === "พบประวัติ"
                    ?
                    <table class="table-auto">
                        <thead>
                            <tr>
                                <th class="px-4 py-2">ห้อง</th>
                                <th class="px-4 py-2">เทอม</th>
                                <th class="px-4 py-2">เดือน</th>
                                <th class="px-4 py-2">ปี</th>
                                <th class="px-4 py-2">ค่าไฟ</th>
                                <th class="px-4 py-2">ค่าน้ำ</th>
                                <th class="px-4 py-2">สถานะ</th>
                            </tr>
                        </thead>
                        {bills.data.map((bill, key) =>
                            <tbody key={key}>
                                <tr>
                                    <td class="border px-4 py-2">{bill.roomId}</td>
                                    <td class="border px-4 py-2">{bill.semester}</td>
                                    <td class="border px-4 py-2">{bill.month}</td>
                                    <td class="border px-4 py-2">{bill.year}</td>
                                    <td class="border px-4 py-2">{bill.electronic}</td>
                                    <td class="border px-4 py-2">{bill.water}</td>
                                    <td class="border px-4 py-2">{bill.status}</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                    :
                    <div>{bills.message}</div>
            }
        </div>
    )
}

export default PaymentHistory
