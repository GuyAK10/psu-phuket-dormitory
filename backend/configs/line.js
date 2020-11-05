var request = require('request');

var token = "XmePmrVCTE4dlbGNDHWNffoRSDfOxIXwJOG3iummhXD";

const lineNotify = {
    receiptNotify: (semester, year, month, roomId) => {
        try {
            
            var message = `ห้อง ${roomId} ทำการจ่ายเงินเทอม ${semester} ปีการศึกษา ${year} เดือน ${month}`;

            request({
                method: 'POST',
                uri: 'https://notify-api.line.me/api/notify',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                auth: {
                    'bearer': token
                },
                form: {
                    message: message
                }
            }, (err, httpResponse, body) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("แจ้งเตือนว่าส่งสลิปแล้ว")
                    res.json({
                        httpResponse: httpResponse,
                        body: body
                    });
                }
            });
        } catch (error) {
            throw error
        }
        
    },
    newsNotify: (newName) => {
        
        var message = newName;

        request({
            method: 'POST',
            uri: 'https://notify-api.line.me/api/notify',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                'bearer': token
            },
            form: {
                message: message
            }
        }, (err, httpResponse, body) => {
            if (err) {
                console.log(err);
            } else {
                // console.log("อัปเดตข่าวเรื่อง" + `${newName}`)
                console.log("แจ้งเตือนว่าอัปเดตข่าวแล้ว")
                res.json({
                    httpResponse: httpResponse,
                    body: body
                });
            }
        });
        
    }
}

module.exports = lineNotify; 