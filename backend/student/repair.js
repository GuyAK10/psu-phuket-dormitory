const express = require('express');
const { db } = require('../configs/firebase')
const { repairNotify } = require('../configs/line')

const router = express.Router()

router.post('/student/repair', (req, res) => {
  try {
    const { body: { topic, detail, roomId, day, month, semester, year } } = req
    const repairRef = db.collection('repair').doc(`${semester}-${year}-${month}-${roomId}`)
    repairRef.set({
      semester: semester,
      year: year,
      month: month,
      day: day,
      roomId: roomId,
      detail: detail,
      topic: topic
    })
    repairNotify()
  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

module.exports = router;