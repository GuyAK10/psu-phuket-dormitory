import React, { useEffect, useContext, useState } from 'react'
import { message } from 'antd'
import { GlobalState } from '../utils/context'
import Item from 'antd/lib/list/Item'

const repair = () => {
    const { verifyLogin, post, get, response, cookies } = useContext(GlobalState)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [historyRepair, serHistoryRepair] = useState([])
    const [universityYear,setUniversityYear] = useState()
    const [semester,setSemester]=useState("")
    const handleSemester = (event) =>{
        console.log(event.target.value)
        setSemester(event.target.value)
    }
    const handleTitle = (event) => {
        setTitle(event.target.value)
    }
    const submit = async () => {
        const data = await post("student/repair", { studentId: `${cookies.user.id}`, title, description })
        if (!data.success) {
            message.error(data.message)
            if (data.message === "กรุณาจองห้องพักก่อนทำการแจ้งซ่อม") {
                message.warn("ระบบจะพาคุณไปยังหน้าบันทึกข้อมูล")
                Router.push("reserve")
            }
        } else {
            message.success(data.message)
        }

    }

    const getUniversityYear = async () => {
        const {data} = await get('/universityYear')
        console.log(data)
        setUniversityYear(data)
    }
    const getMyrepair = async () => {
        const {data} = cookies && await get(`/student/myRepair/${cookies.user.id}/${semester}/${universityYear}`)
        console.log(data)
        serHistoryRepair(data)
    }

    useEffect(() => {
        verifyLogin()
        getUniversityYear()
    },[])

    useEffect(()=>{
        getMyrepair()
    },[semester])
    return (
        <div className="repair-user-container">
            <div className="repair-box">
                <label className="repairtext">แจ้งซ่อม</label>
                <hr/>
                <select name="title" className=" repairtitle" value={title} onChange= {handleTitle}>
                    <option disabled value="" >เลือกหัวข้อปัญหา</option>
                    <option value="water">แจ้งซ่อมน้ำประปา</option>
                    <option value="electric">แจ้งซ่อมระบบไฟ</option>
                    <option value="air">แจ้งซ่อมแอร์</option>
                    <option value="other">แจ้งซ่อมอื่่นๆ</option>
                </select>
                <textarea className="repairinput" type="text" placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)} />
                <button className="repairbutton"
                    onClick={submit}>ส่งเรื่องแจ้งซ่อม</button>
            </div>
            <div className="repairhistory">
                <label className="repairhistorytext">ประวัติการแจ้งซ่อม</label>
                <select name="semester" className=" semestertitle"value={semester} onChange={event=>{handleSemester(event)} } >
                    <option disabled value="" >เลือกเทอม/ปีการศึกษา</option>
                    <option value="1">1/{universityYear}</option>
                    <option value="2">2/{universityYear}</option>
                    <option value="3">3/{universityYear}</option>
                </select>
            </div>
            {historyRepair? historyRepair.map((item,key)=>
                    <div className ="repairdetail" key={key}>
                        <label>{item.day}/{item.month}/{item.year}</label>
                        <div className="repairdetail-title"><label >ปัญหาน้ำประปา:</label>{item.water?<p>{item.water.description}</p>:""}</div>
                        <div className="repairdetail-title"><label >ปัญหาด้านไฟฟ้า:</label>{item.electric?<p>{item.electric.description}</p>:""}</div>
                        <div className="repairdetail-title"><label >ปัญหาระบบแอร์:</label>{item.air?<p>{item.air.description}</p>:""}</div>
                        <div className="repairdetail-title"><label >ปัญหาอื่น ๆ:</label>{item.other?<p>{item.other.description}</p>:""}</div>
                    </div>
                ):""}
        </div>
    )
}

export default repair
