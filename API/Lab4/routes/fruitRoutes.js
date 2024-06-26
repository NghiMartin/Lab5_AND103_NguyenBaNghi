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
                "messenger":"Thêm thành công",
                "data": result
            })
        }else{
            res.json({
                "status":400,
                "messenger":"Thêm thất bại",
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
                "messenger":"Thêm thành công",
                "data": result
            })
        }else{
            res.json({
                "status":400,
                "messenger":"Thêm thất bại",
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
            "messenger":"Thêm thành công",
            "data": result
        })
    } else {
        res.json({
            "status":404,
            "messenger":"Không tìm thấy ID",
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


// router.patch('/edit/:id', upload.array('image', 5),async(req,res)=>{
//     try {
//         const result = await modelFruit.findByIdAndUpdate(req.params.id, req.body)
//         if (result) {
//             await result.save()
//             res.send(result);
//         } else {
//             res.json({
//                 "status":404,
//                 "messenger":"Không tìm thấy ID",
//                 "data": []
//             })
//         }
//       } catch (error) {
//         if (error.name === 'CastError') {
//           res.status(400).send('Invalid ID format');
//         } else {
//           console.log(error);
//           res.status(500).send('Internal Server Error');
//         }
//       }
// })
router.patch('/edit/:id', upload.array('image', 5), async (req, res) => {
    try {
        const { files } = req;
        const urlImages = files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);

        const result = await modelFruit.findByIdAndUpdate(req.params.id, { $set: { ...req.body, image: urlImages } }, { new: true });

        if (result) {
            res.json({
                "status": 200,
                "messenger": "Cập nhật thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 404,
                "messenger": "Không tìm thấy ID",
                "data": []
            });
        }
    } catch (error) {
        if (error.name === 'CastError') {
            res.status(400).send('Định dạng ID không hợp lệ');
        } else {
            console.log(error);
            res.status(500).send('Lỗi máy chủ nội bộ');
        }
    }
});


router.delete('/delete/:id', async(req,res)=>{
    try {
        const result = await modelFruit.findByIdAndDelete(req.params.id)
        if (result) {
            res.json({
                "status":200,
                "messenger":"xóa thành công",
                "data": result
            })
        }else{
            res.json({
                "status":400,
                "messenger":"xóa thất bại",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})
const JWT = require("jsonwebtoken");
const SECRETKEY = "FPTPOLYTECHNIC";

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


router.get('/get-list-fruit', async (req, res,next) => {

    const authHeader = req.headers[ 'authorization' ];
    // Authorization thêm key word  `Bearer token`
    const token = authHeader && authHeader.split(' ')[1] 
    if(token == null) return res.sendStatus(401);
    let payload;
    JWT.verify(token,SECRETKEY, (err, _payload) => {
        if(err instanceof JWT.TokenExpiredError) return res.sendStatus(401)
        if(err) return res.sendStatus(403)
        payload = _payload;
    })

    console.log(payload);

    try {
        const data = await modelFruit.find().populate('id_distributor');
        res.json({
            "status": 200,
            "messenger": "Danh sach fruit",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
})
router.get('/get-page-fruit', async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    let payload;

    JWT.verify(token, SECRETKEY, (err, _payload) => {
        if (err instanceof JWT.TokenExpiredError) return res.sendStatus(401);
        if (err) return res.sendStatus(403);
        payload = _payload;
    });

    console.log(payload);
    let perPage = 6;
    let page = req.query.page || 1;
    let skip = (perPage * page) - perPage; // Phân trang
    let count = await modelFruit.find().count(); // Lấy tổng số phần tử

    // Lọc theo tên
    const name = { "$regex": req.query.name ?? "", "$options": "i" };
    // Lọc theo giá
    const price = { $gte: req.query.price ?? 0 };
    
    // Sắp xếp theo giá
    let sort = {};
    if (req.query.sort) {
        if (req.query.sort === '1') {
            sort = { price: 1 }; // Sắp xếp tăng dần
        } else if (req.query.sort === '-1') {
            sort = { price: -1 }; // Sắp xếp giảm dần
        }
    }

    try {
        const data = await modelFruit.find({ name: name, price: price })
            .populate('id_distributor')
            .sort(sort)
            .skip(skip)
            .limit(perPage);
        res.json({
            "status": 200,
            "messenger": "Danh sách trái cây",
            "data": {
                data,
                "currentPage": Number(page),
                "totalPage": Math.ceil(count / perPage)
            }
        });
    } catch (error) {
        console.log(error);
    }
});

// router.get('/get-page-fruit', async (req, res,next) => {

//     const authHeader = req.headers[ 'authorization' ];
//     // Authorization thêm key word  `Bearer token`
//     const token = authHeader && authHeader.split(' ')[1] 
//     if(token == null) return res.sendStatus(401);
//     let payload;

//     JWT.verify(token,SECRETKEY, (err, _payload) => {
//         if(err instanceof JWT.TokenExpiredError) return res.sendStatus(401)
//         if(err) return res.sendStatus(403)
//         payload = _payload;
//     })

//     console.log(payload);
//     let perPage = 6;
//     let page = req.query.page || 1;
//     let skip = (perPage  * page) - perPage; // Phan trang
//     let count = await modelFruit.find().count(); // get total element

//     //Filter by name
//     const name = {"$regex" : req.query.name ?? "", "$options" : "i" }
//     //
//     const price = {$gte : req.query.price ?? 0}
//     // filter sort by price
//     const sort = {price : req.query.sort ?? 1}



//     try {
//         const data = await modelFruit.find({name : name, price: price})
//                                     .populate('id_distributor')
//                                     .sort(sort)
//                                     .skip(skip)
//                                     .limit(perPage)
//         res.json({
//             "status": 200,
//             "messenger": "Danh sach fruit",
//             "data": {
//                 data,
//                 "currentPage" : Number(page),
//                 "totalPage" : Math.ceil(count/perPage)
//             }
//         })
//     } catch (error) {
//         console.log(error);
//     }
// })
module.exports = router;