import React from 'react'

const Card = ({ item }) => {
    return (
        <div className="Card bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
            <div>{item.title}</div>
            <img src={item.img} />
            <p>{item.description}</p>
        </div>
    )
}

export default Card
