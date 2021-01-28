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
    console.log(req.body)
    const {room} = await myRoom(studentId)
    console.log(room)
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
      await db.collection('repair').doc(`${day}-${month}-${year}-${room}`).set({
        year: year,
        month: month,
        day: day,
        room: room,
        [title]: {
          description,
          time,
        }
  
      },{merge:true})
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

module.exports = router;