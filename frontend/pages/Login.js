import React from 'react'
import axios from 'axios'
import qs from 'qs'
import { LoginState } from '../utils/context'
import Router from 'next/router'
const Endpoint = process.env.END_POINT || 'http://localhost'

const Login = () => {
    const { MenuBar, Token, Modal, AxiosConfig, PreviousRoute } = React.useContext(LoginState)
    const [previousRoute] = PreviousRoute
    const [token, setToken] = Token
    const [showModal, setShowModal] = Modal
    const [menuBar, setMenuBar] = MenuBar
    const [axiosConfig, setAxiosConfig] = AxiosConfig

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
            const result = await axios.post(`${Endpoint}`, qs.stringify(form), {
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
                setMenuBar('ออกจากระบบ')
                if (previousRoute !== null) Router.push(previousRoute)
            }
            else if (result.status === 401) {
                setToken(null)
                // sessionStorage.removeItem("token")
                // setMenuBar('ลงชื่อเข้าใช้')
            }
        } catch (e) {
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
        <div className="login-page-container">
            <div className="login-form">
                <h2 className="force-login">กรุณาเข้าสู่ระบบ</h2>
                <label htmlFor="username">PSU Passport</label>
                <input type="text" name="username" placeholder="username"
                    onChange={handleForm}
                    onKeyDown={handleEnter}
                />

                <label htmlFor="username">Password</label>
                <input type="password" name="password" placeholder="password"
                    onChange={handleForm}
                    onKeyPress={handleEnter}
                />
                <label htmlFor="สถานะ" className="status">สถานะ</label>
                <select name="type" onChange={handleForm}>
                    <option value="Students">นักศึกษา</option>
                    <option value="Staff">เจ้าหน้าที่/อาจารย์</option>
                </select>
                <button onClick={getAuthen}>Login</button>
            </div>
            <style jsx>{`
                    .login-page-container {
                        min-height: 85vh;
                        display: flex;
                        flex-direction: column;
                        align-content: center;
                        justify-content: center;
                        text-align: center;
                        background: #269CD4;
                    }
                    .force-login {
                        font-size: 25px;
                        margin: 0;
                        padding: 0;
                        font-family: 'Sarabun', sans-serif;
                    }
                    .login-form {
                        padding: 4em 5em 5em 5em;
                        background: #47C5FF;
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                        border-radius: 15px;
                    }
                    .login-form > label {
                        margin: 1em 0 0 0 ;
                        text-align: left;
                    }
                    .login-form > select {
                        margin: 0;
                        padding: 0;
                    }
                    .login-form > input, select {
                        width: 30em;
                    }
                    .login-form > input, select, button {
                        border-radius: 5px;
                        height: 2em;
                    }
                    .login-form > button {
                        margin: 2em 0 0 0;
                    }
            `}</style>
        </div>
    )
}

export default Login