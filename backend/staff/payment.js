const express = require('express');
const { db, storage } = require('../configs/firebase')
const xlsxFile = require('xlsx');

const router = express.Router();
const bucket = storage.bucket()



router.post('/staff/payment', async (req, res) => {
    try {
        const { buffer } = req.files[0]
        const { body: { abbMonth, abbYear } } = req

        var workbook = xlsxFile.read(buffer, { type: "buffer" });
        let sheetName = workbook.SheetNames

        sheetName.map(async (name) => {
            let result = name
            result = name.slice(0, 4)
            let checkMonth = name.slice(11, 14)
            let checkYear = name.slice(14, 16)

            if (result === "ชั้น" && checkMonth === abbMonth && checkYear === abbYear) {
                
                for (i = 6; i <= 52;) {
                    const month =  workbook.Sheets[name].A2.v.slice(11,17)
                    const year =  workbook.Sheets[name].A2.v.slice(18,22)
                    const roomId = workbook.Sheets[name][`A${i}`].v
                    const oldUnit = workbook.Sheets[name][`C${i}`].v
                    const newUnit = workbook.Sheets[name][`D${i}`].v
                    const unitPrice = workbook.Sheets[name][`F${i}`].v
                    const water = workbook.Sheets[name][`I${i}`].v
                    const paymentRef = db.collection(`payment`).doc(`${roomId}-${month}-${year}`)
                    await paymentRef.set({
                        year: +year,
                        month: month,
                        roomId: roomId,
                        water: +water,
                        oldUnit: +oldUnit,
                        newUnit: +newUnit,
                        unitPrice: +unitPrice,
                        status: "ค้างชำระ"
                    })
                    i += 2
                }
            }
        })
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
