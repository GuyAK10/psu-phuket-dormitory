const express = require('express');
const generatePayload = require('promptpay-qr')
const qrcode = require('qrcode')
const { firestore } = require('../configs/firebase')

const router = express.Router();
const bucket = firestore.storage().bucket()
const db = firestore()

const uploadBill = (roomId, month, semester, year, water, electric, total, res) =>{
    try {
        const paymentRef = db.doc(`payment/${semester}-${year}/${month}/${roomId}`)
        paymentRef.update({
            bill:{
                water:water,
                electric:electric,
                total:total
            }
        })
        console.log("บันทึกข้อมูลค่าน้ำค่าไฟแล้ว")
        res.status(200).send({ code: 200, success: true, message: "บันทึกข้อมูลค่าน้ำค่าไฟแล้ว" });
    } catch (error) {
        console.log(error)
        res.sendStatus(400); 
    }
}

const uploadQr = (payload, options, month, semester, year, roomId, res) => {
    try {
        qrcode.toString(payload, options, (err, png) => {
            try {
                const folder = 'payment'
                const fileUpload = bucket.file(`${folder}/${semester}-${year}/${month}/${roomId}`);
                const blobStream = fileUpload.createWriteStream({
                    metadata: {
                        contentType: png
                    }
                });

                blobStream.on('error', (err) => {
                    res.status(405).json(err);
                });

                blobStream.on('finish', () => {
                    res.status(200).send('Upload complete!');
                });

                blobStream.end(png.buffer);

            } catch (error) {
                console.log(error)
                res.sendStatus(400);
            }

        })
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
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
        await uploadQr(payload, options, month, semester, year, roomId, res)
        await uploadBill(roomId, month, semester, year, water, electric, total, res)

    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});
