import React, { useEffect, useContext, useState } from 'react'
import { message } from 'antd'
import { GlobalState } from '../../../utils/context'

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
  
    const getUniversityYear = async () => {
        const {data} = await get('/universityYear')
        console.log(data)
        setUniversityYear(data)
    }
    const getRepair = async () => {
        
        const {data} = cookies && await get(`/staff/repair/${semester}/${universityYear}`)
        console.log(data)
        serHistoryRepair(data)
    }

    useEffect(() => {
        verifyLogin()
        getUniversityYear()
    },[])

    useEffect(()=>{
        getRepair()
    },[semester])
    return (
        <div className="repair-user-container h-screen">
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
                        <div className="repairdetail-title"><label >ห้อง:</label>{item.room?<p>{item.room}</p>:""}</div>
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
