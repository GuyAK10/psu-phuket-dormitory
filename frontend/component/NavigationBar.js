import React, { useContext, useEffect, useState } from 'react'
import { GlobalState } from '../utils/context'
import { Divider } from 'antd';
import Link from 'next/link'

const NavigationBar = () => {
    const { Staff, MenuName, SubMenuName } = useContext(GlobalState)
    const [menuName, setMenuName] = MenuName
    const [subMenuName, setSubMenuName] = SubMenuName
    const [staff, setStaff] = Staff
    const [adminPath, setAdminPath] = useState(false)

    const SubMenu = ({ menu, route }) => {
        return <Link href={route}>
            <a style={{ background: subMenuName === menu ? "#2f80af" : "none" }} onClick={() => setSubMenuName(menu)} className="text-lg cursor-pointer p-3 rounded">
                {menu}
            </a>
        </Link>
    }

    const toggleDrop = (menu) => menuName === menu ? setMenuName('') : setMenuName(menu)

    const checkPathName = () => {
        const { location: { pathname } } = window
        const checkAdminPath = pathname.includes('/admin/')
        setAdminPath(checkAdminPath)
    }

    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            if ((sessionStorage.getItem('token')).type == "Staffs") setStaff(true)
            else setStaff(false)
        }
        checkPathName()
    }, [])

    return (
        <div className="nav-bar shadow flex flex-col bg-gradient-to-r from-blue-700 h-full to-blue-800 text-white p-2">
            <h1 className="text-2xl text-center text-white">เมนู</h1>
            <Divider />
            {
                staff
                    ? <div className="cursor-pointer p-3">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src={adminPath ? `../../icon/newspaper.svg` : `icon/newspaper.svg`} alt="news" />
                            <a className="text-lg" onClick={() => toggleDrop('ข่าวสาร')}>ข่าวสาร</a>
                        </span>
                        {menuName === "ข่าวสาร" ?
                            <div className="flex flex-col">
                                <SubMenu menu="อัพเดดข่าว" route="/admin/news/update" />
                                <SubMenu menu="รายการข่าว" route="/admin/news" />
                            </div> : null
                        }
                    </div>
                    :
                    <div className="cursor-pointer p-3">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src={adminPath ? `../../icon/newspaper.svg` : `icon/newspaper.svg`} alt="news" />
                            <a className="text-lg" onClick={() => toggleDrop('ข่าวสาร')}>ข่าวสาร</a>
                        </span>
                        {menuName === "ข่าวสาร" ?
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
                            <img className="w-5 h-5 mr-2" src={adminPath ? `../../icon/identification.svg` : `icon/identification.svg`} alt="personal infomation" />
                            <a className="text-lg" onClick={() => toggleDrop("ข้อมูลส่วนตัว")}>ข้อมูลส่วนตัว</a>
                        </span>
                        {menuName === "ข้อมูลส่วนตัว" ?
                            <div className="flex flex-col">
                                <SubMenu menu="ข้อมูลนักศึกษาทั้งหมด" route="/admin/profiles" />
                            </div> : null
                        }
                    </div>
                    : <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src={adminPath ? `../../icon/identification.svg` : `icon/identification.svg`} alt="personal infomation" />
                            <a className="text-lg" onClick={() => toggleDrop("ข้อมูลส่วนตัว")}>ข้อมูลส่วนตัว</a>
                        </span>
                        {menuName === "ข้อมูลส่วนตัว" ?
                            <div className="flex flex-col">
                                <SubMenu menu="ข้อมูลส่วนตัว" route={`/profile-result?profileId=${sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')).id : undefined}`} />
                                <SubMenu menu="แก้ไขข้อมูล" route="/profile" />
                            </div> : null
                        }
                    </div>
            }
            {
                staff
                    ? <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src={adminPath ? `../../icon/online-booking.svg` : `icon/online-booking.svg`} alt="personal infomation" />
                            <a className="text-lg" onClick={() => toggleDrop("จองห้องพัก")}>จองห้องพัก</a>
                        </span>
                        {menuName === "จองห้องพัก" ?
                            <div className="flex flex-col">
                                <SubMenu menu="ตารางรายชื่อ" route="/admin/reserve" />
                                <SubMenu menu="แผนผังการจอง" route="/admin/reserve" />
                            </div> : null
                        }
                    </div>
                    : <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src={adminPath ? `../../icon/online-booking.svg` : `icon/online-booking.svg`} alt="personal infomation" />
                            <a className="text-lg" onClick={() => toggleDrop("จองห้องพัก")}>จองห้องพัก</a>
                        </span>
                        {menuName === "จองห้องพัก" ?
                            <div className="flex flex-col">
                                <SubMenu menu="วิธีการจองห้องพัก" route="/reserve" />
                                <SubMenu menu="แผนผังการจอง" route="/reserve" />
                                <SubMenu menu="ตารางรายชื่อ" route="/reserve" />
                            </div> : null
                        }
                    </div>
            }
            {
                staff
                    ?
                    <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src={adminPath ? `../../icon/mechanic.svg` : `icon/mechanic.svg`} alt="personal infomation" />
                            <a className="text-lg" onClick={() => toggleDrop("แจ้งซ่อมแซม")}>แจ้งซ่อมแซม</a>
                        </span>
                        {menuName === "แจ้งซ่อมแซม" ?
                            <div className="flex flex-col">
                                <SubMenu menu="ประวัติการแจ้งซ่อมแซม" route="/admin/support" />
                            </div> : null
                        }
                    </div>
                    : <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src={adminPath ? `../../icon/mechanic.svg` : `icon/mechanic.svg`} alt="personal infomation" />
                            <a className="text-lg" onClick={() => toggleDrop("แจ้งซ่อมแซม")}>แจ้งซ่อมแซม</a>
                        </span>
                        {menuName === "แจ้งซ่อมแซม" ?
                            <div className="flex flex-col">
                                <SubMenu menu="เพิ่มรายละเอียด" route="/support" />
                            </div> : null
                        }
                    </div>
            }
            {
                staff
                    ?
                    <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src={adminPath ? `../../icon/bill.svg` : `icon/bill.svg`} alt="personal infomation" />
                            <a className="text-lg" onClick={() => toggleDrop("ชำระค่าน้้ำค่าไฟ")}>ชำระค่าน้้ำค่าไฟ</a>
                        </span>
                        {menuName === "ชำระค่าน้้ำค่าไฟ" ?
                            <div className="flex flex-col">
                                <SubMenu menu="เพิ่มรายการ" route="/admin/payment" />
                                <SubMenu menu="ประวัติ" route="/admin/payment/payment-history" />
                            </div> : null
                        }
                    </div>
                    : <div className="p-3 cursor-pointer">
                        <span className="flex">
                            <img className="w-5 h-5 mr-2" src={adminPath ? `../../icon/bill.svg` : `icon/bill.svg`} alt="personal infomation" />
                            <a className="text-lg" onClick={() => toggleDrop("ชำระค่าน้้ำค่าไฟ")}>ชำระค่าน้้ำค่าไฟ</a>
                        </span>
                        {menuName === "ชำระค่าน้้ำค่าไฟ" ?
                            <div className="flex flex-col">
                                <SubMenu menu="ชำระค่าน้้ำค่าไฟ" route="/payment" />
                                <SubMenu menu="ประวัติ" route="/payment-history" />
                            </div> : null
                        }
                    </div>
            }

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