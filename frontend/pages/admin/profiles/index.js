import React, { useState, useContext } from 'react'
import { GlobalState } from '../../../utils/context'
import axios from 'axios'
import Router from 'next/router'
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const profile = () => {
    const { students, setStudents } = useContext(GlobalState)

    React.useEffect(() => {
        getStudent()
    }, [])

    const getStudent = async () => {
        try {
            const result = await get(`staff/profile`)
            setStudents(result)
        } catch (e) {
            console.error(e)
        }
    }

    const gotoShowMore = (profileId) => {
        Router.push({ pathname: "profiles/student", query: { profileId } })
    }

    return (
        <div className="profile-container h-screen">
            {/* <button onClick={() => console.log(students)}>Students</button> */}
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">PSU PassportID</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Surname</th>
                        <th className="px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students ? students.map((item, key) => {
                        return (
                            <tr key={key}>
                                <td className="border px-4 py-2">{item.studentId}</td>
                                <td className="border px-4 py-2">{item.profile.name}</td>
                                <td className="border px-4 py-2">{item.profile.surname}</td>
                                <td className="border px-4 py-2">
                                    <button onClick={
                                        () => gotoShowMore(item.studentId)
                                    }>Show More</button>
                                </td>
                            </tr>
                        )
                    }) : null}

                </tbody>
            </table>
        </div>
    )
}

export default profile