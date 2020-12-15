import '../styles.css'
import '../component/NavigationBar'
import NavigationBar from '../component/NavigationBar'
import Footer from '../component/Footer'
import UtilitiesBar from '../component/UtilitiesBar'
import { GlobalState } from '../utils/context'
import LoginModal from '../component/Login'
import React, { useState } from 'react'

const MyApp = ({ Component, pageProps }) => {
    const [token, setToken] = useState({ id: null, token: null, type: "Students" })
    const [showModal, setShowModal] = useState(false)
    const [axiosConfig, setAxiosConfig] = useState(null)
    const [menuBar, setMenubar] = useState('ลงชื่อเข้าใช้')
    const [previousRoute, setPreviousRoute] = useState(null)
    const [students, setStudents] = useState(null)
    const [staff, setStaff] = useState(false)
    const [menuName, setMenuName] = useState('ข่าวสาร')
    const [subMenuName, setSubMenuName] = useState('รายการข่าว')

    return (
        <GlobalState.Provider
            value={{
                Token: [token, setToken],
                Modal: [showModal, setShowModal],
                AxiosConfig: [axiosConfig, setAxiosConfig],
                MenuBar: [menuBar, setMenubar],
                Students: [students, setStudents],
                Staff: [staff, setStaff],
                MenuName: [menuName, setMenuName],
                SubMenuName: [subMenuName, setSubMenuName],
                previousRoute,
                setPreviousRoute,
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
    )
}

export default MyApp