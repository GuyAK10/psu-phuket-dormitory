import React, { useState, useEffect, useContext } from 'react'
import Router from 'next/router'
import useFetch from 'use-http'
import { GlobalState } from '../../../utils/context'
import { message, Button } from 'antd';
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const UpdateNews = () => {
    const { Modal, Token, MenuBar } = useContext(GlobalState)
    const [menuBar, setMenuBar] = MenuBar
    const [token, setToken] = Token
    const [showModal, setShowModal] = Modal
    const [fileName, setFileName] = useState({})
    const [file, setFile] = useState({})
    const [header, setHeader] = useState({})
    const { get, post } = useFetch(`${ENDPOINT}:${PORT}/staff/news`, { ...header, cachePolicy: "no-cache" })

    const Logout = () => {
        setToken(null)
        sessionStorage.removeItem('token')
        setShowModal(false)
        setMenuBar('ลงชื่อเข้าใช้')
        Router.push('login')
    }

    const getHeader = () => {
        if (sessionStorage.getItem('token')) {
            setToken(JSON.parse(sessionStorage.getItem('token')))
            setHeader({
                headers: {
                    authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")).token}`,
                    type: JSON.parse(sessionStorage.getItem('token')).type
                }
            })
        }
    }

    const verifyLogin = () => {
        const session = sessionStorage.getItem("token")
        if (!session) {
            sessionStorage.removeItem('token')
            setToken(null)
            setShowModal(false)
            setMenuBar('ลงชื่อเข้าใช้')
            Router.push('login')
        }
    }

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
        const resPdf = await post(`upload/${fileName.name}/${fileName.detail}`, data)
        if (resPdf.success) message.success(resPdf.message)
    }

    useEffect(() => {
        getHeader()
        verifyLogin()
    }, [])

    return (
        <div className="flex flex-col justify-center px-32 py-4">
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
