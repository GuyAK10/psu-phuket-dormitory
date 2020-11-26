import React, { useState, useEffect, useContext } from 'react'
import { GlobalState } from '../utils/context'
import Router from 'next/router'
import Loading from '../component/Loading'
import { message, Skeleton, Tooltip } from 'antd';
import useFetch from 'use-http'
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const reserve = () => {
    const { Modal, Token, MenuBar } = useContext(GlobalState)
    const [menuBar, setMenuBar] = MenuBar
    const [token, setToken] = Token
    const [showModal, setShowModal] = Modal
    const [header, setHeader] = useState({})
    const [system, setSystem] = useState(false)
    const [showRoomSelect, setShowRoomSelect] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)
    const [showbuilding, setShowBuilding] = useState([])
    const [modalFloor, setModalFloor] = useState(null)
    const [focusRoomList, setFocusListRoom] = useState([[{ floorId: "E01" }], [{ floorId: "A01" }]])
    const [update, setUpdate] = useState(0)

    const floorList = [
        { 1: ["E", "A"] },
        { 2: ["F", "B"] },
        { 3: ["G", "C"] },
        { 4: ["H", "D"] }
    ]
    const { get, post, loading, error } = useFetch(`${ENDPOINT}:${PORT}/student/room`, { ...header, cachePolicy: "no-cache" })
    const [myId, setMyId] = useState(null)
    const [myRoom, setMyRoom] = useState(null)

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
        setIsLoading(true)
        try {
            const floor0 = await get(`/floor${floor[0]}`)
            if (!error)
                floorDetails[0] = { ...floor0 }
            else Logout()

            const floor1 = await get(`/floor${floor[1]}`)
            if (!error)
                floorDetails[1] = { ...floor1 }
            else Logout()

            setFocusListRoom(floorDetails)
            setIsLoading(false)
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
        return (
            <div className="building-container">
                <div className="left text-white text-2xl hover:bg-blue-700" onClick={() => handleModalFloor("l-1-16")}>{left}01 - {left}16</div>
                <div className="sleft text-2xl hover:bg-blue-700" onClick={() => handleModalFloor("l-17-24")}>{left}17 - {left}24</div>
                <div className="center text-white text-2xl">ชั้นส่วนกลาง</div>
                <div className="right text-white text-2xl hover:bg-blue-700" onClick={() => handleModalFloor("r-1-16")}>{right}01 - {right}16</div>
                <div className="sright text-2xl hover:bg-blue-700" onClick={() => handleModalFloor("r-17-24")}>{right}17 - {right}24</div>
            </div>
        )
    }

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

    const selectRoom = async (item, student) => {
        try {
            const body = {
                floorId: `floor${item.roomId[0]}`,
                roomId: item.roomId,
                studentId: myId,
                orderId: student
            }

            const data = await post(`/`, body)

            if (!data.success) {
                message.error(data.message)
                if (data.message === "กรุณาบันทึกข้อมูลผู้ใช้ก่อน") {
                    message.warn("ระบบจะพาคุณไปยังหน้าบันทึกข้อมูล")
                    Router.push("profile")
                }
            }

            if (data.success) {
                let changeStatusReserve = modalFloor.map(room => {
                    let temp = room
                    if (temp.roomId === item.roomId) {
                        temp[`${student}`] = { id: myId }
                        return temp
                    } else return temp
                })
                onSelectedRoom()
                setModalFloor(changeStatusReserve)
                setMyRoom({ profileData: { ...item }, roomId: item.roomId })
                setUpdate(Math.random())
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const removeRoom = async (item, student, isOuterSelect) => {
        try {
            console.log(student)
            let body = {}
            if (isOuterSelect !== 'outer')
                body = {
                    floorId: `floor${item.roomId[0]}`,
                    roomId: item.roomId,
                    studentId: myId,
                    orderId: student
                }
            else {
                const StudentOrder = student.student1 ? "student1" : "student2"
                body = {
                    floorId: `floor${item[0]}`,
                    roomId: item,
                    studentId: myId,
                    orderId: StudentOrder
                }
            }

            const data = await post(`/remove`, body)

            if (!data.success) {
                message.error(data.message)
            }

            if (data.success) {
                let changeStatusReserve = modalFloor.map(room => {
                    let temp = room
                    if (temp.roomId === item.roomId) {
                        temp[`${body.student}`] = undefined
                        return temp
                    } else return temp
                })
                console.log(changeStatusReserve)
                setModalFloor(changeStatusReserve)
                onDeletedRoom()
                setMyRoom(null)
                setUpdate(Math.random())
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const FocusFloor = () => {

        const styleStd1 = (room) => {
            if (!room.available) {
                return { filter: "invert(0%) sepia(83%) saturate(7431%) hue-rotate(51deg) brightness(109%) contrast(114%)" }
            }
            else if (room.student1) {
                if (room.student1.id == myId) {
                    return { filter: "invert(87%) sepia(9%) saturate(7473%) hue-rotate(38deg) brightness(111%) contrast(110%)" }
                }
                return { filter: "invert(14%) sepia(92%) saturate(6821%) hue-rotate(2deg) brightness(96%) contrast(114%)" }
            }
            return { filter: null }
        }

        const styleStd2 = (room) => {
            if (!room.available) {
                return { filter: "invert(0%) sepia(83%) saturate(7431%) hue-rotate(51deg) brightness(109%) contrast(114%)" }
            }
            else if (room.student2) {
                if (room.student2.id == myId) {
                    return { filter: "invert(87%) sepia(9%) saturate(7473%) hue-rotate(38deg) brightness(111%) contrast(110%)" }
                }
                return { filter: "invert(14%) sepia(92%) saturate(6821%) hue-rotate(2deg) brightness(96%) contrast(114%)" }
            }
            return { filter: null }
        }

        const color = "#108ee9"

        return (
            <div className="focus-floor">
                <img src="icon/close.svg" alt="x" id="close" onClick={handleFocusModal} />
                <div className="modal-content">
                    <div className="even-room">
                        {modalFloor ? modalFloor.filter((_item, key) => key % 2 !== 0).map((room, key) => {

                            return <div className="room-container" key={key}>
                                <span className="even-room-item" >
                                    <span className="student1">
                                        <Tooltip
                                            title={room.student1 ? `${room.student1.id} ${room.student1.name} ${room.student1.surname}` : ""}
                                            color={color}
                                        >
                                            <img
                                                style={styleStd1(room)}
                                                src="/icon/male.svg" alt="person" className="person cursor-pointer"
                                                onClick={(e) => {
                                                    if (!loading)
                                                        if (room.student1)
                                                            removeRoom(room, "student1", e.currentTarget)
                                                        else
                                                            selectRoom(room, "student1", e.currentTarget)
                                                }}
                                            />
                                        </Tooltip>
                                    </span>
                                    <span className="student2">
                                        <Tooltip
                                            title={room.student2 ? `${room.student2.id} ${room.student2.name} ${room.student2.surname}` : ""}
                                            color={color}
                                        >
                                            <img
                                                style={styleStd2(room)}
                                                src="/icon/male.svg" alt="person" className="person cursor-pointer"
                                                onClick={(e) => {
                                                    if (!loading) {
                                                        if (room.student2)
                                                            removeRoom(room, "student2", e.currentTarget)
                                                        else
                                                            selectRoom(room, "student2", e.currentTarget)
                                                    }
                                                }}
                                            />
                                        </Tooltip>
                                    </span>
                                </span>
                                {room.roomId}
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
                                style={{ filter: "invert(87%) sepia(9%) saturate(7473%) hue-rotate(38deg) brightness(111%) contrast(110%)" }}
                                src="/icon/male.svg" alt="person" className="person cursor-pointer"
                            />
                                ห้องที่ท่านจอง
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
                        {modalFloor ? modalFloor.filter((_item, key) => key % 2 === 0).map((room, key) => {

                            return <div className="room-container" key={key} >
                                <span className="odd-room-item">
                                    <span className="student1">
                                        <Tooltip
                                            title={room.student1 ? `${room.student1.id} ${room.student1.name} ${room.student1.surname}` : ""}
                                            color={color}
                                        >
                                            <img
                                                style={styleStd1(room)}
                                                src="/icon/male.svg"
                                                alt="person"
                                                className="person cursor-pointer"
                                                onClick={(e) => {
                                                    if (!loading)
                                                        if (room.student1)
                                                            removeRoom(room, "student1", e.currentTarget)
                                                        else
                                                            selectRoom(room, "student1", e.currentTarget)
                                                }}
                                            />
                                        </Tooltip>
                                    </span>
                                    <span className="student2">
                                        <Tooltip
                                            title={room.student2 ? `${room.student2.id} ${room.student2.name} ${room.student2.surname}` : ""}
                                            color={color}
                                        >
                                            <img
                                                style={styleStd2(room)}
                                                src="/icon/male.svg"
                                                alt="person"
                                                className="person cursor-pointer"
                                                onClick={(e) => {
                                                    if (!loading) {
                                                        if (room.student2)
                                                            removeRoom(room, "student2", e.currentTarget)
                                                        else
                                                            selectRoom(room, "student2", e.currentTarget)
                                                    }
                                                }}
                                            />
                                        </Tooltip>
                                    </span>
                                </span>
                                {room.roomId}
                            </div>
                        }) : null}
                    </div>
                </div>
            </div>
        )
    }

    const getMyId = () => {
        const { id } = JSON.parse(sessionStorage.getItem('token'))
        if (!id) Logout()
        setMyId(id)
    }

    const getMyRoom = async () => {
        if (sessionStorage.getItem('token')) {
            const myRoomGet = await get(`myRoom/${JSON.parse(sessionStorage.getItem('token')).id}`)
            if (myRoomGet.success) {
                setMyRoom(myRoomGet.data)
                setUpdate(Math.random())
            }
        }
    }

    const checkSystem = async () => {
        const system = await get('system')
        if (system.success) {
            setSystem(system.data.system)
        } else {
            console.log(system.message)
        }
    }

    useEffect(() => {
        getHeader()
        verifyLogin()
        checkSystem()
        setShowBuilding(["E", "A"])
        handleSelectFloor(["E", "A"])
        getMyId()
        getMyRoom()
        if (!loading) setIsLoading(false)
    }, [])

    if (loading) message.loading('Loading')
    if (!system) return <div className="min-h-screen text-3xl text-center"><p className="bg-red-500">ระบบยังไม่เปิดให้จองในขณะนี้</p></div>
    return (
        <div className="reserve-container">
            <div className="floor-select-container col-start-2 col-span-10">
                {
                    myRoom
                        ?
                        <div className="flex flex-col justify-center">
                            <div className="text-center text-2xl p-5">ท่านได้จองห้อง {myRoom.roomId}</div>
                            <button
                                onClick={() => removeRoom(myRoom.roomId, myRoom.profileData, "outer")}
                                className="col-start-4 col-end-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                ยกเลิกการจองห้อง
                            </button>
                        </div>
                        : <div className="text-center text-2xl p-5">ท่านยังไม่ได้จองห้อง สามารถจองได้โดยเลือกห้องจากด้านล่าง</div>
                }
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
            {Building()}
            {showRoomSelect && <FocusFloor />}
        </div>
    )
}

export default reserve
