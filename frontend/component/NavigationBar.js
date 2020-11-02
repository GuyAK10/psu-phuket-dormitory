import React, { useState } from 'react'
import Router from 'next/router'
import { GlobalState } from '../utils/context'
import axios from 'axios'
import { message } from 'antd';
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const NavigationBar = () => {
    const { MenuBar, Token, Modal, PreviousRoute, Staff } = React.useContext(GlobalState)
    const [token, setToken] = Token
    const [showModal, setShowModal] = Modal
    const [menuBar, setMenuBar] = MenuBar
    const [previousRoute, setPreviousRoute] = PreviousRoute
    const [staff] = Staff
    const ref = React.useRef()

    const handleRoute = (url) => {
        const session = sessionStorage.getItem('token')
        if (url === "/reserve" || url === "/profile") {
            setPreviousRoute(url)
            if (session)
                Router.push(url)
            else {
                Router.push("login")
            }
        }
        else Router.push(url)
    }

    const handleLogin = () => {
        const logout = () => {
            message.success('ออกจากระบบเรียบร้อย')
        }

        if (menuBar === "ลงชื่อเข้าใช้") setShowModal(true)
        if (menuBar === "ออกจากระบบ") {
            const { token } = JSON.parse(sessionStorage.getItem("token"))
            setToken(null)
            sessionStorage.removeItem('token')
            setMenuBar('ลงชื่อเข้าใช้')
            try {
                axios.delete(`${ENDPOINT}:${PORT}/logout/${token}`)
                    .then((res) => {
                        logout()
                    })
            } catch (e) {
                console.error(e)
            }
            Router.push('/')
        }
    }

    const LoginOrLogout = () => {
        const session = sessionStorage.getItem('token')
        if (session) setMenuBar('ออกจากระบบ')
        else setMenuBar('ลงชื่อเข้าใช้')
        return true
    }

    React.useEffect(() => {
        LoginOrLogout()
    }, [])

    return (
        <div className="navbar-container text-center flex flex-col justify-around justify-items-auto items-stretch sm:flex sm:flex-row">
            <span className="cursor-pointer p-3 w-full h-full" onClick={() => handleRoute('/')}>หน้าแรก</span>
            {staff ? <span className="cursor-pointer p-3 w-full h-full" onClick={() => handleRoute('/admin/reserve')}>รายการจองห้อง</span>
                : <span className="cursor-pointer p-3 w-full h-full" onClick={() => handleRoute('/reserve')}>จองห้อง</span>}
            <span className="cursor-pointer p-3 w-full h-full" onClick={() => handleRoute('/support')}>แจ้งซ่อม</span>
            {staff ? <span className="cursor-pointer p-3 w-full h-full" onClick={() => handleRoute('/admin/profiles')}>ข้อมูลนักศึกษา</span>
                : <span className="cursor-pointer p-3 w-full h-full" onClick={() => handleRoute('/profile')}>ข้อมูลส่วนตัว</span>}
            <span className="cursor-pointer p-3 w-full h-full" onClick={handleLogin}>{menuBar}</span>
        </div>
    )

    // return (
    //     <div className="navbar-container text-center flex flex-col justify-around justify-items-auto items-stretch sm:flex sm:flex-row">
    //         <span className="cursor-pointer p-3 w-full h-full" onClick={() => handleRoute('/')}>หน้าแรก</span>
    //         <span className="cursor-pointer p-3 w-full h-full" onClick={() => handleRoute('/admin/reserve')}>รายการจองห้อง</span>
    //         <span className="cursor-pointer p-3 w-full h-full" onClick={() => handleRoute('/support')}>แจ้งซ่อม</span>
    //         <span className="cursor-pointer p-3 w-full h-full" onClick={() => handleRoute('/admin/profiles')}>ข้อมูลนักศึกษา</span>
    //         <span className="cursor-pointer p-3 w-full h-full" onClick={handleLogin}>{menuBar}</span>
    //     </div>
    // )
}

export default NavigationBar