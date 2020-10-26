import React from 'react'

const reserve = () => {
    const Building = () => {
        return (
            <div className="building-container">
                <div className="center">center</div>
                <div className="left">left</div>
                <div className="right">right</div>
            </div>
        )
    }
    return (
        <div className="reserve-container">
            <Building />
            {/* <div className="floor-container">

                <div className="left-floor"></div>
                <div className="right-floor"></div>
            </div> */}
        </div>
    )
}
export default reserve