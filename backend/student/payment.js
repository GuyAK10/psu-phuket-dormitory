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



router.get('/student/payment/qrcode', async (req, res) => {
  try {
    const { body: { roomId, month, semester, year } } = req
    const folder = 'payment'
    const file = bucket.file(`${folder}/${semester}-${year}/${month}/${roomId}`);
    file.download().then(downloadResponse => {
      console.log(typeof (downloadResponse[0]))
      res.status(200).send(downloadResponse[0]);
    });

  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

router.get('/student/payment/bill', async (req, res) => {
  try {

    const { body: { semester, year, month, roomId } } = req
    const billRef = await db.collection('payment').where("semester", "==", semester).where("year", "==", year).where("month", "==", month).where("roomId", "==", roomId).get()

    let billList = []
    billRef.docs.map((bill) => {
      billList.push(bill.data())
    })
    console.log(billList)
    res.status(200).send(billList);

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
      console.log("Upload Complete!")
      // res.status(200).send('Upload complete!');
      receiptNotify(semester, year, month, roomId) 
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }

});

module.exports = router;