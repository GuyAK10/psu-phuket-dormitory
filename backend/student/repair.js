const express = require('express');
const { db, admin } = require('../configs/firebase')
const { repairNotify } = require('../configs/line')

const router = express.Router()

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

router.post('/student/repair', async (req, res) => {
  try {
    const { body: { title, description, studentId } } = req
    const { room } = await myRoom(studentId)
    if (room) {
      const date = new Date()
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear() + 543
      const hour = date.getHours()
      var minute = date.getMinutes()
      if (minute < 10) {
        minute = `0${minute}`
      }
      const time = hour + ":" + minute
      const status = await db.collection("dormitory").doc("status").get()
      const semester = status.data().semester
      const university_year = status.data().year
      await db.collection('repair').doc(`${day}-${month}-${year}-${room}`).set({
        year: year,
        month: month,
        day: day,
        room: room,
        university_year: university_year,
        semester: semester,
        [title]: {
          description,
          time,
        }

      }, { merge: true })
      // repairNotify()
      res.status(200).send({ code: 200, success: true, message: "แจ้งซ่อมสำเร็จ" });

    } else {
      res.status(200).send({ code: 200, success: true, message: "กรุณาจองห้องพักก่อนทำการแจ้งซ่อม" });
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

router.get('/student/myRepair/:studentId/:semester/:universityYear', async (req, res) => {
  const { params: { studentId, semester, universityYear } } = req
  const { historyRoom } = (await db.collection('students').doc(`${studentId}`).get()).data()
  if (historyRoom) {
    let repairList = []
    await Promise.all(historyRoom.map(async (data) => {
      if (+semester == data.semester && +universityYear == data.year) {
        const repairRef = await db.collection('repair')
          .where('room', '==', `${data.room}`)
          .where('university_year', '==', data.year)
          .where('semester', '==', data.semester).get()
        await Promise.all(repairRef.docs.map((repair) => {
          repairList.push(repair.data())
        }))
      }
    }))
    res.status(200).send({ code: 200, success: true, data: repairList });
  } else {
    res.status(200).send({ code: 200, success: true, message: "ยังไม่มีประวัติการแจ้งซ่อม" });
  }

});

router.get('/universityYear', async (req, res) => {
  const status = await db.collection("dormitory").doc("status").get()
  const university_year = status.data().year
  res.status(200).send({ code: 200, success: true, data: university_year });
});
module.exports = router;