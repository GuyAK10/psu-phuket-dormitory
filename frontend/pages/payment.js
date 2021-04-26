import React, { useEffect, useState, useContext } from 'react'
import { GlobalState } from '../utils/context'
import { message, Skeleton, Button } from 'antd'

const Payment = () => {
    const [bill, setBill] = useState({
        message: "ค้นหาเพื่อแสดงผลข้อมูล"
    })
    const { get, post, cookies, verifyLogin } = useContext(GlobalState)
    const [isLoading, setIsLoading] = useState(false)
    const [file, setFile] = useState({})
    const years = () => {
        const fullYear = new Date().getFullYear()
        const years = []
        for (let i = fullYear; i >= fullYear - 5; i--) {
            years.push(i)
        }
        return years.map(item => item + 543)
    }

    const [select, setSelect] = useState({
        semester: 2,
        month: "january",
        year: years()[0]
    })

    const handleChange = (e) => {
        setSelect(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const getBill = async () => {
        if (cookies.user) {
            const data = await get(`/student/payment/bill/${select.year}/${select.month}/${cookies.user.id}`)
            if (data.success) {
                message.success(data.message)
                setBill(data)
            }
            else {
                message.error(data.message)
                setBill(data.message)
            }
        }
    }
    const handleFile = async (file) => {
        setFile(file)
    }

    const handleSubmit = async () => {
        let data = new FormData()
        data.append('img', file)
        const resPdf = await post(`/student/payment/receipt/${select.year}/${select.month}/${bill.data.roomId}/${cookies.user.id}`, data)
        if (resPdf.success) {
            console.log(resPdf.message)
            message.success(resPdf.message)
            getBill()
            setFile(null)
        }
    }
    useEffect(() => {
        verifyLogin()
    }, [])

    return (
        <div className="flex flex-col min-h-screen pl-32 pr-32 pt-10">
            <div className="flex flex-col relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>

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
                onClick={getBill}
            >
                ค้นหา
            </button>

            { isLoading
                ?
                <Skeleton />
                :
                bill.message === "พบรายการชำระเงิน"
                    ?
                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">ห้อง</th>
                                <th className="px-4 py-2">เดือน</th>
                                <th className="px-4 py-2">ปี</th>
                                <th className="px-4 py-2">ค่าไฟ</th>
                                <th className="px-4 py-2">ค่าน้ำ</th>
                                <th className="px-4 py-2">รวม</th>
                                <th className="px-4 py-2">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2">{bill.data.roomId}</td>
                                <td className="border px-4 py-2">{bill.data.month}</td>
                                <td className="border px-4 py-2">{bill.data.year}</td>
                                <td className="border px-4 py-2">{(bill.data.newUnit - bill.data.oldUnit) * bill.data.unitPrice} บาท</td>
                                <td className="border px-4 py-2">{bill.data.water}</td>
                                <td className="border px-4 py-2">{+bill.data.water + (bill.data.newUnit - bill.data.oldUnit) * bill.data.unitPrice} บาท</td>
                                {bill.status === "student1" ? <td className="border px-4 py-2">{bill.data.student1}</td>
                                    : <td className="border px-4 py-2">{bill.data.student2}</td>}
                            </tr>
                        </tbody>
                    </table>
                    :
                    <div>{bill.message}</div>
            }

            {
                bill.message === "พบรายการชำระเงิน"
                    ?
                    <div className="flex flex-col">

                        <div className="flex flex-col justify-center max-w-sm rounded overflow-hidden shadow-lg p-3 m-2 self-center">
                            <div className="flex flex-col items-center justify-center px-6 py-4">
                                <img className="w-48" src="icon/SCB.png" alt="scb" />
                                <div className="text-gray-700 text-base mb-2 bg-blue-200">เลขบัญชี 8573001151</div>
                                <p className="text-gray-700 text-base">
                                    ชื่อบัญชี มหาวิทยาลัยสงขลานครินทร์(ค่าหอพัก)
                                </p>
                            </div>
                        </div>

                        <label htmlFor="file">อัพโหลดใบเสร็จ</label>
                        <input type="file" id="img"   onChange={(e) => handleFile(e.target.files[0])} />
                        <Button className="mt-2" type="primary" onClick={(e) => handleSubmit()}>Upload</Button>
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default Payment
