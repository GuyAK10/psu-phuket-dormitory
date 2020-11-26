const express = require('express');
const { db } = require('../configs/firebase')

const router = express.Router()

router.get('/staff/room/system', async (req, res) => {
      try {
            const docRef = await db.collection(`dormitory`).doc(`status`).get()
            if (docRef.exists) {
                  if (docRef.data())
                        res.status(200).send({ code: 200, success: true, message: `ระบบเปิดการจอง`, data: docRef.data() });
                  else
                        res.status(200).send({ code: 200, success: true, message: `ระบบไม่เปิดการจอง`, data: docRef.data() });
            }
      } catch (error) {
            console.log(error)
            res.status(200).send({ code: 200, success: false, message: `เกิดปัญหาในการปิดการจองห้องโปรดติดต่อผู้ดูแลระบบ` });
      }
});

router.post('/staff/room/system', async (req, res) => {
      try {
            const { body: { system } } = req
            console.log(system)
            const docRef = await db.collection(`dormitory`).doc(`status`)
            docRef.update({ system: system })
            if ((await docRef.get()).data().system)
                  res.status(200).send({ code: 200, success: true, message: `เปิดระบบการจองแล้ว`, data: (await docRef.get()).data() });
            else
                  res.status(200).send({ code: 200, success: true, message: `ปิดระบบการจองแล้ว`, data: (await docRef.get()).data() });
      } catch (error) {
            console.log(error)
            res.status(200).send({ code: 200, success: false, message: `เกิดปัญหาในการปิดการจองห้องโปรดติดต่อผู้ดูแลระบบ` });
      }
});

router.post('/staff/room/', (req, res) => {
      try {
            const statusDormitory = {
                  system: req.body.system,
            };
            const docRef = db.doc('/dormitory/status')
            docRef.set(statusDormitory)
            res.status(200).send("change status");

      } catch (error) {
            console.log(error)
            res.sendStatus(400)
      }
});

router.get('/staff/room/:floorId', async (req, res) => {
      try {
            const floorId = req.params.floorId
            const docRef = db.collection(`${floorId}`);
            const roomRef = await docRef.get()
            let result = [];

            roomRef.forEach(roomId => {
                  let floorList = {
                        roomId: '',
                  }

                  floorList.roomId = roomId.id
                  Object.assign(floorList, roomId.data())
                  result.push(floorList)

            })
            res.status(200).send(result);

      } catch (error) {
            console.log(error)
            res.sendStatus(400)
      }
})

router.post('/staff/room/remove', async (req, res) => {
      try {
            const { body: { floorId, roomId, studentId, orderId } } = req
            const profileRef = db.doc(`${floorId}/${roomId}`);
            await profileRef.get().then(async data => {
                  if (data.data()[orderId].id === studentId) {
                        await profileRef.update({ [orderId]: FieldValue.delete() })
                        res.status(200).send({ code: 200, success: true, message: "deleted" })
                  }
                  else {
                        res.status(200).send({ code: 200, success: false, message: "ไม่สามารถยกเลิกการจองของผู้อื่นได้" })
                  }
            })
      } catch (error) {
            console.log(error)
            res.status(200).send({ code: 200, success: false, message: "ผิดพลาดกรุณาเข้าสู่ระบบอีกครั้ง" })
      }
})

// เผื่อใช้ในอนาคต
// อนาคตมาถึงแล้ว
router.post('/staff/room/statusRoom', async (req, res) => {
      try {
            const { body: { floorId, roomId, available } } = req
            const docRef = await db.collection(`${floorId}`).doc(`${roomId}`)

            await docRef.update({ ...req.body })
            if ((await docRef.get()).data().available)
                  res.status(200).send({ code: 200, success: true, message: `เปิดการจองห้อง ${docRef.id} แล้ว` });
            else
                  res.status(200).send({ code: 200, success: true, message: `ปิดการจองห้อง ${docRef.id} แล้ว` });

      } catch (error) {
            console.log(error)
            res.status(200).send({ code: 200, success: false, message: `เกิดปัญหาในการปิดการจองห้องโปรดติดต่อผู้ดูแลระบบ` });
      }
});

module.exports = router;