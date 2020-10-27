import './styles.css'
import '../style.css'
import '../component/NavigationBar'
import NavigationBar from '../component/NavigationBar'
import Footer from '../component/Footer'
import { GlobalState } from '../utils/context'
import LoginModal from '../component/login'
import { RecoilRoot } from 'recoil'
import React, { useState } from 'react'

const MyApp = ({ Component, pageProps }) => {
    const [token, setToken] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [axiosConfig, setAxiosConfig] = useState(null)
    const [menuBar, setMenubar] = useState('ลงชื่อเข้าใช้')
    const [previousRoute, setPreviousRoute] = useState(null)
    const [students, setStudents] = useState(null)

    return (
        <GlobalState.Provider
            value={{
                Token: [token, setToken],
                Modal: [showModal, setShowModal],
                AxiosConfig: [axiosConfig, setAxiosConfig],
                MenuBar: [menuBar, setMenubar],
                PreviousRoute: [previousRoute, setPreviousRoute],
                Students: [students, setStudents]
            }}>
            <div className="root-container">
                <NavigationBar />
                <LoginModal>
                    <RecoilRoot>
                        <Component {...pageProps} />
                    </RecoilRoot>
                    <style jsx global>{`
                            html, body{
                                margin:0;
                                padding:0;
                                /*background: hsla(0, 0%, 80%, .65);*/
                                width:100vw;
                                font-size: 16px;
                            }
                      `}</style>
                    <Footer />
                </LoginModal >
            </div>
        </GlobalState.Provider>
    )
}

export default MyApp