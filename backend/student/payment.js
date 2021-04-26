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

const toThaiMonth = async (month) => {
  switch (month) {
    case "january":
      return "มกราคม"
    case "febuary":
      return "กุมภาพันธ์"
    case "march":
      return "มีนาคม"
    case "april":
      return "เมษายน"
    case "may":
      return "พฤษภาคม"
    case "june":
      return "มิถุนายน"
    case "july":
      return "กรกฎาคม"
    case "august":
      return "สิงหาคม"
    case "september":
      return "กันยายน"
    case "october":
      return "ตุลาคม"
    case "november":
      return "พฤศจิกายน"
    case "december":
      return "ธันวาคม"
  }
}

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


router.get('/student/payment/bill/:year/:month/:studentId', async (req, res) => {
  try {
    const { params: { year, month, studentId } } = req
    const room = await myRoom(studentId)
    const roomId = room.room
    const thaiMonth = await toThaiMonth(month)
    const billRef = (await db.doc(`payment/${year}-${thaiMonth}-${roomId}`).get()).data()
    // console.log(room.student1)
    if (room && room.student1.id == studentId) {
      if (billRef)
        res.status(200).send({ code: 200, success: true, message: 'พบรายการชำระเงิน', data: billRef, status: "student1" })
      else
        res.status(200).send({ code: 200, success: true, message: "ไม่พบรายกายการชำระ" })
    }
    else if (room && room.student2.id == studentId) {
      if (billRef)
        res.status(200).send({ code: 200, success: true, message: 'พบรายการชำระเงิน', data: billRef, status: "student2" })
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

router.post('/student/payment/receipt/:year/:month/:roomId/:studentId', async (req, res) => {
  try {
    const { params: { year, month, roomId, studentId } } = req
    const {
      mimetype,
      buffer,
    } = req.files[0]
    console.log(studentId)
    const thaiMonth = await toThaiMonth(month)
    const folder = 'receipt'
    const fileUpload = bucket.file(`${folder}/${year}/${thaiMonth}/${roomId}`);
    const room = await myRoom(studentId)
    const receiptRef = db.collection(`payment`).doc(`${year}-${thaiMonth}-${roomId}`)
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: mimetype
      }
    });

    blobStream.on('error', (err) => {
      console.log(err)
      res.status(405).json(err);
    });

    blobStream.on('finish', async () => {
      // await receiptNotify( year, month, roomId)
      if (room && room.student1.id == studentId) {
        await receiptRef.set({
          student1: "รอการยืนยัน"
        }, { merge: true })
        res.status(200).send({ code: 200, success: true, message: 'Upload Complete' });
      } else if (room && room.student2.id == studentId)
        await receiptRef.set({
          student2: "รอการยืนยัน"
        }, { merge: true })
      res.status(200).send({ code: 200, success: true, message: 'Upload Complete' });

    });

    blobStream.end(buffer);
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