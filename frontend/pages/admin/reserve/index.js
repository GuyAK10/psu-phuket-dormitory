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
    const [headers, setHeaders] = useState({})
    const [focusRoomList, setFocusListRoom] = useState([[{ roomId: "E01" }], [{ roomId: "A01" }]])
    const floorList = [
        { 1: ["E", "A"] },
        { 2: ["F", "B"] },
        { 3: ["G", "C"] },
        { 4: ["H", "D"] }
    ]
    const [_, forceUpdate] = useState(0)

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
        setIsLoading(false)
        console.log(ENDPOINT, PORT)
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
            // Logout()
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
                <div className="left" onClick={() => handleModalFloor("l-1-16")}>{left}01 - {left}16</div>
                <div className="sleft" onClick={() => handleModalFloor("l-17-24")}>{left}17 - {left}24</div>
                <div className="center">ส่วนกลาง</div>
                <div className="right" onClick={() => handleModalFloor("r-1-16")}>{right}01 - {right}16</div>
                <div className="sright" onClick={() => handleModalFloor("r-17-24")}>{right}17 - {right}24</div>
            </div>
        )
    }

    const FocusFloor = () => {
        const { post } = useFetch(`${ENDPOINT}/student/room`, headers)

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

        return (
            <div className="focus-floor">
                <img src="../icon/close.svg" alt="x" id="close" onClick={handleFocusModal} />
                <div className="modal-content">
                    <div className="even-room">
                        {oddRoom ? oddRoom.map((room, key) => {

                            return <div className="room-container" key={key}>
                                <span className="even-room-item" >
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
                                                style={room.student1 ? { filter: "invert(68%) sepia(59%) saturate(5804%) hue-rotate(83deg) brightness(107%) contrast(123%)" } : null}
                                                src="/icon/male.svg" alt="person" className="person"
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
                                                style={room.student2 ? { filter: "invert(68%) sepia(59%) saturate(5804%) hue-rotate(83deg) brightness(107%) contrast(123%)" } : null}
                                                src="/icon/male.svg" alt="person" className="person"
                                                onClick={() => routeToStudent(room.student2.id)}
                                            />
                                        </Tooltip>
                                    </span>
                                </span>
                                {room.roomId}
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
                                        <Tooltip title={room.student1 ?
                                            `${room.student1.id ? room.student1.id : "ไม่ได้กรอกข้อมูล"}\n/
                                            ${room.student1.name ? room.student1.name : "ไม่ได้กรอกข้อมูล"}\n/
                                            ${room.student1.surname ? room.student1.surname : "ไม่ได้กรอกข้อมูล"}\n/
                                            ${room.student1.nickname ? room.student1.nickname : "ไม่ได้กรอกข้อมูล"}\n/
                                            ${room.student1.tel ? room.student1.tel : "ไม่ได้กรอกข้อมูล"}`
                                            : null}
                                        >
                                            <img
                                                style={room.student1 ? { filter: "invert(68%) sepia(59%) saturate(5804%) hue-rotate(83deg) brightness(107%) contrast(123%)" } : null}
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
                                            ${room.student2.nickname ? room.studen2.nickname : "ไม่ได้กรอกข้อมูล"}\n/
                                            ${room.student2.tel ? room.student2.tel : "ไม่ได้กรอกข้อมูล"}`
                                            : null}
                                        >
                                            <img
                                                style={room.student2 ? { filter: "invert(68%) sepia(59%) saturate(5804%) hue-rotate(83deg) brightness(107%) contrast(123%)" } : null}
                                                src="/icon/male.svg"
                                                alt="person"
                                                className="person cursor-pointer"
                                                onClick={() => routeToStudent(room.student2.id)}
                                            />
                                        </Tooltip>
                                    </span>
                                </span>
                                {room.roomId}
                            </div>
                        }) : null}

                    </div>
                </div>
            </div >
        )
    }

    const getHeaders = () => {
        setHeaders({
            headers: {
                authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")).token}`,
                type: JSON.parse(sessionStorage.getItem("token")).type
            },
        })
    }

    useEffect(() => {
        verifyLogin()
        getHeader()
        setShowBuilding(["E", "A"])
        handleSelectFloor(["E", "A"])
    }, [])

    return (
        <div className="reserve-container">
            <div className="floor-select-container">
                {floorList.map((floor, key) =>
                    <div
                        value={floor}
                        key={key}
                        className="floor-select-block"
                        onClick={() => handleSelectFloor(floor[key + 1])}
                    >
                        {Object.keys(floor)}
                    </div>
                )}
            </div>
            <Building />
            {showRoomSelect && <FocusFloor />}
        </div>
    )
}

export default reserve