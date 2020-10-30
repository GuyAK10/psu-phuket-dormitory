const express = require('express');
const { firestore } = require('../configs/firebase')

const router = express.Router();
const bucket = firestore.storage().bucket()
const db = firestore()

router.get('/student/payment/', (req, res) => {
    try {
        const { body: { roomId, month, semester, year, water, electric, total } } = req
        const folder = 'payment'
        const file = bucket.file(`${folder}/${semester}-${year}/${month}/${roomId}`);
        file.download().then(downloadResponse => {
            res.status(200).send(downloadResponse[0]);
        });
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});