const express = require('express');
const multer = require('multer');
const { db, storage } = require('../configs/firebase');
const { newsNotify } = require('../configs/line')

const router = express.Router()
const bucket = storage.bucket()
const uploader = multer();

router.post('/staff/news/upload/:newName/:detail', async (req, res) => {
    try {
        const { params: { newName, detail } } = req
        const {
            mimetype,
            buffer,
        } = req.files[0]
        const folder = 'news'
        const fileName = req.file.originalname
        const fileUpload = bucket.file(`${folder}/` + fileName);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: mimetype
            }
        });

        blobStream.on('error', (err) => {
            console.log(err)
            res.status(405).json(err);
        });

        blobStream.on('finish', async () => {
            await newsNotify(newName)
            const newsRef = db.collection("news").doc(`${decodeURI(newName)}`)
            await newsRef.set({
                newsName: fileName,
                detail,
                title: newName
            })
            res.status(200).send({ code: 200, success: true, message: `อัพเดทข่าวแล้ว` });
        });

        blobStream.end(buffer);
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
        const listName = await newsRef.get()
        let newNameset = []
        listName.forEach(newsName => {
            let dataList = {
                newsId: '',
            }

            dataList.newsId = newsName.id
            Object.assign(dataList, newsName.data())
            newNameset.push(decodeURI(dataList))

        })
        res.status(200).send({ code: 200, success: true, data: newNameset });
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;