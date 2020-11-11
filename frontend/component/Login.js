import React from 'react'
import axios from 'axios'
import qs from 'qs'
import { message } from 'antd';
import { GlobalState } from '../utils/context'
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const Login = ({ children }) => {
    const { MenuBar, Token, Modal, AxiosConfig, Staff } = React.useContext(GlobalState)
    const [token, setToken] = Token
    const [showModal, setShowModal] = Modal
    const [menuBar, setMenuBar] = MenuBar
    const [axiosConfig, setAxiosConfig] = AxiosConfig
    const [staff, setStaff] = Staff

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

    const isStaff = () => {
        const session = JSON.parse(sessionStorage.getItem('token'))
        if (session) {
            if (session.type == "Staffs") {
                setStaff(true)
            }
            else if (session.type == "Students") {
                setStaff(false)
            }
        }
    }

    const getAuthen = async () => {
        const fail = () => {
            message.warn('ID หรือรหัสผ่านผิดพลาด')
        }
        try {
            const success = () => {
                message.success('เข้าสู้ระบบแล้ว')
            }
            const result = await axios.post(`${ENDPOINT}:${PORT}`, qs.stringify(form), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            if (result.status === 200 && result.data.token) {
                sessionStorage.setItem('token', JSON.stringify(result.data))
                setShowModal(false)
                setToken(result.data)
                setAxiosConfig({
                    headers: {
                        authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")).token}`,
                        type: result.data.type
                    }
                })
                isStaff()
                setMenuBar('ออกจากระบบ')
                success()
            }
            else if (result.status === 401) {
                setToken(null)
            }
        } catch (e) {
            fail()
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