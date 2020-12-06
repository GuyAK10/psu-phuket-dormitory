import React, { useState, useEffect, useContext } from 'react'
import Router from 'next/router'
import useFetch from 'use-http'
import { GlobalState } from '../../../utils/context'
import { message,Button } from 'antd';
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const UpdateNews = () => {
    const { Modal, Token, MenuBar } = useContext(GlobalState)
    const [menuBar, setMenuBar] = MenuBar
    const [token, setToken] = Token
    const [showModal, setShowModal] = Modal
    const [fileName,setFileName]=useState({})
    const [file,setFile] = useState({})
    const [header, setHeader] = useState({})
    const { get,post } = useFetch(`${ENDPOINT}:${PORT}/staff/news`, { ...header, cachePolicy: "no-cache" })

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
    
    const handleName = (name)=>{
        setFileName(name)
    }
    
    const handleFile =  (file) => {

        let data = new FormData()
        data.append('pdf', file)
        setFile(data)
    }

    const handleSubmit = async () =>{
        const success = () => {
            message.success('บันทึกข้อมูลเรียบร้อยแล้ว');
        };
    
         const resImg = await post(`upload/${fileName}`,file)
        if (resImg.success) {
            success()
            Router.push('/')
        }
    }

    useEffect(() => {
        getHeader()
        verifyLogin()
    }, [])
    
    return (
        <div>
            <input type="text" onChange={(e) => handleName(e.target.value)} name ="newsName"/>
            <input type="file" name ="file" onChange={(e) => handleFile(e.target.files[0])} />
            <Button type="primary" onClick = {(e)=> handleSubmit()}>Upload</Button>
        </div>
    )
    
}

export default UpdateNews
