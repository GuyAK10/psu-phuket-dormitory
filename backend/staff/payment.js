const express = require('express');
const generatePayload = require('promptpay-qr')
const qrcode = require('qrcode')
const firestore = require('../configs/firebase')

const router = express.Router();
const bucket = firestore.storage().bucket()
const db = firestore.firestore()

router.post('/staff/payment', async (req, res) => {
    try {
        const paymentList = req.body
        paymentList.forEach(async(value)=>{
            const paymentRef = db.collection(`payment/`).doc(`${value.roomId}-${value.month}-${value.semester}-${value.year}`)
            await paymentRef.set({
                semester: value.semester,
                year: value.year,
                month: value.month,
                roomId: value.roomId,
                water: value.water,
                electric: value.electric,
            })
        });
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

router.get('/staff/payment/reciept', async (req, res) => {
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
