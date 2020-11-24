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

const bookInfomation = async (studentId) => {
  try {
    //   const floors = [
    //     "floorA",
    //     "floorB",
    //     "floorC",
    //     "floorD",
    //     "floorE",
    //     "floorF",
    //     "floorG",
    //     "floorH"
    //   ]

    //   const orderId = [
    //     "student1",
    //     "student2"
    //   ]

    //   let booked = false;

    //   for (var a in floors) {
    //     var b = floors[a];
    //     const roomRef = db.collection(b)
    //     for (c in orderId) {
    //       var d = orderId[c]
    //       const result = await roomRef.where(`${d}.id`, "==", profileData.profile.id).get()

    //       if (!result.empty && checkCase === "reserve") {
    //         result.forEach((room) => {
    //           booked = room.id
    //           return booked
    //         })
    //       }
    //       else if (!result.empty && checkCase === "count") {
    //         result.forEach((room) => {
    //           const checkStudent = room.data()
    //           if (checkStudent.student1 && checkStudent.student2 !== undefined) {
    //             booked = 2
    //             return booked
    //           } else {
    //             booked = 1
    //             return booked
    //           }
    //         })
    //       }

    //     }
    //   }
    //   return booked

    let roomList = []
    const findCollectFloor = await db.listCollections()
    findCollectFloor.forEach(async database => database.id.startsWith('floor') ? roomList.push(database.id) : "")

    let students = []
    for (let i in roomList) {
      const student = await db.collection(roomList[i]).get()
      student.forEach(data => {
        if (data.data().student1 || data.data().student2) students.push({ ...data.data(), room: data.id })
      })
    }

    const stdAndRoom = await students.find(item => {
      if (item.student1 !== undefined) {
        if (item.student1.id == studentId) return true
      }
      if (item.student2 !== undefined) {
        if (item.student2.id == studentId) return true
      }
    })
    if (stdAndRoom !== undefined) return stdAndRoom
    else return { room: false }
  }
  catch (error) {
    console.log(error)
    throw error
  }
}

router.get('/student/payment/bills/:studentId', async (req, res) => {
  const { params: { studentId } } = req
  const billRef = await db.collection(`payment`).where("students", "array-contains", { studentId: studentId }).get()
  let bills = []
  billRef.forEach(res =>
    bills.push(res.data())
  )
  res.status(200).send({ code: 200, success: true, message: "พบประวัติ", data: bills })
})

router.get('/student/payment/bill/:semester/:year/:month/:studentId', async (req, res) => {
  try {

    const { params: { semester, year, month, studentId } } = req
    const { room } = await bookInfomation(studentId)

    if (room) {
      const billRef = (await db.doc(`payment/${room}-${month}-${semester}-${year}`).get()).data()
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