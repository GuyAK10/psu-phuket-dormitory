const express = require('express');
const { db, storage } = require('../configs/firebase')

const router = express.Router()
const bucket = storage.bucket()

router.get('/news/listname', async (req, res) => {
    try {
        const newsRef = db.collection("news");
        const listName = await newsRef.get()
        let newNameset = []
        await Promise.all(listName.docs.map(async newsName => {
            let dataList = {
                newsId: '',
            }

            dataList.newsId = newsName.id
            Object.assign(dataList, newsName.data())
            newNameset.push(dataList)
        }))
        res.status(200).send({ code: 200, success: true, data: newNameset });
    } catch (error) {
        console.log(error)
    }
})

router.get('/news/:newsName', async (req, res) => {
    try {
        const { download } = req.query
        const fileName = req.params.newsName
        const file = bucket.file(`news/${fileName}`);

        const [getUrl] = await file.getSignedUrl({ action: "read", expires: Date.now() + 1000 * 60 * 60 })
        // if (download != 'true') res.status(200).send({ code: 200, success: true, message: "พบไฟล์", data: getUrl })
        if (download != 'true') res.redirect(getUrl)

        else if (download == "true")
            await file.download().then(downloadResponse => {
                res.status(200).send(downloadResponse[0]);
            });

    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }
});

module.exports = router;