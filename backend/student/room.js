const express = require('express');
const { db, admin } = require('../configs/firebase')
const router = express.Router()
const { firestore } = admin
const FieldValue = firestore.FieldValue

const myRoom = async(studentId) => {
    try {
        const orderId = [
            "student1",
            "student2"
        ]
        let booked = false;
        const dormitory = db.collection("dormitory")
        const status = await dormitory.doc("status").get()
        const semester = status.data().semester
        const year = status.data().year
        for (i in orderId) {
            var student = orderId[i]
            const reserveRef = await dormitory.where("year", "==", year).where("semester", "==", semester).where(`${student}.id`, "==", studentId).get()
            if (!reserveRef.empty) {
                reserveRef.forEach((room)=>{
                    const roomData = {
                        docID: '',

                    }
                    roomData.docID = room.id
                    Object.assign(roomData, room.data())
                    booked = roomData
                     return booked
                })
            }
        }
        return booked
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

const reserveInfomation = async (profileData) => {
    try {
        const orderId = [
            "student1",
            "student2"
        ]
        let booked = false;
        const dormitory = db.collection("dormitory")
        const status = await dormitory.doc("status").get()
        const semester = status.data().semester
        const year = status.data().year
        for (i in orderId) {
            var student = orderId[i]
            const reserveRef = await dormitory.where("year", "==", year).where("semester", "==", semester).where(`${student}.id`, "==", profileData.profile.id).get()
            if (!reserveRef.empty) {
                booked = true
                return booked
            }
        }
        return booked
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

const bookingRoom = async (bookRoom, floorId, roomId, orderId, res) => {
    try {
        const dormitory = db.collection('dormitory')
        const status = await dormitory.doc('status').get()
        const semester = status.data().semester
        const year = status.data().year
        const bookRef = dormitory.doc(`${year}-${semester}-${roomId}`)
        const available = (await bookRef.get()).data().available
        if (!available) {
            res.status(200).send({ code: 200, success: false, message: "ไม่สามารถจองห้องได้เนื่องจากห้องนี้ปิดการจองโดยเจ้าหน้าที่" });
        }
        else if (!bookRef.exists && orderId == "student1") {
            bookRef.set({
                floor: floorId,
                room: roomId,
                semester: semester,
                year: year,
                student1: bookRoom
            }, { merge: true })
            console.log("booking student1 success")
            res.status(200).send({ code: 200, success: true, message: "จองห้องสำเร็จ" });
        }
        else if (!bookRef.exists && orderId == "student2") {
            bookRef.set({
                floor: floorId,
                room: roomId,
                semester: semester,
                year: year,
                student2: bookRoom
            }, { merge: true })
            console.log("booking student2 success")
            res.status(200).send({ code: 200, success: true, message: "จองห้องสำเร็จ" });
        }
        else if (bookRef.exists && orderId == "student1") {
            bookRef.update({ student1: bookRoom })
            console.log("booking student1 success")
            res.status(200).send({ code: 200, success: true, message: "จองห้องสำเร็จ" });
        }
        else if (bookRef.exists && orderId == "student2") {
            bookRef.update({ student2: bookRoom })
            console.log("booking student2 success")
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
            const isBooked = await reserveInfomation(profileData)
            if (isBooked) {
                res.status(200).send({ code: 200, success: false, message: "ผู้ใช้จองแล้ว กรุณายกเลิกการจองห้องครั้งก่อน แล้วทำการจองอีกครั้ง" })
            } else if (!isBooked) {
                await bookingRoom(bookRoom, floorId, roomId, orderId, res)
            }
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
})

router.get('/student/room/system', async (req, res) => {
    try {
        const docRef = await db.doc(`dormitory/status`).get()
        if (docRef.exists) {
            if (docRef.data() )
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
        reserveRef.forEach(async(floor)=>{
            floorInformation.push(floor.data())
        })
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
            res.status(200).send({ code: 200, success: false, message: "ไม่มีการจองห้องพักในระบบ" })
        } else {
            res.send(roomInformation);
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
            console.log("deleted")
            res.status(200).send({ code: 200, success: true, message: "deleted" })
        }
        else {
            console.log("ไม่สามารถยกเลิกการจองของผู้อื่นได้")
            res.status(200).send({ code: 200, success: false, message: "ไม่สามารถยกเลิกการจองของผู้อื่นได้" })
        }
    } catch (error) {
        console.log(error)
        res.status(200).send({ code: 200, success: false, message: "ผิดพลาดกรุณาเข้าสู่ระบบอีกครั้ง" })

    }
})

module.exports = router;