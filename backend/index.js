const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = process.env.PORT || 80
const { verifyHeader } = require("./configs/jwt");
const { staffType, studentType } = require("./configs/type")
const accessControl = require('./access')
const studentprofile = require('./student/profile')
const studentRoom = require('./student/room')
const staffprofile = require('./staff/profile')
const staffRoom = require('./staff/room')
require('dotenv').config()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(accessControl)
// app.use('/staff', verifyHeader, staffType)
app.use(staffprofile);
app.use(staffRoom);
app.use('/student', verifyHeader, studentType)
app.use(studentprofile);
app.use(studentRoom);

app.listen(PORT, () => console.log(`Server is ready! => ${PORT}`))