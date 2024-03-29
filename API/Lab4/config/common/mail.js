var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "soobinnghi@gmail.com",
        pass: "zhjs xhxm tddb hrpc"
    }
});

module.exports = transporter;