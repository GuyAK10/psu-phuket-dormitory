import React, { useEffect, useContext, useState } from 'react'
import { LoginState } from '../../../utils/context'
import { useRouter } from 'next/router'
import axios from 'axios'
const Endpoint = process.env.END_POINT || 'http://localhost'

const profile = () => {
    const { Students } = useContext(LoginState)
    const [students, setStudents] = Students
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

    const router = useRouter()
    const { profileId } = router.query

    const getStudents = async () => {
        try {
            const result = await axios.get(`${Endpoint}/staff/profile/`)
            setStudents(result.data)
            filterStudent(result.data)
        } catch (e) {
            console.error(e)
        }
    }

    const filterStudent = (students) => {
        const studentFiltered = students.filter(item => item.studentId === profileId)
        setStudent(studentFiltered[0])
    }

    useEffect(() => {
        getStudents()
        console.log(student)
    }, [])

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

    const TableList = ({ data }) => {
        return <table class="table-auto">
            <thead>
                <tr>
                    <th class="px-4 py-2">หัวข้อ</th>
                    <th class="px-4 py-2">รายละเอียด</th>
                </tr>
            </thead>
            {
                data.map((item, key) =>

                    <tbody key={key}>
                        <tr>
                            <td class="border px-4 py-2 bg-gray-300">{Object.getOwnPropertyNames(item)[0]}</td>
                            <td class="border px-4 py-2">{Object.values(item)[0]}</td>
                        </tr>
                    </tbody>

                )
            }
        </table>
    }

    return (
        <div className="flex flex-row flex-wrap">
            {/* <button onClick={() => console.log(student)}>Std</button> */}
            <div>
                <div class="px-4 py-2 text-center">ข้อมูลเบื้องต้น</div>
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
            <div>
                <div class="px-4 py-2 text-center">ข้อมูลติดต่อ</div>
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
            <div>
                <div class="px-4 py-2 text-center">ข้อมูลการศึกษา</div>
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
            <div>
                <div class="px-4 py-2 text-center">เพื่อนสนิท</div>
                <TableList data={[
                    { "ชื่อจริง": friend.name },
                    { "นามสกุล": friend.surname },
                    { "ชื่อเล่น": friend.nickname },
                    { "เบอร์โทร": friend.tel },
                    { "คณะ": friend.faculty },
                    { "สาขา/ภาควิชา": friend.department },
                ]} />
            </div>
            <div>
                <div class="px-4 py-2 text-center">เกี่ยวกับครอบครัว</div>
                <div className="flex flex-row flex-no-wrap">
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

                    <TableList data={[
                        { "มีความเกี่ยวข้องเป็น": status },
                    ]} />

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
            <div>
                <div class="px-4 py-2 text-center">อื่น ๆ</div>
                <TableList data={[
                    { "ความสามารถพิเศษ": talent },
                    { "อุปนิสัยส่วนตัว": character },
                    { "เคยได้รับตำแหน่งในมหาวิทยาลัย/โรงเรียน": position },
                ]} />
            </div>
        </div>
    )
}

export default profile
