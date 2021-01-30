const express = require('express');
const { db, storage } = require('../configs/firebase')
const { receiptNotify } = require('../configs/line')
const multer = require('multer');

const router = express.Router();
const bucket = storage.bucket()
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

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

// ประวัติค่าไฟของเราทั้งหมดที่เคยอยู่มา ***รอแก้ คิดไม่ออก
// router.get('/student/payment/bills/:studentId', async (req, res) => {
//   const { params: { studentId } } = req
//   const billRef = await db.collection(`payment`).where("students", "array-contains", { studentId: studentId }).get()
//   let bills = []
//   await Promise.all(  billRef.forEach(res =>
//     bills.push(res.data())
//   ))
//   res.status(200).send({ code: 200, success: true, message: "พบประวัติ", data: bills })
// })

router.get('/student/payment/bill/:year/:month/:studentId', async (req, res) => {
  try {

    const { params: { year, month, studentId } } = req
    const { room } = await myRoom(studentId)
    if (room) {
      const billRef = (await db.doc(`payment/${year}-${month}-${room}`).get()).data()
      if (billRef)
        res.status(200).send({ code: 200, success: true, message: 'พบรายการชำระเงิน', data: billRef })
      else
        res.status(200).send({ code: 200, success: true, message: "ไม่พบรายกายการชำระ" })
    }

    else
      res.status(200).send({ code: 200, success: false, message: "กรุณาจองห้องก่อนชำระค่าน้ำค่าไฟ" })

  } catch (error) {
    console.log(error)
    res.sendStatus(400).send(error);
  }
});

router.post('/student/payment/receipt', uploader.single('img'), (req, res) => {
  try {
    const { body: {year, month, roomId } } = req
    const folder = 'receipt'
    const fileUpload = bucket.file(`${folder}/${year}/${month}/${roomId}`);
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
      await receiptNotify( year, month, roomId)
      const receiptRef = db.collection(`payment/`).doc(`${year}-${month}-${roomId}`)
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
    const { body: { month, year, roomId } } = req
    const folder = 'receipt'
    const file = bucket.file(`${folder}/${year}/${month}/${roomId}`);
    const [recieptPictureUrl] = await file.getSignedUrl({ action: "read", expires: Date.now() + 60 * 60 * 10 })
    res.redirect(recieptPictureUrl)

  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

module.exports = router;