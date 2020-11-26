import React, { useEffect, useContext, useState, useRef } from 'react'
import { GlobalState } from '../../../utils/context'
import useFetch from 'use-http'
import { useReactToPrint } from 'react-to-print';
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const Profile = ({ profileId }) => {
    const { AxiosConfig } = useContext(GlobalState)
    const [axiosConfig] = AxiosConfig
    const [headers, setHeaders] = useState({})
    const { get, loading } = useFetch(`${ENDPOINT}:${PORT}`, headers)
    const printRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });
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

    const {
        profile:
        { id, name, surname, nickname, religion, race, nationality, birthday, faculty, department, line },
        contact:
        { tel, email, facebook, network, houseno, village, villageno, road, district, subdistrict, province, postalcode },
        information:
        { school, county, gpa, plan, height, weight, blood, disease, drugallergy },
        friend,
        family:
        { dad, mom, status, emergency },
        other:
        { talent, character, position },
    } = student

    const getStudents = async () => {
        try {
            const data = await get(`/staff/profile/`)
            filterStudent(data)
        } catch (e) {
            console.error(e)
        }
    }

    const filterStudent = (students) => {
        const studentFiltered = students.filter(item => item.studentId === profileId)
        setStudent(studentFiltered[0])
    }

    useEffect(() => {
        setHeaders({
            headers: {
                authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")).token}`,
                type: JSON.parse(sessionStorage.getItem("token")).type
            },
            cachePolicy: "no-cache",
        })
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

    if (!loading) return (
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
                <ul className="list-disc">
                    <div className="m-4">
                        <li>
                            ข้อมูลเบื้องต้นของนักศึกษา
                    </li>
                        <p>
                            {`ชื่อ-สกุล ${name} ${surname} ชื่อเล่น ${nickname} ศาสนา ${religion} เชื้อชาติ ${race} สัญชาติ ${nationality} วัน/เดือน/ปีเกิด ${birthday} คณะ ${faculty} สาขา/ภาควิชา ${department} Line ID ${line} เบอร์โทรศัพท์ ${tel} อีเมล์ ${email}`}
                        </p>
                    </div>
                    <div className="m-4">
                        <li>
                            ข้อมูลติดต่อ
                    </li>
                        <p>
                            {`เบอร์โทร ${tel} อีเมล์ ${email} ชื่อ facebook ${facebook} ที่อยู่ ${network} บ้านเลขที่ ${houseno} หมู่บ้าน ${village} หมู่ที่ ${villageno} ถนน ${road} ตำบล ${district} อำเภอ ${subdistrict} จังหวัด ${province} รหัสไปรษณีย์ ${postalcode}`}
                        </p>
                    </div>
                    <div className="m-4">
                        <li>
                            ข้อมูลการศึกษา
                    </li>
                        <p>{`จบจากโรงเรียน ${school} จังหวัด ${county} เกรดเฉลี่ย ${gpa} แผนการศึกษา ${plan} ส่วนสูง(ซ.ม.) ${height}  น้ำหนัก(ก.ก.) ${weight} กรุ๊บเลือด ${blood} โรคประจำตัว ${disease} แพ้ยา ${drugallergy}          
                    `}
                        </p>
                    </div>
                    <div className="m-4">
                        <li>
                            เพื่อนสนิท
                    </li>
                        <p>
                            {` ชื่อจริง ${friend.name} นามสกุล ${friend.surname} ชื่อเล่น ${friend.nickname} เบอร์โทร ${friend.tel} คณะ ${friend.faculty} สาขา/ภาควิชา ${friend.department}
                        `}
                        </p>
                    </div>
                    <div className="m-4">
                        <li>
                            เกี่ยวกับครอบครัว
                    </li>
                        <p>
                            {`ชื่อจริงบิดา ${dad.name} นามสกุล ${dad.surname} อายุ ${dad.age} สถานที่ทำงาน ${dad.workplace} ตำแหน่ง ${dad.position} สถานที่ ${dad.network} รายได้/เดือน ${dad.income} เบอร์โทร ${dad.tel} ชื่อระบบเครือข่ายโทรศัพท์ ${dad.tel}`}
                        </p>
                        <p>
                            {`ชื่อจริงมารดา ${mom.name} นามสกุล ${mom.surname} อายุ ${mom.age} สถานที่ทำงาน ${mom.workplace} ตำแหน่ง ${mom.position} สถานที่ ${mom.network} รายได้/เดือน ${mom.income} เบอร์โทร ${mom.tel} ชื่อระบบเครือข่ายโทรศัพท์ ${mom.tel}`}
                        </p>
                        <p>
                            {`มีความเกี่ยวข้องเป็น  ${status}`}
                        </p>
                        <p>
                            {`ติดต่อฉุกเฉินชื่อจริง${emergency.name} สกุล${emergency.surname} อายุ${emergency.age} มีความเกี่ยวข้องเป็น${emergency.concerned} อาชีพ${emergency.career} เบอร์โทร${emergency.tel} ระบบเครือข่ายโทรศัพท์${emergency.network}`}
                        </p>
                    </div>
                    <div className="m-4">
                        <li>
                            อื่น ๆ
                    </li>
                        <p>
                            {`ความสามารถพิเศษ ${talent} อุปนิสัยส่วนตัว ${character} เคยได้รับตำแหน่งในมหาวิทยาลัย/โรงเรียน ${position}`}
                        </p>
                    </div>
                </ul>
            </div>
        </div>
    )
    else return <div>Loading</div>
}

Profile.getInitialProps = async ({ query }) => {
    return {
        profileId: query.profileId,
    }
}

export default Profile
