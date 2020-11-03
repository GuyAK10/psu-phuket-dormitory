const express = require('express');
const firestore = require('../configs/firebase')

const router = express.Router()
const db = firestore.firestore()

router.post('/student/repair', (req, res) => {
    try {
      const { body: { detail, roomId, day , month, semester, year } } = req
      const repairRef = db.collection('repair').doc(`${semester}-${year}-${month}-${roomId}`)
      repairRef.set({
          detail:detail
      })
   
      } catch (error) {
        console.log(error)
        res.sendStatus(400);
      }
});

module.exports = router;