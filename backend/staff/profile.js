const express = require('express');
const { db, storage } = require('../configs/firebase')

const router = express.Router()
const bucket = storage.bucket()

router.get('/staff/profile/', async (req, res) => {
  try {
    let studentList = []
    const studentRef = db.collection('students')
    const profile = await studentRef.get();
    await Promise.all(profile.docs.map(async (list) => {
      let studentData = {
        studentId: '',
      }
      studentData.studentId = list.id
      Object.assign(studentData, list.data())
      studentList.push(studentData)
    }))

    res.status(200).send(studentList);
  }
  catch (error) {
    console.log(error)
    res.sendStatus(500);
  }
});

router.get('/staff/profile/picture/:studentId', async (req, res) => {
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

module.exports = router;