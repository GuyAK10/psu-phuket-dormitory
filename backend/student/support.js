const express = require('express');
const { supportNotify } = require('../configs/line')

const router = express.Router()

router.post('/student/support', (req, res) => {
    try {
        const { body: { detail } } = req
        const type = "student"
        supportNotify(detail, type)
    } catch (error) {
        console.log(error)
        res.status(400);
    }
});
module.exports = router;