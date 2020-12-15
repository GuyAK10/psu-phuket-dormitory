const express = require('express');
const firestore = require('../configs/firebase')
const multer = require('multer');
const { db, storage } = require('../configs/firebase');
const { newsNotify } = require('../configs/line')

const router = express.Router()
const bucket = storage.bucket()
const uploader = multer();

router.post('/staff/news/upload/:newName', uploader.single('pdf'), async (req, res) => {
    console.log(req.body)
    try {
        const { params: { newName } } = req
        const folder = 'news'
        const fileName = req.file.originalname
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

        blobStream.on('finish', async () => {
            await newsNotify(newName)
            const newsRef =  db.collection("news").doc(`${newName}`)
            await newsRef.set({
                newsName:fileName
            })
            res.status(200).send({ code: 200, success: true, message: `อัพเดทข่าวแล้ว` });
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }

});

router.get('/staff/news/', (req, res) => {
    try {
        const { body: { newName } } = req
        const file = bucket.file(`news/${newName}`);
        file.download().then(downloadResponse => {
            const fileNews = downloadResponse[0]
            res.setHeader('Content-Type', 'application/pdf');
            res.status(200).send(fileNews);
        });
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});

router.get('/staff/news/listname', async (req, res) => {
    try {
        const newsRef = db.collection("news");
        const listName =  await newsRef.get()
        let newNameset = []
        listName.forEach(newsName => {
            let dataList = {
                newsId: '',
            }

            dataList.newsId = newsName.id
            Object.assign(dataList, newsName.data())
            newNameset.push(dataList)

        })
        res.status(200).send({ code: 200, success: true, data:newNameset });
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;