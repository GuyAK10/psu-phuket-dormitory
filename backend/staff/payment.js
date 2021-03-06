const express = require('express');
const { db, storage } = require('../configs/firebase')
const xlsxFile = require('xlsx');

const router = express.Router();
const bucket = storage.bucket()
const toAbbMonth = async (abbMonth) => {
  switch (abbMonth) {
    case "january":
      return "ม.ค"
    case "febuary":
      return "ก.พ"
    case "march":
      return "มี.ค"
    case "april":
      return "เม.ย"
    case "may":
      return "พ.ค"
    case "june":
      return "มิ.ย"
    case "july":
      return "ก.ค"
    case "august":
      return "ส.ค"
    case "september":
      return "ก.ย"
    case "october":
      return "ต.ค"
    case "november":
      return "พ.ย"
    case "december":
      return "ธ.ค"
  }
}

const toThaiMonth = async (month) => {
  switch (month) {
    case "january":
      return "มกราคม"
    case "febuary":
      return "กุมภาพันธ์"
    case "march":
      return "มีนาคม"
    case "april":
      return "เมษายน"
    case "may":
      return "พฤษภาคม"
    case "june":
      return "มิถุนายน"
    case "july":
      return "กรกฎาคม"
    case "august":
      return "สิงหาคม"
    case "september":
      return "กันยายน"
    case "october":
      return "ตุลาคม"
    case "november":
      return "พฤศจิกายน"
    case "december":
      return "ธันวาคม"
  }
}
const countInRoom = async (roomId) => {
  let count = 0
  const dormitory = db.collection('dormitory')
  const status = await dormitory.doc('status').get()
  const semester = status.data().semester
  const year = status.data().year
  const roomRef = (await dormitory.doc(`${year}-${semester}-${roomId}`).get()).data()
  if (roomRef.student1 !== undefined && roomRef.student2 !== undefined) {
    count = 2
    return count
  } else if (roomRef.student1 !== undefined && roomRef.student2 == undefined || roomRef.student1 == undefined && roomRef.student2 !== undefined) {
    count = 1
    return count
  } else if (roomRef.student1 == undefined && roomRef.student2 == undefined) {
    count = 0
    return count
  }
}
router.post('/staff/payment/:abbMonth/:abbYear', async (req, res) => {
  try {
    const { buffer } = req.files[0]
    const { params: { abbMonth, abbYear } } = req
    const shortMonth = await toAbbMonth(abbMonth)
    const shortYear = abbYear.slice(2)
    var workbook = xlsxFile.read(buffer, { type: "buffer" });
    let sheetName = workbook.SheetNames
    const status = await db.collection("dormitory").doc("status").get()
    const semester = status.data().semester
    const university_year = status.data().year
    await Promise.all(sheetName.map(async (name) => {
      let result = name.slice(0, 4)
      let checkMonth = name.slice(11, 14)
      let checkYear = name.slice(14, 16)
      if (result === "ชั้น" && checkMonth === shortMonth && checkYear === shortYear) {
        let i = 6
        for (i = 6; i <= 52;) {
          const month = workbook.Sheets[name].A2.v.slice(11, 17)
          const year = workbook.Sheets[name].A2.v.slice(18, 22)
          const roomId = workbook.Sheets[name][`A${i}`].v
          const oldUnit = workbook.Sheets[name][`C${i}`].v
          const newUnit = workbook.Sheets[name][`D${i}`].v
          const unitPrice = workbook.Sheets[name][`F${i}`].v
          const water = workbook.Sheets[name][`I${i}`].v
          let floor = ""
          if (roomId.slice(0, 1) == "A") {
            floor = "floorA"
          }
          else if (roomId.slice(0, 1) == "B") {
            floor = "floorB"
          }
          else if (roomId.slice(0, 1) == "C") {
            floor = "floorC"
          }
          else if (roomId.slice(0, 1) == "D") {
            floor = "floorD"
          }
          else if (roomId.slice(0, 1) == "E") {
            floor = "floorE"
          }
          else if (roomId.slice(0, 1) == "F") {
            floor = "floorF"
          }
          else if (roomId.slice(0, 1) == "G") {
            floor = "floorG"
          }
          else if (roomId.slice(0, 1) == "H") {
            floor = "floorH"
          }
          const count = await countInRoom(roomId)
          await db.collection(`payment`).doc(`${year}-${month}-${roomId}`).set({
            year: +year,
            month: month,
            roomId: roomId,
            water: +water,
            oldUnit: +oldUnit,
            newUnit: +newUnit,
            unitPrice: +unitPrice,
            floor: floor,
            semester: +semester,
            university_year: +university_year,
            count: +count,
            student1: "ค้างชำระ",
            student2: "ค้างชำระ"
          })
          i += 2
        }
      }
    }))
    res.status(200).send({ code: 200, success: true, message: "บันทึกข้อมูลค่าน้ำค่าไฟเรียบร้อย" });
  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

router.get('/staff/payment/:floorId/:month/:year', async (req, res) => {
  try {

    const { params: { floorId, year, month } } = req
    console.log(year, month)
    const thaiMonth = await toThaiMonth(month)
    const billRef = await db.collection('payment').where("floor", "==", `${floorId}`).where("year", "==", +year).where("month", "==", `${thaiMonth}`).get()
    if (billRef.empty)
      res.status(200).send({ code: 200, success: false, message: "ไม่พบค่าน้ำค่าไฟในระบบ" });
    else {
      let billList = []
      await Promise.all(billRef.docs.map((bill) => {
        billList.push(bill.data())
      }))

      res.status(200).send({ code: 200, success: true, message: "พบค่าน้ำค่าไฟในระบบ", data: billList });
    }

  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

router.get('/staff/payment/reciept', async (req, res) => {
  try {
    const { body: { month, year, roomId } } = req
    const folder = 'receipt'
    const thaiMonth = await toThaiMonth(month)
    const file = bucket.file(`${folder}/${year}/${thaiMonth}/${roomId}`);
    const [recieptPictureUrl] = await file.getSignedUrl({ action: "read", expires: Date.now() + 60 * 60 * 10 })
    res.redirect(recieptPictureUrl)

  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

router.post('/staff/payment/paid/:month/:year/:roomId/:studentStatus',async (req, res) => {
  try {
    const { params: { month, year, roomId, studentStatus } } = req
    const thaiMonth = await toThaiMonth(month)
    const receiptRef = db.collection(`payment/`).doc(`${year}-${thaiMonth}-${roomId}`)
    const folder = 'receipt'
    const file = bucket.file(`${folder}/${year}/${thaiMonth}/${roomId}`);
    await file.delete()
    await receiptRef.set({
      [studentStatus]: "ชำระเสร็จสิ้น"
    }, { merge: true })
    res.status(200).send({ code: 200, success: true, message: "Confirm" });
  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
});

module.exports = router;
