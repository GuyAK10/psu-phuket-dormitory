import React, { useState, useEffect, useContext } from 'react'
import { GlobalState } from '../utils/context'
import Router from 'next/router'
import Loading from '../component/Loading'
import { message } from 'antd';
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
    const [isLoading, setIsLoading] = React.useState(true)
    const [showbuilding, setShowBuilding] = useState([])
    const [modalFloor, setModalFloor] = useState([])
    const [focusRoomList, setFocusListRoom] = useState([[{ floorId: "E01" }], [{ floorId: "A01" }]])
    const [update, setUpdate] = useState(0)
    const floorList = [
        { 1: ["E", "A"] },
        { 2: ["F", "B"] },
        { 3: ["G", "C"] },
        { 4: ["H", "D"] }
    ]
    const { get, post, loading, error } = useFetch(`${ENDPOINT}:${PORT}/student/room`, {
        headers: {
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")).token}`,
            type: JSON.parse(sessionStorage.getItem("token")).type
        },
        cachePolicy: "no-cache",
    })

    const Logout = () => {
        console.log("Logout")
        setToken(null)
        sessionStorage.removeItem('token')
        setShowModal(false)
        setMenuBar('ลงชื่อเข้าใช้')
        Router.push('login')
    }

    const getHeader = () => {
        if (sessionStorage.getItem('token')) {
            setToken(JSON.parse(sessionStorage.getItem('token')))
            setAxiosConfig({
                headers: {
                    authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")).token}`,
                    type: JSON.parse(sessionStorage.getItem('token')).type
                }
            })
        }
        else Logout()
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
                <div className="left" onClick={() => handleModalFloor("l-1-16")}>{left}01 - {left}16</div>
                <div className="sleft" onClick={() => handleModalFloor("l-17-24")}>{left}17 - {left}24</div>
                <div className="center">ชั้นส่วนกลาง</div>
                <div className="right" onClick={() => handleModalFloor("r-1-16")}>{right}01 - {right}16</div>
                <div className="sright" onClick={() => handleModalFloor("r-17-24")}>{right}17 - {right}24</div>
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

        const selectRoom = async (item, student, event) => {
            try {
                const { id } = token
                const body = {
                    floorId: `floor${item.floorId.split(0, 1)[0][0]}`,
                    roomId: item.floorId,
                    studentId: id,
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
                    let changeStatusReserve = modalFloor
                    changeStatusReserve.map(room => {
                        let temp = room
                        if (temp.floorId === item.floorId) {
                            temp[`${student}`] = id
                            return temp
                        } else return temp
                    })
                    TweenMax.set(event, { filter: "invert(86%) sepia(98%) saturate(734%) hue-rotate(356deg) brightness(102%) contrast(105%)" })
                    onSelectedRoom()
                    setUpdate(Math.random())
                }
            }
            catch (e) {
                console.log(e)
            }
        }

        const removeRoom = async (item, student, event) => {
            try {
                const { id } = token
                const body = {
                    floorId: `floor${item.floorId.split(0, 1)[0][0]}`,
                    roomId: item.floorId,
                    studentId: id,
                    orderId: student
                }

                const data = await post(`/remove`, body)

                if (!data.success) {
                    message.error(data.message)
                }

                if (data.success) {
                    let changeStatusReserve = modalFloor
                    changeStatusReserve.map(room => {
                        let temp = room
                        if (temp.floorId === item.floorId) {
                            temp[`${student}`] = undefined
                            return temp
                        } else return temp
                    })
                    onDeletedRoom()
                    TweenMax.set(event, { filter: null })
                    setUpdate(Math.random())
                }
            }
            catch (e) {
                console.log(e)
            }
        }

        const styleStd1 = (room) => {
            const { id } = JSON.parse(sessionStorage.getItem('token'))
            if (room.student1) {
                if (room.student1.id == id) {
                    return { filter: "invert(10%) sepia(59%) saturate(5804%) hue-rotate(83deg) brightness(107%) contrast(123%)" }
                }
                return { filter: "invert(14%) sepia(92%) saturate(6821%) hue-rotate(2deg) brightness(96%) contrast(114%)" }
            }
            return { filter: null }
        }

        const styleStd2 = (room) => {
            const { id } = JSON.parse(sessionStorage.getItem('token'))
            if (room.student2) {
                if (room.student2.id == id) {
                    return { filter: "invert(10%) sepia(59%) saturate(5804%) hue-rotate(83deg) brightness(107%) contrast(123%)" }
                }
                return { filter: "invert(14%) sepia(92%) saturate(6821%) hue-rotate(2deg) brightness(96%) contrast(114%)" }
            }
            return { filter: null }
        }

        return (
            <div className="focus-floor">
                <img src="icon/close.svg" alt="x" id="close" onClick={handleFocusModal} />
                <div className="modal-content">
                    <div className="even-room">
                        {oddRoom ? oddRoom.map((room, key) => {

                            return <div className="room-container" key={key}>
                                <span className="even-room-item" >
                                    <span className="student1">
                                        <img
                                            style={styleStd1(room)}
                                            src="/icon/male.svg" alt="person" className="person cursor-pointer"
                                            onClick={(e) => {
                                                if (room.student1)
                                                    removeRoom(room, "student1", e.currentTarget)
                                                else
                                                    selectRoom(room, "student1", e.currentTarget)
                                            }}
                                        />
                                    </span>
                                    <span className="student2">
                                        <img
                                            style={styleStd2(room)}
                                            src="/icon/male.svg" alt="person" className="person cursor-pointer"
                                            onClick={(e) => {
                                                if (room.student2)
                                                    removeRoom(room, "student2", e.currentTarget)
                                                else
                                                    selectRoom(room, "student2", e.currentTarget)
                                            }}
                                        />
                                    </span>
                                </span>
                                {room.floorId}
                            </div>
                        }
                        ) : null}
                    </div>

                    <span className="space">ทางเดิน</span>

                    <div className="odd-room">
                        {evenRoom ? evenRoom.map((room, key) => {

                            return <div className="room-container" key={key} >
                                <span className="odd-room-item">
                                    <span className="student1">
                                        <img
                                            style={styleStd1(room)}
                                            src="/icon/male.svg"
                                            alt="person"
                                            className="person cursor-pointer"
                                            onClick={(e) => {
                                                if (room.student1)
                                                    removeRoom(room, "student1", e.currentTarget)
                                                else
                                                    selectRoom(room, "student1", e.currentTarget)
                                            }}
                                        />
                                    </span>
                                    <span className="student2">
                                        <img
                                            style={styleStd2(room)}
                                            src="/icon/male.svg"
                                            alt="person"
                                            className="person cursor-pointer"
                                            onClick={(e) => {
                                                if (room.student2)
                                                    removeRoom(room, "student2", e.currentTarget)
                                                else
                                                    selectRoom(room, "student2", e.currentTarget)
                                            }}
                                        />
                                    </span>
                                </span>
                                {room.floorId}
                            </div>
                        }) : null}

                    </div>
                </div>
            </div >
        )
    }

    const MyRoom = () => {
        const id = JSON.parse(sessionStorage.getItem('token')).id
        const result = focusRoomList[0].filter(item => item.floorId.student1.id == id)
        console.log(result)
    }

    useEffect(() => {
        getHeader()
        verifyLogin()
        setShowBuilding(["E", "A"])
        handleSelectFloor(["E", "A"])
        if (!loading) setIsLoading(false)
        if (error) console.log(error)
    }, [])

    if (loading) return <Loading />
    if (loading) setUpdate(Math.random())
    return (
        <div className="reserve-container">
            <div>ท่านได้จองห้อง</div>

            <h1 className="col-span-full text-center self-end text-xl">เลือกชั้น</h1>
            <div className="floor-select-container col-span-full">
                <div className="flex flex-row justify-center">{floorList.map((floor, key) =>
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
