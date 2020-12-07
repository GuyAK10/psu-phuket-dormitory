import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../utils/context'
import Router from 'next/router'
import Loading from '../../../component/Loading'
import { message, Tooltip } from 'antd';
import useFetch from 'use-http'
import { TweenMax } from 'gsap'
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const reserve = () => {
    const { Modal, Token, AxiosConfig, MenuBar } = useContext(GlobalState)
    const [menuBar, setMenuBar] = MenuBar
    const [axiosConfig, setAxiosConfig] = AxiosConfig
    const [token, setToken] = Token
    const [showModal, setShowModal] = Modal
    const [showRoomSelect, setShowRoomSelect] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [showbuilding, setShowBuilding] = useState([])
    const [modalFloor, setModalFloor] = useState([])
    const [header, setHeader] = useState({})
    const [focusRoomList, setFocusListRoom] = useState([[{ floorId: "E01" }], [{ floorId: "A01" }]])
    const [update, setUpdate] = useState(0)
    const [system, setSystem] = useState(false)
    const floorList = [
        { 1: ["E", "A"] },
        { 2: ["F", "B"] },
        { 3: ["G", "C"] },
        { 4: ["H", "D"] }
    ]
    const { get, post, loading, error } = useFetch(`${ENDPOINT}:${PORT}/staff/room`, { ...header, cachePolicy: "no-cache" })

    const Logout = () => {
        setToken(null)
        sessionStorage.removeItem('token')
        setShowModal(false)
        setMenuBar('ลงชื่อเข้าใช้')
        Router.push('login')
    }

    const getHeader = () => {
        if (sessionStorage.getItem('token')) {
            setToken(JSON.parse(sessionStorage.getItem('token')))
            setHeader({
                headers: {
                    authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")).token}`,
                    type: JSON.parse(sessionStorage.getItem('token')).type
                }
            })
        }
    }

    const verifyLogin = () => {
        const session = sessionStorage.getItem("token")
        if (!session) {
            sessionStorage.removeItem('token')
            setToken(null)
            setShowModal(false)
            setMenuBar('ลงชื่อเข้าใช้')
            Router.push('login')
        }
    }

    const handleSelectFloor = async floor => {
        setShowBuilding(floor)
        let floorDetails = []
        setIsLoading(false)
        try {
            await axios.get(`${ENDPOINT}:${PORT}/staff/room/floor${floor[0]}`, axiosConfig)
                .then(res => {
                    floorDetails[0] = { ...res.data }
                })
                .catch(e => {
                    console.log(e)
                    Logout()
                })

            await axios.get(`${ENDPOINT}:${PORT}/staff/room/floor${floor[1]}`, axiosConfig)
                .then(res => {
                    floorDetails[1] = { ...res.data }
                })
                .catch(e => {
                    console.log(e)
                    Logout()
                })

            setFocusListRoom(floorDetails)
            setIsLoading(true)
        }
        catch (e) {
            console.error(e)
            Logout()
        }
    }

    const handleFocusModal = () => {
        setShowRoomSelect(false)
    }

    const handleModalFloor = (section) => {
        let temp = []

        if (section === "l-1-16") {
            let i = 0
            while (i < 16) {
                temp.push(focusRoomList[0][i])
                i++
            }
        }

        if (section === "l-17-24") {
            let i = 16
            while (i < 24) {
                temp.push(focusRoomList[0][i])
                i++
            }
        }

        if (section === "r-1-16") {
            let i = 0
            while (i < 16) {
                temp.push(focusRoomList[1][i])
                i++
            }
        }

        if (section === "r-17-24") {
            let i = 16
            while (i < 24) {
                temp.push(focusRoomList[1][i])
                i++
            }
        }

        setModalFloor(temp)
        setShowRoomSelect(true)
    }

    const Building = () => {
        const left = showbuilding[0]
        const right = showbuilding[1]
        if (!isLoading)
            return (
                <div className="Loading">
                    <Loading />
                </div>
            )
        else return (
            <div className="building-container">
                <div className="left text-2xl cursor-pointer hover:bg-blue-700" onClick={() => handleModalFloor("l-1-16")}>{left}01 - {left}16</div>
                <div className="sleft text-2xl text-white cursor-pointer hover:bg-blue-700" onClick={() => handleModalFloor("l-17-24")}>{left}17 - {left}24</div>
                <div className="center text-2xl text-white">ส่วนกลาง</div>
                <div className="right text-2xl text-white cursor-pointer hover:bg-blue-700" onClick={() => handleModalFloor("r-1-16")}>{right}01 - {right}16</div>
                <div className="sright text-2xl cursor-pointer hover:bg-blue-700" onClick={() => handleModalFloor("r-17-24")}>{right}17 - {right}24</div>
            </div>
        )
    }

    const FocusFloor = () => {

        const onSelectedRoom = () => {
            message.success('จองห้องแล้ว')
        }

        const onSelecteRoom = () => {
            message.warning('กำลังจองห้อง')
        }

        const onDeletedRoom = () => {
            message.warn('ยกเลิกการจองแล้ว')
        }

        const onDeleteRoom = () => {
            message.warning('กำลังยกเลิกการจอง')
        }

        const oddRoom = modalFloor.filter((_item, key) => key % 2 !== 0)
        const evenRoom = modalFloor.filter((_item, key) => key % 2 === 0)

        const routeToStudent = (id) => {
            Router.push({ pathname: "profiles/student", query: { profileId: id } })
        }

        const styleStd1 = (room) => {
            if (!room.available) {
                return { filter: "invert(0%) sepia(83%) saturate(7431%) hue-rotate(51deg) brightness(109%) contrast(114%)" }
            }
            else if (room.student1) {
                return { filter: "invert(14%) sepia(92%) saturate(6821%) hue-rotate(2deg) brightness(96%) contrast(114%)" }
            }
            return { filter: null }
        }

        const styleStd2 = (room) => {
            if (!room.available) {
                return { filter: "invert(0%) sepia(83%) saturate(7431%) hue-rotate(51deg) brightness(109%) contrast(114%)" }
            }
            else if (room.student2) {
                return { filter: "invert(14%) sepia(92%) saturate(6821%) hue-rotate(2deg) brightness(96%) contrast(114%)" }
            }
            return { filter: null }
        }

        const setStatusRoom = async (room, status) => {
            console.log(room)
            const sendStatus = { floorId: `floor${room.roomId.slice(0, 1)}`, roomId: room.roomId, available: status }
            const setStatus = await post("statusRoom", sendStatus)
            if (setStatus.success) {
                let tempModelFloor = modalFloor
                const keepTempModal = tempModelFloor.map(item => {
                    if (item.roomId === room.roomId)
                        return { ...item, available: status }
                    else return item
                })
                setModalFloor(keepTempModal)
                message.success(`ปิดการจองห้อง ${room.roomId} แล้ว`)
            }
            setUpdate(Math.random())
        }

        return (
            <div className="focus-floor">
                <img src="../icon/close.svg" alt="x" id="close" onClick={handleFocusModal} />
                <div className="modal-content">
                    <div className="even-room">
                        {oddRoom ? oddRoom.map((room, key) => {

                            return <div className="room-container" key={key}>
                                <span className="even-room-item">
                                    {
                                        room.available
                                            ?
                                            <button onClick={() => setStatusRoom(room, false)} className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">ปิดการจองห้องนี้</button>
                                            :
                                            <button onClick={() => setStatusRoom(room, true)} className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">เปิดการจองห้องนี้</button>
                                    }
                                    {room.roomId}
                                    <span className="student1">
                                        <Tooltip title={room.student1 ?
                                            `${room.student1.id ? room.student1.id : "ไม่ได้กรอกข้อมูล"}\n/
                                                ${room.student1.name ? room.student1.name : "ไม่ได้กรอกข้อมูล"}\n/
                                                ${room.student1.surname ? room.student1.surname : "ไม่ได้กรอกข้อมูล"}\n/
                                                ${room.student1.nickname ? room.student1.nickname : "ไม่ได้กรอกข้อมูล"}\n/
                                                ${room.student1.tel ? room.student1.tel : "ไม่ได้กรอกข้อมูล"}`
                                            : null}
                                        >
                                            <img
                                                className="person cursor-pointer"
                                                style={styleStd1(room)}
                                                src="/icon/male.svg" alt="person"
                                                onClick={() => routeToStudent(room.student1.id)}
                                            />
                                        </Tooltip>
                                    </span>
                                    <span className="student2">
                                        <Tooltip
                                            title={room.student2 ?
                                                `${room.student2.id ? room.student2.id : "ไม่ได้กรอกข้อมูล"}\n/
                                                ${room.student2.name ? room.student2.name : "ไม่ได้กรอกข้อมูล"}\n/
                                                ${room.student2.surname ? room.student2.surname : "ไม่ได้กรอกข้อมูล"}\n/
                                                ${room.student2.nickname ? room.student2.nickname : "ไม่ได้กรอกข้อมูล"}\n/
                                                ${room.student2.tel ? room.student2.tel : "ไม่ได้กรอกข้อมูล"}`
                                                : null}
                                        >
                                            <img
                                                className="person cursor-pointer"
                                                style={styleStd2(room)}
                                                src="/icon/male.svg" alt="person"
                                                onClick={() => routeToStudent(room.student2.id)}
                                            />
                                        </Tooltip>
                                    </span>
                                </span>
                            </div>
                        }
                        ) : null}
                    </div>

                    <span className="">
                        <span className="flex">
                            <img
                                src="/icon/male.svg" alt="person" className="person cursor-pointer"
                            />
                                ห้องว่างสามารถจองได้
                        </span>
                        <span className="flex">
                            <img
                                style={{ filter: "invert(14%) sepia(92%) saturate(6821%) hue-rotate(2deg) brightness(96%) contrast(114%)" }}
                                src="/icon/male.svg" alt="person" className="person cursor-pointer"
                            />
                                ห้องไม่ว่างเนื่องจากจองแล้ว
                        </span>
                        <span className="flex">
                            <img
                                style={{ filter: "invert(0%) sepia(83%) saturate(7431%) hue-rotate(51deg) brightness(109%) contrast(114%)" }}
                                src="/icon/male.svg" alt="person" className="person cursor-pointer"
                            />
                                ห้องถูกปิดการจองโดยเจ้าหน้าที่
                        </span>
                    </span>

                    <div className="odd-room">
                        {evenRoom ? evenRoom.map((room, key) => {

                            return <div className="room-container" key={key} >
                                <span className="odd-room-item">
                                    {
                                        room.available
                                            ?
                                            <button onClick={() => setStatusRoom(room, false)} className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">ปิดการจองห้องนี้</button>
                                            :
                                            <button onClick={() => setStatusRoom(room, true)} className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">เปิดการจองห้องนี้</button>
                                    }
                                    {room.roomId}
                                    <span className="student1">
                                        <Tooltip title={room.student1 ?
                                            `${room.student1.id ? room.student1.id : "ไม่ได้กรอกข้อมูล"}\n/
                                            ${room.student1.name ? room.student1.name : "ไม่ได้กรอกข้อมูล"}\n/
                                            ${room.student1.surname ? room.student1.surname : "ไม่ได้กรอกข้อมูล"}\n/
                                            ${room.student1.nickname ? room.student1.nickname : "ไม่ได้กรอกข้อมูล"}\n/
                                            ${room.student1.tel ? room.student1.tel : "ไม่ได้กรอกข้อมูล"}`
                                            : null}
                                        >
                                            <img
                                                style={styleStd1(room)}
                                                src="/icon/male.svg"
                                                alt="person"
                                                className="person cursor-pointer"
                                                onClick={() => routeToStudent(room.student1.id)}
                                            />
                                        </Tooltip>
                                    </span>
                                    <span className="student2">
                                        <Tooltip title={room.student2 ?
                                            `${room.student2.id ? room.student2.id : "ไม่ได้กรอกข้อมูล"}\n/
                                            ${room.student2.name ? room.student2.name : "ไม่ได้กรอกข้อมูล"}\n/
                                            ${room.student2.surname ? room.student2.surname : "ไม่ได้กรอกข้อมูล"}\n/
                                            ${room.student2.nickname ? room.student2.nickname : "ไม่ได้กรอกข้อมูล"}\n/
                                            ${room.student2.tel ? room.student2.tel : "ไม่ได้กรอกข้อมูล"}`
                                            : null}
                                        >
                                            <img
                                                style={styleStd2(room)}
                                                src="/icon/male.svg"
                                                alt="person"
                                                className="person cursor-pointer"
                                                onClick={() => routeToStudent(room.student2.id)}
                                            />
                                        </Tooltip>
                                    </span>
                                </span>
                            </div>
                        }) : null}

                    </div>
                </div>
            </div >
        )
    }

    const checkSystem = async () => {
        const system = await get('system')
        if (system.success) {
            setSystem(system.data.system)
        } else {
            message.error(system.message)
        }
    }

    const changeStatusSystem = async (status) => {
        const changeStatus = await post("system", { system: status })
        if (changeStatus.success) {
            message.success(changeStatus.message)
            setSystem(changeStatus.data.system)
        }
    }

    useEffect(() => {
        verifyLogin()
        getHeader()
        setShowBuilding(["E", "A"])
        handleSelectFloor(["E", "A"])
        checkSystem()
    }, [])

    return (
        <div className="reserve-container">
            <div className="floor-select-container col-start-2 col-span-10">
                <div className="flex flex-col floor-select-container col-start-2 col-span-10 justify-center justify-items-center pl-8 pr-8">
                    {
                        system
                            ?
                            <div className="flex flex-row justify-center text-center text-2xl p-5"><p>สถานะ : </p> <p className="bg-green-200">เปิดจองห้อง</p></div>
                            :
                            <div className="flex flex-row justify-center text-center text-2xl p-5"><p>สถานะ : </p> <p className="bg-red-200">ปิดจองห้อง</p></div>
                    }
                    {
                        system
                            ?
                            <button
                                onClick={() => changeStatusSystem(false)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                ปิดการจองห้อง
                            </button>
                            :
                            <button
                                onClick={() => changeStatusSystem(true)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                เปิดการจองห้อง
                            </button>
                    }
                </div>
                <h1 className="p-3 text-center text-xl">เลือกชั้น</h1>
                <div className="flex flex-row justify-center">
                    {floorList.map((floor, key) =>
                        <div
                            value={floor}
                            key={key}
                            className="shadow-md p-3 bg-gray-200 cursor-pointer"
                            onClick={() => handleSelectFloor(floor[key + 1])}
                        >
                            {Object.keys(floor)}
                        </div>
                    )}
                </div>
            </div>
            <Building />
            {showRoomSelect && <FocusFloor />}
        </div>
    )
}

export default reserve