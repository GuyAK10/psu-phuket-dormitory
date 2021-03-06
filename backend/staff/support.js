const express = require('express');
const { supportNotify } = require('../configs/line')

const router = express.Router()

router.post('/staff/support', (req, res) => {
    try {
        const { body: {  detail } } = req
        const type = "staff"
        supportNotify(detail,type)
    } catch (error) {
        console.log(error)
        res.status(400);
    }
});
module.exports = router;