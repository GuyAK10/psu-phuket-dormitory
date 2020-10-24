import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { students as stds } from '../../../utils/recoil'
import { useRecoilState } from 'recoil'
const Profile = () => {
    const [students, setStudents] = useRecoilState(stds)
    const router = useRouter()
    const { profile } = router.query

    useEffect(() => {
        console.log(students)
    }, [])

    return (
        <div>
            {profile}
        </div>
    )
}

export default Profile
