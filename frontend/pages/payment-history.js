import React, { useState, useEffect } from 'react'
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
    const [isLoading, setIsLoading] = useState(false)

    const getHeaders = () => {
        setHeaders({
            headers: {
                authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")).token}`,
                type: JSON.parse(sessionStorage.getItem("token")).type
            },
        })
    }

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

    useEffect(() => {
        // getHeaders()
        getBill()
    }, [])

    return (
        <div className="flex flex-col min-h-screen pl-32 pr-32 pt-10">

            <div className="text-center"><label htmlFor="id">รหัสนักศึกษา :  </label>""</div>

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
