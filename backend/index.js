const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const { verifyHeader } = require("./configs/jwt");
const accessControl = require('./access')
const studentProfile = require('./student/profile')
const studentRoom = require('./student/room')
const staffProfile = require('./staff/profile')
const staffRoom = require('./staff/room')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(accessControl)
// app.use('/staff', verifyHeader)
app.use(staffProfile);
app.use(staffRoom);
app.use('/student', verifyHeader)
app.use(studentProfile);
app.use(studentRoom);
app.listen(80, () => console.log('Server is ready!'))