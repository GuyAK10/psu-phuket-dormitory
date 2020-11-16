const express = require('express');
const firestore = require('../configs/firebase')
const { receiptNotify } = require('../configs/line')
const multer = require('multer');

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

router.get('/student/payment/bills/:semester/:year/:month/', async (req, res) => {
  const { params: { semester, year, month } } = req
  const billRef = await db.collection('payment').where("semester", "==", semester).where("year", "==", year).where("month", "==", month).get()
  console.log(billRef.docs)
  res.status.send({})
})

router.get('/student/payment/bill/:semester/:year/:month/:studentId', async (req, res) => {
  try {

    const { params: { semester, year, month, studentId } } = req
    const profileData = {
      profile: {
        id: studentId
      }
    }
    const checkCase = "reserve"
    const roomId = 'A03'
    // const roomId = await bookInfomation(profileData, checkCase)
    // if (roomId == false) {
    //   res.status(200).send({ code: 200, success: false, message: "ไม่มีการจองห้องพักในระบบ" })
    // } else {
    // const billRef = await db.collection('payment').where("semester", "==", semester).where("year", "==", year).where("month", "==", month).where("roomId", "==", roomId).get()
    // const billRef = await db.doc(`payment/${roomId}-${month}-${semester}-${year}`).get()
    // console.log(billRef.exists)
    // console.log(billRef.data())

    let data
    const findCollectFloor = await db.listCollections()
    findCollectFloor.forEach(async collection => {
      if (collection.id.startsWith('floor')) {
        const student1 = await db.doc(`${collection.id}/student1`).get()
        const student2 = await db.doc(`${collection.id}/student2`).get()
        if (student1.exists) {
          data = student1.data()
        }
        if (student2.exists) {
          data = student1.data()
        }
      }
    })
    console.log(data)

    // let billList = []
    // billRef.docs.map((bill) => {
    //   billList.push(bill.data())
    // })
    // res.status(200).send(billList);
    // }

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