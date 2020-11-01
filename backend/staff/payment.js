const express = require('express');
const generatePayload = require('promptpay-qr')
const qrcode = require('qrcode')
const firestore = require('../configs/firebase')

const router = express.Router();
const bucket = firestore.storage().bucket()
const db = firestore.firestore()

const uploadBill = async (roomId, month, semester, year, water, electric, total) => {
    try {

        const paymentRef = db.collection(`payment/`).doc(`${semester}-${year}-${month}-${roomId}`)
        await paymentRef.set({
            semester: semester,
            year: year,
            month: month,
            roomId: roomId,
            water: water,
            electric: electric,
            total: total
        })

        console.log("บันทึกข้อมูลค่าน้ำค่าไฟแล้ว")

    } catch (error) {

        throw error
    }
}

const uploadQr = async (payload, options, month, semester, year, roomId) => {
    try {
        await new Promise((resolve, reject) => {
            qrcode.toDataURL(payload, options, (err, png) => {
                try {

                    const folder = 'payment'
                    const fileUpload = bucket.file(`${folder}/${semester}-${year}/${month}/${roomId}`);
                    const blobStream = fileUpload.createWriteStream({
                        metadata: {
                            contentType: png
                        }
                    });

                    blobStream.on('error', (err) => {
                        reject(err)
                    });

                    blobStream.on('finish', () => {
                        console.log("Upload complete!")
                        resolve()
                    });

                    blobStream.end(png.buffer);

                } catch (error) {
                    error.custom = "Qr Error"
                    reject(error)
                }

            })
        })

    } catch (error) {
        throw error;
    }
}


router.post('/staff/payment', async (req, res) => {
    try {
        const { body: { roomId, month, semester, year, water, electric, total } } = req
        const mobileNumber = '082-432-7072'
        const amount = total
        const payload = generatePayload(mobileNumber, { amount }) //First parameter : mobileNumber || IDCardNumber

        // Convert to SVG QR Code
        const options = { type: 'png', color: { dark: '#000', light: '#fff' } }
        const status = {
            qr:false,
            bill:false
        }

        try {
            await uploadQr(payload, options, month, semester, year, roomId)
            status.qr = true
        } catch (error) {
            console.log("QR Error")
        }
        try {
            await uploadBill(roomId, month, semester, year, water, electric, total) 
            status.bill = true
        } catch (error) {
            console.log("Bill Error")
        }
        res.send(status);


    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});

router.get('/staff/payment', async (req, res) => {
    try {

        const { body: { semester, year } } = req
        const billRef = await db.collection('payment').where("semester", "==", semester).where("year", "==", year).get()

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

module.exports = router;
