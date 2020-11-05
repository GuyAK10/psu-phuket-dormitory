const express = require('express');
const firestore = require('../configs/firebase')

const router = express.Router()
const db = firestore.firestore()

router.get('/staff/repair', async (req, res) => {
    try {
        const { body: {  roomId, day , month, semester, year } } = req
        const repairRef = await db.collection('repair').doc(`${semester}-${year}-${month}-${roomId}`).get()
        console.log(repairRef.data())
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});

module.exports = router;