import React from 'react'
import axios from 'axios'
import qs from 'qs'
import { GlobalState } from '../utils/context'
import { message } from 'antd';
import Router from 'next/router'
import { Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const Login = () => {
    const { MenuBar, Token, Modal, AxiosConfig, PreviousRoute, Staff } = React.useContext(GlobalState)
    const [previousRoute] = PreviousRoute
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
            message.warn('ID หรือ รหัสผ่านผิดพลาด')
        }
        const success = () => {
            message.success('เข้าสู้ระบบแล้ว')
        }
        try {
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
                if (previousRoute) {
                    Router.push(previousRoute)
                }
                success()
            }
            else if (result.status === 401) {
                fail()
                setToken(null)
            }
        } catch (e) {
            fail()
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

    const Card = ({ children, background, width }) => {
        const bg = background || "bg-gray-100"
        const w = width ? `w-${width}` || "" : null
        return (
            <div className={`Card ${bg} ${w} shadow-md rounded px-8 pt-6 pb-8 m-4 flex flex-col justify-center items-center`}>
                {/* <div>{item.title}</div>
                <img src={item.img} />
                <p>{item.description}</p> */}
                {children}
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <Card>
                <h2 className="text-3xl m-3">กรุณาเข้าสู่ระบบ</h2>
                <Card background="bg-white" width="500">
                    <label htmlFor="username">PSU Passport</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="username" placeholder="username"
                        onChange={handleForm}
                        onKeyDown={handleEnter}
                    />

                    <label htmlFor="username">Password</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" name="password" placeholder="password"
                        onChange={handleForm}
                        onKeyPress={handleEnter}
                    />
                    <label htmlFor="สถานะ" className="status">สถานะ</label>
                    <select className="shadow w-full border rounded h-10" name="type" onChange={handleForm}>
                        <option value="Students">นักศึกษา</option>
                        <option value="Staffs">เจ้าหน้าที่/อาจารย์</option>
                    </select>
                    <button className="w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-5" onClick={getAuthen}>Login</button>
                </Card>
            </Card>
        </div>
    )
}

export default Login
