const express = require('express');
const { db } = require('../configs/firebase')

const router = express.Router()

router.get('/staff/repair/:semester/:year', async (req, res) => {
    try {
        const { params: {  semester, year } } = req
        console.log(typeof(semester))
        let repairList = []
        const repairRef = await db.collection('repair').where("semester","==",+semester).where("university_year","==",+year).get()
        await Promise.all(repairRef.docs.map((repair) => {
            console.log(repair.data())
            repairList.push(repair.data())
          }))
          console.log(repairList)
        res.status(200).send({ code: 200, success: true, data: repairList });
    } catch (error) {
        console.log(error)
        res.status(200).send({ code: 200, success: true, message: "ยังไม่มีประวัติการแจ้งซ่อม" });
    }
});

module.exports = router;