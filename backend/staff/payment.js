const express = require('express');
const { db, storage } = require('../configs/firebase')

const router = express.Router();
const bucket = storage.bucket()

router.post('/staff/payment', async (req, res) => {
    try {
        const paymentList = req.body
        paymentList.forEach(async value => {
            const paymentRef = db.collection(`payment`).doc(`${value.roomId}-${value.month}-${value.semester}-${value.year}`)
            await paymentRef.set({
                semester: +value.semester,
                year: +value.year,
                month: value.month,
                roomId: value.roomId,
                water: +value.water,
                electric: value.electric ? +value.electric : null,
                status: value.status
            })
        });
        res.status(200).send({ code: 200, success: true, message: "บันทึกข้อมูลค่าน้ำค่าไฟเรียบร้อย" });

    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});

router.get('/staff/payment/:semester/:month/:year', async (req, res) => {
    try {

        const { params: { semester, year, month } } = req
        const billRef = await db.collection('payment').where("semester", "==", +semester).where("year", "==", +year).where("month", "==", month).get()
        if (billRef.empty)
            res.status(200).send({ code: 200, success: false, message: "ไม่พบค่าน้ำค่าไฟในระบบ" });
        else {
            let billList = []
            billRef.docs.map((bill) => {
                billList.push(bill.data())
            })
            res.status(200).send({ code: 200, success: true, message: "พบค่าน้ำค่าไฟในระบบ", data: billList });
        }

    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});

router.get('/staff/payment/history/:semester/:month/:year', async (req, res) => {
    try {
        const { params: { semester, year, month } } = req
        const billRef = await db.collection('payment').where("semester", "==", +semester).where("year", "==", +year).where("month", "==", month).get()
        if (billRef.empty)
            res.status(200).send({ code: 200, success: false, message: "ไม่พบค่าน้ำค่าไฟในระบบ" });
        else {
            let billList = []
            billRef.docs.map((bill) => {
                billList.push(bill.data())
            })
            res.status(200).send({ code: 200, success: true, message: "พบค่าน้ำค่าไฟในระบบ", data: billList });
        }

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

router.post('/staff/payment/reciept', async (req, res) => {
    try {
        const { body: { month, semester, year, roomId } } = req
        const receiptRef = db.collection(`payment/`).doc(`${roomId}-${month}-${semester}-${year}`)
        await receiptRef.set({
            status: "ชำระเสร็จสิ้น"
        }, { merge: true })
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});

module.exports = router;
