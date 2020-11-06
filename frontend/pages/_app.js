import './styles.css'
import '../styles.css'
import '../component/NavigationBar'
import NavigationBar from '../component/NavigationBar'
import Footer from '../component/Footer'
import { GlobalState } from '../utils/context'
import LoginModal from '../component/Login'
import React, { useState } from 'react'

const MyApp = ({ Component, pageProps }) => {
    const [token, setToken] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [axiosConfig, setAxiosConfig] = useState(null)
    const [menuBar, setMenubar] = useState('ลงชื่อเข้าใช้')
    const [previousRoute, setPreviousRoute] = useState(null)
    const [students, setStudents] = useState(null)
    const [staff, setStaff] = useState(false)

    return (
        <GlobalState.Provider
            value={{
                Token: [token, setToken],
                Modal: [showModal, setShowModal],
                AxiosConfig: [axiosConfig, setAxiosConfig],
                MenuBar: [menuBar, setMenubar],
                PreviousRoute: [previousRoute, setPreviousRoute],
                Students: [students, setStudents],
                Staff: [staff, setStaff]
            }}>
            <div className="root-container relative">
                <NavigationBar />
                <LoginModal>
                    <Component {...pageProps} />
                    <Footer />
                </LoginModal >
            </div>
        </GlobalState.Provider>
    )
}

export default MyApp