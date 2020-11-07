const express = require('express');
const generatePayload = require('promptpay-qr')
const qrcode = require('qrcode')
const firestore = require('../configs/firebase')

const router = express.Router();
const bucket = firestore.storage().bucket()
const db = firestore.firestore()

router.post('/staff/payment', async (req, res) => {
    try {
        const { body: { roomId, month, semester, year, water, electric } } = req
        await uploadBill(roomId, month, semester, year, water, electric)
        const paymentRef = db.collection(`payment/`).doc(`${semester}-${year}-${month}-${roomId}`)
        await paymentRef.set({
            semester: semester,
            year: year,
            month: month,
            roomId: roomId,
            water: water,
            electric: electric,
        })
        console.log("บันทึกข้อมูลค่าน้ำค่าไฟแล้ว")
        res.status(200).send({ code: 200, success: true, message: "บันทึกข้อมูลค่าน้ำค่าไฟเรียบร้อย" });

    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});

router.get('/staff/payment', async (req, res) => {
    try {

        const { body: { semester, year, month } } = req
        const billRef = await db.collection('payment').where("semester", "==", semester).where("year", "==", year).where("month", "==", month).get()

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

router.get('/student/payment/reciept', async (req, res) => {
    try {
        const { body: { month, semester, year, roomId } } = req
        const folder = 'receipt'
        const file = bucket.file(`${folder}/${semester}-${year}/${month}/${roomId}`);
        file.download().then(downloadResponse => {
            const picture = downloadResponse[0]
            res.setHeader('Content-Type', 'image/png');
            res.status(200).send(picture);
        });

    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});

module.exports = router;
