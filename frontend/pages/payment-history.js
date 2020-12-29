import React, { useEffect, useContext, useState } from 'react'
import { GlobalState } from '../utils/context'
import { message, Skeleton } from 'antd'

const PaymentHistory = () => {
    const [bills, setBills] = useState({
        message: "ค้นหาเพื่อแสดงผลข้อมูล",
        data: []
    })
    const { get, loading, cookies, verifyLogin } = useContext(GlobalState)

    const getBill = async () => {
        if (cookies.token) {
            const data = await get(`student/payment/bills/${cookies.user.id}`)
            if (data.success) {
                message.success(data.message)
                setBills(data)
            }
            else {
                message.error(data.message)
                setBills(data.message)
            }
        }
    }

    useEffect(() => {
        getBill()
        verifyLogin()
    }, [])

    return (
        <div className="flex flex-col min-h-screen pl-32 pr-32 pt-10">

            { loading
                ?
                <Skeleton />
                :
                bills.message === "พบประวัติ"
                    ?
                    <table class="table-auto">
                        <p className="text-yellow-500">หน้านี้ยังไม่พร้อมให้บริการ</p>
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

// export default PaymentHistory
const Close = () => <div className="min-h-screen">ยังไม่เปิดให้บริการ</div>
export default Close