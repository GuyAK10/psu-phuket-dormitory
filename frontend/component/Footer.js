import React from 'react'

const Footer = () => {
    return (
        <div className="footer-container flex flex-row">
            <img className="psu-phuket-logo" src="icon/psuPhuketLogo.png" alt="psu phuket logo" />
            <div className="footer-contact flex flex-col justify-center items-center">
                <p className="flex-1">Prince of Songkla University, Phuket Campus</p>
                <p className="flex-1">80 Moo 1 Vichitsongkram Road., Kathu, Phuket 83120, Thailand</p>
                <p className="flex-1">Tel: 062-4488584 Fax: 0-7627-6002</p>
            </div>
            <div className="social-container">fb line ig</div>
        </div>
    )
}
export default Footer