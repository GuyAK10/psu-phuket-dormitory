const express = require('express');
const firestore = require('../configs/firebase')

const router = express.Router()
const db = firestore.firestore()

router.post('/staff/room/',  (req, res) => {
      try {
            const statusDormitory = {
                  system: req.body.system,
            };
            const docRef = db.doc('/dormitory/status')
            docRef.set(statusDormitory)
            res.status(200).send("change status");

      } catch (error) {
            res.sendStatus(400)
      }
});

router.get('/staff/room/:floorId/', async (req, res) => {
      try {
            const { body: { floorId } } = req
            const docRef = db.collection(`${floorId}`);
            const roomRef = await docRef.get()
            let result = [];

            roomRef.forEach(floors => {
                  let floorList = {
                      floorId: '',
                  }
  
                  floorList.floorId = floors.id
                  Object.assign(floorList, floors.data())
                  result.push(floorList)
  
              })
            res.status(200).send(result);

      } catch (error) {
            res.sendStatus(400)
      }
})

router.delete('/staff/room/remove', async (req, res) => {
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
// router.post('/staff/room/statusRoom',  async (req, res) => {
//       try {

//             const { body: { floorId, roomId, studentId, orderId } } = req
//             const statusRoom = {
//                   roomStatus: req.body.roomStatus
//             }

            
//             const docRef = db.collection(`${floorId}`).doc(`${roomId}`)
//             await docRef.update(statusRoom)
//             res.status(200).send("change status");

//       } catch (error) {
//             res.sendStatus(400)
//       }
// });


module.exports = router;