import React, { useState, useEffect } from 'react'
import { GlobalState } from '../utils/context'
import axios from 'axios'
import { message, Steps, } from 'antd';
import Router from 'next/router';
import { useForm } from "react-hook-form";
import useFetch from 'use-http'

const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const { Step } = Steps;

const profile = () => {
    const { get, post, response, cookies, verifyLogin } = React.useContext(GlobalState)
    const [current, setCurrent] = useState(0)
    const [imgUrl, setImgUrl] = useState('')
    const { register, handleSubmit, errors } = useForm();
    const [isProfileFail, setProfileFail] = useState(true)
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
            friendName: "",
            friendSurname: "",
            friendNickname: "",
            friendTel: "",
            friendFaculty: "",
            friendDepartment: ""
        },
        family: {
            dad: {
                dadName: "",
                dadSurname: "",
                dadAge: "",
                dadCareer: "",
                dadWorkplace: "",
                dadPosition: "",
                dadIncome: "",
                dadTel: "",
                dadNetwork: ""
            },
            mom: {
                momName: "",
                momSurname: "",
                momAge: "",
                momCareer: "",
                momWorkplace: "",
                momPosition: "",
                momIncome: "",
                momTel: "",
                momNetwork: ""
            },
            emergency: {
                emergencyName: "",
                emergencySurname: "",
                emergencyAge: "",
                emergencyConcerned: "",
                emergencyCareer: "",
                emergencyTel: "",
                emergencyNetwork: ""
            },
            status: ""
        },
        other: {
            otherTalent: "",
            otherCharacter: "",
            otherPosition: ""
        },
        agreement: false
    })

    const handleFormProfile = (val) => {
        postData()
        setCurrent(prev => prev + 1)
        setForm({
            ...form,
            profile: val
        })
    }

    const handleFormContact = (val) => {
        postData()
        setCurrent(prev => prev + 1)
        setForm({
            ...form,
            contact: val
        })
    }

    const handleFormInformation = (val) => {
        postData()
        setCurrent(prev => prev + 1)
        setForm({
            ...form,
            information: val
        })
    }

    const handleFormFriend = (val) => {
        postData()
        setCurrent(prev => prev + 1)
        setForm({
            ...form,
            friend: val
        })
    }

    const handleFormFamily = {
        dad: (val) => {
            postData()
            setCurrent(prev => prev + 1)
            setForm({
                ...form,
                family: {
                    ...form.family,
                    dad: val
                }
            })
        },
        mom: (val) => {
            postData()
            setCurrent(prev => prev + 1)
            setForm({
                ...form,
                family: {
                    ...form.family,
                    mom: val
                }
            })
        },
        emergency: (val) => {
            postData()
            setCurrent(prev => prev + 1)
            setForm({
                ...form,
                family: {
                    ...form.family,
                    emergency: val
                }
            })
        },
        status: (val) => {
            postData()
            setCurrent(prev => prev + 1)
            setForm({
                ...form,
                family: {
                    ...form.family,
                    status: val
                }
            })
        }
    }

    const handleFormOther = (val) => {
        postData()
        setCurrent(prev => prev + 1)
        setForm({
            ...form,
            other: val
        })
    }

    const postData = async (saveAll) => {
        try {
            await post(`student/profile/${cookies.user.id}`, form)
            if (response.ok) {
                if (saveAll == "saveAll") {
                    message.success('บันทึกข้อมูลเรียบร้อยแล้ว');
                    Router.push(`/profile-result?profileId=${cookies.user.id}`)
                }
                if (saveAll != "saveAll") message.success('บันทึกข้อมูลชั่วคราว (เฉพาะหน้าถัดมา)')
            }
            else message.error('เกิดข้อผิดพลาด');
        } catch (e) {
            console.error(e)
        }
    }

    const steps = [
        {
            key: 0,
            title: 'ข้อมูลเบื้องต้น',
            content: form ? <form onSubmit={handleSubmit(handleFormProfile)} className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2>ข้อมูลเบื้องต้น</h2>

                <label>รูปภาพ</label>

                {isProfileFail ? <img className="w-20 h-20" src={`${ENDPOINT}${PORT}/student/profile/picture/${cookies.user ? cookies.user.id : ""}?key=${imgUrl}`} onError={() => {
                    setProfileFail(false)
                }} alt="profileImg" />
                    :
                    <img className="w-20 h-20" src="icon/mockProfile.png" alt="mock profile" />}

                <input type="file" accept="image/*" name="file" onChange={(e) => handleFile(e.target.files[0])} />

                <label>รหัสนักศึกษา</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="id"
                    defaultValue={form.profile.id}
                    ref={register({ required: true })}
                />
                {errors.line && <p className="text-red-500">โปรดกรอกข้อมูล รหัสนักศึกษา</p>}
                <label>ชื่อจริง</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="name"
                    defaultValue={form.profile.name}
                    ref={register({ required: true })}
                />
                {errors.name && <p className="text-red-500">โปรดกรอกข้อมูล ชื่อจริง</p>}
                <label>นามสกุล</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="surname"
                    defaultValue={form.profile.surname}
                    ref={register({ required: true })}
                />
                {errors.surname && <p className="text-red-500">โปรดกรอกข้อมูล นามสกุล</p>}
                <label>ชื่อเล่น</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="nickname"
                    defaultValue={form.profile.nickname}
                    ref={register({ required: true })}
                />
                {errors.nickname && <p className="text-red-500">โปรดกรอกข้อมูล ชื่อเล่น</p>}
                <label>ศาสนา</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="religion"
                    defaultValue={form.profile.religion}
                    ref={register({ required: true })}
                />
                {errors.religion && <p className="text-red-500">โปรดกรอกข้อมูล ศาสนา</p>}
                <label>สัญชาติ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="race"
                    defaultValue={form.profile.race}
                    ref={register({ required: true })}
                />
                {errors.race && <p className="text-red-500">โปรดกรอกข้อมูล สัญชาติ</p>}
                <label>เชื่อชาติ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="nationality"
                    defaultValue={form.profile.nationality}
                    ref={register({ required: true })}
                />
                {errors.nationality && <p className="text-red-500">โปรดกรอกข้อมูล เชื่อชาติ</p>}
                <label>วัน/เดือน/ปีเกิด</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="birthday"
                    defaultValue={form.profile.birthday}
                    ref={register({ required: true })}
                />
                {errors.birthday && <p className="text-red-500">โปรดกรอกข้อมูล วัน/เดือน/ปีเกิด</p>}
                <label>คณะ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="faculty"
                    defaultValue={form.profile.faculty}
                    ref={register({ required: true })}
                />
                {errors.faculty && <p className="text-red-500">โปรดกรอกข้อมูล คณะ</p>}
                <label>สาขา/ภาควิชา</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="department"
                    defaultValue={form.profile.department}
                    ref={register({ required: true })}
                />
                {errors.department && <p className="text-red-500">โปรดกรอกข้อมูล สาขา/ภาควิชา</p>}
                <label>Line ID</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="line"
                    defaultValue={form.profile.line}
                    ref={register({ required: true })}
                />
                {errors.line && <p className="text-red-500">โปรดกรอกข้อมูล line</p>}
                <input type="submit" className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="ถัดไป" />
                <p className="text-red-500">*** คำเตือน การบันทึกข้อมูลชั่วคราวใช้สำหรับการบันทึกชั่วคราวเท่านั้น ต้องกรอกข้อมูลให้ครบทุกช่องเท่านั้นจึงสามารถจองห้องพักได้</p>
            </form> : ""
        },
        {
            key: 1,
            title: 'ข้อมูลติดต่อ',
            content: form ? <form onSubmit={handleSubmit(handleFormContact)} className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2>ข้อมูลติดต่อ</h2>
                <label>เบอร์โทรศัพท์</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.contact.tel}
                    name="tel"
                    ref={register({ required: true })}
                />
                {errors.tel && <p className="text-red-500">โปรดกรอกข้อมูล เบอร์โทรศัพท์</p>}
                <label>อีเมล์</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.contact.email}
                    name="email"
                    ref={register({ required: true })}
                />
                {errors.email && <p className="text-red-500">โปรดกรอกข้อมูล อีเมล์</p>}
                <label>ชื่อ Facebook</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.contact.facebook}
                    name="facebook"
                    ref={register({ required: true })}
                />
                {errors.facebook && <p className="text-red-500">โปรดกรอกข้อมูล ชื่อ Facebook</p>}
                <label>ที่อยู่</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.contact.network}
                    name="network"
                    ref={register({ required: true })}
                />
                {errors.network && <p className="text-red-500">โปรดกรอกข้อมูล ที่อยู่</p>}
                <label>บ้านเลขที่</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.contact.village}
                    name="village"
                    ref={register({ required: true })}
                />
                {errors.village && <p className="text-red-500">โปรดกรอกข้อมูล บ้านเลขที่</p>}
                <label>หมู่บ้าน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.contact.villageno}
                    name="villageno"
                    ref={register({ required: true })}
                />
                {errors.villageno && <p className="text-red-500">โปรดกรอกข้อมูล หมู่บ้าน</p>}
                <label>หมู่ที่</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.contact.houseno}
                    name="houseno"
                    ref={register({ required: true })}
                />
                {errors.houseno && <p className="text-red-500">โปรดกรอกข้อมูล หมู่ที่</p>}
                <label>ถนน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.contact.road}
                    name="road"
                    ref={register({ required: true })}
                />
                {errors.road && <p className="text-red-500">โปรดกรอกข้อมูล ถนน</p>}
                <label>ตำบล</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.contact.district}
                    name="district"
                    ref={register({ required: true })}
                />
                {errors.district && <p className="text-red-500">โปรดกรอกข้อมูล ตำบล</p>}
                <label>อำเภอ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.contact.subdistrict}
                    name="subdistrict"
                    ref={register({ required: true })}
                />
                {errors.subdistrict && <p className="text-red-500">โปรดกรอกข้อมูล อำเภอ</p>}
                <label>จังหวัด</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.contact.province}
                    name="province"
                    ref={register({ required: true })}
                />
                {errors.province && <p className="text-red-500">โปรดกรอกข้อมูล จังหวัด</p>}
                <label>รหัสไปรษณีย์</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.contact.postalcode}
                    name="postalcode"
                    ref={register({ required: true })}
                />
                {errors.postalcode && <p className="text-red-500">โปรดกรอกข้อมูล รหัสไปรษณีย์</p>}
                <button
                    className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => setCurrent(prev => prev - 1)}
                >
                    ก่อนหน้า
                </button>
                <input type="submit" className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="ถัดไป" />
                <p className="text-red-500">*** คำเตือน การบันทึกข้อมูลชั่วคราวใช้สำหรับการบันทึกชั่วคราวเท่านั้น ต้องกรอกข้อมูลให้ครบทุกช่องเท่านั้นจึงสามารถจองห้องพักได้</p>
            </form> : ""
        },
        {
            key: 2,
            title: 'ข้อมูลการศึกษา',
            content: form ? <form onSubmit={handleSubmit(handleFormInformation)} className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2>ข้อมูลการศึกษา</h2>
                <label>จบจากโรงเรียน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.information.school}
                    name="school"
                    ref={register({ required: true })}
                />
                {errors.line && <p className="text-red-500">โปรดกรอกข้อมูล line</p>}
                <label>จังหวัด</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.information.county}
                    name="county"
                    ref={register({ required: true })}
                />
                {errors.county && <p className="text-red-500">โปรดกรอกข้อมูล จังหวัด</p>}
                <label>เกรดเฉลี่ย</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.information.gpa}
                    name="gpa"
                    ref={register({ required: true })}
                />
                {errors.gpa && <p className="text-red-500">โปรดกรอกข้อมูล เกรดเฉลี่ย</p>}
                <label>แผนการศึกษา</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.information.plan}
                    name="plan"
                    ref={register({ required: true })}
                />
                {errors.plan && <p className="text-red-500">โปรดกรอกข้อมูล แผนการศึกษา</p>}
                <label>ส่วนสูง(ซ.ม.)</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.information.height}
                    name="height"
                    ref={register({ required: true })}
                />
                {errors.height && <p className="text-red-500">โปรดกรอกข้อมูล ส่วนสูง(ซ.ม.)</p>}
                <label>น้ำหนัก(ก.ก.)</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.information.weight}
                    name="weight"
                    ref={register({ required: true })}
                />
                {errors.weight && <p className="text-red-500">โปรดกรอกข้อมูล น้ำหนัก(ก.ก.)</p>}
                <label>กรุ๊บเลือด</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.information.blood}
                    name="blood"
                    ref={register({ required: true })}
                />
                {errors.blood && <p className="text-red-500">โปรดกรอกข้อมูล กรุ๊บเลือด</p>}
                <label>โรคประจำตัว</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.information.disease}
                    name="disease"
                    ref={register({ required: true })}
                />
                {errors.disease && <p className="text-red-500">โปรดกรอกข้อมูล โรคประจำตัว</p>}
                <label>แพ้ยา</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.information.drugallergy}
                    name="drugallergy"
                    ref={register({ required: true })}
                />
                {errors.drugallergy && <p className="text-red-500">โปรดกรอกข้อมูล แพ้ยา</p>}
                <button
                    className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => setCurrent(prev => prev - 1)}
                >
                    ก่อนหน้า
                </button>
                <input type="submit" className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="ถัดไป" />
                <p className="text-red-500">*** คำเตือน การบันทึกข้อมูลชั่วคราวใช้สำหรับการบันทึกชั่วคราวเท่านั้น ต้องกรอกข้อมูลให้ครบทุกช่องเท่านั้นจึงสามารถจองห้องพักได้</p>
            </form> : ""
        },
        {
            key: 3,
            title: 'เพื่อนสนิท',
            content: form ? <form onSubmit={handleSubmit(handleFormFriend)} className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2>เพื่อนสนิท</h2>
                <label>ชื่อจริง</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.friend.friendName}
                    name="friendName"
                    ref={register({ required: true })}
                />{errors.friendName && <p className="text-red-500">โปรดกรอกข้อมูล ชื่อจริง</p>}
                <label>นามสกุล</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.friend.friendSurname}
                    name="friendSurname"
                    ref={register({ required: true })}
                />
                {errors.friendSurname && <p className="text-red-500">โปรดกรอกข้อมูล นามสกุล</p>}
                <label>ชื่อเล่น</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.friend.friendNickname}
                    name="friendNickname"
                    ref={register({ required: true })}
                />
                {errors.friendNickname && <p className="text-red-500">โปรดกรอกข้อมูล ชื่อเล่น</p>}
                <label>เบอร์โทร</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.friend.friendTel}
                    name="friendTel"
                    ref={register({ required: true })}
                />
                {errors.friendTel && <p className="text-red-500">โปรดกรอกข้อมูล เบอร์โทร</p>}
                <label>คณะ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.friend.friendFaculty}
                    name="friendFaculty"
                    ref={register({ required: true })}
                />
                {errors.friendFaculty && <p className="text-red-500">โปรดกรอกข้อมูล คณะ</p>}
                <label>สาขา/ภาควิชา</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.friend.friendDepartment}
                    name="friendDepartment"
                    ref={register({ required: true })}
                />
                {errors.friendDepartment && <p className="text-red-500">โปรดกรอกข้อมูล สาขา/ภาควิชา</p>}
                <button
                    className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => setCurrent(prev => prev - 1)}
                >
                    ก่อนหน้า
                </button>
                <input type="submit" className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="ถัดไป" />
                <p className="text-red-500">*** คำเตือน การบันทึกข้อมูลชั่วคราวใช้สำหรับการบันทึกชั่วคราวเท่านั้น ต้องกรอกข้อมูลให้ครบทุกช่องเท่านั้นจึงสามารถจองห้องพักได้</p>
            </form> : ""
        },
        {
            key: 4,
            title: 'ข้อมูลเกี่ยวกับครอบครัว (บิดา)',
            content: form ? <form onSubmit={handleSubmit(handleFormFamily.dad)} className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2>ข้อมูลเกี่ยวกับครอบครัว (บิดา)</h2>
                <label>ชื่อจริงบิดา</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.dad.dadName}
                    name="dadName"
                    ref={register({ required: true })}
                />
                {errors.dadName && <p className="text-red-500">โปรดกรอกข้อมูล ชื่อจริงบิดา</p>}
                <label>นามสกุล</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.dad.dadSurname}
                    name="dadSurname"
                    ref={register({ required: true })}
                />
                {errors.dadSurname && <p className="text-red-500">โปรดกรอกข้อมูล นามสกุล</p>}
                <label>อายุ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.dad.dadAge}
                    name="dadAge"
                    ref={register({ required: true })}
                />
                {errors.dadAge && <p className="text-red-500">โปรดกรอกข้อมูล อายุ</p>}
                <label>อาชีพ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.dad.dadCareer}
                    name="dadCareer"
                    ref={register({ required: true })}
                />
                {errors.dadCareer && <p className="text-red-500">โปรดกรอกข้อมูล อาชีพ</p>}
                <label>สถานที่ทำงาน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.dad.dadWorkplace}
                    name="dadWorkplace"
                    ref={register({ required: true })}
                />
                {errors.dadWorkplace && <p className="text-red-500">โปรดกรอกข้อมูล สถานที่ทำงาน</p>}
                <label>ตำแหน่ง</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.dad.dadPosition}
                    name="dadPosition"
                    ref={register({ required: true })}
                />
                {errors.dadPosition && <p className="text-red-500">โปรดกรอกข้อมูล ตำแหน่ง</p>}
                <label>รายได้/เดือน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.dad.dadIncome}
                    name="dadIncome"
                    ref={register({ required: true })}
                />
                {errors.dadIncome && <p className="text-red-500">โปรดกรอกข้อมูล รายได้/เดือน</p>}
                <label>เบอร์โทร</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.dad.dadTel}
                    name="dadTel"
                    ref={register({ required: true })}
                />
                {errors.dadTel && <p className="text-red-500">โปรดกรอกข้อมูล เบอร์โทร</p>}
                <label>ชื่อระบบเครือข่ายโทรศัพท์</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.dad.dadNetwork}
                    name="dadNetwork"
                    ref={register({ required: true })}
                />
                {errors.dadNetwork && <p className="text-red-500">โปรดกรอกข้อมูล ชื่อระบบเครือข่ายโทรศัพท์</p>}
                <button
                    className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => setCurrent(prev => prev - 1)}
                >
                    ก่อนหน้า
                </button>
                <input type="submit" className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="ถัดไป" />
                <p className="text-red-500">*** คำเตือน การบันทึกข้อมูลชั่วคราวใช้สำหรับการบันทึกชั่วคราวเท่านั้น ต้องกรอกข้อมูลให้ครบทุกช่องเท่านั้นจึงสามารถจองห้องพักได้</p>
            </form> : ""
        },
        {
            key: 5,
            title: "ข้อมูลเกี่ยวกับครอบครัว (มารดา)",
            content: form ? <form onSubmit={handleSubmit(handleFormFamily.mom)} className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <label>ชื่อจริงมารดา</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.mom.momName}
                    name="momName"
                    ref={register({ required: true })}
                />
                {errors.momName && <p className="text-red-500">โปรดกรอกข้อมูล ชื่อจริงมารดา</p>}
                <label>นามสกุล</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.mom.momSurname}
                    name="momSurname"
                    ref={register({ required: true })}
                />
                {errors.momSurname && <p className="text-red-500">โปรดกรอกข้อมูล นามสกุล</p>}
                <label>อายุ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.mom.momAge}
                    name="momAge"
                    ref={register({ required: true })}
                />
                {errors.momAge && <p className="text-red-500">โปรดกรอกข้อมูล อายุ</p>}
                <label>อาชีพ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.mom.momCareer}
                    name="momCareer"
                    ref={register({ required: true })}
                />
                {errors.momCareer && <p className="text-red-500">โปรดกรอกข้อมูล อาชีพ</p>}
                <label>สถานที่ทำงาน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.mom.momWorkplace}
                    name="momWorkplace"
                    ref={register({ required: true })}
                />
                {errors.momWorkplace && <p className="text-red-500">โปรดกรอกข้อมูล สถานที่ทำงาน</p>}
                <label>ตำแหน่ง</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.mom.momPosition}
                    name="momPosition"
                    ref={register({ required: true })}
                />
                {errors.momPosition && <p className="text-red-500">โปรดกรอกข้อมูล ตำแหน่ง</p>}
                <label>รายได้/เดือน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.mom.momIncome}
                    name="momIncome"
                    ref={register({ required: true })}
                />
                {errors.momIncome && <p className="text-red-500">โปรดกรอกข้อมูล รายได้/เดือน</p>}
                <label>เบอร์โทร</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.mom.momTel}
                    name="momTel"
                    ref={register({ required: true })}
                />
                {errors.momTel && <p className="text-red-500">โปรดกรอกข้อมูล เบอร์โทร</p>}
                <label>ชื่อระบบเครือข่ายโทรศัพท์</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.mom.momNetwork}
                    name="momNetwork"
                    ref={register({ required: true })}
                />
                {errors.momNetwork && <p className="text-red-500">โปรดกรอกข้อมูล ชื่อระบบเครือข่ายโทรศัพท์</p>}
                <button
                    className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => setCurrent(prev => prev - 1)}
                >
                    ก่อนหน้า
                </button>
                <input type="submit" className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="ถัดไป" />
                <p className="text-red-500">*** คำเตือน การบันทึกข้อมูลชั่วคราวใช้สำหรับการบันทึกชั่วคราวเท่านั้น ต้องกรอกข้อมูลให้ครบทุกช่องเท่านั้นจึงสามารถจองห้องพักได้</p>
            </form> : ""
        },
        {
            key: 6,
            title: "ข้อมูลเกี่ยวกับครอบครัว (ติดต่อฉุกเฉิน)",
            content: form ? <form onSubmit={handleSubmit(handleFormFamily.emergency)} className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <label>ติดต่อฉุกเฉิน</label>
                <label>ชื่อจริง</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.emergency.emergencyName}
                    name="emergencyName"
                    ref={register({ required: true })}
                />
                {errors.emergencyName && <p className="text-red-500">โปรดกรอกข้อมูล ชื่อจริง</p>}
                <label>สกุล</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.emergency.emergencySurname}
                    name="emergencySurname"
                    ref={register({ required: true })}
                />
                {errors.emergencySurname && <p className="text-red-500">โปรดกรอกข้อมูล สกุล</p>}
                <label>อายุ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.emergency.emergencyAge}
                    name="emergencyAge"
                    ref={register({ required: true })}
                />
                {errors.emergencyAge && <p className="text-red-500">โปรดกรอกข้อมูล อายุ</p>}
                <label>มีความเกี่ยวข้องเป็น</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.emergency.emergencyConcerned}
                    name="emergencyConcerned"
                    ref={register({ required: true })}
                />
                {errors.emergencyConcerned && <p className="text-red-500">โปรดกรอกข้อมูล มีความเกี่ยวข้องเป็น</p>}
                <label>อาชีพ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.emergency.emergencyCareer}
                    name="emergencyCareer"
                    ref={register({ required: true })}
                />
                {errors.emergencyCareer && <p className="text-red-500">โปรดกรอกข้อมูล อาชีพ</p>}
                <label>เบอร์โทร</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.emergency.emergencyTel}
                    name="emergencyTel"
                    ref={register({ required: true })}
                />
                {errors.emergencyTel && <p className="text-red-500">โปรดกรอกข้อมูล เบอร์โทร</p>}
                <label>ระบบเครือข่ายโทรศัพท์</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.family.emergency.emergencyNetwork}
                    name="emergencyNetwork"
                    ref={register({ required: true })}
                />
                {errors.emergencyNetwork && <p className="text-red-500">โปรดกรอกข้อมูล ระบบเครือข่ายโทรศัพท์</p>}
                <button
                    className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => setCurrent(prev => prev - 1)}
                >
                    ก่อนหน้า
                </button>
                <input type="submit" className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="ถัดไป" />
                <p className="text-red-500">*** คำเตือน การบันทึกข้อมูลชั่วคราวใช้สำหรับการบันทึกชั่วคราวเท่านั้น ต้องกรอกข้อมูลให้ครบทุกช่องเท่านั้นจึงสามารถจองห้องพักได้</p>
            </form> : ""
        },
        {
            key: 7,
            title: 'ข้อมูลอื่น ๆ',
            content: form ? <form onSubmit={handleSubmit(handleFormOther)} className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2>ข้อมูลอื่น ๆ</h2>
                <label>ความสามารถพิเศษ</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.other.otherTalent}
                    name="otherTalent"
                    ref={register({ required: true })}
                />
                {errors.otherTalent && <p className="text-red-500">โปรดกรอกข้อมูล ความสามารถพิเศษ</p>}
                <label>อุปนิสัยส่วนตัว</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.other.otherCharacter}
                    name="otherCharacter"
                    ref={register({ required: true })}
                />
                {errors.otherCharacter && <p className="text-red-500">โปรดกรอกข้อมูล อุปนิสัยส่วนตัว</p>}
                <label>เคยได้รับตำแหน่งใดในมหาวิทยาลัย/โรงเรียน</label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={form.other.otherPosition}
                    name="otherPosition"
                    ref={register({ required: true })}
                />
                {errors.otherPosition && <p className="text-red-500">โปรดกรอกข้อมูล เคยได้รับตำแหน่งใดในมหาวิทยาลัย/โรงเรียน</p>}
                <button
                    className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => setCurrent(prev => prev - 1)}
                >
                    ก่อนหน้า
                </button>
                <input type="submit" className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="ถัดไป" />
                <p className="text-red-500">*** คำเตือน การบันทึกข้อมูลชั่วคราวใช้สำหรับการบันทึกชั่วคราวเท่านั้น ต้องกรอกข้อมูลให้ครบทุกช่องเท่านั้นจึงสามารถจองห้องพักได้</p>
            </form> : ""
        },
        {
            key: 8,
            title: "กฎระเบียบการใช้งานหอพัก",
            content: form ? <div className="flex flex-col h-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3"></div>
                    <label className="md:w-2/3 block text-gray-500 font-bold">
                        <input
                            className="mr-2 leading-tight"
                            type="checkbox"
                            checked={form.agreement}
                            onChange={e => setForm({ ...form, agreement: e.target.checked })}
                        />
                        <span className="text-sm">
                            ยอมรับข้อตกลงหอพัก
                        </span>
                    </label>
                </div>
                <button
                    className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => setCurrent(prev => prev - 1)}
                >
                    ก่อนหน้า
                </button>
                <button
                    className="cursor-pointer mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => {
                        if (form.agreement) {
                            postData('saveAll')
                        }
                        else message.warning("โปรดอ่านและยอมรับกฎระเบียบของหอพัก")
                    }}
                >
                    บันทึกข้อมูลทั้งหมด (สามารถจองห้องได้)
                </button>
            </div> : ""
        }
    ]

    const getInitialProfile = async () => {
        if (cookies.token) {
            try {
                const studentProfile = await get(`/student/profile/${cookies.user.id}`)
                if (response.ok) {
                    setForm(studentProfile)
                }
            }
            catch (error) {
                console.error(error)
            }
        }
    }

    const handleFile = async (file) => {
        let data = new FormData()
        data.append('img', file)
        const resImg = await post(`/student/profile/upload/${cookies.user.id}`, data)
        if (resImg.success) {
            setImgUrl(resImg.message)
        }
    }

    useEffect(() => {
        verifyLogin()
        getInitialProfile()
    }, [])

    return (
        <div className="profile-container min-h-screen flex flex-col items-center px-4 py-4">
            <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content" key={steps[current].key}>{steps[current].content}</div>
        </div>
    )
}

export default profile
