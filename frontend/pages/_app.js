import '../styles.css'
import NavigationBar from '../component/NavigationBar'
import Footer from '../component/Footer'
import UtilitiesBar from '../component/UtilitiesBar'
import { GlobalState } from '../utils/context'
import LoginModal from '../component/Login'
import React, { useEffect, useState } from 'react'
import { CookiesProvider } from 'react-cookie';
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

    const { get, post, del, error, loading, response, request } = useFetch(`${ENDPOINT}:${PORT}`, options => {
        options.cachePolicy = "no-cache"
        options.credentials = 'include'
        // options.timeout = 3000
        return options
    })

    const logout = async () => {
        if (menuBar === "ออกจากระบบ") {
            removeCookie("token")
            removeCookie("user")
            setMenuBar('ลงชื่อเข้าใช้')
            setHeaderDetail(null)
            setStaff(false)
            Router.push('/')
        }
    }

    const verifyLogin = () => {
        if (!cookies.token) {
            Router.push('/login')
        }
    }

    useEffect(() => {
        let dontLeak = false
        if (!cookies.token) {
            logout()
        } return () => dontLeak = true
    }, [])

    return (
        <CookiesProvider>
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
                <div className="root-container relative grid grid-cols-6">
                    <div className="nav-bar-container col-span-1 col-start-1">
                        <NavigationBar />
                    </div>
                    <div className="body-container col-span-5 col-start-2">
                        <UtilitiesBar />
                        <LoginModal>
                            <Component {...pageProps} />
                            <Footer />
                        </LoginModal >
                    </div>
                </div>
            </GlobalState.Provider>
        </CookiesProvider>
    )
}

MyApp.getInitialProps = ({ ctx: { req, res } }) => {

    //server side
    if (req) {
        let serverCookie = req.cookies || ""
        if (!serverCookie) {
            if (req.url != '/login' && req.url != '/') {
                console.log('no cookie Redirect')
                res.writeHead(302, { Location: `/login` })
                res.end()
            }
        }

        return { serverCookie }
    }

    //client side
    if (!req) {
        const clientCookie = document.cookie || ""
        return { clientCookie }
    }

    return {}

}
export default MyApp