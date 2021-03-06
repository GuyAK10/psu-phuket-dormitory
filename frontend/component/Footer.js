import React, { useEffect, useState } from 'react'

const Footer = () => {
    const [adminPath, setAdminPath] = useState(false)

    const checkPathName = () => {
        const { location: { pathname } } = window
        const checkAdminPath = pathname.includes('/admin/')
        setAdminPath(checkAdminPath)
    }

    useEffect(() => {
        checkPathName()
    }, [])

    return (
        <div className="footer-container flex flex-row justify-between items-center bg-gradient-to-r from-blue-700 h-full to-blue-800 min-w-screen shadow-md p-4">
            <div className="psu-footer-img-container">
                <img className="psu-footer-img" src={adminPath ? `../../icon/psuPhuketLogo.png` : `icon/psuPhuketLogo.png`} alt="psu phuket logo" />
            </div>
            <div className="footer-contact flex flex-col justify-center items-center">
                <p className="address-psu">Prince of Songkla University, Phuket Campus</p>
                <p className="address-psu block xl:block md:block lg:block sm:hidden">80 Moo 1 Vichitsongkram Road., Kathu, Phuket 83120, Thailand</p>
                <p className="address-psu block xl:block md:block lg:block sm:hidden">Tel: 062-4488584 Fax: 0-7627-6002</p>
            </div>
            <div className="social-container flex flex-row">
                <img className="icon m-2" src={adminPath ? `../../icon/facebook.png` : `icon/facebook.png`} alt="facebook icon" />
                <img className="icon m-2" src={adminPath ? `../../icon/line.png` : `icon/line.png`} alt="line icon" />
            </div>
        </div>
    )
}
export default Footer