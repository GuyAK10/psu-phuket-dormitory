import './styles.css'
import '../style.css'
import '../component/NavigationBar'
import NavigationBar from '../component/NavigationBar'
import Footer from '../component/Footer'
import { LoginState } from '../utils/context'
import LoginModal from '../component/Login'
import { RecoilRoot } from 'recoil'

const MyApp = ({ Component, pageProps }) => {
    const [token, setToken] = React.useState(null)
    const [showModal, setShowModal] = React.useState(false)
    const [axiosConfig, setAxiosConfig] = React.useState(null)
    const [menuBar, setMenubar] = React.useState('ลงชื่อเข้าใช้')
    const [previousRoute, setPreviousRoute] = React.useState(null)

    return (
        <RecoilRoot>
            <LoginState.Provider
                value={{
                    Token: [token, setToken],
                    Modal: [showModal, setShowModal],
                    AxiosConfig: [axiosConfig, setAxiosConfig],
                    MenuBar: [menuBar, setMenubar],
                    PreviousRoute: [previousRoute, setPreviousRoute]
                }}>
                <div className="root-container">
                    <NavigationBar />
                    <LoginModal>
                        <Component {...pageProps} />
                        <style jsx global>{`
                            html, body{
                                margin:0;
                                padding:0;
                                //background: hsla(0, 0%, 80%, .65);
                                width:100vw;
                                font-size: 16px;
                            }
                      `}</style>
                        <Footer />
                    </LoginModal >
                </div>
            </LoginState.Provider>
        </RecoilRoot>
    )
}

export default MyApp