import React, { useState, useEffect } from 'react'
import { GlobalState } from '../../../utils/context'
import useFetch from 'use-http'
import Router from 'next/router'
import { message } from 'antd'
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const Payment = () => {
    const { get, post, cookies } = React.useContext(GlobalState)
    const [form, setForm] = useState([])
    const [autoSave, setAutoSave] = useState(true)
    const [createBill, setCreateBill] = useState(false)
    const [_, setUpdate] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

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

    const handleChange = (e) => {
        localStorage.removeItem('adminPayment')
        setCreateBill(false)
        getRoom(0)
        setSelect(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const getBill = async () => {
        setIsLoading(true)
        const data = await get(`staff/payment/${select.semester}/${select.month}/${select.year}`)
        if (data.success) {
            message.success(data.message)
            let tempChange = []
            for (let change in form)
                if (form[change].roomId == data.data[change].roomId)
                    tempChange[change] = data.data[change]
                else
                    tempChange[change] = form[change]
            if (tempChange.length) setForm(tempChange)
        }
        else {
            message.error(data.message)
        }
        setIsLoading(false)
    }

    const initialRoomName = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const getRoom = (key) => {
        let rooms = []
        for (let room = 1; room <= 24; room++) {
            const calRoom = room < 10 ? "0" + room : room
            rooms.push({
                ...select,
                roomId: `${initialRoomName[key]}${calRoom}`,
                water: "70",
                electric: "",
                status: "ค้างชำระ"
            })
        }
        setForm(rooms)
    }

    const handleForm = (event, key) => {
        let tempForm = form
        tempForm.splice(key, 1, {
            ...tempForm[key],
            [event.target.name]: event.target.value
        })
        if (autoSave) {
            localStorage.setItem('adminPayment', JSON.stringify(form))
        }
        setForm(tempForm)
        setUpdate(Math.random())
    }

    const saveForm = () => {
        const save = post("staff/payment", form)
        if (save.success) {
            message.success(save.message)
        }
    }

    const keepLocalStorage = () => {
        if (localStorage.getItem('adminPayment')) {
            setForm(JSON.parse(localStorage.getItem('adminPayment')))
        }
    }

    useEffect(() => {
        getRoom(0)
        keepLocalStorage()
    }, [])

    const Room = () =>
        <div className="mt-10 flex flex-col items-center">
            <p>เลือกกลุ่มห้อง</p>
            <div className="flex flex-row">
                {
                    initialRoomName.map((item, key) =>
                        <div
                            key={key}
                            className="p-1 border border-gray-600 cursor-pointer"
                            onClick={() => {
                                localStorage.removeItem('adminPayment')
                                getRoom(key)
                            }}
                        >
                            {item}
                        </div>
                    )
                }
            </div>
            <div>
                <input className="mr-1 mt-1" type="checkbox" onChange={e => setAutoSave(e.target.checked)} value={autoSave} />
                <label className="" htmlFor="choice">บันทึกอัตโนมัติ (ลบทันทีที่เปลี่ยนกลุ่มห้อง)</label>
            </div>

            <div className="flex flex-col">
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ห้อง</th>
                            <th className="px-4 py-2">ค่าน้ำ</th>
                            <th className="px-4 py-2">ค่าไฟ</th>
                            <th className="px-4 py-2">รวม</th>
                            <th className="px-4 py-2">สถานะ</th>
                        </tr>
                    </thead>
                    {
                        form.map((item, key) => {
                            return <tbody key={key}>
                                <tr>
                                    <td className="border px-4 py-2">
                                        {item.roomId}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            name="water"
                                            onChange={e => handleForm(e, key)}
                                            value={item.water}
                                            required
                                        />
                                    </td>
                                    <td className="border px-4 py-2">
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            name="electric"
                                            onChange={e => handleForm(e, key)}
                                            value={item.electric}
                                            required
                                        />
                                    </td>
                                    <td className="border px-4 py-2">
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            name="total"
                                            value={+item.electric + +item.water}
                                            required
                                        />
                                    </td>
                                    <td className="border px-4 py-2">
                                        <select
                                            className="shadow w-full border rounded h-10"
                                            name="status"
                                            onChange={e => handleForm(e, key)}
                                            required
                                        >
                                            <option value="ค้างชำระ">ค้างชำระ</option>
                                            <option value="ชำระเงินแล้ว">ชำระเงินแล้ว</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        })
                    }
                </table>
            </div>
            <div>
                <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-5"
                    onClick={() => localStorage.setItem('adminPayment', JSON.stringify(form))}
                >บันทึกชั่วคราว</button>
                <button className="bg-red-200 hover:bg-red-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-5"
                    onClick={() => {
                        localStorage.removeItem('adminPayment')
                        getRoom(0)
                        setUpdate(Math.random())
                    }}
                >ล้างค่าบันทึกชั่วคราว</button>
                <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-5"
                    onClick={saveForm}
                >บันทึกข้อมูลในระบบ</button>
            </div>
        </div>

    return (
        <div className="flex flex-col min-h-screen pl-32 pr-32 pt-10">

            <div className="flex flex-col relative">
                <label htmlFor="semester">เทอม</label>
                <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" name="semester" id="semester" onChange={handleChange} value={select.semester}>
                    <option value="1" name="semester">1</option>
                    <option value="2" name="semester">2</option>
                    <option value="3" name="semester">3</option>
                </select>
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
                onClick={() => {
                    getBill()
                    setCreateBill(true)
                }}
            >
                สร้างบิล
            </button>

            {createBill && Room()}

        </div>
    )
}

export default Payment
