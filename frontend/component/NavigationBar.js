import React from 'react'
import Router from 'next/router'
import { GlobalState } from '../utils/context'
import axios from 'axios'
import { message, Button, Space } from 'antd';
const ENV_ENPOINT = process.env.END_POINT || 'http://localhost'

const NavigationBar = () => {
    const { MenuBar, Token, Modal, PreviousRoute } = React.useContext(GlobalState)
    const [token, setToken] = Token
    const [showModal, setShowModal] = Modal
    const [menuBar, setMenuBar] = MenuBar
    const [previousRoute, setPreviousRoute] = PreviousRoute
    const [hamburgerMenu, setHamburgermenu] = React.useState(false)
    const ref = React.useRef()

    const hamburgerToggle = () => {
        setHamburgermenu(!hamburgerMenu)
        if (window.innerWidth < 500)
            ref.current.style.display !== 'flex' ? ref.current.style.display = 'flex' : ref.current.style.display = 'none'
    }

    const handleTabClose = () => {
        if (hamburgerMenu) setHamburgermenu(!hamburgerMenu)
        if (window.innerWidth < 500)
            ref.current.style.display = 'none';
    }

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
                axios.delete(`${ENV_ENPOINT}/logout/${token}`)
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
    }

    React.useEffect(() => {
        LoginOrLogout()
    }, [])

    return (
        <div className="root-navbar-container">
            {
                !hamburgerMenu && <div onClick={hamburgerToggle} className="hamburger-container">
                    <img className="hamburger" src="/icon/Hamburger_icon.svg.png" alt="Hambuger Menu" />
                </div>
            }
            {
                <div ref={ref} onClick={hamburgerToggle} className="navbar-container">
                    <span onClick={() => handleRoute('/')}>หน้าแรก</span>
                    <span onClick={() => handleRoute('/reserve')}>จองห้อง</span>
                    <span onClick={() => handleRoute('/support')}>แจ้งซ่อม</span>
                    <span onClick={() => handleRoute('/profile')}>ข้อมูลส่วนตัว</span>
                    <span onClick={handleLogin}>{menuBar}</span>
                </div>
            }
            <style jsx>{`
                .navbar-container > span {
                    cursor: pointer;
                    font-family: 'Sarabun', sans-serif;
                    font-size: 18px;
                    font-weight: 600;
                }
                .root-navbar-container {
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                }
            `}</style>
        </div>
    )
}

export default NavigationBar