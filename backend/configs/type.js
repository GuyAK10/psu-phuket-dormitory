const checkType = {
    studentType: (req, res, next) => {
        // console.log(req.cookies)
        const type = req.cookies.user.type
        try {
            if (type === "Students") {
                next();
            }
            else {
                res.status(403).send({ code: 403, success: false, messagge: "session หมดอายุ" });
            }
        } catch (error) {
            console.log("คุณไม่ใช่นักศึกษา")
            res.status(403).send({ code: 403, success: false, messagge: "เฉพาะนักศึกษาที่สถานะกำลังศึกษาดท่านั้นที่ใช้งานระบบนี้ได้" });
        }
    },
    staffType: (req, res, next) => {
        const { type } = JSON.parse(req.cookies.user) || ""
        try {
            if (type === "Staffs") {
                next();
            }
            else {
                res.status(403).send({ code: 403, success: false, messagge: "session หมดอายุ" });
            }
        } catch (error) {
            console.log("คุณไม่ใช่เจ้าหน้าที่/อาจารย์")
            res.status(403).send({ code: 403, success: false, messagge: "คุณไม่ใช่เจ้าหน้าที่" });
        }
    }
}

module.exports = checkType