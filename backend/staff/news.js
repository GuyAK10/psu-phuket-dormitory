const express = require('express');
const { db, storage } = require('../configs/firebase');
const { newsNotify } = require('../configs/line')

const router = express.Router()
const bucket = storage.bucket()

router.post('/staff/news/upload/:newName/:detail', async (req, res) => {
    try {
        const { params: { newName, detail } } = req
        const {
            mimetype,
            buffer,
        } = req.files[0]
        const folder = 'news'
        const fileUpload = bucket.file(`${folder}/` + newName);
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
            const newsRef = db.collection("news").doc(`${newName}`)
            await newsRef.set({
                newsName: newName,
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

router.post('/staff/news/delete/:newName',async (req, res) => {
    try {
        const { params: { newName } } = req
        const folder = 'news'
        await bucket.file(`${folder}/` + newName).delete();
        res.status(200).send({ code: 200, success: true, message: `ลบข่าว${newName}แล้ว` });
    } catch (error) {
        res.sendStatus(400);
    }

});

router.get('/staff/news/',async (req, res) => {
    try {
        const { body: { newName } } = req
        const file = bucket.file(`news/${newName}`);
        await file.download().then(downloadResponse => {
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
        await Promise.all(listName.docs.map(newsName => {
            let dataList = {
                newsId: '',
            }

            dataList.newsId = newsName.id
            Object.assign(dataList, newsName.data())
            newNameset.push(dataList)

        }))

        res.status(200).send({ code: 200, success: true, data: data });
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;