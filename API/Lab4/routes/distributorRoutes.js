var express = require('express');
const modelDistributor = require('../models/distributors');
var router = express.Router();
router.post('/add', async(req,res) =>{
    try {
        const model = new modelDistributor(req.body)
        const result = await model.save() //thêm vào database
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
    const result = await modelDistributor.find().sort({createdAt: -1});
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
    const result = await modelDistributor.findById(req.params.id);
    if (result) {
      res.send(result);
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

router.get('/search-distributor',async(req,res)=>{
    try {
        const key = req.query.key;

        const data = await modelDistributor.find({name:{'$regex':key,"$options":"i"}}).sort({createdAt:-1})
        if(data.length>0){
            res.json({
                status:200,
                messenger:"Thành công",
                data:data
            })
        }
        else{
            res.json({
                status:400,
                messenger:"Thất bại",
                data:[]
            })
        }
    } catch (error) {
        res.json({
            status:404,
            mess:"Thất bại",
            data:data
        })
        console.log(error);

    }
})
router.patch('/edit/:id', async(req,res)=>{
    try {
        const result = await modelDistributor.findByIdAndUpdate(req.params.id, req.body);
        await result.save();
        if (result) {
            res.json({
                "status":200,
                "messenger":"Cập nhật thành công",
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
})
router.delete('/delete/:id', async(req,res)=>{
    try {
        const result = await modelDistributor.findByIdAndDelete(req.params.id)
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
module.exports = router;