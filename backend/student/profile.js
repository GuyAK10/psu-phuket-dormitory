const express = require('express');
const { db, storage } = require('../configs/firebase')

const router = express.Router()
const bucket = storage.bucket()

router.post('/student/profile/upload/:studentId', async (req, res) => {
  try {
    const {
      mimetype,
      buffer,
    } = req.files[0]
    const id = req.params.studentId
    const folder = 'profile'
    const fileName = `${id}`
    const fileUpload = bucket.file(`${folder}/${fileName}`);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: mimetype
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
    blobStream.end(buffer);

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
    res.status(200).send(myProfile);
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
