var express = require('express');
const upload = require('../config/common/upload');
var router = express.Router();

router.get('/test', function(req, res, next) {
    res.send('respond with a resource upload test');
});

//add data

router.post('/mulUpload', upload.array('images',5) , async(req,res) =>{
    try {
    const {files} = req
    const urlImages = files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)
    console.log(urlImages);
        // const result = await model.save() //thêm vào database
        // if (result) {
        //     res.json({
        //         "status":200,
        //         "message":"Thêm thành công",
        //         "data": result
        //     })
        // }else{
        //     res.json({
        //         "status":400,
        //         "message":"Thêm thất bại",
        //         "data": []
        //     })
        // }
        // res.send(result)
    } catch (error) {
        console.log('Error:'+error);
    }
})

module.exports = router;