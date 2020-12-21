import React from 'react'
import { GlobalState } from '../utils/context'
import { message } from 'antd';
import Router from 'next/router'
import useFetch from 'use-http'

const Login = () => {
    const {
        setCookie,
        setShowModal,
        setMenuBar,
        setStaff,
        previousRoute,
        setHeaderDetail,
        cookies,
        response
    } = React.useContext(GlobalState)

    const { post } = useFetch(`${ENDPOINT}:${PORT}`, options => {
        options.cachePolicy = "no-cache"
        return options
    })

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
            if (response.ok) {
                setShowModal(false)
                setCookie("token", result.token, { maxAge: Date.now() + 1000 * 60 * 10 })
                setCookie("user", result.user, { maxAge: Date.now() + 1000 * 60 * 10 })
                const detail = cookies.user || ""
                setHeaderDetail(detail)
                if (result.user.type == "Staffs") {
                    setStaff(true)
                }
                else if (result.user.type == "Students") {
                    setStaff(false)
                }
                setMenuBar('ออกจากระบบ')
                if (previousRoute) {
                    Router.push(previousRoute)
                }
                message.success('เข้าสู่ระบบแล้ว')
            }

            else if (result.status === 401) {
                message.warn('ID หรือ รหัสผ่านผิดพลาด')
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

    React.useEffect(() => {
        setMenuBar("ลงชื่อเข้าใช้")
        setShowModal(false)
    }, [])

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
