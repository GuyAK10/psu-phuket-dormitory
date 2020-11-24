const express = require('express');
const { db, admin } = require('../configs/firebase')
const router = express.Router()
const { firestore } = admin
const FieldValue = firestore.FieldValue

const bookInfomation = async (profileData, checkCase) => {
    try {
        const floors = [
            "floorA",
            "floorB",
            "floorC",
            "floorD",
            "floorE",
            "floorF",
            "floorG",
            "floorH"
        ]

        const orderId = [
            "student1",
            "student2"
        ]

        let booked = false;

        for (var a in floors) {
            var b = floors[a];
            const roomRef = db.collection(b)
            for (c in orderId) {
                var d = orderId[c]
                const result = await roomRef.where(`${d}.id`, "==", profileData.profile.id).get()

                if (!result.empty && checkCase === "reserve") {
                    booked = true
                    return booked
                }
                else if (!result.empty && checkCase === "myroom") {
                    result.forEach((room) => {
                        const roomData = {
                            roomId: '',

                        }
                        roomData.roomId = room.id
                        Object.assign(roomData, room.data())
                        booked = roomData
                        return booked
                    })

                }
            }
        }
        return booked
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

const bookingRoom = (bookRoom, floorId, roomId, orderId, res) => {
    try {
        const bookRef = db.collection(floorId).doc(roomId)
        if (!bookRef.exists && orderId == "student1") {
            bookRef.update({ student1: bookRoom }, { merge: true })
            console.log("booking student1 success")
            res.status(200).send({ code: 200, success: true, message: "booking student1 success" });
        }
        else if (!bookRef.exists && orderId == "student2") {
            bookRef.set({ student2: bookRoom }, { merge: true })
            console.log("booking student2 success")
            res.status(200).send({ code: 200, success: true, message: "booking student2 success" });
        }
        else if (bookRef.exists && orderId == "student1") {
            bookRef.update({ student1: bookRoom })
            console.log("booking student1 success")
            res.status(200).send({ code: 200, success: true, message: "booking student1 success" });
        }
        else if (bookRef.exists && orderId == "student2") {
            bookRef.update({ student1: bookRoom })
            console.log("booking student2 success")
            res.status(200).send({ code: 200, success: true, message: "booking student2 success" });
        }
        else {
            console.log("booking failed")
            res.status(400).send({ code: 200, success: false, message: "booking failed" });
        }
    } catch (error) {
        console.log(error)
        throw error
    }

}

router.post('/student/room', async (req, res) => {
    try {
        const { body: { floorId, roomId, studentId, orderId } } = req

        const profileRef = db.collection('students').doc(`${studentId}`)

        const studentRef = await profileRef.get()
        if (!studentRef.exists) {
            res.status(200).send({ code: 200, success: false, message: "กรุณาบันทึกข้อมูลผู้ใช้ก่อน" })
        }
        else {
            const profileData = studentRef.data()
            const bookRoom = {
                id: profileData.profile.id,
                name: profileData.profile.name,
                surname: profileData.profile.surname,
                nickname: profileData.profile.nickname,
                tel: profileData.contact.tel
            }
            const checkCase = "reserve"
            const isBooked = await bookInfomation(profileData, checkCase)
            if (isBooked) {
                res.status(200).send({ code: 200, success: false, message: "ผู้ใช้จองแล้ว กรุณายกเลิกการจองห้องครั้งก่อน แล้วทำการจองอีกครั้ง" })
            } else if (!isBooked) {
                bookingRoom(bookRoom, floorId, roomId, orderId, res)
            }
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
})

router.get('/student/room/:floorId', async (req, res) => {
    try {
        const floorId = req.params.floorId
        const checkRef = db.collection('dormitory').doc('status');
        const checkStatus = await checkRef.get()
        const check = Object.values(checkStatus.data())
        const checkDormitory = check[0]
        if (checkDormitory) {
            const docRef = db.collection(`${floorId}`);
            const roomRef = await docRef.get()
            let result = [];

            roomRef.forEach(floors => {
                let floorList = {
                    floorId: '',
                }

                floorList.floorId = floors.id
                Object.assign(floorList, floors.data())
                result.push(floorList)

            })
            res.status(200).send({
                ...result,
            });
        } else {
            console.log("ระบบยังไม่เปิดจอง")
            res.status(200).send("ระบบยังไม่เปิดจอง");;
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(400);
    }
});

router.get('/student/room/myRoom/:studentId', async (req, res) => {
    try {

        const { params: { studentId } } = req
        const floor = ['floorA', 'floorB', 'floorC', 'floorD', 'floorE', 'floorF', 'floorG', 'floorH']

        const [findStudent] = await Promise.all(
            floor.map(async item => {
                const roomRef = await db.collection(item).listDocuments()
                const student = await Promise.all(
                    roomRef.map(async data => {
                        const result = await data.get()
                        if (result.data().student1) {
                            if (result.data().student1.id == studentId) {
                                return { roomId: result.id, profileData: result.data() }
                            }
                        }
                        else if (result.data().student2) {
                            if (result.data().student2.id == studentId) {
                                return { roomId: result.id, profileData: result.data() }
                            }
                        }
                    })
                )
                if (student) return student
            })
        )
        const [student] = findStudent.filter(notUndefined => notUndefined !== undefined)

        if (student) res.status(200).send({ code: 200, success: true, message: "พบข้อมูลการจองห้อง", data: student })
        else res.status(200).send({ code: 200, success: false, message: "ไม่พบข้อมูลการจองห้อง" })

    } catch (e) {
        console.error(e)
    }
})

router.get('/student/room/', async (req, res) => {
    try {
        const profileData = {
            profile: {
                id: req.body.studentId
            }
        }
        const checkCase = "myroom"
        const room = await bookInfomation(profileData, checkCase)
        if (room == false) {
            res.status(200).send({ code: 200, success: false, message: "ไม่มีการจองห้องพักในระบบ" })
        } else {
            res.send(room);
        }

    } catch (error) {
        console.error(error)
        res.sendStatus(400);
    }
});

router.post('/student/room/remove', async (req, res) => {
    try {
        const { body: { floorId, roomId, studentId, orderId } } = req
        const profileRef = db.doc(`${floorId}/${roomId}`);
        await profileRef.get().then(async data => {
            if (data.data()[orderId].id === studentId) {
                await profileRef.update({ [orderId]: FieldValue.delete() })
                console.log("deleted")
                res.status(200).send({ code: 200, success: true, message: "deleted" })
            }
            else {
                console.log("ไม่สามารถยกเลิกการจองของผู้อื่นได้")
                res.status(200).send({ code: 200, success: false, message: "ไม่สามารถยกเลิกการจองของผู้อื่นได้" })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(200).send({ code: 200, success: false, message: "ผิดพลาดกรุณาเข้าสู่ระบบอีกครั้ง" })

    }
})

module.exports = router;