const jwt = require('jsonwebtoken');
const fs = require('fs')
const firebase = require('./firebase')
require('dotenv').config()

const tokenRef = firebase.firestore().collection('token')
const db = firebase.firestore()
const privateKey = process.env.PRIVATE_KEY
// const privateKey = fs.readFileSync('./configs/private.pem', 'utf8');

let student = {
      profile: {
            id: "",
            name: "",
            surname: "",
            nickname: "",
            religion: "",
            race: "",
            nationality: "",
            birthday: "",
            faculty: "",
            department: "",
            line: ""
      },
      contact: {
            tel: "",
            network: "",
            email: "",
            facebook: "",
            houseno: "",
            village: "",
            villageno: "",
            road: "",
            subdistrict: "",
            district: "",
            province: "",
            postalcode: ""

      },
      information: {
            school: "",
            county: "",
            gpa: "",
            plan: "",
            height: "",
            weight: "",
            blood: "",
            disease: "",
            drugallergy: ""
      },
      friend: {
            name: "",
            surname: "",
            nickname: "",
            tel: "",
            faculty: "",
            department: ""
      },
      family: {
            dad: {
                  name: "",
                  surname: "",
                  age: "",
                  career: "",
                  workplace: "",
                  position: "",
                  income: "",
                  tel: "",
                  network: ""
            },
            mom: {
                  name: "",
                  surname: "",
                  age: "",
                  career: "",
                  workplace: "",
                  position: "",
                  income: "",
                  tel: "",
                  network: ""
            },
            emergency: {
                  name: "",
                  surname: "",
                  age: "",
                  concerned: "",
                  career: "",
                  tel: "",
                  network: ""
            },
            status: ""
      },
      other: {
            talent: "",
            character: "",
            position: ""
      }
}
const createToken = async (user, responseData, _req, res) => {
      try {
            if (responseData.userId === null && responseData.role === null) {
                  res.status(401).send("ID หรือ Password ผิด");
            } else {
                  if (user.type == responseData.role) {

                        const payload = {
                              id: responseData.userId,
                              type: responseData.role,
                              exp: Date.now() + (1000 * 60 * 60)
                        }

                        let encoded = jwt.sign(payload, privateKey, { algorithm: 'HS256' });
                        const register = tokenRef.doc(`${responseData.userId}`)
                        const setProfile = db.collection('students').doc(`${responseData.userId}`);

                        await register.set({
                              id: responseData.userId,
                              type: responseData.role,
                              token: encoded
                        });

                        student.profile.id = responseData.userId
                        student.profile.name = responseData.name
                        student.profile.surname = responseData.surname
                        student.profile.faculty = responseData.faculty
                        student.profile.department = responseData.department
                        student.contact.email = responseData.email

                        if (responseData.role === "Students" && user.username !== "student") {
                              const doc = await setProfile.get()
                              if (!doc.exists) {
                                    await setProfile.set(student)
                              } else {
                                    await setProfile.update({
                                          'profile.id ': responseData.userId,
                                          'profile.name': responseData.name,
                                          'profile.surname': responseData.surname,
                                          'profile.faculty': responseData.faculty,
                                          'profile.department': responseData.department,
                                          'contact.email': responseData.email
                                    })
                              }
                        }

                        res.status(200).send({
                              id: responseData.userId,
                              type: responseData.role,
                              token: encoded
                        })
                  }
                  else {
                        res.status(400).send("สถานะไม่ถูกต้อง")
                  }
            }
      } catch (error) {
            console.error(error)
            res.status(400).send({ code: 400, success: false, message: "เกิดข้อผิดพลาด" + error })
      }
}

const verifyHeader = async (req, res, next) => {
      try {
            if (req.headers.authorization) {
                  const tokenReceive = req.headers.authorization
                  const token = tokenReceive.slice(7)
                  const verifyHeaderToken = await tokenRef.where('token', '==', token).get()
                  let isExpToken = {}
                  const decode = jwt.decode(token, privateKey)
                  if (!verifyHeaderToken.empty) {
                        verifyHeaderToken.forEach(result => isExpToken = { ...result.data() })
                  }
                  if (isExpToken.token !== token) {
                        console.log("Not authorization")
                        res.status(401).send({ code: 401, logout: true, message: "ไม่อนุญาติให้ใช้งาน" })
                  }
                  if (+decode.exp < Date.now()) {
                        console.log("Token expired")
                        res.status(401).send({ code: 401, logout: true, message: "Token expired" })
                  }
                  else next()

            } else {
                  console.log("Please Login")
                  res.status(401).send({ code: 401, logout: true, message: "เกิดข้อผิดพลาดกรุณาเข้าสู่ระบบอีกครั้ง" })
            }
      } catch (error) {
            console.log(error)
            res.sendStatus(400).send({ code: 401, logout: true, message: error });
      }
}

module.exports = {
      verifyHeader,
      createToken
}
