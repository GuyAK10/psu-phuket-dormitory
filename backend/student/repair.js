const express = require('express');
const firestore = require('../configs/firebase')

const router = express.Router()

router.post('/student/repair', (req, res) => {
    try {
        
        const folder = 'repair'
        const fileName = `${id}`
        const fileUpload = bucket.file(`${folder}/` + fileName);
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: req.file.mimetype
          }
        });
    
        blobStream.on('error', (err) => {
          res.status(405).json(err);
        });
    
        blobStream.on('finish', () => {
          res.status(200).send('Upload complete!');
        });
    
        blobStream.end(req.file.buffer);
      } catch (error) {
        res.sendStatus(400);
      }
});

module.exports = router;