const checkType = {
    studentType: (req, res, next) => {
        try {
            if (req.headers.type === "Students") {
                next();
            }
        } catch (error) {
            console.log("คุณไม่ใช่นักศึกษา")
            res.status(403).send(error);
        }
    },
    staffType: (req, res, next) => {
        try {
            if (req.headers.type === "Staffs") {
                next();
            }
        } catch (error) {
            console.log("คุณไม่ใช่เจ้าหน้าที่/อาจารย์")
            res.status(403).send(error);
        }
    }
}

module.exports = checkType