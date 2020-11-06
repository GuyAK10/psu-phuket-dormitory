const express = require('express');
const firestore = require('../configs/firebase')
const multer = require('multer');
const { storage } = require('../configs/firebase');
const { newsNotify } = require('../configs/line')

const router = express.Router()
const bucket = firestore.storage().bucket()
const uploader = multer({
    storage: storage
});

router.post('/staff/new/upload/', uploader.single('pdf'), (req, res) => {
    try {
        const { body: { newName } } = req
        const folder = 'news'
        const fileName = `${newName}`
        const fileUpload = bucket.file(`${folder}/` + fileName);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });

        blobStream.on('error', (err) => {
            console.log(err)
            res.status(405).json(err);
        });

        blobStream.on('finish', () => {
            console.log("Upload Complete!")  
            newsNotify(newName) 
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }

});

router.get('/staff/new/', (req, res) => {
    try {
        const { body: {  newName } } = req
        const file = bucket.file(`news/${newName}`);
        file.download().then(downloadResponse => {
            console.log(typeof(downloadResponse[0]))
            res.status(200).send(downloadResponse[0]);
        });
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});

module.exports = router;