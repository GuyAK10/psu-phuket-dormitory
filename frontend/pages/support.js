import React, { useEffect, useContext, useState } from 'react'
import { message } from 'antd'
import { GlobalState } from '../utils/context'

const support = () => {
    const { verifyLogin, post, response } = useContext(GlobalState)
    const [detail, setDetail] = useState("")

    useEffect(() => {
        verifyLogin()
    })

    return (
        <div className="support-user-container min-h-screen flex flex-col p-32">
            <label>แจ้งซ่อม</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text"
                onChange={(e) => setDetail({ ...detail, detail: e.target.value })} />
            <button className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={async () => {
                    await post("student/support", detail)
                    if (response.ok) message.success("แจ้งซ่อมแล้ว")
                }}>ส่งเรื่องแจ้งซ่อม</button>
        </div>
    )
}

export default support
