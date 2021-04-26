import React, { useEffect, useContext, useState } from 'react'
import { message, Steps, Skeleton } from 'antd'
import { GlobalState } from '../utils/context'
const { Step } = Steps;
const reserveResult = () => {
    const { verifyLogin, post, get, response, cookies } = useContext(GlobalState)
    const [isLoading, setIsLoading] = useState(false)
    const [current, setCurrent] = useState(0)
    const [initialId, setInitialId] = useState('')
    const [floorDetail, setFloorDetail] = useState([])
    const steps = [
        {
            key: 0,
            title: "A"
        },
        {
            key: 1,
            title: "B"
        },
        {
            key: 2,
            title: "C"
        },
        {
            key: 3,
            title: "D"
        },
        {
            key: 4,
            title: "E"
        },
        {
            key: 5,
            title: "F"
        },
        {
            key: 6,
            title: "G"
        },
        {
            key: 7,
            title: "H"
        }
    ]
    const floorList = {
        0: "floorA",
        1: "floorB",
        2: "floorC",
        3: "floorD",
        4: "floorE",
        5: "floorF",
        6: "floorG",
        7: "floorH",
    }

    const getFloor = async () => {
        const floor = await get(`student/room/${floorList[current]}`)
        setFloorDetail(floor)
    }
    useEffect(() => {
        
        verifyLogin()
    }, [])

    useEffect(()=>{
        getFloor()
    },[current])

    return (
        <div className="reserve-result">
            <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            {isLoading ? <Skeleton />
                : <div className="table-floor">
                    <table className="table-floor-detail">
                        <tr>
                            <th>
                                ห้อง
                            </th>
                            <th>
                                ชื่อ
                            </th>
                            <th>
                                นามสกุล
                            </th>
                            <th>
                                ชื่อเล่น
                            </th>
                            <th>
                                รหัสนักศึกษา
                            </th>
                            <th>
                                เบอร์โทรศัพท์
                            </th>
                        </tr>
                        {floorDetail ? floorDetail.map((item, key) =>
                            <>
                                <tr >
                                    <th className="" rowSpan="2" >{item.room}</th>
                                    <th className="">{item.student1 && item.student1.name ? item.student1.name : ""}</th>
                                    <th className="">{item.student1 && item.student1.surname ? item.student1.surname : ""}</th>
                                    <th className="">{item.student1 && item.student1.nickname ? item.student1.nickname : ""}</th>
                                    <th className="">{item.student1 && item.student1.id ? item.student1.id : ""}</th>
                                    <th className="">{item.student1 && item.student1.tel ? item.student1.tel : ""}</th>
                                </tr>
                                <tr>
                                    <th className="">{item.student2 && item.student2.name ? item.student2.name : ""}</th>
                                    <th className="">{item.student2 && item.student2.surname ? item.student2.surname : ""}</th>
                                    <th className="">{item.student2 && item.student2.nickname ? item.student2.nickname : ""}</th>
                                    <th className="">{item.student2 && item.student2.id ? item.student2.id : ""}</th>
                                    <th className="">{item.student2 && item.student2.tel ? item.student2.tel : ""}</th>
                                </tr>
                            </>
                        ) : ""}
                    </table>
                    
                </div>
                
            }
            {
                        current == 0 ?
                            <button className="cursor-pointer  mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setCurrent(prev => prev + 1)}>ถัดไป</button>
                            : current == 7 ? <button className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setCurrent(prev => prev - 1)}>ก่อนหน้า</button>
                                : <>
                                    <button className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"  onClick={() => setCurrent(prev => prev - 1)}>ก่อนหน้า</button>
                                    <button className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setCurrent(prev => prev + 1)}>ถัดไป</button>
                                </>
                    }
        </div>
    )
}

export default reserveResult
