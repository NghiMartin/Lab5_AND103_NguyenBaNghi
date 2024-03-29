var express = require("express");
const modelUser = require("../models/users");
var router = express.Router();
router.post("/add", async (req, res) => {
  try {
    const model = new modelUser(req.body);
    const result = await model.save(); //thêm vào database
    if (result) {
      res.json({
        status: 200,
        message: "Thêm thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        message: "Thêm thất bại",
        data: [],
      });
    }
    // res.send(result)
  } catch (error) {
    console.log("Error:" + error);
  }
});

router.get("/list", async (req, res) => {
  const result = await modelUser.find({});
  try {
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});
router.get("/getbyid/:id", async (req, res) => {
  try {
    const result = await modelUser.findById(req.params.id);
    if (result) {
      res.send(result);
    } else {
      res.json({
        status: 404,
        message: "Không tìm thấy ID",
        data: [],
      });
    }
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400).send("Invalid ID format");
    } else {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
});
router.patch("/edit/:id", async (req, res) => {
  try {
    const result = await modelUser.findByIdAndUpdate(req.params.id, req.body);
    if (result) {
      await result.save();
      res.send(result);
    } else {
      res.json({
        status: 404,
        message: "Không tìm thấy ID",
        data: [],
      });
    }
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400).send("Invalid ID format");
    } else {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const result = await modelUser.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({
        status: 200,
        message: "xóa thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        message: "xóa thất bại",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

const JWT = require("jsonwebtoken");
const SECRETKEY = "FPTPOLYTECHNIC";
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await modelUser.findOne({ username, password });
    if (user) {
      //Token người dùng sẽ sử dụng gửi lên trên header mỗi lần muốn gọi api
      const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: "1h" });
      //Khi token hết hạn, người dùng sẽ call 1 api khác để lấy token mới
      //Lúc này người dùng sẽ truyền refreshToken lên để nhận về 1 cặp token,refreshToken mới
      //Nếu cả 2 token đều hết hạn người dùng sẽ phải thoát app và đăng nhập lại
      const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, {
        expiresIn: "1d",
      });
      //expiresIn thời gian token
      res.json({
        status: 200,
        messenger: "Đăng nhâp thành công",
        data: user,
        token: token,
        refreshToken: refreshToken,
      });
    } else {
      // Nếu thêm không thành công result null, thông báo không thành công
      res.json({
        status: 400,
        messenger: "Lỗi, đăng nhập không thành công",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
