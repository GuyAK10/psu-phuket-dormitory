const express = require('express');
const { db, storage } = require('../configs/firebase')

const router = express.Router()
const bucket = storage.bucket()

const historyReserve = async (studentId) => {
  try {
    const orderId = [
      "student1",
      "student2"
    ]
    let historyList = []
    let booked = false;
    const dormitory = db.collection("dormitory")
    const status = await dormitory.doc("status").get()
    const year = status.data().year
    for (i in orderId) {
      var student = orderId[i]
      const reserveRef = await dormitory.where("year", "==", year).where(`${student}.id`, "==", studentId).get()
      if (!reserveRef.empty) {
        reserveRef.forEach(async (room) => {
          historyList.push(room.id)
          booked = historyList
          return booked
        })
      }
    }
    return booked
  } catch (error) {
    throw error
  }
}

router.get('/staff/profile/', async (req, res) => {
  try {
    let studentList = []
    const studentRef = db.collection('students')
    const profile = await studentRef.get();
    profile.forEach(async (student) => {
      const historyRoom = await historyReserve(student.id)
      await studentRef.doc(student.id).set({
        historyRoom:historyRoom
      },{merge:true})
    })
    profile.forEach(async (list) => {
      let studentData = {
        studentId: '',
      }
      studentData.studentId = list.id
      Object.assign(studentData, list.data())
      studentList.push(studentData)
    })

    res.status(200).send(studentList);
  }
  catch (error) {
    console.log(error)
    res.sendStatus(500);
  }
});

router.get('/staff/profile/picture/:studentId', (req, res) => {
  try {

    const studentId = req.params.studentId
    const file = bucket.file(`profile/${studentId}`);
    file.download().then(downloadResponse => {
      res.status(200).send(downloadResponse[0]
      );
    });
  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

module.exports = router;