import React, { useState, useEffect, useContext, forwardRef, useRef } from 'react'
import { GlobalState } from '../utils/context'
import Router from 'next/router'
import { message, Tooltip } from 'antd';

message.config({ maxCount: 1 })

const FocusFloor = forwardRef(({ modalFloor, handleFocusModal, setModalFloor, setMyRoom }, ref) => {
    const { loading, post, cookies } = useContext(GlobalState)

    const onSelectedRoom = () => {
        message.success('จองห้องแล้ว')
    }

    const onDeletedRoom = () => {
        message.warn('ยกเลิกการจองแล้ว')
    }

    const selectRoom = async (item, student) => {
        try {

            const { name, surname, id } = cookies.user

            const body = {
                floorId: `floor${item.room[0]}`,
                roomId: item.room,
                studentId: id,
                orderId: student
            }

            const data = await post(`student/room`, body)

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
                    if (temp.room === item.room) {
                        temp[`${student}`] = { id, name, surname }
                        return temp
                    } else return temp
                })
                onSelectedRoom()
                setModalFloor(changeStatusReserve)
                setMyRoom(item)
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const removeRoom = async (item, student, isOuterSelect) => {
        try {
            const { id } = cookies.user
            const StudentOrder = () => {
                if (student.student1) {
                    if (+student.student1.id == id) {
                        return "student1"
                    }
                }
                else if (student.student2) {
                    if (+student.student2.id == id) {
                        return "student2"
                    }
                }
            }

            let body = {}
            if (isOuterSelect !== 'outer')
                body = {
                    floorId: `floor${item.room[0]}`,
                    roomId: item.room,
                    studentId: id,
                    orderId: student
                }
            else {
                body = {
                    floorId: `floor${item[0]}`,
                    roomId: item.room,
                    studentId: id,
                    orderId: StudentOrder()
                }
            }

            const data = await post(`student/room/remove`, body)

            if (!data.success) {
                message.error(data.message)
            }

            if (data.success) {
                if (modalFloor) {
                    let changeStatusReserve = modalFloor.map(room => {
                        let temp = room
                        if (temp.room == item.room) {
                            temp[`${student}`] = undefined
                            return temp
                        } else return temp
                    })
                    setModalFloor(changeStatusReserve)
                }
                else handleSelectFloor(showbuilding)
                setMyRoom(null)
                onDeletedRoom()
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const styleStd1 = (room) => {
        if (!room.available) {
            return { filter: "invert(0%) sepia(83%) saturate(7431%) hue-rotate(51deg) brightness(109%) contrast(114%)" }
        }
        else if (room.student1 && cookies.user) {
            if (room.student1.id == cookies.user.id) {
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
        else if (room.student2 && cookies.user) {
            if (room.student2.id == cookies.user.id) {
                return { filter: "invert(87%) sepia(9%) saturate(7473%) hue-rotate(38deg) brightness(111%) contrast(110%)" }
            }
            return { filter: "invert(14%) sepia(92%) saturate(6821%) hue-rotate(2deg) brightness(96%) contrast(114%)" }
        }
        return { filter: null }
    }

    const color = "#108ee9"

    return (
        <div ref={ref} className="focus-floor hidden">
            {/* <img src="icon/close.svg" alt="x" id="close" onClick={handleFocusModal} /> */}
            <div className="modal-content">
                <div className="even-room">
                    {modalFloor ? modalFloor.filter((_item, key) => key % 2 !== 0).map((room, key) => {

                        return <div className="room-container bg-blue-700 rounded" key={key}>
                            <p className="text-center">{room.room}</p>
                            <span className="even-room-item" >
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
                        </div>
                    }
                    ) : null}
                </div>

                <span className="">

                    <span className="flex">
                        คลิกเพื่อจอง
                    </span>
                    <span className="flex">
                        <img
                            src="/icon/male.svg" alt="person" className="person cursor-pointer"
                        />
                            ห้องว่าง
                            </span>

                    <span className="flex">
                        <img
                            style={{ filter: "invert(87%) sepia(9%) saturate(7473%) hue-rotate(38deg) brightness(111%) contrast(110%)" }}
                            src="/icon/male.svg" alt="person" className="person cursor-pointer"
                        />
                            ห้องท่าน
                            </span>

                    <span className="flex">
                        <img
                            style={{ filter: "invert(14%) sepia(92%) saturate(6821%) hue-rotate(2deg) brightness(96%) contrast(114%)" }}
                            src="/icon/male.svg" alt="person" className="person cursor-pointer"
                        />
                            ห้องไม่ว่าง
                            </span>
                    <span className="flex">
                        <img
                            style={{ filter: "invert(0%) sepia(83%) saturate(7431%) hue-rotate(51deg) brightness(109%) contrast(114%)" }}
                            src="/icon/male.svg" alt="person" className="person cursor-pointer"
                        />
                            ปิดใช้งาน
                            </span>
                    <button className="close-bt bg-blue-100 rounded text-black text-2xl" onClick={handleFocusModal}>ปิด</button>
                </span>

                <div className="odd-room">
                    {modalFloor ? modalFloor.filter((_item, key) => key % 2 === 0).map((room, key) => {

                        return <div className="room-container bg-blue-700 rounded" key={key} >
                            <p className="text-center">{room.room}</p>
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
                        </div>
                    }) : null}
                </div>
            </div>
        </div>
    )
})

const reserve = () => {
    const { get, post, loading, error, cookies, verifyLogin } = useContext(GlobalState)
    const [system, setSystem] = useState(true)
    const [showbuilding, setShowBuilding] = useState([])
    const [modalFloor, setModalFloor] = useState(null)
    const [focusRoomList, setFocusListRoom] = useState([])
    const focusFloorRef = useRef()

    const floorList = [
        { 1: ["E", "A"] },
        { 2: ["F", "B"] },
        { 3: ["G", "C"] },
        { 4: ["H", "D"] }
    ]

    const [isLoading, setIsLoading] = useState(true)
    const [myRoom, setMyRoom] = useState(null)
    const removeRoom = async (item, student) => {
        console.log(item.room[0])
        console.log(student)
        try {
            const { id } = cookies.user
            const StudentOrder = () => {
                if (student.student1) {
                    if (student.student1.id == id) {
                        return "student1"
                    }
                }
                else if (student.student2) {
                    if (student.student2.id == id) {
                        return "student2"
                    }
                }
            }

            const body = {
                floorId: `floor${item.room[0]}`,
                roomId: item.room,
                studentId: id,
                orderId: StudentOrder()
            }

            const data = await post(`student/room/remove`, body)

            if (!data.success) {
                message.error(data.message)
            }

            if (data.success) {
                if (modalFloor) {
                    let changeStatusReserve = modalFloor.map(room => {
                        let temp = room
                        if (temp.room == item.room) {
                            temp[`${student}`] = undefined
                            return temp
                        } else return temp
                    })
                    setModalFloor(changeStatusReserve)
                }
                else handleSelectFloor(showbuilding)
                setMyRoom(null)
                message.warn('ยกเลิกการจองแล้ว')
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleSelectFloor = async floor => {
        console.log('getInSelectFloor')
        setShowBuilding(floor)
        let floorDetails = []
        try {
            setIsLoading(true)
            const floor0 = await get(`student/room/floor${floor[0]}`)
            if (!error)
                floorDetails[0] = floor0

            const floor1 = await get(`student/room/floor${floor[1]}`)
            if (!error)
                floorDetails[1] = floor1

            setFocusListRoom(floorDetails)
            setIsLoading(false)
        }
        catch (e) {
            console.error(e)
        }
    }

    const handleFocusModal = () => {
        focusFloorRef.current.style.display = "none"
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
        focusFloorRef.current.style.display = "block"
    }

    const Building = () => {
        const left = showbuilding[0]
        const right = showbuilding[1]
        return (
            <div className="building-container">
                <div className="left text-white text-2xl hover:bg-blue-700" onClick={() => {
                    if (!isLoading)
                        handleModalFloor("l-1-16")
                }}>{left}01 - {left}16</div>
                <div className="sleft text-2xl hover:bg-blue-700" onClick={() => {
                    if (!isLoading)
                        handleModalFloor("l-17-24")
                }}>{left}17 - {left}24</div>
                <div className="center text-white text-2xl">ทางเข้าด้านหน้า</div>
                <div className="right text-white text-2xl hover:bg-blue-700" onClick={() => {
                    if (!isLoading)
                        handleModalFloor("r-1-16")
                }}>{right}01 - {right}16</div>
                <div className="sright text-2xl hover:bg-blue-700" onClick={() => {
                    if (!isLoading)
                        handleModalFloor("r-17-24")
                }}>{right}17 - {right}24</div>
            </div>
        )
    }

    const getMyRoom = async () => {
        if (cookies.user) {
            const { id } = cookies.user
            const myRoomGet = await get(`student/room/myRoom/${id}`)
            if (myRoomGet.success) {
                setMyRoom(myRoomGet.data)
            }
        }
    }

    const checkSystem = async () => {
        const system = await get('student/room/system')
        if (system.success) {
            setSystem(system.data.system)
        } else {
            console.log(system.message)
        }
    }

    const checkIsFillProfile = async () => {
        if (cookies.user) {
            const isFill = await get(`student/room/isFill/${cookies.user.id}`)
            if (!isFill.success) {
                message.warning(isFill.message)
                Router.push(`/profile`)
            }
        }
    }

    useEffect(() => {
        verifyLogin()
        checkSystem()
        setShowBuilding(["E", "A"])
        handleSelectFloor(["E", "A"])
        getMyRoom()
        // checkIsFillProfile()
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
                            <div className="text-center text-2xl p-5">ท่านได้จองห้อง {myRoom.room}</div>
                            <button
                                onClick={() => removeRoom(myRoom, myRoom, "outer")}
                                className="col-start-4 col-end-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                ยกเลิกการจองห้อง
                            </button>
                        </div>
                        : <div className="text-center text-md p-5">ท่านยังไม่ได้จองห้อง สามารถจองได้โดยเลือกห้องจากด้านล่าง</div>
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
            <Building />
            <FocusFloor
                ref={focusFloorRef}
                modalFloor={modalFloor}
                handleFocusModal={handleFocusModal}
                setModalFloor={setModalFloor}
                setMyRoom={setMyRoom}
            />
        </div>
    )
}

export default reserve
