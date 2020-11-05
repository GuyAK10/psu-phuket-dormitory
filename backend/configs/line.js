var request = require('request');

var token = "XmePmrVCTE4dlbGNDHWNffoRSDfOxIXwJOG3iummhXD";

const lineNotify = {
    receiptNotify: (semester, year, month, roomId) => {
        try {

            var message = `ห้อง ${roomId} ทำการชำระค่าน้ำค่าไฟเทอม ${semester} ปีการศึกษา ${year} เดือน ${month} เรียบร้อยแล้ว`;

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
                    console.log(`ห้อง ${roomId} ทำการชำระค่าน้ำค่าไฟเทอม ${semester} ปีการศึกษา ${year} เดือน ${month} เรียบร้อยแล้ว`)
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

        var message = `ข่าวใหม่! เรื่อง${newName}`;

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
                console.log("อัปเดตข่าวเรื่อง" + `${newName}`)
                res.json({
                    httpResponse: httpResponse,
                    body: body
                });
            }
        });

    },
    repairNotify: (detail) => {

        var message = `ห้อง ${roomId} ทำการแจ้งซ่อม ${detail}`;

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
                console.log(`ห้อง ${roomId} ทำการแจ้งซ่อม ${detail}`)
                res.json({
                    httpResponse: httpResponse,
                    body: body
                });
            }
        });

    },
    supportNotify: (detail,type) => {

        var message = `${type} => ${detail}`;

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
                console.log("ทำการส่งข้อเสนอแนะ/แก้ไขแล้ว")
                res.json({
                    httpResponse: httpResponse,
                    body: body
                });
            }
        });

    }
}

module.exports = lineNotify; 