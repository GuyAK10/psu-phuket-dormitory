const express = require('express');
const firestore = require('../configs/firebase')
const { receiptNotify } = require('../configs/line')
const multer = require('multer');
const e = require('express');

const router = express.Router();
const bucket = firestore.storage().bucket()
const db = firestore.firestore()
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const bookInfomation = async (profileData, checkCase) => {
  try {
    const floors = [
      "floorA",
      "floorB",
      "floorC",
      "floorD",
      "floorE",
      "floorF",
      "floorG",
      "floorH"
    ]

    const orderId = [
      "student1",
      "student2"
    ]

    let booked = false;

    for (var a in floors) {
      var b = floors[a];
      const roomRef = db.collection(b)
      for (c in orderId) {
        var d = orderId[c]
        const result = await roomRef.where(`${d}.id`, "==", profileData.profile.id).get()

        if (!result.empty && checkCase === "reserve") {
          result.forEach((room) => {
            booked = room.id
            return booked
          })
        }
        else if (!result.empty && checkCase === "count") {
          result.forEach((room) => {
            const checkStudent = room.data()
            if (checkStudent.student1&&checkStudent.student2!==undefined) {
              booked = 2
              return booked
            } else {
              booked = 1
              return booked
            }
          })
        }

      }
    }
    return booked
  }
  catch (error) {
    console.log(error)
    throw error
  }
}

router.get('/student/payment/bill', async (req, res) => {
  try {

    const { body: { semester, year, month, studentId } } = req
    const profileData = {
      profile: {
        id: studentId
      }
    }
    const checkCase = ["reserve","count"]
    const roomId = await bookInfomation(profileData, checkCase[0])
    const count = await bookInfomation(profileData,checkCase[1])
    if (roomId == false) {
      res.status(200).send({ code: 200, success: false, message: "ไม่มีการจองห้องพักในระบบ" })
    } else {

      const billRef = await db.collection('payment').where("semester", "==", semester).where("year", "==", year).where("month", "==", month).where("roomId", "==", roomId).get()

      let billList = []
      billRef.docs.map((bill) => {
        billList.push(bill.data())
      })
      billList.push({count:count})
      res.status(200).send(billList);
    }


  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

router.post('/student/payment/receipt', uploader.single('img'), (req, res) => {
  try {
    const { body: { semester, year, month, roomId } } = req
    const folder = 'receipt'
    const fileUpload = bucket.file(`${folder}/${semester}-${year}/${month}/${roomId}`);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    });

    blobStream.on('error', (err) => {
      console.log(err)
      res.status(405).json(err);
    });

    blobStream.on('finish', async () => {
      await receiptNotify(semester, year, month, roomId)
      const receiptRef = db.collection(`payment/`).doc(`${roomId}-${month}-${semester}-${year}`)
      await receiptRef.set({
        status: "รอการยืนยัน"
      }, { merge: true })
      res.status(200).send({ code: 200, success: true, message: `Upload Complete` });

    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }

});

router.get('/student/payment/reciept', async (req, res) => {
  try {
    const { body: { month, semester, year, roomId } } = req
    const folder = 'receipt'
    const file = bucket.file(`${folder}/${semester}-${year}/${month}/${roomId}`);
    file.download().then(downloadResponse => {
      res.status(200).send(downloadResponse[0]);
    });

  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

module.exports = router;