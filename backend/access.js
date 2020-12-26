require('tls').DEFAULT_MIN_VERSION = 'TLSv1'   // since TLSv1.3 default disable v1.0 
const express = require('express');
const soap = require('soap');
const { userUsecase } = require('./usecase/userUsecase')
const url = 'https://passport.psu.ac.th/authentication/authentication.asmx?wsdl';
const router = express.Router()
const { db, admin } = require('./configs/firebase')
const { createToken } = require('./configs/jwt')
const xlsxFile = require('read-excel-file/node');

//remove token
router.delete('/logout/:userId', async (req, res) => {
    const userId = req.params.userId
    const docRef = db.collection('token')
    const find = await docRef.where('id', "==", userId).get()
    let deleteId = {}

    try {
        if (!find.empty) {
            find.forEach(res => deleteId = { ...res.data() })
        }
        docRef.doc(deleteId.id).delete()
        res.status(200)
            .clearCookie('token')
            .clearCookie('user')
            .send({ code: 200, status: "Logout", message: "Logout" });
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

//create token
router.post('/login', (req, res) => {
    try {
        soap.createClient(url, (err, client) => {
            const { username, password, type } = req.body

            //test user staff
            const mockRequestStaff = { headers: { type: "Staffs" } }
            const mockRequestStudent = { headers: { type: "Students" } }
            if (username == "staff") {
                createToken({ username, password: "any", type: "Staffs" }, { userId: "staff test User", role: "Staffs" }, mockRequestStaff, res)
            }
            //test user student
            else if (username == "student") {
                createToken({ username, password: "any", type: "Students" }, { userId: "student test user", role: "Students" }, mockRequestStudent, res)
            }

            else {
                client.GetUserDetails({ username, password, type }, (err, response) => {
                    try {
                        const responseData = {
                            userId: userUsecase.getStudentId(response),
                            role: userUsecase.getRole(response),
                            name: userUsecase.getName(response),
                            surname: userUsecase.getSurname(response),
                            faculty: userUsecase.getFaculty(response),
                            department: userUsecase.getDepartment(response),
                            email: userUsecase.getEmail(response)
                        }

                        createToken({ username, password, type }, responseData, req, res)

                    } catch (error) {
                        console.log(error)
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

router.post('/test', (req, res) => {
    let listFloor = ["A", "B", "C", "D", "E", "F", "G", "H"]
    listFloor.forEach(async (floor) => {
        await xlsxFile('./ค่าไฟหอพักนักศึกษา ชั้น A-H ปี 2564 ใช้งาน.xlsx', { sheet: `ชั้น${floor}01-${floor}24ต.ค63` }).then((rows) => {

            let excelData = rows[1][0].split(" ")
            month = excelData[1]
            let year = excelData[2]
            console.log("ค่าน้ำค่าไฟประจำเดือน", month, year)
            for (i = 5; i < 52;) {
                console.log("ห้อง", rows[i][0], "ยูนิตเดือนก่อน", rows[i][2], "ยูนิตเดือนนี้", rows[i][3], "ราคาต่อหน่วย", rows[i][5], "ค่าน้ำ", rows[i][8])
                i += 2
            }
        })
    })
});

module.exports = router;