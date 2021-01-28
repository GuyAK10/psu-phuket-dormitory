import React, { useEffect, useContext, useState } from 'react'
import { message } from 'antd'
import { GlobalState } from '../utils/context'

const repair = () => {
    const { verifyLogin, post, response, cookies } = useContext(GlobalState)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const handleTitle = (event) => {
        console.log(event.target.value)
        setTitle(event.target.value)
    }
    const submit = async () => {
        const data = await post("student/repair", { studentId: `${cookies.user.id}`, title, description })
        if (!data.success) {
            message.error(data.message)
            if (data.message==="กรุณาจองห้องพักก่อนทำการแจ้งซ่อม") {
                message.warn("ระบบจะพาคุณไปยังหน้าบันทึกข้อมูล")
                Router.push("reserve")
            }  
        } else {
            message.success(data.message)
        }
        
    }

    useEffect(() => {
        verifyLogin()
    })

    return (
        <div className="repair-user-container">
            <label className = "repairtext">แจ้งซ่อม</label>
            <select name="title" className=" repairtitle" value = {title}  onChange={handleTitle}>
                <option  disabled value="" >เลือกหัวข้อปัญหา</option>
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
    )
}

export default repair
