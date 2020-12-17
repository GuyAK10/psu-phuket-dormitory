const express = require('express');
const { db, storage } = require('../configs/firebase')
const multer = require('multer');

const router = express.Router()
const bucket = storage.bucket()
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

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

router.post('/student/profile/upload/:studentId', uploader.single('img'), async (req, res) => {
  try {
    const id = req.params.studentId
    const folder = 'profile'
    const fileName = `${id}`
    const fileUpload = bucket.file(`${folder}/${fileName}`);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      },
    });

    blobStream.on('error', (err) => {
      console.log(err)
      res.status(405).json(err);
    });

    blobStream.on('finish', () => {
      res.status(200).send({
        code: 200,
        success: true,
        message: `${Math.random()}`
      });
    });
    blobStream.end(req.file.buffer);

  } catch (error) {
    console.error(error)
    res.sendStatus(400);
  }
});

router.get('/student/profile/picture/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId
    const file = bucket.file(`profile/${studentId}`);
    const [profilePictureUrl] = await file.getSignedUrl({ action: "read", expires: Date.now() + 60 * 60 * 10 })
    res.redirect(profilePictureUrl)
  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

router.get('/student/profile/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId
    const docRef = db.collection('students').doc(`${studentId}`);
    const profileRef = await docRef.get();
    const myProfile = profileRef.data()
    const historyRoom = await historyReserve(studentId)
    if (historyRoom == false) {
      res.status(200).send(myProfile);
    } else {
      const result = Object.assign(myProfile, { historyRoom: historyRoom })
      res.status(200).send(result);
    }
  }
  catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

router.post('/student/profile/:studentId', async (req, res) => {
  try {
    const { params: { studentId } } = req
    // const { body: { profile, contact, information, friend, family, other, agreement } } = req
    const user = req.body
    const docRef = db.collection('students').doc(`${studentId}`)
    await docRef.update(user)
    res.status(200).send({ code: 200, success: true, message: "บันทึกข้อมูลสำเร็วแล้ว" });
  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

module.exports = router;
