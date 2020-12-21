require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 80
const { verifyHeader } = require("./configs/jwt");
const { staffType, studentType } = require("./configs/type")
const accessControl = require('./access')
const functions = require('firebase-functions')

//studentPath
const studentProfile = require('./student/profile')
const studentRoom = require('./student/room')
const studentPayment = require('./student/payment')
const studentNew = require('./student/news')
const studentRepair = require('./student/repair')
const studentSupport = require('./student/support')

//staffPath
const staffProfile = require('./staff/profile')
const staffRoom = require('./staff/room')
const staffPayment = require('./staff/payment')
const staffNew = require('./staff/news')
const staffRepair = require('./staff/repair')
const staffSupport = require('./staff/support')
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//useStaff
app.use(accessControl)
// app.use('/staff', verifyHeader, staffType)
app.use(staffProfile);
app.use(staffRoom);
app.use(staffPayment);
app.use(staffNew);
app.use(staffRepair);
app.use(staffSupport);

//useStudent
// app.use('/student', verifyHeader, studentType)
app.use(studentProfile);
app.use(studentRoom);
app.use(studentPayment);
app.use(studentNew);
app.use(studentRepair);
app.use(studentSupport);

//firebase functions
exports.api = functions.https.onRequest(app);

//express
app.listen(PORT, () => console.log(`Server is ready! => ${PORT}`))