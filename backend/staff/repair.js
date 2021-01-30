const express = require('express');
const { db } = require('../configs/firebase')

const router = express.Router()

router.get('/staff/repair', async (req, res) => {
    try {
        const { body: { roomId, day, month, semester, year } } = req
        const repairRef = await db.collection('repair').doc(`${semester}-${year}-${month}-${roomId}`).get()
        
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});

module.exports = router;