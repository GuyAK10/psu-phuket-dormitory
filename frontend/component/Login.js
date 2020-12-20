import React from 'react'
import { message } from 'antd';
import { GlobalState } from '../utils/context'
import Router from 'next/router'

const Login = ({ children }) => {
    const {
        setCookie,
        showModal,
        setShowModal,
        setMenuBar,
        setStaff,
        post,
        previousRoute
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
                setCookie("token", result.token)
                setCookie("user", result.user)
                setMenuBar('ออกจากระบบ')
                if (result.user.type == "Staffs") {
                    setStaff(true)
                }
                else if (result.user.type == "Students") {
                    setStaff(false)
                }
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
        if (e.key === "Enter")
            getAuthen()
    }

    if (showModal) return (
        <>
            <div
                className="h-full flex flex-col absolute right-0 p-5 bg-gray-200"
                onKeyDown={handleEnter}
            >
                <div onClick={() => setShowModal(!showModal)}>
                    <img className="cursor-pointer p-1 shadow border rounded bg-white w-full h-8" src="https://image.flaticon.com/icons/svg/271/271228.svg" alt="close login bar" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="username">PSU Passport</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        name="username"
                        placeholder="username"
                        onChange={handleForm}
                        value={form.username}
                    />
                    <label htmlFor="username">รหัสผ่าน</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={handleForm}
                        value={form.password}
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
                    <button className="w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5" onClick={getAuthen}>Login</button>
                </div>
            </div>
            {children}
        </>
    )
    else return <div>{children}</div>
}

export default Login