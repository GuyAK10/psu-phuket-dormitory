import React, { useState, useContext } from 'react'
import { GlobalState } from '../../../utils/context'
import axios from 'axios'
import Router from 'next/router'
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const profile = () => {
    const { AxiosConfig, Token, Students } = useContext(GlobalState)
    const [students, setStudents] = Students
    const [axiosConfig, setAxiosConfig] = AxiosConfig
    const [_token, setToken] = Token
    const [student, setStudent] = useState({
        profile: {
            id: "",
            name: "",
            surname: "",
            nickname: "",
            religion: "",
            race: "",
            nationality: "",
            birthday: "",
            faculty: "",
            department: "",
            line: ""
        },
        contact: {
            tel: "",
            network: "",
            email: "",
            facebook: "",
            houseno: "",
            village: "",
            villageno: "",
            road: "",
            subdistrict: "",
            district: "",
            province: "",
            postalcode: ""

        },
        information: {
            school: "",
            county: "",
            gpa: "",
            plan: "",
            height: "",
            weight: "",
            blood: "",
            disease: "",
            drugallergy: ""
        },
        friend: {
            name: "",
            surname: "",
            nickname: "",
            tel: "",
            faculty: "",
            department: ""
        },
        family: {
            dad: {
                name: "",
                surname: "",
                age: "",
                career: "",
                workplace: "",
                position: "",
                income: "",
                tel: "",
                network: ""
            },
            mom: {
                name: "",
                surname: "",
                age: "",
                career: "",
                workplace: "",
                position: "",
                income: "",
                tel: "",
                network: ""
            },
            emergency: {
                name: "",
                surname: "",
                age: "",
                concerned: "",
                career: "",
                tel: "",
                network: ""
            },
            status: ""
        },
        other: {
            talent: "",
            character: "",
            position: ""
        }
    })

    const Logout = () => {
        setToken(null)
        sessionStorage.removeItem('token')
        setShowModal(false)
        setMenuBar('ลงชื่อเข้าใช้')
        Router.push('login')
    }

    const getHeader = () => {
        if (sessionStorage.getItem('token')) {
            setToken(JSON.parse(sessionStorage.getItem('token')))
            setAxiosConfig({
                headers: {
                    authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")).token}`,
                    type: JSON.parse(sessionStorage.getItem('token')).type
                }
            })
        }
        else Logout()
    }

    const verifyLogin = () => {
        const session = sessionStorage.getItem("token")
        if (!session) {
            sessionStorage.removeItem('token')
            setToken(null)
            setShowModal(false)
            setMenuBar('ลงชื่อเข้าใช้')
            Router.push('login')
        }
    }

    React.useEffect(() => {
        verifyLogin()
        getHeader()
        getStudent()
    }, [])

    const getStudent = async () => {
        try {
            const result = await axios.get(`${ENDPOINT}:${PORT}/staff/profile/`, axiosConfig)
            console.log(result.data)
            setStudents(result.data)
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