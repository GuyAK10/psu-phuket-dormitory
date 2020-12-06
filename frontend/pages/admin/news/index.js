import React, { useState, useEffect, useContext } from 'react'
import Router from 'next/router'
import useFetch from 'use-http'
import { GlobalState } from '../../../utils/context'

const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const news = () => {
    const { Modal, Token, MenuBar } = useContext(GlobalState)
    const [menuBar, setMenuBar] = MenuBar
    const [token, setToken] = Token
    const [showModal, setShowModal] = Modal
    const [header, setHeader] = useState({})
    const [news, setNews] = useState(null)
    const { get } = useFetch(`${ENDPOINT}:${PORT}`, { cachePolicy: "no-cache", })

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

    const newsList = async () => {
        try {
            const resNews = await get('/news/listname')
            setNews(resNews)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getHeader()
        verifyLogin()
        newsList()
    }, [])
    
    return (
        <div>
{news !== null ? news.data.map((item, key) => (
            <div>
                <a href={`http://localhost/news/${item.newsName}`} target="_blank">{item.newsId}</a>
            </div>
        )) :""}
        </div>
        
    )
    
}

export default news
