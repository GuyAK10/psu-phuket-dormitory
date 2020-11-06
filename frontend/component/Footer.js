import React from 'react'

const Footer = () => {
    return (
        <div className="footer-container flex flex-row justify-between items-center bg-gray-200 bottom-0 absolute w-full shadow-md p-4">
            <img className="w-20 h-10" src="icon/psuPhuketLogo.png" alt="psu phuket logo" />
            <div className="footer-contact flex flex-col justify-center items-center">
                <p className="">Prince of Songkla University, Phuket Campus</p>
                <p className="block xl:block md:block lg:block sm:hidden">80 Moo 1 Vichitsongkram Road., Kathu, Phuket 83120, Thailand</p>
                <p className="block xl:block md:block lg:block sm:hidden">Tel: 062-4488584 Fax: 0-7627-6002</p>
            </div>
            <div className="social-container flex flex-row">
                <img className="w-10 h-10 m-2" src="icon/facebook.png" alt="facebook icon" />
                <img className="w-10 h-10 m-2" src="icon/line.png" alt="line icon" />
            </div>
        </div>
    )
}
export default Footer