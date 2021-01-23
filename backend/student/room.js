const express = require('express');
const { db, admin } = require('../configs/firebase')
const router = express.Router()
const { firestore } = admin
const FieldValue = firestore.FieldValue

const myRoom = async (studentId) => {
    try {
        const order = [
            "student1",
            "student2"
        ]
        let booked = false;
        const dormitory = db.collection("dormitory")
        const status = await dormitory.doc("status").get()
        const semester = status.data().semester
        const year = status.data().year
        await Promise.all(order.map(async (orderId) => {
            const reserveRef = await dormitory.where("year", "==", year).where("semester", "==", semester).where(`${orderId}.id`, "==", studentId).get()
            if (!reserveRef.empty) {
                reserveRef.forEach((room) => {
                    const roomData = {
                        docID: '',
                    }
                    roomData.docID = room.id
                    Object.assign(roomData, room.data())
                    booked = roomData
                    return booked
                })
            }
        }))
        return booked
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

const reserveInfomation = async (profileData, year, semester) => {
    try {
        const order = [
            "student1",
            "student2"
        ]
        let booked = false;
        await Promise.all(order.map(async (orderId) => {
            const reserveRef = await db.collection('dormitory').where("year", "==", year).where("semester", "==", semester).where(`${orderId}.id`, "==", profileData.profile.id).get()
            if (!reserveRef.empty) {
                booked = true
                return booked
            }
        }))
        return booked
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

const bookingRoom = async (bookRoom, roomId, orderId, year, semester, res) => {
    try {
        const studentRef = db.collection('students').doc(`${bookRoom.id}`)
        const bookRef = db.collection('dormitory').doc(`${year}-${semester}-${roomId}`)
        const available = (await bookRef.get()).data().available
        if (!available) {
            res.status(200).send({ code: 200, success: false, message: "ไม่สามารถจองห้องได้เนื่องจากห้องนี้ปิดการจองโดยเจ้าหน้าที่" });
        }
        else if (orderId == "student1" || orderId == "student2") {
            await bookRef.set({
                [orderId]: bookRoom
            }, { merge: true })
            if (semester == 1) {
                await studentRef.update({
                    historyRoom: FieldValue.delete()
                })
                await studentRef.update({
                    historyRoom: FieldValue.arrayUnion({
                        year: year,
                        semester: semester,
                        room: roomId
                    })
                })
            } else {
                await studentRef.update({
                    historyRoom: FieldValue.arrayUnion({
                        year: year,
                        semester: semester,
                        room: roomId
                    })
                })
            }
            console.log("booking student1 success")
            res.status(200).send({ code: 200, success: true, message: "จองห้องสำเร็จ" });
        }
        else {
            console.log("booking failed")
            res.status(400).send({ code: 200, success: false, message: "จองห้องไม่สำเร็จโปรดติดต่อเจ้าหน้าที่" });
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

router.post('/student/room', async (req, res) => {
    try {
        const { body: { roomId, studentId, orderId } } = req
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
            const status = await db.collection("dormitory").doc("status").get()
            const semester = status.data().semester
            const year = status.data().year
            const isBooked = await reserveInfomation(profileData, year, semester)
            if (isBooked) {
                res.status(200).send({ code: 200, success: false, message: "ผู้ใช้จองแล้ว กรุณายกเลิกการจองห้องครั้งก่อน แล้วทำการจองอีกครั้ง" })
            } else if (!isBooked) {
                await bookingRoom(bookRoom, roomId, orderId, year, semester, res)
            }
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
})

//check is fill prefile
router.get('/student/room/isFill/:studentId', async (req, res) => {
    const { params: { studentId } } = req
    const profileRef = await db.collection('students').doc(`${studentId}`).get()
    if (!profileRef.data().agreement) {
        res.send({ code: 200, success: false, message: "กรุณากรอกข้อมูลส่วนตัวให้ครบก่อนจองห้อง ระบบจะนำคุณไปยังหน้ากรอกข้อมูล" })
    }
    else res.send({ code: 200, success: true, message: "สามารถจองห้องได้" })
})



router.get('/student/room/system', async (req, res) => {
    try {
        const docRef = await db.doc(`dormitory/status`).get()
        if (docRef.exists) {
            if (docRef.data())
                res.status(200).send({ code: 200, success: true, message: `ระบบเปิดการจอง`, data: docRef.data() });
            else
                res.status(200).send({ code: 200, success: true, message: `ระบบไม่เปิดการจอง`, data: docRef.data() });
        }
    } catch (error) {
        console.log(error)
        res.status(200).send({ code: 200, success: false, message: `เกิดปัญหาในการปิดการจองห้องโปรดติดต่อผู้ดูแลระบบ` });
    }
});

router.get('/student/room/:floorId', async (req, res) => {
    try {
        const { params: { floorId } } = req
        const dormitory = db.collection('dormitory')
        const status = await dormitory.doc('status').get()
        const semester = status.data().semester
        const year = status.data().year
        const reserveRef = await dormitory.where("year", "==", year).where("semester", "==", semester).where("floor", "==", floorId).get()
        let floorInformation = []
        await Promise.all(reserveRef.forEach(async (floor) => {
            floorInformation.push(floor.data())
        }))
        res.status(200).send(floorInformation);
    } catch (error) {
        console.error(error)
        res.sendStatus(400);
    }
});

router.get('/student/room/myRoom/:studentId', async (req, res) => {
    try {
        const { params: { studentId } } = req
        const roomInformation = await myRoom(studentId)
        if (roomInformation == false) {
            res.send({ code: 200, success: false, message: "ไม่มีการจองห้องพักในระบบ" })
        } else {
            res.send({ code: 200, success: true, message: "ท่านได้จองห้องแล้ว", data: roomInformation })
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/student/room/remove', async (req, res) => {
    try {
        const { body: { roomId, studentId, orderId } } = req
        const dormotory = db.collection('dormitory')
        const status = await dormotory.doc('status').get()
        const semester = status.data().semester
        const year = status.data().year
        const reserveRef = db.doc(`dormitory/${year}-${semester}-${roomId}`)
        const profileRef = await reserveRef.get()
        if (profileRef.data()[orderId].id === studentId) {
            await reserveRef.update({ [orderId]: FieldValue.delete() })
            res.status(200).send({ code: 200, success: true, message: "ยกเลิกการจองห้องแล้ว" })
        }
        else {
            res.status(200).send({ code: 200, success: false, message: "ไม่สามารถยกเลิกการจองของผู้อื่นได้" })
        }
    } catch (error) {
        console.log(error)
        res.status(200).send({ code: 200, success: false, message: "ผิดพลาดกรุณาเข้าสู่ระบบอีกครั้ง" })

    }
})

module.exports = router;