var express = require('express');
var router = express.Router();

//them model
const Distributors = require('../models/distributors');
const Fruits = require('../models/fruits');

router.post('/add-distributor', async (req,res) => {
    try {
        const data = req.body; // get data from body
        const newDIstributors = new Distributors({
            name: data.name
        });
        
        const result = await newDIstributors.save(); // add into data
        if(result)
        {
            res.json({
                "status" : 200,
                "message" : "Add successful",
                "data": result
            })
        }
        else 
        {
            res.json({
                "status" : 400,
                "message" : "Error, Add fail",
                "data": []
            })
        }

    } catch (error) {
        console.log(error);
    }
})
// Api add fruit
router.post('/add-fruit', async (req,res) => {
    try {
        const data = req.body;
        const model = new Fruits(data);
        // const newfruit = new Fruits ({
        //     name : data.name,
        //     quantity: data.quantity,
        //     price: data.price,
        //     status: data.status,
        //     image: data.image,
        //     description: data.description,
        //     id_distributor: data.id_distributor
        // }); // create new obj
        const result = await model.save(); // add on data
        if(result)
        {
            res.json({
                "status" : 200,
                "message" : "Add successful",
                "data": result
            })
        }
        else 
        {
            res.json({
                "status" : 400,
                "message" : "Error, Add fail",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})
const JWT = require("jsonwebtoken");
const SECRETKEY = "FPTPOLYTECHNIC";

// Api get list fruits
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
    } )
    console.log(payload);
    try {
        const data = await Fruits.find().populate('id_distributor');
        res.json({
            "status": 200,
            "messenger": "Danh sach fruit",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
})
// Api get fruit by Id
router.get('/get-fruit-by-id/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Fruits.findById(id).populate('id_distributor');
        res.json({
            "status": 200,
            "messenger": "Danh sach fruit",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
})
//Api cập nhật fruit 
router.put('/update-fruit-by-id/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body; // Dữ liệu từ body
        const updateFruit = await Fruits.findById(id);

        let result = null;

        if (updateFruit) {
            updateFruit.name = data.name ?? updateFruit.name;
            updateFruit.quantity = data.quantity ?? updateFruit.quantity;
            updateFruit.price = data.price ?? updateFruit.price;
            updateFruit.status = data.status ?? updateFruit.status;
            updateFruit.image = data.image ?? updateFruit.image;
            updateFruit.description = data.description ?? updateFruit.description;
            updateFruit.id_distributor = data.id_distributor ?? updateFruit.id_distributor;

            result = await updateFruit.save();
            
            // Nếu cập nhật thành công
            if (result) {
                res.json({
                    "status": 200,
                    "messenger": "Cập nhật thành công",
                    "data": result
                });
            } else {
                // Nếu cập nhật không thành công
                res.json({
                    "status": 400,
                    "messenger": "Lỗi, cập nhật không thành công",
                    "data": []
                });
            }
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});
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
