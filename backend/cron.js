const cron = require('node-cron');
const jwt = require('jsonwebtoken');
const { db } = require('./configs/firebase')
const fs = require('fs')
const privateKey = fs.readFileSync('./configs/private.pem', 'utf8');
cron.schedule('*/10 * * * *', async () => {
    console.log('Run task every minute');
    let tokenList = []
    const tokenRef = await db.collection('token').get()
    tokenRef.forEach((tokenData) => {
        tokenList.push(tokenData.data().token)
    })
    tokenList.forEach(async (token) => {
        console.log(token)
        const decode = jwt.decode(token, privateKey)
        console.log(decode)
        if (+decode.exp < Math.floor(Date.now() / 1000)) {
            console.log(Math.floor(Date.now() / 1000))
            const expiredToken = await db.collection('token').where("token", "==", token).get()
            expiredToken.forEach(async (doc) => {
                console.log(doc.id)
                const docId = doc.id
                await db.collection('token').doc(docId).delete()
            })
        }
    })

});