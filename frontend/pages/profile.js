import React, { useState, useEffect } from 'react'
import { GlobalState } from '../utils/context'
import axios from 'axios'
import Loading from '../component/Loading'
import { message, Steps, Button, } from 'antd';
import Router from 'next/router';
import useFetch from 'use-http'
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const { Step } = Steps;

const profile = () => {
    const { AxiosConfig, Token, Modal, MenuBar } = React.useContext(GlobalState)
    const [axiosConfig, setAxiosConfig] = AxiosConfig
    const [_token, setToken] = Token
    const [showModal, setShowModal] = Modal
    const [menuBar, setMenuBar] = MenuBar
    const [current, setCurrent] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [form, setForm] = React.useState({
        profile: {
            profileImg: "",
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

    const { get, post, loading, response } = useFetch(`${ENDPOINT}:${PORT}`, { ...axiosConfig, cachePolicy: "no-cache" })

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
            axios.post(`${ENDPOINT}/student/profile/${id}`, form, axiosConfig).then(res => {
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

    const getInitialProfile = async () => {
        try {
            if (sessionStorage.getItem('token')) {
                const token = await JSON.parse(sessionStorage.getItem('token'))
                const studentProfile = await get(`/student/profile/${token.id}`)
                if (response.ok) {
                    setForm(studentProfile)
                }
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    const handleFile = async (file) => {
        const token = JSON.parse(sessionStorage.getItem('token'))
        let data = new FormData()
        data.append('img', file)
        const resImg = await post(`/student/profile/upload/${token.id}`, data)
        console.log(resImg)
        if (resImg.success) {
            setForm({ ...form, profile: { ...form.profile, profileImg: resImg.message } })
        }
    }

    const steps = [
        {
            title: 'ข้อมูลเบื้องต้น',
            content: form ? <div className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2>ข้อมูลเบื้องต้น</h2>

                <label>รูปภาพ</label>

                {form.profile.profileImg ? <img className="w-20 h-20" src={`${ENDPOINT}:${PORT}${form.profile.profileImg}`} alt="profileImg" />
                    :
                    <img className="w-20 h-20" src="icon/mockProfile.png" alt="mock profile" />}

                <input type="file" name="file" onChange={(e) => handleFile(e.target.files[0])} />

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
            </div> : null
        },
        {
            title: 'ข้อมูลติดต่อ',
            content: form ? <div className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2>ข้อมูลติดต่อ</h2>
                <label>เบอร์โทรศัพท์</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.contact.tel} name="tel" onChange={handleFormContact} />
                <label>อีเมล์</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.contact.email} name="email" onChange={handleFormContact} />
                <label>ชื่อ Facebook</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.contact.facebook} name="facebook" onChange={handleFormContact} />
                <label>ที่อยู่</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.contact.network} name="network" onChange={handleFormContact} />
                <label>บ้านเลขที่</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.contact.village} name="houseno" onChange={handleFormContact} />
                <label>หมู่บ้าน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.contact.villageno} name="village" onChange={handleFormContact} />
                <label>หมู่ที่</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.contact.houseno} name="villageno" onChange={handleFormContact} />
                <label>ถนน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.contact.road} name="road" onChange={handleFormContact} />
                <label>ตำบล</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.contact.district} name="subdistrinct" onChange={handleFormContact} />
                <label>อำเภอ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.contact.subdistrict} name="district" onChange={handleFormContact} />
                <label>จังหวัด</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.contact.province} name="province" onChange={handleFormContact} />
                <label>รหัสไปรษณีย์</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.contact.postalcode} name="postalcode" onChange={handleFormContact} />
            </div> : null
        },
        {
            title: 'ข้อมูลการศึกษา',
            content: form ? <div className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2>ข้อมูลการศึกษา</h2>
                <label>จบจากโรงเรียน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.information.school} name="school" onChange={handleFormInformation} />
                <label>จังหวัด</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.information.county} name="country" onChange={handleFormInformation} />
                <label>เกรดเฉลี่ย</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.information.gpa} name="gpa" onChange={handleFormInformation} />
                <label>แผนการศึกษา</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.information.plan} name="plan" onChange={handleFormInformation} />
                <label>ส่วนสูง(ซ.ม.)</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.information.height} name="height" onChange={handleFormInformation} />
                <label>น้ำหนัก(ก.ก.)</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.information.weight} name="weight" onChange={handleFormInformation} />
                <label>กรุ๊บเลือด</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.information.blood} name="blood" onChange={handleFormInformation} />
                <label>โรคประจำตัว</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.information.disease} name="desease" onChange={handleFormInformation} />
                <label>แพ้ยา</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.information.drugallergy} name="drugallergy" onChange={handleFormInformation} />
            </div> : null
        },
        {
            title: 'เพื่อนสนิท',
            content: form ? <div className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2>เพื่อนสนิท</h2>
                <label>ชื่อจริง</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.friend.name} name="name" onChange={handleFormFriend} />
                <label>นามสกุล</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.friend.surname} name="surname" onChange={handleFormFriend} />
                <label>ชื่อเล่น</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.friend.nickname} name="nickname" onChange={handleFormFriend} />
                <label>เบอร์โทร</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.friend.tel} name="tel" onChange={handleFormFriend} />
                <label>คณะ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.friend.faculty} name="faculty" onChange={handleFormFriend} />
                <label>สาขา/ภาควิชา</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.friend.department} name="department" onChange={handleFormFriend} />
            </div> : null
        },
        {
            title: 'ข้อมูลเกี่ยวกับครอบครัว',
            content: form ? <div className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2>ข้อมูลเกี่ยวกับครอบครัว</h2>
                <label>ชื่อจริงบิดา</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.dad.name} name="name" onChange={handleFormFamily.dad} />
                <label>นามสกุล</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.dad.surname} name="surname" onChange={handleFormFamily.dad} />
                <label>อายุ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.dad.age} name="age" onChange={handleFormFamily.dad} />
                <label>อาชีพ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.dad.career} name="career" onChange={handleFormFamily.dad} />
                <label>สถานที่ทำงาน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.dad.workplace} name="workplace" onChange={handleFormFamily.dad} />
                <label>ตำแหน่ง</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.dad.position} name="position" onChange={handleFormFamily.dad} />
                <label>รายได้/เดือน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.dad.income} name="income" onChange={handleFormFamily.dad} />
                <label>เบอร์โทร</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.dad.tel} name="tel" onChange={handleFormFamily.dad} />
                <label>ชื่อระบบเครือข่ายโทรศัพท์</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.dad.network} name="network" onChange={handleFormFamily.dad} />
                <label>ชื่อจริงมารดา</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.mom.name} name="name" onChange={handleFormFamily.mom} />
                <label>นามสกุล</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.mom.surname} name="surname" onChange={handleFormFamily.mom} />
                <label>อายุ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.mom.age} name="age" onChange={handleFormFamily.mom} />
                <label>อาชีพ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.mom.career} name="career" onChange={handleFormFamily.mom} />
                <label>สถานที่ทำงาน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.mom.workplace} name="workplace" onChange={handleFormFamily.mom} />
                <label>ตำแหน่ง</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.mom.position} name="position" onChange={handleFormFamily.mom} />
                <label>รายได้/เดือน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.mom.income} name="income" onChange={handleFormFamily.mom} />
                <label>เบอร์โทร</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.mom.tel} name="tel" onChange={handleFormFamily.mom} />
                <label>ชื่อระบบเครือข่ายโทรศัพท์</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.mom.network} name="network" onChange={handleFormFamily.mom} />

                <label>ติดต่อฉุกเฉิน</label>
                <label>ชื่อจริง</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.emergency.name} name="name" onChange={handleFormFamily.emergency} />
                <label>สกุล</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.emergency.surname} name="surname" onChange={handleFormFamily.emergency} />
                <label>อายุ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.emergency.age} name="age" onChange={handleFormFamily.emergency} />
                <label>มีความเกี่ยวข้องเป็น</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.emergency.concerned} name="concerned" onChange={handleFormFamily.emergency} />
                <label>อาชีพ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.emergency.career} name="career" onChange={handleFormFamily.emergency} />
                <label>เบอร์โทร</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.emergency.tel} name="tel" onChange={handleFormFamily.emergency} />
                <label>ระบบเครือข่ายโทรศัพท์</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.family.emergency.network} name="network" onChange={handleFormFamily.emergency} />
            </div> : null
        },
        {
            title: 'ข้อมูลอื่น ๆ',
            content: form ? <div className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2>ข้อมูลอื่น ๆ</h2>
                <label>ความสามารถพิเศษ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.other.talent} name="talent" onChange={handleFormOther} />
                <label>อุปนิสัยส่วนตัว</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.other.character} name="character" onChange={handleFormOther} />
                <label>เคยได้รับตำแหน่งใดในมหาวิทยาลัย/โรงเรียน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={form.other.position} name="position" onChange={handleFormOther} />
            </div> : null
        },
    ]

    useEffect(() => {
        verifyLogin()
        getHeader()
        getInitialProfile()
        if (!loading) setIsLoading(false)
    }, [])

    if (isLoading) return <Loading />

    return (
        <div className="profile-container h-auto flex flex-col items-center p-10">
            <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
            <div className="steps-action">
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => setCurrent(prev => prev - 1)}>
                        ก่อนหน้า
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => {
                        handleSubmit()
                    }}>
                        บันทึกข้อมูล
                    </Button>
                )}
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => {
                        setCurrent(prev => prev + 1)
                    }}>
                        ถัดไป
                    </Button>
                )}
            </div>
        </div>
    )
}

export default profile
