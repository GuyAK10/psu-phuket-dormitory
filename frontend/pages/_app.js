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

const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const MyApp = ({ Component, pageProps, serverCookie, clientCookie }) => {
    const [showModal, setShowModal] = useState(false)
    const [menuBar, setMenuBar] = useState('ลงชื่อเข้าใช้')
    const [previousRoute, setPreviousRoute] = useState(null)
    const [students, setStudents] = useState(null)
    const [staff, setStaff] = useState(false)
    const [menuName, setMenuName] = useState('ข่าวสาร')
    const [subMenuName, setSubMenuName] = useState('รายการข่าว')
    const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);
    const [adminPath, setAdminPath] = useState(false)
    const { get, post, error, loading, response } = useFetch(`${ENDPOINT}:${PORT}`, { cachePolicy: "no-cache", headers: { type: cookies.user.type, token: cookies.token } })

    const getCookieToState = () => {
        const myCookie = serverCookie || clientCookie
        if (myCookie.token) {
            setCookie("token", myCookie.token)
            setCookie("user", myCookie.user)
        }
    }

    useEffect(() => {
        let dontLeak = false
        if (!dontLeak) getCookieToState()
        return () => dontLeak = true
    }, [])

    return (
        <CookiesProvider>
            <GlobalState.Provider
                value={{
                    adminPath, setAdminPath,
                    showModal, setShowModal,
                    menuBar, setMenuBar,
                    students, setStudents,
                    staff, setStaff,
                    menuName, setMenuName,
                    subMenuName, setSubMenuName,
                    cookies, setCookie, removeCookie,
                    previousRoute, setPreviousRoute,
                    get, post, error, loading, response
                }}>
                <div className="root-container relative grid grid-cols-6">
                    <button onClick={async () => {
                        const data = await get('student/profile/5835512119')
                        console.log(cookies)
                        console.log(data)
                    }}>Check</button>
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
        const serverCookie = req.cookies || ""
        if (!serverCookie) {
            if (req.url != '/login' && req.url != '/') {
                console.log('no cookie Redirect')
                res.writeHead(301, { Location: `/login` })
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