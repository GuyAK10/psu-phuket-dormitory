import React, { useEffect, useContext, useState, useRef } from 'react'
import { GlobalState } from '../../../utils/context'
import Router from 'next/router'
import { useReactToPrint } from 'react-to-print';
const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const Profile = ({ profileId }) => {
    const { get } = useContext(GlobalState)
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
            line: "",
            profileImg: ""
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
    const [isProfileFail, setProfileFail] = useState(true)
    const getStudents = async () => {
        try {
            const data = await get(`staff/profile`)
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

    return (
        <div className="container flex flex-col">
            <button
                className="w-32 m-5 self-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded self-start"
                onClick={handlePrint}
            >
                Print
            </button>
            <div ref={printRef} className="print-student text-black flex flex-col pt-8 pb-8 pr-16 pl-16">

                <img className="psuLogo self-center" src="../../icon/psuLogo.png" alt="psu logo" />

                <p className="text-center m-2">สำนักงานหอพักนักศึกษาชาย มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตภูเก็ต</p>

                <div className="text-center border-2 p-2 m-2">ทะเบียนประวัตินักศึกษาชาย}</div>
                <ul className="list-disc flex flex-col">
                {
                        isProfileFail ? <img className="w-24 h-32 self-center" src={`${ENDPOINT}${PORT}/staff/profile/picture/${student.profile.id}`} onError={() => setProfileFail(false)} alt="profileImg" />
                            :
                            <img className="w-24 h-32 self-center" src="icon/mockProfile.png" alt="error loading profile image" />
                    }
                    <div className="m-2">
                        <li className="font-bold">
                            ข้อมูลเบื้องต้นของนักศึกษา
                        </li>
                        <p>
                            ชื่อ-สกุล <p className="border-dotted border-b-2 border-black inline">{student.profile.name} {student.profile.surname}</p> ชื่อเล่น <p className="border-dotted border-b-2 border-black inline">{student.profile.nickname}</p> ศาสนา <p className="border-dotted border-b-2 border-black inline">{student.profile.religion}</p> เชื้อชาติ <p className="border-dotted border-b-2 border-black inline">{student.profile.race}</p> สัญชาติ <p className="border-dotted border-b-2 border-black inline">{student.profile.nationality}</p> วัน/เดือน/ปีเกิด <p className="border-dotted border-b-2 border-black inline">{student.profile.birthday}</p> คณะ <p className="border-dotted border-b-2 border-black inline">{student.profile.faculty}</p> สาขา/ภาควิชา <p className="border-dotted border-b-2 border-black inline">{student.profile.department}</p> Line ID <p className="border-dotted border-b-2 border-black inline">{student.profile.line}</p>
                        </p>
                    </div>
                    <div className="m-2">
                        <li className="font-bold">
                            ข้อมูลติดต่อ
                        </li>
                        <p>
                            เบอร์โทร <p className="border-dotted border-b-2 border-black inline">{student.contact.tel}</p> อีเมล์ <p className="border-dotted border-b-2 border-black inline">{student.contact.email}</p> ชื่อ facebook <p className="border-dotted border-b-2 border-black inline">{student.contact.facebook}</p> ที่อยู่ <p className="border-dotted border-b-2 border-black inline">{student.contact.network}</p> บ้านเลขที่ <p className="border-dotted border-b-2 border-black inline">{student.contact.houseno}</p> หมู่บ้าน <p className="border-dotted border-b-2 border-black inline">{student.contact.village}</p> หมู่ที่ <p className="border-dotted border-b-2 border-black inline">{student.contact.villageno}</p> ถนน <p className="border-dotted border-b-2 border-black inline">{student.contact.road}</p> ตำบล <p className="border-dotted border-b-2 border-black inline">{student.contact.district}</p> อำเภอ <p className="border-dotted border-b-2 border-black inline">{student.contact.subdistrict}</p> จังหวัด <p className="border-dotted border-b-2 border-black inline">{student.contact.province}</p> รหัสไปรษณีย์ <p className="border-dotted border-b-2 border-black inline">{student.contact.postalcode}</p>
                        </p>
                    </div>
                    <div className="m-2">
                        <li className="font-bold">
                            ข้อมูลการศึกษา
                        </li>
                        <p>จบจากโรงเรียน <p className="border-dotted border-b-2 border-black inline">{student.information.school}</p> จังหวัด <p className="border-dotted border-b-2 border-black inline">{student.information.county}</p> เกรดเฉลี่ย <p className="border-dotted border-b-2 border-black inline">{student.information.gpa}</p> แผนการศึกษา <p className="border-dotted border-b-2 border-black inline">{student.information.plan}</p> ส่วนสูง (ซ.ม.) <p className="border-dotted border-b-2 border-black inline">{student.information.height}</p>  น้ำหนัก (ก.ก.) <p className="border-dotted border-b-2 border-black inline">{student.information.weight}</p> กรุ๊บเลือด <p className="border-dotted border-b-2 border-black inline">{student.information.blood}</p> โรคประจำตัว <p className="border-dotted border-b-2 border-black inline">{student.information.disease}</p> แพ้ยา <p className="border-dotted border-b-2 border-black inline">{student.information.drugallergy}</p></p>
                    </div>
                    <div className="m-2">
                        <li className="font-bold">
                            เพื่อนสนิท
                        </li>
                        <p>
                            ชื่อจริง <p className="border-dotted border-b-2 border-black inline">{student.friend.friendName}</p> นามสกุล <p className="border-dotted border-b-2 border-black inline">{student.friend.friendSurname}</p> ชื่อเล่น <p className="border-dotted border-b-2 border-black inline">{student.friend.friendNickname}</p> เบอร์โทร <p className="border-dotted border-b-2 border-black inline">{student.friend.friendTel}</p> คณะ <p className="border-dotted border-b-2 border-black inline">{student.friend.friendFaculty}</p> สาขา/ภาควิชา <p className="border-dotted border-b-2 border-black inline">{student.friend.friendDepartment}</p>
                        </p>
                    </div>
                    <div className="m-2">
                        <li className="font-bold">
                            เกี่ยวกับครอบครัว
                        </li>
                        <p className="font-semibold my-1">
                            เกี่ยวกับบิดา
                        </p>
                        ชื่อจริงบิดา<p className="border-dotted border-b-2 border-black inline">{student.family.dad.dadName}</p> นามสกุล <p className="border-dotted border-b-2 border-black inline">{student.family.dad.dadSurname}</p> อายุ <p className="border-dotted border-b-2 border-black inline">{student.family.dad.dadAge}</p> สถานที่ทำงาน <p className="border-dotted border-b-2 border-black inline">{student.family.dad.dadWorkplace}</p> ตำแหน่ง <p className="border-dotted border-b-2 border-black inline">{student.family.dad.dadPosition}</p> รายได้/เดือน <p className="border-dotted border-b-2 border-black inline">{student.family.dad.dadIncome}</p> เบอร์โทร <p className="border-dotted border-b-2 border-black inline">{student.family.dad.dadTel}</p> ชื่อระบบเครือข่ายโทรศัพท์ <p className="border-dotted border-b-2 border-black inline">{student.family.dad.dadNetwork}</p>
                        <p className="font-semibold my-1">
                            เกี่ยวกับมารดา
                        </p>
                        ชื่อจริงมารดา<p className="border-dotted border-b-2 border-black inline">{student.family.mom.momName}</p> นามสกุล <p className="border-dotted border-b-2 border-black inline">{student.family.mom.momSurname}</p> อายุ <p className="border-dotted border-b-2 border-black inline">{student.family.mom.momAge}</p> สถานที่ทำงาน <p className="border-dotted border-b-2 border-black inline">{student.family.mom.momWorkplace}</p> ตำแหน่ง <p className="border-dotted border-b-2 border-black inline">{student.family.mom.momPosition}</p>รายได้/เดือน <p className="border-dotted border-b-2 border-black inline">{student.family.mom.momIncome}</p> เบอร์โทร <p className="border-dotted border-b-2 border-black inline">{student.family.mom.momTel}</p> ชื่อระบบเครือข่ายโทรศัพท์ <p className="border-dotted border-b-2 border-black inline">{student.family.mom.momNetwork}</p>
                        <p className="font-semibold my-1">
                            ติดต่อฉุกเฉิน
                        </p>
                            ชื่อจริง <p className="border-dotted border-b-2 border-black inline">{student.family.emergency.emergencyName}</p> สกุล <p className="border-dotted border-b-2 border-black inline">{student.family.emergency.emergencySurname}</p> อายุ <p className="border-dotted border-b-2 border-black inline">{student.family.emergency.emergencyAge}</p> มีความเกี่ยวข้องเป็น <p className="border-dotted border-b-2 border-black inline">{student.family.emergency.emergencyConcerned}</p> อาชีพ <p className="border-dotted border-b-2 border-black inline">{student.family.emergency.emergencyCareer}</p> เบอร์โทร <p className="border-dotted border-b-2 border-black inline">{student.family.emergency.emergencyTel}</p> ระบบเครือข่ายโทรศัพท์ <p className="border-dotted border-b-2 border-black inline">{student.family.emergency.emergencyNetwork}</p>
                        <p className="font-semibold">
                            มีความเกี่ยวข้องเป็น
                        </p>
                        <p className="border-dotted border-b-2 border-black inline">{student.family.status}</p>
                    </div>
                    <div className="m-2">
                        <li className="font-bold">
                            อื่น ๆ
                        </li>
                        <p>
                            ความสามารถพิเศษ <p className="border-dotted border-b-2 border-black inline">{student.other.otherTalent}</p> อุปนิสัยส่วนตัว <p className="border-dotted border-b-2 border-black inline">{student.other.otherCharacter}</p> เคยได้รับตำแหน่งในมหาวิทยาลัย/โรงเรียน <p className="border-dotted border-b-2 border-black inline">{student.other.otherPosition}</p>
                        </p>
                    </div>
                </ul>
            </div>
        </div>
    )
}

Profile.getInitialProps = async ({ query }) => {
    return {
        profileId: query.profileId,
    }
}

export default Profile
