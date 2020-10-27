import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../utils/context'
import Router from 'next/router'
import Loading from '../../../component/Loading'
import { message } from 'antd';

const Endpoint = process.env.END_POINT || 'http://localhost'

const reserve = () => {
    const { Modal, Token, AxiosConfig, MenuBar } = useContext(GlobalState)
    const [menuBar, setMenuBar] = MenuBar
    const [axiosConfig] = AxiosConfig
    const [token, setToken] = Token
    const [showModal, setShowModal] = Modal
    const [showRoomSelect, setShowRoomSelect] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    // const [oddRoom, setOddRoom] = useState([])
    // const [evenRoom, setEvenRoom] = useState([])
    const [_, forceUpdate] = useState(0)

    const floorList = [
        { 1: ["E", "A"] },
        { 2: ["F", "B"] },
        { 3: ["G", "C"] },
        { 4: ["H", "D"] }
    ]

    const [focusRoomList, setFocusListRoom] = useState([[{ profileId: "E01" }], [{ profileId: "A01" }]])
    const [showbuilding, setShowBuilding] = useState([])
    const [modalFloor, setModalFloor] = useState([])

    const Logout = () => {
        console.log("Logout")
        setToken(null)
        sessionStorage.removeItem('token')
        setShowModal(false)
        setMenuBar('ลงชื่อเข้าใช้')
        Router.push('login')
    }

    const getHeader = () => {
        if (sessionStorage.getItem('token')) setToken(JSON.parse(sessionStorage.getItem('token')))
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

        const onSelectedRoom = () => {
            message.success('จองห้องแล้ว')
        }

        const onDeletedRoom = () => {
            message.warn('ยกเลิกการจองแล้ว')
        }

        const oddRoom = modalFloor.filter((_item, key) => key % 2 !== 0)
        const evenRoom = modalFloor.filter((_item, key) => key % 2 === 0)
        const selectRoom = async (item, student) => {
            try {
                const { id } = await JSON.parse(sessionStorage.getItem('token'))
                const body = {
                    floorId: `floor${item.profileId.split(0, 1)[0][0]}`,
                    roomId: item.profileId,
                    studentId: id,
                    orderId: student
                }
                const reserve = await axios.post(`${Endpoint}/student/room`, body)

                if (reserve.data.success) {
                    let changeStatusReserve = modalFloor
                    changeStatusReserve.map(room => {
                        let temp = room
                        if (temp.profileId === item.profileId) {
                            temp[`${student}`] = id
                            return temp
                        } else return temp
                    })
                    onSelectedRoom()
                    forceUpdate(Math.random())
                }
            }
            catch (e) {
                console.log(e)
            }
        }

        const removeRoom = async (item, student) => {
            try {
                const { id } = await JSON.parse(sessionStorage.getItem('token'))
                const body = {
                    floorId: `floor${item.profileId.split(0, 1)[0][0]}`,
                    roomId: item.profileId,
                    studentId: id,
                    orderId: student
                }

                const reserve = await axios.post(`${Endpoint}/student/room/remove`, body)
                console.log(reserve.data)
                if (reserve.data.success) {
                    let changeStatusReserve = modalFloor
                    changeStatusReserve.map(room => {
                        let temp = room
                        if (temp.profileId === item.profileId) {
                            temp[`${student}`] = undefined
                            return temp
                        } else return temp
                    })
                    onDeletedRoom()
                    forceUpdate(Math.random())
                }
            }
            catch (e) {
                console.log(e)
            }
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
                                            style={room.student1 ? { filter: "grayscale(100%)" } : null}
                                            src="/icon/male.svg" alt="person" className="person"
                                            onClick={() => {
                                                if (room.student1) removeRoom(room, "student1")
                                                else selectRoom(room, "student1")
                                            }}
                                        />
                                    </span>
                                    <span className="student2">
                                        <img
                                            style={room.student2 ? { filter: "grayscale(100%)" } : null}
                                            src="/icon/male.svg" alt="person" className="person"
                                            onClick={() => {
                                                if (room.student2) removeRoom(room, "student2")
                                                else selectRoom(room, "student2")
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
                                        <img style={room.student1 ? { filter: "grayscale(100%)" } : null}
                                            src="/icon/male.svg"
                                            alt="person"
                                            className="person"
                                            onClick={() => {
                                                if (room.student1) removeRoom(room, "student1")
                                                else selectRoom(room, "student1")
                                            }}
                                        />
                                    </span>
                                    <span className="student2">
                                        <img style={room.student2 ? { filter: "grayscale(100%)" } : null}
                                            src="/icon/male.svg"
                                            alt="person"
                                            className="person"
                                            onClick={() => {
                                                if (room.student2) removeRoom(room, "student2")
                                                else selectRoom(room, "student2")
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