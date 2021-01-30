import React, { useState, useEffect, useContext } from 'react'
import { GlobalState } from '../../../utils/context'
import Router from 'next/router'
import Loading from '../../../component/Loading'
import { message, Tooltip, Switch, Modal as studentModal } from 'antd';

const years = () => {
    const fullYear = new Date().getFullYear()
    const years = []
    for (let i = fullYear + 3; i >= fullYear - 130; i--) {
        years.push(i)
    }
    return years.map(item => item + 543)
}

const reserve = () => {
    const { get, post, loading } = useContext(GlobalState)
    const [showRoomSelect, setShowRoomSelect] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [showbuilding, setShowBuilding] = useState([])
    const [modalFloor, setModalFloor] = useState([])
    const [focusRoomList, setFocusListRoom] = useState([[{ floorId: "E01" }], [{ floorId: "A01" }]])
    const [system, setSystem] = useState(false)
    const [update, setUpdate] = useState(0)
    const [select, setSelect] = useState({
        system: false,
        semester: 2,
        year: years()[0]
    })
    const floorList = [
        { 1: ["E", "A"] },
        { 2: ["F", "B"] },
        { 3: ["G", "C"] },
        { 4: ["H", "D"] }
    ]

    const handleSelectFloor = async floor => {
        setShowBuilding(floor)
        let floorDetails = []
        setIsLoading(false)
        try {
            const floor0 = await get(`staff/room/floor${floor[0]}`)
            floorDetails[0] = floor0

            const floor1 = await get(`staff/room/floor${floor[1]}`)
            floorDetails[1] = floor1

            console.log(floorDetails)
            setFocusListRoom(floorDetails)
            setIsLoading(true)
        }
        catch (e) {
            console.error(e)
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
                <div className="left text-2xl text-white cursor-pointer hover:bg-blue-700" onClick={() => handleModalFloor("l-1-16")}>{left}01 - {left}16</div>
                <div className="sleft text-2xl cursor-pointer hover:bg-blue-700" onClick={() => handleModalFloor("l-17-24")}>{left}17 - {left}24</div>
                <div className="center text-2xl text-white">ส่วนกลาง</div>
                <div className="right text-2xl text-white cursor-pointer hover:bg-blue-700" onClick={() => handleModalFloor("r-1-16")}>{right}01 - {right}16</div>
                <div className="sright text-2xl cursor-pointer hover:bg-blue-700" onClick={() => handleModalFloor("r-17-24")}>{right}17 - {right}24</div>
            </div>
        )
    }

    const routeToStudent = (id) => {
        Router.push({ pathname: "profiles/student", query: { profileId: id } })
    }

    const studentInfo = (item, student) => {
        const removeRoom = async () => {
            const body = {
                floorId: `floor${item.room[0]}`,
                roomId: item.room,
                studentId: item[student].id,
                orderId: student
            }
            const remove = await post("staff/room/remove", body)
            if (remove.success) {
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
                message.success(remove.message)
            }
            else message.error(remove.message)
        }
        if (student == "student1") {

            studentModal.info({
                title: 'การจัดการนักศึกษา',
                content: (
                    <div className="flex flex-row">
                        <button className="m-2 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 px-1 border border-red-500 hover:border-transparent rounded"
                            onClick={() => {
                                studentModal.destroyAll()
                                removeRoom()
                            }}
                        >
                            ยกเลิกการจองห้องของนักศึกษา
                        </button>
                        <button className="m-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded"
                            onClick={() => {
                                studentModal.destroyAll()
                                routeToStudent(item.student1.id)
                            }}
                        >
                            ดูข้อมูลนักศึกษาเพิ่มเติม
                        </button>
                    </div>
                ),
                onOk() { },
                okText: `ปิด`,
            });
        }
        else if (student == "student2") {
            studentModal.info({
                title: 'การจัดการนักศึกษา',
                content: (
                    <div className="flex flex-row">
                        <button className="m-2 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 px-1 border border-red-500 hover:border-transparent rounded"
                            onClick={() => {
                                studentModal.destroyAll()
                                removeRoom()
                            }}
                        >
                            ยกเลิกการจองห้องของนักศึกษา
                            </button>
                        <button className="m-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded"
                            onClick={() => {
                                studentModal.destroyAll()
                                routeToStudent(item.student2.id)
                            }}
                        >
                            ดูข้อมูลนักศึกษาเพิ่มเติม
                        </button>
                    </div>
                ),
                onOk() { },
                okText: `ปิด`,
            });
        }
    }

    const FocusFloor = () => {

        const oddRoom = modalFloor.filter((_item, key) => key % 2 !== 0)
        const evenRoom = modalFloor.filter((_item, key) => key % 2 === 0)

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
            const sendStatus = { floorId: `floor${room.room.slice(0, 1)}`, roomId: room.room, available: status }
            const setStatus = await post("staff/room/statusRoom", sendStatus)
            if (setStatus.success) {
                let tempModelFloor = modalFloor
                const keepTempModal = tempModelFloor.map(item => {
                    if (item.room === room.room)
                        return { ...item, available: status }
                    else return item
                })
                setModalFloor(keepTempModal)
                message.success(`ปิดการจองห้อง ${room.room} แล้ว`)
                setUpdate(Math.random())
            }
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
                                    {room.room}
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
                                                onClick={() => {
                                                    if (room.student1)
                                                        studentInfo(room, "student1")
                                                }}
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
                                                onClick={() => {
                                                    if (room.student2)
                                                        studentInfo(room, "student2")
                                                }}
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
                                    {room.room}
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
                                                onClick={() => {
                                                    if (room.student1)
                                                        studentInfo(room, "student1")
                                                }}
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
                                                onClick={() => {
                                                    if (room.student2)
                                                        studentInfo(room, "student2")
                                                }}
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
        const system = await get('staff/room/system')
        if (system.success) {
            console.log(system)
            setSystem(system.data.system)
            setSelect(system.data)
        } else {
            message.error(system.message)
        }
    }

    const handleChange = (e) => {
        setSelect(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const changeStatusSystem = async (status) => {
        const changeStatus = await post("staff/room/system", { system: status, semester: select.semester, year: select.year })
        if (changeStatus.success) {
            message.success(changeStatus.message)
            setSystem(changeStatus.data.system)
        }
        else if (!changeStatus.success) {
            message.error(changeStatus.message)
        }
    }

    useEffect(() => {
        setShowBuilding(["E", "A"])
        handleSelectFloor(["E", "A"])
        checkSystem()
    }, [])

    return (
        <div className="reserve-container">
            <div className="floor-select-container col-start-2 col-span-10">
                <div className="flex flex-col floor-select-container col-start-2 col-span-10 justify-center justify-items-center pl-8 pr-8">

                    <div className="flex flex-col relative">
                        <label htmlFor="semester">เทอม</label>
                        <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" name="semester" id="semester" onChange={handleChange} value={select.semester}>
                            <option value="1" name="semester">1</option>
                            <option value="2" name="semester">2</option>
                            <option value="3" name="semester">3</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>

                    <div className="flex flex-col relative">
                        <label htmlFor="years">ปี</label>
                        <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" name="year" id="year" onChange={handleChange} value={select.year}>
                            {
                                years().map((item, key) => <option key={key} value={item} name={item}>{item}</option>)
                            }
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>

                    <Switch className="m-4" loading={loading} checkedChildren="เปิดการจองห้อง" unCheckedChildren="ปิดการจองห้อง" checked={system} onChange={e => changeStatusSystem(e)} />

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