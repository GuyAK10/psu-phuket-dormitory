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
                className="login-container"
                onKeyDown={handleEnter}
            >
                <div onClick={() => setShowModal(!showModal)}>
                    <img src="https://image.flaticon.com/icons/svg/271/271228.svg" alt="close login bar" />
                </div>
                <div className="login-form">
                    <label htmlFor="username">PSU Passport</label>
                    <input type="text" name="username" placeholder="username" onChange={handleForm} />
                    <label htmlFor="username">รหัสผ่าน</label>
                    <input type="password" name="password" placeholder="password" onChange={handleForm} />
                    <label htmlFor="สถานะ" className="status">สถานะ</label>
                    <select name="type" onChange={handleForm}>
                        <option value="Students">นักศึกษา</option>
                        <option value="Staffs">เจ้าหน้าที่/อาจารย์</option>
                    </select>
                    <button onClick={getAuthen}>Login</button>
                </div>
            </div>
            {children}
            <style jsx>{`
                    .login-container {
                        background: #269CD4;
                        font-family: 'Sarabun', sans-serif;
                    }
                    .login-container > div:first-child, img:first-child {
                        grid-column: span 12;
                        width: 100%;
                        height: 2em;
                        cursor: pointer;
                        background: #6489BD;
                    }
                    .login-form > input, select, option{
                        border-radius: 10px;
                        height: 2em;
                        font-family: 'Sarabun', sans-serif;
                    }
                    .login-form > label {
                        margin: 2em 0 0 0;
                        font-family: 'Sarabun', sans-serif;
                    }
                    .login-form > button {
                        height: 3em;
                        background: #9BBD22;
                        border-radius: 10px;
                        margin: 5em 2px 2px 0;
                    }
            `}</style>
        </>
    )
    else return <div>{children}</div>
}

export default Login