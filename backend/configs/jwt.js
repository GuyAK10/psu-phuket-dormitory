const jwt = require('jsonwebtoken');
const fs = require('fs')
const { db } = require('./firebase');
require('dotenv').config()

const tokenRef = db.collection('token')
// const privateKey = process.env.PRIVATE_KEY
const privateKey = fs.readFileSync('./configs/private.pem', 'utf8');

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
                  //save test user for profile
                  if (user.username === 'student') {
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

                        student.profile.id = 'student test user'
                        student.profile.name = "userStudentForTest"
                        student.profile.surname = "userStudentForTest"
                        student.profile.faculty = "testFaculty"
                        student.profile.department = "testDepartment"
                        student.contact.email = "test@test.com"

                        if (user.username === "student") {
                              const doc = await setProfile.get()
                              if (!doc.exists) {
                                    await setProfile.set(student)
                              } else {
                                    await setProfile.update({
                                          'profile.id ': "studentTest",
                                          'profile.name': "userStudentForTest",
                                          'profile.surname': "userStudentForTest",
                                          'profile.faculty': "testFaculty",
                                          'profile.department': "testDepartment",
                                          'contact.email': "test@test.com"
                                    })
                              }
                        }

                        res.status(200).
                              cookie("token", encoded, {
                                    expire: Date.now() + 1000 * 60 * 10,
                                    httpOnly: true,
                              })
                              .cookie("user", {
                                    id: responseData.userId,
                                    name: responseData.name,
                                    surname: responseData.surname,
                                    type: responseData.role,
                              }, {
                                    expire: Date.now() + 1000 * 60 * 10,
                              }).send({
                                    token: encoded,
                                    user: {
                                          id: "student test user",
                                          name: "userStudentForTest",
                                          surname: "userStudentForTest",
                                          type: "Students",
                                    }
                              })
                  }

                  else if (user.username === 'staff') {
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

                        student.profile.id = 'staffTest'
                        student.profile.name = "userStaffForTest"
                        student.profile.surname = "userStaffForTest"
                        student.profile.faculty = "testFaculty"
                        student.profile.department = "testDepartment"
                        student.contact.email = "test@test.com"

                        if (user.username === "staff") {
                              const doc = await setProfile.get()
                              if (!doc.exists) {
                                    await setProfile.set(student)
                              } else {
                                    await setProfile.update({
                                          'profile.id ': "staffTest",
                                          'profile.name': "userStaffForTest",
                                          'profile.surname': "userStaffForTest",
                                          'profile.faculty': "testFaculty",
                                          'profile.department': "testDepartment",
                                          'contact.email': "test@test.com"
                                    })
                              }
                        }

                        res.status(200).
                              cookie("token", encoded, {
                                    expire: Date.now() + 1000 * 60 * 10,
                                    httpOnly: true,
                              })
                              .cookie("user", {
                                    id: responseData.userId,
                                    name: responseData.name,
                                    surname: responseData.surname,
                                    type: responseData.role,
                              }, {
                                    expire: Date.now() + 1000 * 60 * 10,
                              }).send({
                                    token: encoded,
                                    user: {
                                          id: "staffTest",
                                          name: "userStaffForTest",
                                          surname: "userStaffForTest",
                                          type: "Staffs",
                                    }
                              })
                  }

                  else if (user.type == responseData.role) {

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

                        if (responseData.role === "Students") {
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
                              res.status(200)
                                    .cookie("token", encoded, {
                                          expire: Date.now() + 1000 * 60 * 10,
                                          httpOnly: true,
                                    })
                                    .cookie("user", {
                                          id: responseData.userId,
                                          name: responseData.name,
                                          surname: responseData.surname,
                                          type: responseData.role,
                                    }, {
                                          expire: Date.now() + 1000 * 60 * 10,
                                    })
                                    .send({
                                          token: encoded,
                                          user: {
                                                id: responseData.userId,
                                                name: responseData.name,
                                                surname: responseData.surname,
                                                type: responseData.role,
                                          }
                                    })
                        }
                  }

                  else if (responseData.role === "Staff") {
                        res.status(200)
                              .cookie("token", encoded, {
                                    expire: Date.now() + 1000 * 60 * 10,
                                    httpOnly: true,
                              })
                              .cookie("user", {
                                    id: responseData.userId,
                                    name: responseData.name,
                                    surname: responseData.surname,
                                    type: responseData.role,
                              }, {
                                    expire: Date.now() + 1000 * 60 * 10,
                              })
                              .send({
                                    token: encoded,
                                    user: {
                                          id: responseData.userId,
                                          name: responseData.name,
                                          surname: responseData.surname,
                                          type: responseData.role,
                                    }
                              })
                  }
                  else {
                        console.log('สถานะไม่ถูกต้อง')
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
            if (req.cookies) {
                  const { token } = req.cookies || req.headers
                  const verifyToken = await tokenRef.doc('token', '==', token).get()
                  if (verifyToken.empty) {
                        res.status(401).send({ code: 401, logout: true, message: "session หมดอายุ" });
                  }
                  else next()
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
