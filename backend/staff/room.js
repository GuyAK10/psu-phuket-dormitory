const express = require('express');

const { db, admin } = require('../configs/firebase')
const { createRoomDb, deleteOldroom, changeStatusAllRoom, changeStatusFloor } = require('../configs/initialDormitoryStatus')
const router = express.Router()
const { firestore } = admin
const FieldValue = firestore.FieldValue

//get status room
router.get('/staff/room/system', async (req, res) => {
      try {
            const docRef = await db.collection(`dormitory`).doc(`status`).get()
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

router.post('/staff/room/system', async (req, res) => {
      try {
            const { body: { system, year, semester } } = req
            const docRef = db.collection(`dormitory`).doc(`status`)
            await docRef.set({
                  system: system,
                  year: +year,
                  semester: +semester
            })
            await createRoomDb(year, semester)
            if (semester == 1) {
                  await deleteOldroom(year)
            }
            if ((await docRef.get()).data().system)
                  res.status(200).send({ code: 200, success: true, message: `เปิดระบบการจองแล้ว`, data: (await docRef.get()).data() });
            else
                  res.status(200).send({ code: 200, success: true, message: `ปิดระบบการจองแล้ว`, data: (await docRef.get()).data() });
      } catch (error) {
            console.log(error)
            res.status(200).send({ code: 200, success: false, message: `เกิดปัญหาในการปิดการจองห้องโปรดติดต่อผู้ดูแลระบบ` });
      }
});

router.get('/staff/room/:floorId', async (req, res) => {
      try {
            const { params: { floorId } } = req
            const dormitory = db.collection('dormitory')
            const status = await dormitory.doc('status').get()
            const semester = status.data().semester
            const year = status.data().year
            const reserveRef = await dormitory.where("year", "==", year).where("semester", "==", semester).where("floor", "==", floorId).get()
            let floorInformation = []
            reserveRef.forEach(async (floor) => {
                  floorInformation.push(floor.data())
            })
            res.status(200).send(floorInformation);
      } catch (error) {
            console.error(error)
            res.sendStatus(400);
      }
})

//remove Student from room by staff
router.post('/staff/room/remove', async (req, res) => {
      try {
            const { body: { roomId, studentId, orderId } } = req
            const dormitory = db.collection('dormitory')
            const status = await dormitory.doc('status').get()
            const semester = status.data().semester
            const year = status.data().year
            const reserveRef = dormitory.doc(`${year}-${semester}-${roomId}`)
            const profileRef = await reserveRef.get()
            if (profileRef.data()[orderId].id === studentId) {
                  await reserveRef.update({ [orderId]: FieldValue.delete() })
                  console.log("ยกเลิกการจองห้องแล้ว")
                  res.status(200).send({ code: 200, success: true, message: "ยกเลิกการจองห้องแล้ว" })
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

//Close/Open available room
router.post('/staff/room/statusRoom', async (req, res) => {
      try {
            const { body: { roomId, available } } = req
            const dormitory = db.collection('dormitory')
            const status = await dormitory.doc('status').get()
            const semester = status.data().semester
            const year = status.data().year
            const roomRef = dormitory.doc(`${year}-${semester}-${roomId}`)
            await roomRef.update({
                  available: available
            })
            const checkStatus = await roomRef.get()
            if (checkStatus.data().available)
                  res.status(200).send({ code: 200, success: true, message: `เปิดการจองห้อง ${checkStatus.data().room} แล้ว` });
            else
                  res.status(200).send({ code: 200, success: true, message: `ปิดการจองห้อง ${checkStatus.data().room} แล้ว` });

      } catch (error) {
            console.log(error)
            res.status(200).send({ code: 200, success: false, message: `เกิดปัญหาในการปิดการจองห้องโปรดติดต่อผู้ดูแลระบบ` });
      }
});

router.post('/staff/room/statusAllRoom', async (req, res) => {
      try {
            const { body: { available } } = req
            const dormitory = db.collection('dormitory')
            const status = await dormitory.doc('status').get()
            const semester = status.data().semester
            const year = status.data().year
            await changeStatusAllRoom(year, semester, available, res)
      } catch (error) {
            console.log(error)
            res.status(200).send({ code: 200, success: false, message: `เกิดปัญหาในการปิดการจองห้องโปรดติดต่อผู้ดูแลระบบ` });
      }
});

router.post('/staff/room/statusFloor', async (req, res) => {
      try {
            const { body: { floorId, available } } = req
            const dormitory = db.collection('dormitory')
            const status = await dormitory.doc('status').get()
            const semester = status.data().semester
            const year = status.data().year
            await changeStatusFloor(year, semester, floorId, available, res)
      } catch (error) {
            console.log(error)
            res.status(200).send({ code: 200, success: false, message: `เกิดปัญหาในการปิดการจองห้องโปรดติดต่อผู้ดูแลระบบ` });
      }
});

module.exports = router;