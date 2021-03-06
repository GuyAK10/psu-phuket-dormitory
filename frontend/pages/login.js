import React, { useEffect } from 'react'
import { GlobalState } from '../utils/context'
import { message } from 'antd';
import Router from 'next/router'

const Login = () => {
    const {
        setShowModal,
        setMenuBar,
        setStaff,
        setHeaderDetail,
        cookies,
        post,
        loading
    } = React.useContext(GlobalState)

    const [form, setForm] = React.useState({
        username: "",
        password: "",
        type: "Students"
    })

    const handleForm = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    const getAuthen = async () => {
        try {
            const result = await post(`/login`, form)
            if (result.token) {
                setShowModal(false)
                setMenuBar('ออกจากระบบ')
                const detail = cookies.user || ""
                setHeaderDetail(detail)
                if (result.user.type == "Staffs") {
                    setStaff(true)
                }
                else if (result.user.type == "Students") {
                    setStaff(false)
                }
                message.success('เข้าสู่ระบบแล้ว')
                window.location.href = '/'
            }
            else {
                message.warn(result.message)
            }

        } catch (e) {
            message.warn('ผิดพลาดไม่ทราบสาเหตุ')
            console.log(e)
        }
    }

    const handleEnter = e => {
        if (e.key === "Enter") {
            getAuthen()
        }
    }

    const checkChookies = () => {
        if(cookies.user) {
            Router.push("/")
        }
    }

    useEffect(() => {
        if (loading) message.loading('กำลังเข้าสู่ระบบ')
        checkChookies()
        return () => {
            if (!loading) message.destroy()
        }
    }, [loading])

    return (
        <div className="min-h-screen">
            <h2 className="text-3xl m-3">กรุณาเข้าสู่ระบบ</h2>
            <div className={`Card bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 m-4 flex flex-col justify-center items-center`}>
                <label htmlFor="username">PSU Passport</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="username" placeholder="username"
                    name="username"
                    value={form.username}
                    onChange={handleForm}
                    onKeyDown={handleEnter}
                />

                <label htmlFor="username">Password</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" name="password" placeholder="password"
                    name="password"
                    value={form.password}
                    onChange={handleForm}
                    onKeyPress={handleEnter}
                />
                <label htmlFor="สถานะ" className="status">สถานะ</label>
                <select className="shadow w-full border rounded h-10"
                    name="type"
                    onChange={handleForm}
                    value={form.type}
                >
                    <option value="Students">นักศึกษา</option>
                    <option value="Staffs">เจ้าหน้าที่/อาจารย์</option>
                </select>
                <button className="w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-5"
                    onClick={getAuthen}
                >Login</button>
            </div>
        </div>
    )
}

export default Login
