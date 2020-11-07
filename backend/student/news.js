const express = require('express');
const firestore = require('../configs/firebase')

const router = express.Router()
const bucket = firestore.storage().bucket()

router.get('/staff/new/', (req, res) => {
    try {
        const { body: {  newName } } = req
        const file = bucket.file(`news/${newName}`);
        file.download().then(downloadResponse => {
            res.status(200).send(downloadResponse[0]);
        });
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});

module.exports = router;