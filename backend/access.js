require('tls').DEFAULT_MIN_VERSION = 'TLSv1'   // since TLSv1.3 default disable v1.0 
const express = require('express');
const soap = require('soap');
const { userUsecase } = require('./usecase/userUsecase')
const jwt = require('jsonwebtoken');
const fs = require('fs')
const url = 'https://passport.psu.ac.th/authentication/authentication.asmx?wsdl';
const router = express.Router()
const firestore = require('./configs/firebase')
const db = firestore.firestore()
const { createToken } = require('./configs/jwt')

//remove token
router.delete('/logout/:token', async (req, res) => {
    const token = req.params.token
    const docRef = db.collection('token')
    const find = await docRef.where('token', "==", token).get()
    let deleteId = {}

    try {
        if (!find.empty) {
            find.forEach(res => deleteId = { ...res.data() })
        }
        docRef.doc(deleteId.id).delete()
        console.log("Logout")
        res.status(200).send({ code: 401, status: "Logout", message: "Logout" });
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

//create token
router.post('/', (req, res) => {
    try {
        soap.createClient(url, (err, client) => {
            const { username, password, type } = req.body

            //test user staff
            const mockRequestStaff = { headers: { type: "Staffs" } }
            const mockRequestStudent = { headers: { type: "Staffs" } }
            if (username == "staff") {
                createToken({ username, password: "any", type: "Staffs" }, { userId: "Test User", role: "Staffs" }, mockRequestStaff, res)
            }
            //test user student
            else if (username == "student") {
                createToken({ username, password: "any", type: "Students" }, { userId: "Test User", role: "Students" }, mockRequestStudent, res)
            }

            else {
                client.GetUserDetails({ username, password, type }, async function (err, response) {
                    try {
                        const responseData = {
                            userId: userUsecase.getStudentId(response),
                            role: userUsecase.getRole(response),
                            name:userUsecase.getName(response),
                            surname:userUsecase.getSurname(response),
                            faculty:userUsecase.getFaculty(response),
                            department:userUsecase.getDepartment(response),
                            email:userUsecase.getEmail(response)
                        }
    
                        createToken({ username, password, type }, responseData, req, res)
                    } catch (error) {
                        console.log(error)
                        throw error
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

module.exports = router;