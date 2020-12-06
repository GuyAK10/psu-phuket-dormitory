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
    const [student, setStudent] = useState(null)
    //({
    //     profile: {
    //         id: "",
    //         name: "",
    //         surname: "",
    //         nickname: "",
    //         religion: "",
    //         race: "",
    //         nationality: "",
    //         birthday: "",
    //         faculty: "",
    //         department: "",
    //         line: ""
    //     },
    //     contact: {
    //         tel: "",
    //         network: "",
    //         email: "",
    //         facebook: "",
    //         houseno: "",
    //         village: "",
    //         villageno: "",
    //         road: "",
    //         subdistrict: "",
    //         district: "",
    //         province: "",
    //         postalcode: ""
    //     },
    //     information: {
    //         school: "",
    //         county: "",
    //         gpa: "",
    //         plan: "",
    //         height: "",
    //         weight: "",
    //         blood: "",
    //         disease: "",
    //         drugallergy: ""
    //     },
    //     friend: {
    //         name: "",
    //         surname: "",
    //         nickname: "",
    //         tel: "",
    //         faculty: "",
    //         department: ""
    //     },
    //     family: {
    //         dad: {
    //             name: "",
    //             surname: "",
    //             age: "",
    //             career: "",
    //             workplace: "",
    //             position: "",
    //             income: "",
    //             tel: "",
    //             network: ""
    //         },
    //         mom: {
    //             name: "",
    //             surname: "",
    //             age: "",
    //             career: "",
    //             workplace: "",
    //             position: "",
    //             income: "",
    //             tel: "",
    //             network: ""
    //         },
    //         emergency: {
    //             name: "",
    //             surname: "",
    //             age: "",
    //             concerned: "",
    //             career: "",
    //             tel: "",
    //             network: ""
    //         },
    //         status: ""
    //     },
    //     other: {
    //         talent: "",
    //         character: "",
    //         position: ""
    //     }
    // })

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

    const TableList = ({ data }) => {
        return <table className="table-auto">
            <thead>
                <tr>
                    <th className="px-4 py-2">หัวข้อ</th>
                    <th className="px-4 py-2">รายละเอียด</th>
                </tr>
            </thead>
            {
                data.map((item, key) =>

                    <tbody key={key}>
                        <tr>
                            <td className="border px-4 py-2 bg-gray-300">{Object.getOwnPropertyNames(item)[0]}</td>
                            <td className="border px-4 py-2">{Object.values(item)[0]}</td>
                        </tr>
                    </tbody>

                )
            }
        </table>
    }

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
                            {` ชื่อจริง ${student.friend.name} นามสกุล ${student.friend.surname} ชื่อเล่น ${student.friend.nickname} เบอร์โทร ${student.friend.tel} คณะ ${student.friend.faculty} สาขา/ภาควิชา ${student.friend.department}
                        `}
                        </p>
                    </div>
                    <div className="m-4">
                        <li>
                            เกี่ยวกับครอบครัว
                    </li>
                        <p>
                            {`ชื่อจริงบิดา ${student.family.dad.name} นามสกุล ${student.family.dad.surname} อายุ ${student.family.dad.age} สถานที่ทำงาน ${student.family.dad.workplace} ตำแหน่ง ${student.family.dad.position} สถานที่ ${student.family.dad.network} รายได้/เดือน ${student.family.dad.income} เบอร์โทร ${student.family.dad.tel} ชื่อระบบเครือข่ายโทรศัพท์ ${student.family.dad.tel}`}
                        </p>
                        <p>
                            {`ชื่อจริงมารดา ${student.family.mom.name} นามสกุล ${student.family.mom.surname} อายุ ${student.family.mom.age} สถานที่ทำงาน ${student.family.mom.workplace} ตำแหน่ง ${student.family.mom.position} สถานที่ ${student.family.mom.network} รายได้/เดือน ${student.family.mom.income} เบอร์โทร ${student.family.mom.tel} ชื่อระบบเครือข่ายโทรศัพท์ ${student.family.mom.tel}`}
                        </p>
                        <p>
                            {`มีความเกี่ยวข้องเป็น  ${student.family.status}`}
                        </p>
                        <p>
                            {`ติดต่อฉุกเฉินชื่อจริง ${student.family.emergency.name} สกุล ${student.family.emergency.surname} อายุ ${student.family.emergency.age} มีความเกี่ยวข้องเป็น ${student.family.emergency.concerned} อาชีพ ${student.family.emergency.career} เบอร์โทร ${student.family.emergency.tel} ระบบเครือข่ายโทรศัพท์ ${student.family.emergency.network}`}
                        </p>
                    </div>
                    <div className="m-4">
                        <li>
                            อื่น ๆ
                    </li>
                        <p>
                            {`ความสามารถพิเศษ ${student.other.talent} อุปนิสัยส่วนตัว ${student.other.character} เคยได้รับตำแหน่งในมหาวิทยาลัย/โรงเรียน ${student.other.position}`}
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

