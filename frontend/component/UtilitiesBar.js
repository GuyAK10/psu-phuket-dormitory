import React, { useContext, useEffect, useState } from 'react'
import { GlobalState } from '../utils/context'
import Link from 'next/link'
import Router from 'next/router'
import { message } from 'antd';

const UtilitiesBar = () => {
    const {
        adminPath,
        setAdminPath,
        del,
        cookies,
        removeCookie,
        menuBar,
        setMenuBar,
        setStaff,
        setShowModal,
        response,
        headerDetail,
        setHeaderDetail
    } = useContext(GlobalState)

    const LoginOrLogout = () => {
        if (cookies.user) {
            setMenuBar('ออกจากระบบ')
        }
           
        else setMenuBar('ลงชื่อเข้าใช้')
        return true
    }

    const handleLogin = async () => {
        if (menuBar === "ลงชื่อเข้าใช้") {
            setShowModal(true)
        }
        if (menuBar === "ออกจากระบบ") {
            setMenuBar('ลงชื่อเข้าใช้')
            setHeaderDetail(null)
            removeCookie("token")
            removeCookie("user")
            setStaff(false)
            try {
                await del(`/logout/${cookies.user.id}`)
                if (response.ok) message.success('ออกจากระบบเรียบร้อย')
            } catch (e) {
                console.error(e)
            }
            Router.push('/')
        }
    }

    const checkPathName = () => {
        const { location: { pathname } } = window
        const checkAdminPath = pathname.includes('/admin/')
        setAdminPath(checkAdminPath)
    }

    const getUtilsBar = () => {
        const detail = cookies.user || ""
        setHeaderDetail(detail)
    }

    useEffect(() => {
        getUtilsBar()
        LoginOrLogout()
        checkPathName()
    }, [])

    return (
        <div className="utillities flex flex-row justify-between shadow min-w-screen flex flex-row bg-gray-200 text-xl p-3">
            { headerDetail ? <div className="text-center text-base">{`${headerDetail.id}`}</div> : ""}
            <div className="self-end">{cookies ? cookies.id : null}</div>
            <div className="cursor-pointer">
                <span className="flex">
                    <img className="w-5 h-5 mr-2" src={adminPath ? `../../icon/login.svg` : `icon/login.svg`} alt="personal infomation" />
                    <Link href="/">
                        <a onClick={handleLogin}>{menuBar}</a>
                    </Link>
                </span>
            </div>
        </div>
    )
}

export default UtilitiesBar
