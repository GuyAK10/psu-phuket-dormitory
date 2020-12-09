const express = require('express');

const { db } = require('../configs/firebase')
const createRoomDb = require('../configs/initialDormitoryStatus')
const router = express.Router()

const changeStatusAllRoom = async (year, semester, available ,res) => {
      try {
            const room = [
                  "A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10", "A11", "A12", "A13", "A14", "A15", "A16", "A17", "A18", "A19", "A20", "A21", "A22", "A23", "A24",
                  "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B10", "B11", "B12", "B13", "B14", "B15", "B16", "B17", "B18", "B19", "B20", "B21", "B22", "B23", "B24",
                  "C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11", "C12", "C13", "C14", "C15", "C16", "C17", "C18", "C19", "C20", "C21", "C22", "C23", "C24",
                  "D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "D10", "D11", "D12", "D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20", "D21", "D22", "D23", "D24",
                  "E01", "E02", "E03", "E04", "E05", "E06", "E07", "E08", "E09", "E10", "E11", "E12", "E13", "E14", "E15", "E16", "E17", "E18", "E19", "E20", "E21", "E22", "E23", "E24",
                  "F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08", "F09", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24",
                  "G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09", "G10", "G11", "G12", "G13", "G14", "G15", "G16", "G17", "G18", "G19", "G20", "G21", "G22", "G23", "G24",
                  "H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08", "H09", "H10", "H11", "H12", "H13", "H14", "H15", "H16", "H17", "H18", "H19", "H20", "H21", "H22", "H23", "H24"
            ]
            room.forEach(async (roomId) => {
                  const roomRef = db.doc(`dormitory/${year}-${semester}-${roomId}`)
                  await roomRef.update({
                        available: available
                  })  
            })
            if (available)
                  res.status(200).send({ code: 200, success: true, message: `เปิดการจองห้องทุกห้องในระบบแล้ว` });
            else
                  res.status(200).send({ code: 200, success: true, message: `ปิดการจองห้องทุกห้องในระบบแล้ว` });
      } catch (error) {
            throw error
      }
}

const changeStatusFloor = async (year, semester, floorId , available ,res) => {
      try {
            const dormitory = db.collection('dormitory')
            const roomRef = await dormitory.where("year", "==", year).where("semester", "==", semester).where("floor", "==", floorId).get()
            let roomDocument = []
            roomRef.forEach(async(room)=>{
                  roomDocument.push(room.id)
            })
            roomDocument.forEach(async(docId)=>{
                  await dormitory.doc(docId).update({
                        available:available
                  })
            })
            if (available)
                  res.status(200).send({ code: 200, success: true, message: `เปิดการจองห้องทุกห้องใน ${floorId} แล้ว` });
            else
                  res.status(200).send({ code: 200, success: true, message: `ปิดการจองห้องทุกห้องใน ${floorId} แล้ว` });
      } catch (error) {
            throw error
      }
}

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
                  year: year,
                  semester: semester
            })
            createRoomDb(year, semester)
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
            await changeStatusAllRoom(year, semester , available ,res)
      } catch (error) {
            console.log(error)
            res.status(200).send({ code: 200, success: false, message: `เกิดปัญหาในการปิดการจองห้องโปรดติดต่อผู้ดูแลระบบ` });
      }
});

router.post('/staff/room/statusFloor', async (req, res) => {
      try {
            const { body: { floorId , available } } = req
            const dormitory = db.collection('dormitory')
            const status = await dormitory.doc('status').get()
            const semester = status.data().semester
            const year = status.data().year
            await changeStatusFloor(year, semester, floorId , available ,res)
      } catch (error) {
            console.log(error)
            res.status(200).send({ code: 200, success: false, message: `เกิดปัญหาในการปิดการจองห้องโปรดติดต่อผู้ดูแลระบบ` });
      }
});

module.exports = router;