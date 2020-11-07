import React from 'react'

const Card = ({ children }) => {
    return (
        <div className="Card bg-white shadow-md rounded px-8 pt-6 pb-8 m-4 bg-gray-100 flex flex-col justify-center items-start">
            {/* <div>{item.title}</div>
            <img src={item.img} />
            <p>{item.description}</p> */}
            {children}
        </div>
    )
}

export default Card
