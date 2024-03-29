var express = require("express");
var router = express.Router();

const Users = require("../models/users");
const Transporter = require("../config/common/mail");
const upload = require('../config/common/upload');

router.post("/test", function(req, res, next) {
  const mailOptions = {
    from: "soobinnghi@gmail.com", //email gửi đi
    to: "nghinbpd07689@fpt.edu.vn", // email nhận
    subject: "Đăng ký thành công", //subject
    text: "Cảm ơn bạn đã đăng ký", // nội dung mail
  };
  Transporter.sendMail(mailOptions, function(error, info) {
    if(error){
      res.status(500).json({error: "send mail fail" + error})
    } else{
      res.status(200).json({error: "send mail success" + info.response})
    }
  })
})
router.post(
  "/register-send-email",
  upload.single("avatar"),
  async (req, res) => { 
    try {
      const { file } = req;
      const urlAvatar = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
      const model = new Users(req.body);
      model.avatar = urlAvatar;
      const result = await model.save();
      if (result) {
        //Gửi mail
        const mailOptions = {
          from: "soobinnghi@gmail.com", //email gửi đi
          to: model.email, // email nhận
          subject: "Đăng ký thành công", //subject
          text: "Cảm ơn bạn đã đăng ký", // nội dung mail
        };
        // Nếu thêm thành công result !null trả về dữ liệu
        Transporter.sendMail(mailOptions, function(error, info) {
          if(error){
            res.status(500).json({error: "send mail fail" + error})
          } else{
            res.status(200).json({error: "send mail success" + info.response})
          }
        })
      }
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
