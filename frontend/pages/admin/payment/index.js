import React, { useState, useEffect } from 'react'
import { GlobalState } from '../../../utils/context'
import useFetch from 'use-http'
import Router from 'next/router'
import { message } from 'antd'
import { useForm } from 'react-hook-form'
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const Payment = () => {
    const { get, post, cookies } = React.useContext(GlobalState)
    const { register, handleSubmit, getValues, errors } = useForm()

    const years = () => {
        const fullYear = new Date().getFullYear()
        const years = []
        for (let i = fullYear; i >= fullYear - 10; i--) {
            years.push(i)
        }
        return years.map(item => item + 543)
    }

    const [select, setSelect] = useState({
        semester: 2,
        month: "january",
        year: years()[0]
    })

    const onSubmit = (values) => {
        console.log(values)
        const save = post("staff/payment", values)
        if (save.success) {
            message.success(save.message)
            Router.pathname('/admin/payment-history')
        }
        console.log(save)
    }

    // const getBill = async () => {
    //     setIsLoading(true)
    //     const data = await get(`staff/payment/${select.semester}/${select.month}/${select.year}`)
    //     if (data.success) {
    //         message.success(data.message)
    //         let tempChange = []
    //         for (let change in form)
    //             if (form[change].roomId == data.data[change].roomId)
    //                 tempChange[change] = data.data[change]
    //             else
    //                 tempChange[change] = form[change]
    //         if (tempChange.length) setForm(tempChange)
    //     }
    //     else {
    //         message.error(data.message)
    //     }
    //     setIsLoading(false)
    // }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-screen pl-32 pr-32 pt-10">

            <div className="flex flex-col relative">
                <label htmlFor="month">เดือน</label>
                <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    name="abbMonth"
                    ref={register}
                >
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
                <label htmlFor="abbYear">ปี</label>
                <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    name="year"
                    ref={register}
                >
                    {
                        years().map((item, key) => <option key={key} value={item} name={item}>{item}</option>)
                    }
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>

            <div className="flex flex-col relative">
                <label htmlFor="years">ไฟล์ Excel</label>
                <div className="flex flex-row">
                    <input type="file"
                        name="file"
                        className=""
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        ref={register}
                    />
                    <input
                        disabled
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                    console.log(getValues())
                }}
            >
                อัพโหลดไฟล์
            </button>

        </form>
    )
}

export default Payment
