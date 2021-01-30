import React, { useState, useEffect } from 'react'
import { GlobalState } from '../../../utils/context'
import { useRouter } from 'next/router'
import { message } from 'antd'

const PaymentHistory = () => {
    const [payments, setPayments] = useState([])
    const { get } = React.useContext(GlobalState)
    const { abbMonth, abbYear } = useRouter()

    const years = () => {
        const fullYear = new Date().getFullYear()
        const years = []
        for (let i = fullYear; i >= fullYear - 130; i--) {
            years.push(i)
        }
        return years.map(item => item + 543)
    }

    const [select, setSelect] = useState({
        semester: 2,
        month: "january",
        year: years()[0]
    })

    const getPayments = async () => {
        const data = await get(`/staff/payment/${select.month}/${select.year}`)
        if (data.success) {
            message.success(data.message)
            setPayments(data.data)
        }
        else
            message.error(data.message)
    }

    const initialState = async () => {
        if (abbMonth && abbYear) {
            const data = await get(`/staff/payment/${abbMonth}/${abbYear}`)
            if (data.success) {
                message.success(data.message)
                setPayments(data.data)
            }
            else
                message.error(data.message)
        }
    }

    const handleChange = (e) => {
        setSelect(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    useEffect(() => {
        initialState()
    }, [])

    return (
        <div className="flex flex-col min-h-screen pl-32 pr-32 pt-10">

            <div className="flex flex-col relative">
                <label htmlFor="month">เดือน</label>
                <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" name="month" id="month" onChange={handleChange} value={select.month}>
                    <option value="january" name="month">มกราคม</option>
                    <option value="febuary" name="month">กุมภาพันธ์</option>
                    <option value="march" name="month">มีนาคม</option>
                    <option value="april" name="month">เมษายน</option>
                    <option value="may" name="month">พฤษภาคม</option>
                    <option value="june" name="month">มิถุนายน</option>
                    <option value="july" name="month">กรกฎาคม</option>
                    <option value="august" name="month">สิงหาคม</option>
                    <option value="september" name="month">กันยายน</option>
                    <option value="october" name="month">ตุลาคม</option>
                    <option value="november" name="month">พฤษจิกายน</option>
                    <option value="december" name="month">ธันวาคม</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>

            <div className="flex flex-col relative">
                <label htmlFor="years">ปี</label>
                <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" name="year" id="year" onChange={handleChange} value={select.year}>
                    {
                        years().map((item, key) => <option key={key} value={item} name={item}>{item}</option>)
                    }
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>

            <button
                className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={getPayments}
            >
                ค้นหา
            </button>

            <div className="flex flex-col">
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ห้อง</th>
                            <th className="px-4 py-2">ค่าน้ำ</th>
                            <th className="px-4 py-2">ค่าไฟ</th>
                            <th className="px-4 py-2">สถานะ</th>
                        </tr>
                    </thead>
                    {
                        JSON.stringify(payments)
                    }

                    {/* {
                        payments.map((item, key) => {
                            return <tbody key={key}>
                                <tr>
                                    <td className="border px-4 py-2">
                                        {item.roomId}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <div>{item.water}</div>
                                    </td>
                                    <td className="border px-4 py-2">
                                        <div>{item.electric}</div>
                                    </td>
                                    {
                                        item.status == "ค้างชำระ"
                                            ?
                                            <td className="border px-4 py-2 bg-red-200">
                                                <div>{item.status}</div>
                                            </td>
                                            :
                                            <td className="border px-4 py-2 bg-green-200">
                                                <div>{item.status}</div>
                                            </td>
                                    }
                                </tr>
                            </tbody>
                        })
                    } */}

                </table>
            </div>
        </div>
    )
}

export default PaymentHistory