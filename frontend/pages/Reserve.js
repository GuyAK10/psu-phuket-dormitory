import React, { useState, useEffect, useContext, createRef } from 'react'
import axios from 'axios'
import { GlobalState } from '../utils/context'
import Router from 'next/router'
import Loading from '../component/Loading'
import { message } from 'antd';
import useFetch from 'use-http'
import { TweenMax } from 'gsap'

const Endpoint = process.env.END_POINT || 'http://localhost'

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
    const [person, setPerson] = useState([{}, {}, {}, {}])
    const [focusRoomList, setFocusListRoom] = useState([[{ profileId: "E01" }], [{ profileId: "A01" }]])
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
        try {
            await axios.get(`${Endpoint}/student/room/floor${floor[0]}`, axiosConfig)
                .then(res => {
                    floorDetails[0] = { ...res.data.result }
                })
                .catch(e => {
                    console.log(e)
                    Logout()
                })

            await axios.get(`${Endpoint}/student/room/floor${floor[1]}`, axiosConfig)
                .then(res => {
                    floorDetails[1] = { ...res.data.result }
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
                <div className="center">center</div>
                <div className="right" onClick={() => handleModalFloor("r-1-16")}>{right}01 - {right}16</div>
                <div className="sright" onClick={() => handleModalFloor("r-17-24")}>{right}17 - {right}24</div>
            </div>
        )
    }

    const FocusFloor = () => {
        const { post } = useFetch(`${Endpoint}/student/room`)

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
                    floorId: `floor${item.profileId.split(0, 1)[0][0]}`,
                    roomId: item.profileId,
                    studentId: id,
                    orderId: student
                }

                const data = await post(`/`, body)

                if (!data.success) message.error(data.message)

                if (data.success) {
                    let changeStatusReserve = modalFloor
                    changeStatusReserve.map(room => {
                        let temp = room
                        if (temp.profileId === item.profileId) {
                            temp[`${student}`] = id
                            return temp
                        } else return temp
                    })
                    TweenMax.set(event, { filter: "invert(86%) sepia(98%) saturate(734%) hue-rotate(356deg) brightness(102%) contrast(105%)" })
                    onSelectedRoom()
                    // forceUpdate(Math.random())
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
                    floorId: `floor${item.profileId.split(0, 1)[0][0]}`,
                    roomId: item.profileId,
                    studentId: id,
                    orderId: student
                }

                // const reserve = await axios.post()
                const data = await post(`/remove`, body)

                if (!data.success) {
                    message.error(data.message)
                }

                if (data.success) {
                    let changeStatusReserve = modalFloor
                    changeStatusReserve.map(room => {
                        let temp = room
                        if (temp.profileId === item.profileId) {
                            temp[`${student}`] = undefined
                            return temp
                        } else return temp
                    })
                    onDeletedRoom()
                    TweenMax.set(event, { filter: null })
                    // forceUpdate(Math.random())
                }
            }
            catch (e) {
                console.log(e)
            }
        }

        return (
            <div className="focus-floor">
                <button onClick={() => forceUpdate(Math.random())}>Update</button>
                <img src="icon/close.svg" alt="x" id="close" onClick={handleFocusModal} />
                <div className="modal-content">
                    <div className="even-room">
                        {oddRoom ? oddRoom.map((room, key) => {

                            return <div className="room-container" key={key}>
                                <span className="even-room-item" >
                                    <span className="student1">
                                        <img
                                            style={room.student1 ? { filter: "invert(68%) sepia(59%) saturate(5804%) hue-rotate(83deg) brightness(107%) contrast(123%)" } : null}
                                            src="/icon/male.svg" alt="person" className="person"
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
                                            style={room.student2 ? { filter: "invert(68%) sepia(59%) saturate(5804%) hue-rotate(83deg) brightness(107%) contrast(123%)" } : null}
                                            src="/icon/male.svg" alt="person" className="person"
                                            onClick={(e) => {
                                                if (room.student2)
                                                    removeRoom(room, "student2", e.currentTarget)
                                                else
                                                    selectRoom(room, "student2", e.currentTarget)
                                            }}
                                        />
                                    </span>
                                </span>
                                {room.profileId}
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
                                            style={room.student1 ? { filter: "invert(68%) sepia(59%) saturate(5804%) hue-rotate(83deg) brightness(107%) contrast(123%)" } : null}
                                            src="/icon/male.svg"
                                            alt="person"
                                            className="person"
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
                                            style={room.student2 ? { filter: "invert(68%) sepia(59%) saturate(5804%) hue-rotate(83deg) brightness(107%) contrast(123%)" } : null}
                                            src="/icon/male.svg"
                                            alt="person"
                                            className="person"
                                            onClick={(e) => {
                                                if (room.student2)
                                                    removeRoom(room, "student2", e.currentTarget)
                                                else
                                                    selectRoom(room, "student2", e.currentTarget)
                                            }}
                                        />
                                    </span>
                                </span>
                                {room.profileId}
                            </div>
                        }) : null}

                    </div>
                </div>
            </div >
        )
    }

    useEffect(() => {
        getHeader()
        verifyLogin()
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