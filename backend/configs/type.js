let i = 0
const checkType = {
    studentType: (req, res, next) => {
        const type = req.headers ? req.headers.type : JSON.parse(req.cookies).type
        try {
            if (type === "Students") {
                next();
            }
        } catch (error) {
            console.log("คุณไม่ใช่นักศึกษา")
            res.status(403).send(error);
        }
    },
    staffType: (req, res, next) => {
        const { type } = JSON.parse(req.cookies.user) || ""
        try {
            if (type === "Staffs") {
                next();
            }
        } catch (error) {
            console.log("คุณไม่ใช่เจ้าหน้าที่/อาจารย์")
            res.status(403).send(error);
        }
    }
}

module.exports = checkType