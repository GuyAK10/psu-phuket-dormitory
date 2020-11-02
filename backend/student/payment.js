const express = require('express');
const  firestore = require('../configs/firebase')

const router = express.Router();
const bucket = firestore.storage().bucket()
const db = firestore.firestore()

router.get('/student/payment/qrcode', async (req, res) => {
    try {
        const { body: { roomId, month, semester, year } } = req
        const folder = 'payment'
        const file = bucket.file(`${folder}/${semester}-${year}/${month}/${roomId}`);
        file.download().then(downloadResponse => {
            res.status(200).send(downloadResponse[0]);
        });

        const paymentRef = db.doc(`payment/${semester}-${year}/${month}/${roomId}`)
        const billRef = await paymentRef.get()
        res.status(200).send(billRef.data());
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});

router.get('/student/payment/bill', async (req, res) => {
    try {
        
        const { body: { semester, year ,month ,roomId } } = req
        const billRef = await db.collection('payment').where("semester","==",semester).where("year","==",year).where("month","==",month).where("roomId","==",roomId).get()
        
        let billList = []
        billRef.docs.map((bill)=>{
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