import React, { useState, useEffect } from 'react'
import { GlobalState } from '../../../utils/context'
import { useRouter } from 'next/router'
import { message, Steps } from 'antd'
import { useForm } from "react-hook-form";

const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const { Step } = Steps;

const PaymentHistory = () => {
    const [payments, setPayments] = useState([])
    const { get, post, response, cookies, verifyLogin } = React.useContext(GlobalState)
    const { floorId, abbMonth, abbYear } = useRouter()
    const [current, setCurrent] = useState(null)
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

    const firstStudentStatus="student1"
    const secondStudentStatus="student2"
    const years = () => {
        const fullYear = new Date().getFullYear()
        const years = []
        for (let i = fullYear; i >= fullYear - 5; i--) {
            years.push(i)
        }
        return years.map(item => item + 543)
    }

    const [select, setSelect] = useState({
        month: "january",
        year: years()[0]
    })

    const confirmPayment = async(item,studentStatus)=>{
        
        const data = await post(`/staff/payment/paid/${select.month}/${select.year}/${item.roomId}/${studentStatus}`)
        console.log(data)
        if (data.success) {
            message.success(data.message)
            getPayments()
        }
        else
            message.error(data.message)
    }

    const getPayments = async () => {
        const data = await get(`/staff/payment/${floorList[current]}/${select.month}/${select.year}`)
        if (data.success) {
            message.success(data.message)
            setPayments(data.data)
        }
        else
            message.error(data.message)
    }


    const handleChange = (e) => {
        setSelect(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const getInitialId = () => {
        setInitialId(cookies.user.id)
    }


    const getFloor = async () => {
        const floor = await get(`staff/room/${floorList[current]}`)
        setFloorDetail(floor)
    }
    useEffect(() => {
        verifyLogin()
        getInitialId()
    }, [])

    useEffect(() => {
        getFloor()

            getPayments()
   
        
    }, [current])
    return (
        <div className="flex flex-col min-h-screen pl-32 pr-32 pt-10">

            <div className="flex flex-col relative">
                <label htmlFor="month">เดือน</label>
                <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" name="month" id="month" onChange={handleChange} value={select.month}>
                    {/* <option value="">เลือกเดือน</option> */}
                    <option value="january" name="month">มกราคม</option>
                    <option value="febuary" name="month">กุมภาพันธ์</option>
                    <option value="march" name="month">มีนาคม</option>
                    <option value="april" name="month">เมษายน</option>
                    <option value="may" name="month">พฤษภาคม</option>
                    <option value="june" name="month">มิถุนายน</option>
                    <option value="july" name="month">กรกฎาคม</option>
                    <option value="august" name="month">สิงหาคม</option>
                    <option value="september" name="month">กันยายน</option>
                    <option value="october" name="month">ตุลาคม</option>
                    <option value="november" name="month">พฤษจิกายน</option>
                    <option value="december" name="month">ธันวาคม</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>

            <div className="flex flex-col relative">
                <label htmlFor="years">ปี</label>
                <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" name="year" id="year" onChange={handleChange} value={select.year}>
                    {/* <option value="">เลือกปี</option> */}
                    {
                        years().map((item, key) => <option key={key} value={item} name={item}>{item}</option>)
                    }
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>

            <button
                className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => { getPayments(); getFloor(); setCurrent(0) }}
            >
                ค้นหา
            </button>

            <div className="flex flex-col">
                <Steps current={current}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="table">
                    <table className="table-payment-title">
                        <tr>
                            <th rowSpan="2" className="payment-title-room">ห้อง</th>
                            <th rowSpan="2" className="payment-title-name">ชื่อ-สกุล</th>
                            <th colSpan="2" className="payment-title-number">เลขที่อ่าน</th>
                            <th colSpan="3" className="payment-title-elec">ค่ากระแสไฟฟ้า</th>
                            <th rowSpan="2" className="payment-title-myelec">ค่ากระแสไฟฟ้า</th>
                            <th rowSpan="2" className="payment-title-water">ค่าน้ำประปา</th>
                            <th rowSpan="2" className="payment-title-sum" >รวมเงินที่จัดเก็บ</th>
                            <th rowSpan="2" className="payment-title-status" >สถานะ</th>
                        </tr>
                        <tr>
                            <th className="payment-title-old">ครั้งก่อน</th>
                            <th className="payment-title-new">ครั้งหลัง</th>
                            <th className="payment-title-unit">จำนวนหน่วย</th>
                            <th className="payment-title-price">ราคาต่อหน่วย</th>
                            <th className="payment-title-amout">จำนวนเงิน</th>
                        </tr>
                    </table>
                    <div className="table-payment">
                        <table className="table-payment-name">
                            {floorDetail ? floorDetail.map((item, key) =>
                                <div>
                                    <tr >
                                        <th className="payment-room" rowSpan="2" >{item.room}</th>
                                        <th className="payment-std1">{item.student1 && item.student1.name ? item.student1.name : ""}{item.student1 && item.student1.surname ? item.student1.surname : ""}</th>
                                    </tr>
                                    <tr>
                                        <th className="payment-std2">{item.student2 && item.student2.name ? item.student2.name : ""}{item.student2 && item.student2.surname ? item.student2.surname : ""}</th>
                                    </tr>
                                </div>

                            ) : ""}
                        </table>
                        <table className="table-payment-detail">
                            {payments ? payments.map((item, key) =>
                                <div>
                                    <tr className="payment-price">
                                        <th className="payment-price-old" rowSpan="2">{item.oldUnit}</th>
                                        <th className="payment-price-new" rowSpan="2">{item.newUnit}</th>
                                        <th className="payment-price-diff" rowSpan="2">{item.newUnit - item.oldUnit}</th>
                                        <th className="payment-price-unit" rowSpan="2">{item.unitPrice}</th>
                                        <th className="payment-price-price" rowSpan="2">{(item.newUnit - item.oldUnit) * item.unitPrice}</th>
                                        <th className="payment-price-myprice">{(item.newUnit - item.oldUnit) * item.unitPrice / 2}</th>
                                        <th className="payment-price-water">{item.water}</th>
                                        <th className="payment-price-sum">{((item.newUnit - item.oldUnit) * item.unitPrice / 2) + item.water}</th>
                                        <th className="payment-price-status" onClick={()=>{confirmPayment(item,firstStudentStatus)}}>{item.student1}</th>
                                    </tr>
                                    <tr className="payment-price">
                                        <th className="payment-price-myprice">{(item.newUnit - item.oldUnit) * item.unitPrice / 2}</th>
                                        <th className="payment-price-water">{item.water}</th>
                                        <th className="payment-price-sum">{((item.newUnit - item.oldUnit) * item.unitPrice / 2) + item.water}</th>
                                        <th className="payment-price-status" onClick={()=>{confirmPayment(item,secondStudentStatus)}}>{item.student2}</th>
                                    </tr>
                                </div>


                            ) : ""}

                        </table>
                    </div>

                </div>
                {
                    current == 0 ?
                        <button className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setCurrent(prev => prev + 1)}>ถัดไป</button>
                        : current == 7 ? <button className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setCurrent(prev => prev - 1)}>ก่อนหน้า</button>
                            : <div>
                                <button className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setCurrent(prev => prev - 1)}>ก่อนหน้า</button>
                                <button className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setCurrent(prev => prev + 1)}>ถัดไป</button>
                            </div>
                }
            </div>
        </div>
    )
}

export default PaymentHistory