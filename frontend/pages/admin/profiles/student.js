import React, { useEffect, useContext, useState } from 'react'
import { GlobalState } from '../../../utils/context'
import useFetch from 'use-http'
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const profile = ({ profileId }) => {
    const { AxiosConfig } = useContext(GlobalState)
    const [axiosConfig] = AxiosConfig
    const [headers, setHeaders] = useState({})

    const { get, loading } = useFetch(`${ENDPOINT}:${PORT}`, headers)
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
        <div className="flex flex-row flex-wrap justify-center">
            <div className="border-4 border-blue-500 mb-5">
                <div className="px-4 py-2 text-center border-4 border-blue-500">ข้อมูลเบื้องต้น</div>
                <TableList data={[
                    { "รหัสนักศึกษา": id },
                    { "ชื่อจริง": name },
                    { "นามสกุล": surname },
                    { "ชื่อเล่น": nickname },
                    { "ศาสนา": religion },
                    { "สัญชาติ": nationality },
                    { "เชื้อชาติ": race },
                    { "วัน/เดือน/ปีเกิด": birthday },
                    { "คณะ": faculty },
                    { "สาขา/ภาควิชา": department },
                    { "Line ID": line },
                    { "เบอร์โทรศัพท์": tel },
                    { "อีเมล์": email }
                ]} />
            </div>
            <div className="border-4 border-blue-500 mb-5">
                <div className="px-4 py-2 text-center border-4 border-blue-500">ข้อมูลติดต่อ</div>
                <TableList data={[
                    { "เบอร์โทร": tel },
                    { "อีเมล์": email },
                    { "ชื่อ Facebook": facebook },
                    { "ที่อยู่": network },
                    { "บ้านเลขที่": houseno },
                    { "หมู่บ้าน": village },
                    { "หมู่ที่": villageno },
                    { "ถนน": road },
                    { "ตำบล": district },
                    { "อำเภอ": subdistrict },
                    { "จังหวัด": province },
                    { "รหัสไปรษณีย์": postalcode },
                ]} />
            </div>
            <div className="border-4 border-blue-500 mb-5">
                <div className="px-4 py-2 text-center border-4 border-blue-500">ข้อมูลการศึกษา</div>
                <TableList data={[
                    { "จบจากโรงเรียน": school },
                    { "จังหวัด": county },
                    { "เกรดเฉลี่ย": gpa },
                    { "แผนการศึกษา": plan },
                    { "ส่วนสูง(ซ.ม.)": height },
                    { "น้ำหนัก(ก.ก.)": weight },
                    { "กรุ๊บเลือด": blood },
                    { "โรคประจำตัว": disease },
                    { "แพ้ยา": drugallergy }
                ]} />
            </div>
            <div className="border-4 border-blue-500 mb-5">
                <div className="px-4 py-2 text-center border-4 border-blue-500">เพื่อนสนิท</div>
                <TableList data={[
                    { "ชื่อจริง": friend.name },
                    { "นามสกุล": friend.surname },
                    { "ชื่อเล่น": friend.nickname },
                    { "เบอร์โทร": friend.tel },
                    { "คณะ": friend.faculty },
                    { "สาขา/ภาควิชา": friend.department },
                ]} />
            </div>
            <div className="border-4 border-blue-500">
                <div className="px-4 py-2 text-center border-4 border-blue-500">เกี่ยวกับครอบครัว</div>
                <div className="flex flex-row flex-no-wrap">
                    <div className="border-2 border-blue-500">
                        <TableList data={[
                            { "ชื่อจริงบิดา": dad.name },
                            { "นามสกุล": dad.surname },
                            { "อายุ": dad.age },
                            { "สถานที่ทำงาน": dad.workplace },
                            { "ตำแหน่ง": dad.position },
                            { "สถานที่": dad.network },
                            { "รายได้/เดือน": dad.income },
                            { "เบอร์โทร": dad.tel },
                            { "ชื่อระบบเครือข่ายโทรศัพท์": dad.tel },
                        ]} />
                    </div>
                    <div className="border-2 border-blue-500">
                        <TableList data={[
                            { "ชื่อจริงมารดา": mom.name },
                            { "นามสกุล": mom.surname },
                            { "อายุ": mom.age },
                            { "สถานที่ทำงาน": mom.workplace },
                            { "ตำแหน่ง": mom.position },
                            { "สถานที่": mom.network },
                            { "รายได้/เดือน": mom.income },
                            { "เบอร์โทร": mom.tel },
                            { "ชื่อระบบเครือข่ายโทรศัพท์": mom.tel },
                        ]} />
                    </div>
                    <div className="border-2 border-blue-500">
                        <TableList data={[
                            { "มีความเกี่ยวข้องเป็น": status },
                        ]} />
                    </div>
                    <div className="border-2 border-blue-500">
                        <TableList data={[
                            { "ติดต่อฉุกเฉินชื่อจริง": emergency.name },
                            { "สกุล": emergency.surname },
                            { "อายุ": emergency.age },
                            { "มีความเกี่ยวข้องเป็น": emergency.concerned },
                            { "อาชีพ": emergency.career },
                            { "เบอร์โทร": emergency.tel },
                            { "ระบบเครือข่ายโทรศัพท์": emergency.network },
                        ]} />
                    </div>
                </div>
            </div>
            <div className="border-4 border-blue-500">
                <div className="px-4 py-2 text-center border-4 border-blue-500">อื่น ๆ</div>
                <TableList data={[
                    { "ความสามารถพิเศษ": talent },
                    { "อุปนิสัยส่วนตัว": character },
                    { "เคยได้รับตำแหน่งในมหาวิทยาลัย/โรงเรียน": position },
                ]} />
            </div>
        </div>
    )
    else return <div>Loading</div>
}

profile.getInitialProps = async ({ query }) => {
    return {
        profileId: query.profileId,
    }
}

export default profile
