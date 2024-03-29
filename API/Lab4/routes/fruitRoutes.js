var express = require('express');
const modelFruit = require('../models/fruits');
const upload = require('../config/common/upload');

var router = express.Router();
router.post('/add', upload.array('image', 5), async(req,res) =>{
    try {
        const {files} = req;
        const urlImages = files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
        const model = new modelFruit(req.body);
        model.image = urlImages;
        const result = await model.save(); //thêm vào database
        if (result) {
            res.json({
                "status":200,
                "messager":"Thêm thành công",
                "data": result
            })
        }else{
            res.json({
                "status":400,
                "messager":"Thêm thất bại",
                "data": []
            })
        }
        // res.send(result)
    } catch (error) {
        console.log('Error:'+error);
    }
})

router.get('/list', async(req,res)=>{
    const result = await modelFruit.find({})
    try {
        if (result) {
            res.json({
                "status":200,
                "messager":"Thêm thành công",
                "data": result
            })
        }else{
            res.json({
                "status":400,
                "messager":"Thêm thất bại",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})
router.get('/getbyid/:id', async (req, res) => {
  try {
    const result = await modelFruit.findById(req.params.id);
    if (result) {
        res.json({
            "status":200,
            "messager":"Thêm thành công",
            "data": result
        })
    } else {
        res.json({
            "status":404,
            "messager":"Không tìm thấy ID",
            "data": []
        })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send('Invalid ID format');
    } else {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  }
});
router.patch('/edit/:id', async(req,res)=>{
    try {
        const result = await modelFruit.findByIdAndUpdate(req.params.id, req.body)
        if (result) {
            await result.save()
            res.send(result);
        } else {
            res.json({
                "status":404,
                "messager":"Không tìm thấy ID",
                "data": []
            })
        }
      } catch (error) {
        if (error.name === 'CastError') {
          res.status(400).send('Invalid ID format');
        } else {
          console.log(error);
          res.status(500).send('Internal Server Error');
        }
      }
})
router.delete('/delete/:id', async(req,res)=>{
    try {
        const result = await modelFruit.findByIdAndDelete(req.params.id)
        if (result) {
            res.json({
                "status":200,
                "messager":"xóa thành công",
                "data": result
            })
        }else{
            res.json({
                "status":400,
                "messager":"xóa thất bại",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})


 // Định nghĩa API endpoint GET danh sách Fruits trong khoảng giá và sắp xếp theo quantity giảm dần
 router.get('/get-list-fruit-in-price', async (req, res) => {
    try {
        const {price_start, price_end} = req.query;

        const query = {price: { $gte: price_start, $lte: price_end} }
        const data = await Fruits.find(query, 'name quantity price id_distributor') // Lọc theo khoảng giá
                                 .populate('id_distributor')   
                                 .sort({ quantity: -1 }) // Sắp xếp theo quantity giảm dần
                                .skip(0) // bo qua so luong row
                                .limit(2) // lay 2 sp
        res.json({
            "status": 200,
            "messenger": "Danh sach fruit",
            "data": data
        })
    } catch (error) {
        console.error('Error fetching fruits:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//Api Get danh sách Fruits có chữ cái bắt đầu tên là A hoặc X
router.get('/get-list-fruit-have-name-d-or-x', async (req, res) => {
    try {
        const query = { $or: [
            {name : {$regex : 'D'}},
            {name : {$regex: 'X'}}
        ]}
        
        const  data = await Fruits.find(query, 'name quantity price id_distributor')
                                    .populate('id_distributor')

                                    res.json({
                                        "status": 200,
                                        "messenger": "Danh sach fruit",
                                        "data": data
                                    })     
    } catch (error) {
        console.error('Error fetching fruits:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
} )
module.exports = router;