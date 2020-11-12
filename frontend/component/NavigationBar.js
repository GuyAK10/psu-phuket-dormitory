import React, { useState, createRef } from 'react'
import Router from 'next/router'
import { GlobalState } from '../utils/context'
import axios from 'axios'
import { message, Divider } from 'antd';
import Link from 'next/link'

const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const NavigationBar = () => {
    const { MenuBar, Token, Modal, PreviousRoute, Staff } = React.useContext(GlobalState)
    const [token, setToken] = Token
    const [showModal, setShowModal] = Modal
    const [menuBar, setMenuBar] = MenuBar
    const [previousRoute, setPreviousRoute] = PreviousRoute
    const [staff] = Staff
    const ref = [createRef(), createRef(), createRef(), createRef(), createRef()]
    const [menuActive, setMenuActive] = useState('')
    const [subMenuActive, setSubMenuActive] = useState('รายการข่าว')

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

    const SubMenu = ({ menu, route }) => {
        return <Link href={route}>
            <a className="cursor-pointer p-3">
                {menu}
            </a>
        </Link>
    }

    const toggleDrop = (menu) => menuActive === menu ? setMenuActive('') : setMenuActive(menu)

    React.useEffect(() => {
        LoginOrLogout()
    }, [])

    return (
        <div className="shadow flex flex-col bg-gradient-to-r from-blue-400 to-blue-500 h-full text-white w-50 p-3">
            <h1 className="text-2xl text-center text-white">เมนู</h1>
            <Divider />
            {
                staff
                    ? <div className="cursor-pointer p-3">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src="icon/newspaper.svg" alt="news" />
                            <a onClick={() => toggleDrop('ข่าวสาร')}>ข่าวสาร</a>
                        </span>
                        {menuActive === "ข่าวสาร" ?
                            <div className="flex flex-col">
                                <SubMenu menu="อัพเดดข่าว" route="/admin/news/update" />
                                <SubMenu menu="รายการข่าว" route="/admin/news" />
                            </div> : null
                        }
                    </div>
                    :
                    <div className="cursor-pointer p-3">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src="icon/newspaper.svg" alt="news" />
                            <a onClick={() => toggleDrop('ข่าวสาร')}>ข่าวสาร</a>
                        </span>
                        {menuActive === "ข่าวสาร" ?
                            <div className="flex flex-col">
                                <SubMenu menu="รายการข่าว" route="/" />
                            </div> : null
                        }
                    </div>
            }
            {
                staff
                    ?
                    <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src="icon/identification.svg" alt="personal infomation" />
                            <a onClick={() => toggleDrop("ข้อมูลส่วนตัว")}>ข้อมูลส่วนตัว</a>
                        </span>
                        {menuActive === "ข้อมูลส่วนตัว" ?
                            <div className="flex flex-col">
                                <SubMenu menu="ข้อมูลนักศึกษาทั้งหมด" route="/admin/profiles" />
                            </div> : null
                        }
                    </div>
                    : <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src="icon/identification.svg" alt="personal infomation" />
                            <a onClick={() => toggleDrop("ข้อมูลส่วนตัว")}>ข้อมูลส่วนตัว</a>
                        </span>
                        {menuActive === "ข้อมูลส่วนตัว" ?
                            <div className="flex flex-col">
                                <SubMenu menu="ข้อมูลส่วนตัว" route="/profile" />
                                <SubMenu menu="แก้ไขข้อมูล" route="/profile" />
                            </div> : null
                        }
                    </div>
            }
            {
                staff
                    ? <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src="icon/mobile-payment.svg" alt="personal infomation" />
                            <a onClick={() => toggleDrop("จ่ายค่าหอพัก")}>จ่ายค่าหอพัก</a>
                        </span>
                        {menuActive === "จ่ายค่าหอพัก" ?
                            <div className="flex flex-col">
                                <SubMenu menu="รายการจ่ายเงิน" route="/admin/payment" />
                            </div> : null
                        }
                    </div>
                    : <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src="icon/mobile-payment.svg" alt="personal infomation" />
                            <a onClick={() => toggleDrop("จ่ายค่าหอพัก")}>จ่ายค่าหอพัก</a>
                        </span>
                        {menuActive === "จ่ายค่าหอพัก" ?
                            <div className="flex flex-col">
                                <SubMenu menu="จ่ายเงิน" route="/payment" />
                            </div> : null
                        }
                    </div>
            }
            {
                staff
                    ? <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src="icon/online-booking.svg" alt="personal infomation" />
                            <a onClick={() => toggleDrop("จองห้องพัก")}>จองห้องพัก</a>
                        </span>
                        {menuActive === "จองห้องพัก" ?
                            <div className="flex flex-col">
                                <SubMenu menu="ตารางรายชื่อ" route="/admin/reserve" />
                                <SubMenu menu="แผนผังการจอง" route="/admin/reserve" />
                            </div> : null
                        }
                    </div>
                    : <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src="icon/online-booking.svg" alt="personal infomation" />
                            <a onClick={() => toggleDrop("จองห้องพัก")}>จองห้องพัก</a>
                        </span>
                        {menuActive === "จองห้องพัก" ?
                            <div className="flex flex-col">
                                <SubMenu menu="วิธีการจองห้องพัก" route="/reserve" />
                                <SubMenu menu="แผนผังการจอง" route="/reserve" />
                                <SubMenu menu="ตารางรายชื่อ" route="/reserve" />
                            </div> : null
                        }
                    </div>
            }
            {
                staff ? <div className="p-3 cursor-pointer">
                    <span className="flex">
                        <img className="w-5 h-5 mr-2" src="icon/mechanic.svg" alt="personal infomation" />
                        <a onClick={() => toggleDrop("แจ้งซ่อมแซม")}>แจ้งซ่อมแซม</a>
                    </span>
                    {menuActive === "แจ้งซ่อมแซม" ?
                        <div className="flex flex-col">
                            <SubMenu menu="ประวัติการแจ้งซ่อมแซม" route="/admin/support" />
                        </div> : null
                    }
                </div>
                    : <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src="icon/mechanic.svg" alt="personal infomation" />
                            <a onClick={() => toggleDrop("แจ้งซ่อมแซม")}>แจ้งซ่อมแซม</a>
                        </span>
                        {menuActive === "แจ้งซ่อมแซม" ?
                            <div className="flex flex-col">
                                <SubMenu menu="เพิ่มรายละเอียด" route="/support" />
                            </div> : null
                        }
                    </div>
            }
            {
                staff ? <div className="p-3 cursor-pointer">
                    <span className="flex">
                        <img className="w-5 h-5 mr-2" src="icon/bill.svg" alt="personal infomation" />
                        <a onClick={() => toggleDrop("ชำระค่าน้้ำค่าไฟ")}>ชำระค่าน้้ำค่าไฟ</a>
                    </span>
                    {menuActive === "ชำระค่าน้้ำค่าไฟ" ?
                        <div className="flex flex-col">
                            <SubMenu menu="เพิ่มรายการ" route="/admin/support" />
                            <SubMenu menu="ประวัติ" route="/admin/support" />
                        </div> : null
                    }
                </div>
                    : <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src="icon/bill.svg" alt="personal infomation" />
                            <a onClick={() => toggleDrop("ชำระค่าน้้ำค่าไฟ")}>ชำระค่าน้้ำค่าไฟ</a>
                        </span>
                        {menuActive === "ชำระค่าน้้ำค่าไฟ" ?
                            <div className="flex flex-col">
                                <SubMenu menu="เพิ่มรายการ" route="/admin/support" />
                                <SubMenu menu="ประวัติ" route="/admin/support" />
                            </div> : null
                        }
                    </div>
            }
            <div className="p-3 cursor-pointer">
                <span className="flex">
                    <img className="w-5 h-5 mr-2" src="icon/login.svg" alt="personal infomation" />
                    <Link href="/">
                        <a onClick={handleLogin}>{menuBar}</a>
                    </Link>
                </span>
            </div>
            <img className="opacity-25" src="background/psu view.jpg" alt="psu view" />
            <style jsx>{`
                img{
                    filter:invert(100%);
                }
                img:last-child{
                    filter:none;
                }
            `}</style>
        </div>
    )
}

export default NavigationBar