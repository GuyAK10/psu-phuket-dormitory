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
const fileMiddleware = require('express-multipart-file-parser')
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
const isDev = !!process.env.DEVELOPEMENT
const origin = isDev ? ["http://localhost:3000", "http://localhost:5000"]
    : ["https://psu-phuket-dormitory.firebaseapp.com", "https://psu-phuket-dormitory.web.app", "https://dormphuket.web.app", "https://dormphuket.firebaseapp.com"]
require('./cron');

isDev && console.log("this is development mode")
!isDev && console.log("this is production mode")

app.use(cors({
    origin,
    credentials: true
}))
app.use(fileMiddleware)
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
exports.api = functions.https.onRequest(app)

//express
isDev && app.listen(PORT, () => console.log(`Server is ready! => ${PORT}`))