import React, { useContext, useEffect } from 'react'
import { GlobalState } from '../utils/context'
import Link from 'next/link'
import Router from 'next/router'
import useFetch from 'use-http'
import { message } from 'antd';

const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const UtilitiesBar = () => {
    const { SubMenuName, Token, Modal, MenuBar } = useContext(GlobalState)
    const [subMenuName] = SubMenuName
    const [token, setToken] = Token
    const [menuBar, setMenuBar] = MenuBar
    const [showModal, setShowModal] = Modal
    const { del } = useFetch(`${ENDPOINT}:${PORT}`)

    const LoginOrLogout = () => {
        const session = sessionStorage.getItem('token')
        if (session) setMenuBar('ออกจากระบบ')
        else setMenuBar('ลงชื่อเข้าใช้')
        return true
    }

    const handleLogin = () => {
        const logout = () => {
            message.success('ออกจากระบบเรียบร้อย')
        }

        if (menuBar === "ลงชื่อเข้าใช้") setShowModal(true)
        if (menuBar === "ออกจากระบบ") {
            const { token } = JSON.parse(sessionStorage.getItem("token"))
            setToken({ id: null, token: null, type: "Students" })
            sessionStorage.removeItem('token')
            setMenuBar('ลงชื่อเข้าใช้')
            try {
                del(`/logout/${token}`)
                    .then((res) => {
                        logout()
                    })
            } catch (e) {
                console.error(e)
            }
            Router.push('/')
        }
    }

    useEffect(() => {
        LoginOrLogout()
    }, [])

    return (
        <div className="flex flex-row justify-between shadow w-full flex flex-row bg-gray-200 text-xl p-3">
            <div>{subMenuName}</div>
            <div className="self-end">{token ? token.id : null}</div>
            <div className="cursor-pointer">
                <span className="flex">
                    <img className="w-5 h-5 mr-2" src="icon/login.svg" alt="personal infomation" />
                    <Link href="/">
                        <a onClick={handleLogin}>{menuBar}</a>
                    </Link>
                </span>
            </div>
        </div>
    )
}

export default UtilitiesBar
