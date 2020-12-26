import './css/styles.css'
import NavigationBar from '../component/NavigationBar'
import Footer from '../component/Footer'
import UtilitiesBar from '../component/UtilitiesBar'
import { GlobalState } from '../utils/context'
import LoginModal from '../component/Login'
import React, { useEffect, useState, useRef } from 'react'
import useFetch from 'use-http'
import { useCookies } from 'react-cookie';
import Router from 'next/router'

const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const MyApp = ({ Component, pageProps }) => {
    const [showModal, setShowModal] = useState(false)
    const [menuBar, setMenuBar] = useState('ลงชื่อเข้าใช้')
    const [previousRoute, setPreviousRoute] = useState(null)
    const [students, setStudents] = useState(null)
    const [staff, setStaff] = useState(false)
    const [menuName, setMenuName] = useState('ข่าวสาร')
    const [subMenuName, setSubMenuName] = useState('รายการข่าว')
    const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);
    const [adminPath, setAdminPath] = useState(false)
    const [headerDetail, setHeaderDetail] = useState(null)
    const [showNav, setShowNav] = useState(false)

    const { get, post, del, error, loading, response } = useFetch(`${ENDPOINT}${PORT}`, {
        cachePolicy: "no-cache",
        credentials: 'include',
        onError: (e) => {
            console.log(e)
            logout()
            // logout()
            // Router.replace('login')
        }
        // options.timeout = 3000
    })

    const hambuger = useRef()
    const navBar = useRef()

    const logout = async () => {
        if (menuBar === "ออกจากระบบ") {
            // removeCookie("token")
            // removeCookie("user")
            setMenuBar('ลงชื่อเข้าใช้')
            setHeaderDetail(null)
            setStaff(false)
            Router.replace('/')
        }
    }

    const verifyLogin = () => {
        if (!cookies.user) {
            console.log('remove cookie')
            Router.replace('/login')
        }
    }

    useEffect(() => {
        let dontLeak = false
        // if (!cookies.user) {
        //     logout()
        // }
        // document.addEventListener('click', ressetTimeSession)
        return () => {
            dontLeak = true
            // document.removeEventListener('click', ressetTimeSession)
        }
    }, [])

    const toggleNav = () => {
        if (showNav == false)
            navBar.current.style.display = "flex"
        setShowNav(prev => !prev)
    }

    return (
        <GlobalState.Provider
            value={{
                verifyLogin,
                adminPath, setAdminPath,
                showModal, setShowModal,
                menuBar, setMenuBar,
                students, setStudents,
                staff, setStaff,
                menuName, setMenuName,
                subMenuName, setSubMenuName,
                cookies, setCookie, removeCookie,
                previousRoute, setPreviousRoute,
                headerDetail, setHeaderDetail,
                get, post, del, error, loading, response
            }}>
            <div className="root-container relative grid grid-cols-6 min-w-screen">
                {
                    !showNav &&
                    <img ref={hambuger} onClick={toggleNav} className="hambuger" src="icon/menu.svg" alt="hambuger" />
                }
                <div ref={navBar} className="nav-bar-container flex flex-col justify-center">
                    {
                        showNav && <>
                            <div onClick={toggleNav} className="arrow-left p-2 bg-blue-500 flex justify-center">
                                <img className="w-4" src="icon/left-arrow.svg" alt="left-arrow" />
                            </div>
                            <NavigationBar />
                        </>
                    }
                </div>
                <div className="desktop-nav-bar-container flex flex-col justify-center">
                    <div className="arrow-left p-2 bg-blue-500 flex justify-center">
                        <img className="w-4" src="icon/left-arrow.svg" alt="left-arrow" />
                    </div>
                    <NavigationBar />
                </div>
                <div className="body-container">
                    <UtilitiesBar />
                    <LoginModal>
                        <Component {...pageProps} />
                        <Footer />
                    </LoginModal >
                </div>
            </div>
            <style jsx global>{`
                    html, body{
                        margin: 0;
                        padding: 0;
                    }
                `}</style>
        </GlobalState.Provider>
    )
}

// MyApp.getInitialProps = ({ ctx: { req, res } }) => {

//     //server side
//     // if (req) {
//     //     let serverCookie = req.cookies || ""
//     //     if (!serverCookie) {
//     //         if (req.url != '/login' && req.url != '/') {
//     //             console.log('no cookie Redirect')
//     //             res.writeHead(302, { Location: `/login` })
//     //             res.end()
//     //         }
//     //     }

//     //     return { serverCookie }
//     // }

//     //client side
//     if (!req) {
//         const clientCookie = document.cookie || ""
//         return { clientCookie }
//     }

//     return {}

// }
export default MyApp