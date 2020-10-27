import React, { useState } from 'react'
import { GlobalState } from '../utils/context'
import axios from 'axios'
import { message, Button, Space } from 'antd';
import Router from 'next/router';
const Endpoint = process.env.END_POINT || 'http://localhost'

const profile = () => {

    const { AxiosConfig, Token } = React.useContext(GlobalState)
    const [axiosConfig, setAxiosConfig] = AxiosConfig
    const [_token, setToken] = Token
    const [section, setSection] = React.useState(1)
    const [stepBackground, setStepBackground] = useState({ 1: "", 2: "", 3: "", 4: "", 5: "" })
    const [form, setForm] = React.useState({
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

    const handleFormprofile = (e) => {
        setForm({
            ...form,
            profile: {
                ...form.profile,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleFormContact = (e) => {
        setForm({
            ...form,
            contact: {
                ...form.contact,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleFormInformation = (e) => {
        setForm({
            ...form,
            information: {
                ...form.information,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleFormFriend = (e) => {
        setForm({
            ...form,
            friend: {
                ...form.friend,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleFormFamily = {
        dad: (e) => {
            setForm({
                ...form,
                family: {
                    ...form.family,
                    dad: {
                        ...form.family.dad,
                        [e.target.name]: e.target.value
                    }
                }
            })
        },
        mom: (e) => {
            setForm({
                ...form,
                family: {
                    ...form.family,
                    mom: {
                        ...form.family.mom,
                        [e.target.name]: e.target.value
                    }
                }
            })
        },
        emergency: (e) => {
            setForm({
                ...form,
                family: {
                    ...form.family,
                    emergency: {
                        ...form.family.emergency,
                        [e.target.name]: e.target.value
                    }
                }
            })
        },
        status: (e) => {
            setForm({
                ...form,
                family: {
                    ...form.family,
                    status: {
                        ...form.family.status,
                        [e.target.name]: e.target.value
                    }
                }
            })
        }
    }

    const handleFormOther = (e) => {
        setForm({
            ...form,
            other: {
                ...form.other,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = (e) => {
        const { id } = JSON.parse(sessionStorage.getItem('token'))

        const success = () => {
            message.success('บันทึกข้อมูลเรียบร้อยแล้ว');
        };

        const error = () => {
            message.error('เกิดข้อผิดพลาด');
        };

        try {
            axios.post(`${Endpoint}/student/profile/${id}`, form, axiosConfig).then(res => {
                if (res.status === 200) {
                    console.log("Submit success")
                    success()
                    Router.push('/')
                }
                else {
                    error()
                }
            })
        } catch (e) {
            console.error(e)
            Logout()
        }
    }
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
    }, [])

    const profileForm = () => {
        return <div className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {Step()}
            <h2>ข้อมูลเบื้องต้น</h2>
            <label>รหัสนักศึกษา</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.profile.id} name="id" onChange={handleFormprofile} />
            <label>ชื่อจริง</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.profile.name} name="name" onChange={handleFormprofile} />
            <label>นามสกุล</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.profile.surname} name="surname" onChange={handleFormprofile} />
            <label>ชื่อเล่น</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.profile.nickname} name="nickname" onChange={handleFormprofile} />
            <label>ศาสนา</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.profile.religion} name="religion" onChange={handleFormprofile} />
            <label>สัญชาติ</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.profile.race} name="race" onChange={handleFormprofile} />
            <label>เชื่อชาติ</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.profile.nationality} name="nationality" onChange={handleFormprofile} />
            <label>วัน/เดือน/ปีเกิด</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.profile.birthday} name="birthday" onChange={handleFormprofile} />
            <label>คณะ</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.profile.faculty} name="faculty" onChange={handleFormprofile} />
            <label>สาขา/ภาควิชา</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.profile.department} name="department" onChange={handleFormprofile} />
            <label>Line ID</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.profile.line} name="line" onChange={handleFormprofile} />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                setSection(prev => prev + 1)
                setStep(section)
            }}>หน้าถัดไป</button>
        </div>
    }

    const Contact = () => {
        return <div className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {Step()}
            <h2>ข้อมูลติดต่อ</h2>
            <label>เบอร์โทรศัพท์</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="tel" onChange={handleFormContact} />
            <label>อีเมล์</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" onChange={handleFormContact} />
            <label>ชื่อ Facebook</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="facebook" onChange={handleFormContact} />
            <label>ที่อยู่</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="network" onChange={handleFormContact} />
            <label>บ้านเลขที่</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="houseno" onChange={handleFormContact} />
            <label>หมู่บ้าน</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="village" onChange={handleFormContact} />
            <label>หมู่ที่</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="villageno" onChange={handleFormContact} />
            <label>ถนน</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="road" onChange={handleFormContact} />
            <label>ตำบล</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="subdistrinct" onChange={handleFormContact} />
            <label>อำเภอ</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="district" onChange={handleFormContact} />
            <label>จังหวัด</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="province" onChange={handleFormContact} />
            <label>รหัสไปรษณีย์</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="postalcode" onChange={handleFormContact} />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                setSection(prev => prev - 1)
                setStep(section)
            }}>หน้าที่แล้ว</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                setSection(prev => prev + 1)
                setStep(section)
            }}>หน้าถัดไป</button>
        </div>
    }

    const Information = () => {
        return <div className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {Step()}
            <h2>ข้อมูลการศึกษา</h2>
            <label>จบจากโรงเรียน</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="school" onChange={handleFormInformation} />
            <label>จังหวัด</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="country" onChange={handleFormInformation} />
            <label>เกรดเฉลี่ย</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="gpa" onChange={handleFormInformation} />
            <label>แผนการศึกษา</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="plan" onChange={handleFormInformation} />
            <label>ส่วนสูง(ซ.ม.)</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="height" onChange={handleFormInformation} />
            <label>น้ำหนัก(ก.ก.)</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="weight" onChange={handleFormInformation} />
            <label>กรุ๊บเลือด</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="blood" onChange={handleFormInformation} />
            <label>โรคประจำตัว</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="desease" onChange={handleFormInformation} />
            <label>แพ้ยา</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="drugallergy" onChange={handleFormInformation} />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                setSection(prev => prev - 1)
                setStep(section)
            }}>หน้าที่แล้ว</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                setSection(prev => prev + 1)
                setStep(section)
            }}>หน้าถัดไป</button>
        </div>
    }

    const Friend = () => {
        return <div className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {Step()}
            <h2>เพื่อนสนิท</h2>
            <label>ชื่อจริง</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="name" onChange={handleFormFriend} />
            <label>นามสกุล</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="surname" onChange={handleFormFriend} />
            <label>ชื่อเล่น</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="nickname" onChange={handleFormFriend} />
            <label>เบอร์โทร</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="tel" onChange={handleFormFriend} />
            <label>คณะ</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="faculty" onChange={handleFormFriend} />
            <label>สาขา/ภาควิชา</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="department" onChange={handleFormFriend} />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                setSection(prev => prev - 1)
                setStep(section)
            }}>หน้าที่แล้ว</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                setSection(prev => prev + 1)
                setStep(section)
            }}>หน้าถัดไป</button>
        </div>
    }

    const Family = () => {
        return <div className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {Step()}
            <h2>ข้อมูลเกี่ยวกับครอบครัว</h2>
            <label>ชื่อจริงบิดา</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="name" onChange={handleFormFamily.dad} />
            <label>นามสกุล</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="surname" onChange={handleFormFamily.dad} />
            <label>อายุ</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="age" onChange={handleFormFamily.dad} />
            <label>อาชีพ</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="career" onChange={handleFormFamily.dad} />
            <label>สถานที่ทำงาน</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="workplace" onChange={handleFormFamily.dad} />
            <label>ตำแหน่ง</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="position" onChange={handleFormFamily.dad} />
            <label>รายได้/เดือน</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="income" onChange={handleFormFamily.dad} />
            <label>เบอร์โทร</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="tel" onChange={handleFormFamily.dad} />
            <label>ชื่อระบบเครือข่ายโทรศัพท์</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="network" onChange={handleFormFamily.dad} />
            <label>ชื่อจริงมารดา</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="name" onChange={handleFormFamily.mom} />
            <label>นามสกุล</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="surname" onChange={handleFormFamily.mom} />
            <label>อายุ</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="age" onChange={handleFormFamily.mom} />
            <label>อาชีพ</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="career" onChange={handleFormFamily.mom} />
            <label>สถานที่ทำงาน</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="workplace" onChange={handleFormFamily.mom} />
            <label>ตำแหน่ง</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="position" onChange={handleFormFamily.mom} />
            <label>รายได้/เดือน</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="income" onChange={handleFormFamily.mom} />
            <label>เบอร์โทร</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="tel" onChange={handleFormFamily.mom} />
            <label>ชื่อระบบเครือข่ายโทรศัพท์</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="network" onChange={handleFormFamily.mom} />

            <label>ติดต่อฉุกเฉิน</label>
            <label>ชื่อจริง</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="name" onChange={handleFormFamily.emergency} />
            <label>สกุล</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="surname" onChange={handleFormFamily.emergency} />
            <label>อายุ</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="age" onChange={handleFormFamily.emergency} />
            <label>มีความเกี่ยวข้องเป็น</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="concerned" onChange={handleFormFamily.emergency} />
            <label>อาชีพ</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="career" onChange={handleFormFamily.emergency} />
            <label>เบอร์โทร</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="tel" onChange={handleFormFamily.emergency} />
            <label>ระบบเครือข่ายโทรศัพท์</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="network" onChange={handleFormFamily.emergency} />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                setSection(prev => prev - 1)
                setStep(section)
            }}>หน้าที่แล้ว</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                setSection(prev => prev + 1)
                setStep(section)
            }}>หน้าถัดไป</button>
        </div>
    }

    const Other = () => {
        return <div className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {Step()}
            <h2>ข้อมูลอื่น ๆ</h2>
            <label>ความสามารถพิเศษ</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="talent" onChange={handleFormOther} />
            <label>อุปนิสัยส่วนตัว</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="character" onChange={handleFormOther} />
            <label>เคยได้รับตำแหน่งใดในมหาวิทยาลัย/โรงเรียน</label>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="position" onChange={handleFormOther} />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                setSection(prev => prev - 1)
                setStep(section)
            }}>หน้าที่แล้ว</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>บันทึกข้อมูลส่วนตัว</button>
        </div>
    }

    const setStep = (section) => {
        setStepBackground({ ...stepBackground, [section]: "red" })
    }

    const Step = () => {
        return (
            <div>
                <span style={{ background: stepBackground[1] }}>1</span>
                <span style={{ background: stepBackground[2] }}>2</span>
                <span style={{ background: stepBackground[3] }}>3</span>
                <span style={{ background: stepBackground[4] }}>4</span>
                <span style={{ background: stepBackground[5] }}>5</span>
                <style jsx>{`
                    div {
                        overflow-wrap: break-word;
                        text-align: center;
                        margin: 2em 0 2em 1em;
                    }

                    div > span {
                        position: relative;
                        border: 4px solid #1D3CE0;
                        border-radius: 50%;
                        margin: .8rem;
                        padding: .8em;
                        background: #1D3CE0;
                    }

                    div > span::after {
                        position: absolute;
                        content: "";
                        background: #1D3CE0;
                        width: 1.5em;
                        height: 4px;
                        top:22.5px;
                        left:39.5px;
                    }

                    div > span:last-child::after {
                        display: none;
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="profile-container h-auto flex flex-col items-center">
            {section === 1 ? <div className="profile-form"> {profileForm()}</div> : null}
            {section === 2 ? <div className="profile-form">{Contact()} </div> : null}
            {section === 3 ? <div className="profile-form">{Information()} </div> : null}
            {section === 4 ? <div className="profile-form">{Friend()} </div> : null}
            {section === 5 ? <div className="profile-form">{Family()} </div> : null}
            {section === 6 ? <div className="profile-form">{Other()} </div> : null}
        </div>
    )
}

export default profile