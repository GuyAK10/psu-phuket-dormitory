import React, { useState, useContext } from 'react'
import { GlobalState } from '../../../utils/context'
import { message, Button } from 'antd';

const UpdateNews = () => {
    const { post } = useContext(GlobalState)
    const [fileName, setFileName] = useState({})
    const [file, setFile] = useState({})

    const handleName = (name) => {
        setFileName({
            ...fileName,
            name: name
        })
    }

    const handleDetail = (detail) => {
        setFileName({
            ...fileName,
            detail: detail
        })
    }

    const handleFile = async (file) => {
        setFile(file)
    }

    const handleSubmit = async () => {
        let data = new FormData()
        data.append('pdf', file)
        const resPdf = await post(`staff/news/upload/${fileName.name}/${fileName.detail}`, data)
        if (resPdf.success) message.success(resPdf.message)
    }

    return (
        <div className="flex flex-col justify-center px-32 py-4 h-screen">
            <label>ชื่อเรื่อง</label>
            <input className="rounded border-2 border-blue-500" type="text" onChange={e => handleName(e.target.value)} name="newsName" />
            <input type="file" accept="application/pdf" name="file" onChange={(e) => handleFile(e.target.files[0])} />
            <label>รายละเอียดเพิ่มเติม</label>
            <input className="rounded border-2 border-blue-500" type="text" onChange={e => handleDetail(e.target.value)} name="detail" />
            <Button className="mt-2" type="primary" onClick={(e) => handleSubmit()}>Upload</Button>
        </div>
    )

}

export default UpdateNews
