import React, { useEffect, useContext, useState } from 'react'
import { message } from 'antd'
import { GlobalState } from '../utils/context'

const repair = () => {
    const { verifyLogin, post, response,cookies } = useContext(GlobalState)
    const [title,setTitle] = useState("แจ้งซ่อมน้ำประปา")
    const [description, setDescription] = useState("")

    const handleTitle =(event)=>{
        console.log(event.target.value)
        setTitle(event.target.value)
    }
    const submit = async() =>{
        await post("student/repair", {studentId:cookies.user.id,title,description})
        if (response.ok) message.success("แจ้งซ่อมแล้ว")
    }
    
    useEffect(() => {
        verifyLogin()
    })
    return (
        <div className="support-user-container min-h-screen flex flex-col p-16">
            <label>แจ้งซ่อม</label>
            <select name = "title" className="shadow border rounded h-10 ml-16 mr-16 mt-8" onChange =  {handleTitle}>
                <option value="water">แจ้งซ่อมน้ำประปา</option>
                <option value="electric">แจ้งซ่อมระบบไฟ</option>
                <option value="air">แจ้งซ่อมแอร์</option>
                <option value="other">แจ้งซ่อมอื่่นๆ</option>
            </select>
            <textarea className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-16 ml-16 mt-8" type="text"
                onChange={(e) => setDescription( e.target.value )} />
            <button className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={submit}>ส่งเรื่องแจ้งซ่อม</button>
        </div>
    )
}

export default repair
