import React, { useEffect, useContext, useState, useRef } from 'react'
import { GlobalState } from '../utils/context'
import Router from 'next/router'
import useFetch from 'use-http'
import { useReactToPrint } from 'react-to-print';
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const ProfileResult = ({ profileId }) => {
    const { AxiosConfig, Modal, Token, MenuBar } = useContext(GlobalState)
    const [menuBar, setMenuBar] = MenuBar
    const [token, setToken] = Token
    const [showModal, setShowModal] = Modal
    const [axiosConfig] = AxiosConfig
    const [headers, setHeaders] = useState({})
    const { get, loading } = useFetch(`${ENDPOINT}:${PORT}/student`, { ...headers, cachePolicy: "no-cache" })
    const printRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });
    const [student, setStudent] = useState({
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

    const getStudents = async () => {
        try {
            if (!profileId) Router.push("login")
            else {
                const data = await get(`profile/${profileId}`)
                setStudent(data)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const getHeader = () => {
        if (sessionStorage.getItem('token'))
            setHeaders({
                headers: {
                    authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")).token}`,
                    type: JSON.parse(sessionStorage.getItem("token")).type
                },
                cachePolicy: "no-cache",
            })
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
    useEffect(() => {
        getHeader()
        verifyLogin()
        getStudents()
    }, [])

    if (student) return (
        <div className="container flex flex-col">
            <button
                className="w-32 m-5 self-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded self-start"
                onClick={handlePrint}
            >
                Print
            </button>
            <div ref={printRef} className="print-student text-black flex flex-col pt-10 pb-10 pr-16 pl-16">

                <img className="psuLogo self-center" src="../../icon/psuLogo.png" alt="psu logo" />

                <p className="text-center m-4">สำนักงานหอพักนักศึกษาชาย มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตภูเก็ต</p>

                <div className="text-center border-2 p-2 m-2">ทะเบียนประวัตินักศึกษาชาย</div>
                <ul className="list-disc flex flex-col">
                    {
                        student.profile.profileImg ? <img className="w-24 h-32 self-center" src={`${ENDPOINT}:${PORT}${student.profile.profileImg}`} alt="profileImg" />
                            :
                            <img className="w-24 h-32 self-center" src="icon/mockProfile.png" alt="error loading profile image" />
                    }
                    <div className="m-4">
                        <li>
                            ข้อมูลเบื้องต้นของนักศึกษา
                    </li>
                        <p>
                            {`ชื่อ-สกุล ${student.profile.name} ${student.profile.surname} ชื่อเล่น ${student.profile.nickname} ศาสนา ${student.profile.religion} เชื้อชาติ ${student.profile.race} สัญชาติ ${student.profile.nationality} วัน/เดือน/ปีเกิด ${student.profile.birthday} คณะ ${student.profile.faculty} สาขา/ภาควิชา ${student.profile.department} Line ID ${student.profile.line} เบอร์โทรศัพท์ ${student.profile.tel} อีเมล์ ${student.profile.email}`}
                        </p>
                    </div>
                    <div className="m-4">
                        <li>
                            ข้อมูลติดต่อ
                    </li>
                        <p>
                            {`เบอร์โทร ${student.contact.tel} อีเมล์ ${student.contact.email} ชื่อ facebook ${student.contact.facebook} ที่อยู่ ${student.contact.network} บ้านเลขที่ ${student.contact.houseno} หมู่บ้าน ${student.contact.village} หมู่ที่ ${student.contact.villageno} ถนน ${student.contact.road} ตำบล ${student.contact.district} อำเภอ ${student.contact.subdistrict} จังหวัด ${student.contact.province} รหัสไปรษณีย์ ${student.contact.postalcode}`}
                        </p>
                    </div>
                    <div className="m-4">
                        <li>
                            ข้อมูลการศึกษา
                    </li>
                        <p>{`จบจากโรงเรียน ${student.information.school} จังหวัด ${student.information.county} เกรดเฉลี่ย ${student.information.gpa} แผนการศึกษา ${student.information.plan} ส่วนสูง(ซ.ม.) ${student.information.height}  น้ำหนัก(ก.ก.) ${student.information.weight} กรุ๊บเลือด ${student.information.blood} โรคประจำตัว ${student.information.disease} แพ้ยา ${student.information.drugallergy}          
                    `}
                        </p>
                    </div>
                    <div className="m-4">
                        <li>
                            เพื่อนสนิท
                    </li>
                        <p>
                            {` ชื่อจริง ${student.friend.friendName} นามสกุล ${student.friend.friendSurname} ชื่อเล่น ${student.friend.friendNickname} เบอร์โทร ${student.friend.friendTel} คณะ ${student.friend.friendFaculty} สาขา/ภาควิชา ${student.friend.friendDepartment}
                        `}
                        </p>
                    </div>
                    <div className="m-4">
                        <li>
                            เกี่ยวกับครอบครัว
                    </li>
                        <p>
                            {`ชื่อจริงบิดา ${student.family.dad.dadName} นามสกุล ${student.family.dad.dadSurname} อายุ ${student.family.dad.dadAge} สถานที่ทำงาน ${student.family.dad.dadWorkplace} ตำแหน่ง ${student.family.dad.dadPosition} สถานที่ ${student.family.dad.dadNetwork} รายได้/เดือน ${student.family.dad.dadIncome} เบอร์โทร ${student.family.dad.dadTel} ชื่อระบบเครือข่ายโทรศัพท์ ${student.family.dad.dadTel}`}
                        </p>
                        <p>
                            {`ชื่อจริงมารดา ${student.family.mom.momName} นามสกุล ${student.family.mom.momSurname} อายุ ${student.family.mom.momAge} สถานที่ทำงาน ${student.family.mom.momWorkplace} ตำแหน่ง ${student.family.mom.momPosition} สถานที่ ${student.family.mom.momNetwork} รายได้/เดือน ${student.family.mom.momIncome} เบอร์โทร ${student.family.mom.momTel} ชื่อระบบเครือข่ายโทรศัพท์ ${student.family.mom.momTel}`}
                        </p>
                        <p>
                            {`มีความเกี่ยวข้องเป็น  ${student.family.status}`}
                        </p>
                        <p>
                            {`ติดต่อฉุกเฉินชื่อจริง ${student.family.emergency.emergencyName} สกุล ${student.family.emergency.emergencySurname} อายุ ${student.family.emergency.emergencyAge} มีความเกี่ยวข้องเป็น ${student.family.emergency.emergencyConcerned} อาชีพ ${student.family.emergency.emergencyCareer} เบอร์โทร ${student.family.emergency.emergencyTel} ระบบเครือข่ายโทรศัพท์ ${student.family.emergency.emergencyNetwork}`}
                        </p>
                    </div>
                    <div className="m-4">
                        <li>
                            อื่น ๆ
                    </li>
                        <p>
                            {`ความสามารถพิเศษ ${student.other.otherTalent} อุปนิสัยส่วนตัว ${student.other.otherCharacter} เคยได้รับตำแหน่งในมหาวิทยาลัย/โรงเรียน ${student.other.otherPosition}`}
                        </p>
                    </div>
                </ul>
            </div>
        </div>
    )
    else return <div>Loading</div>
}

ProfileResult.getInitialProps = async ({ query }) => {
    return {
        profileId: query.profileId,
    }
}

export default ProfileResult

