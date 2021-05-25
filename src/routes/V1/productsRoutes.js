const express = require('express');
const productController = require('../../controller/V1/productsController');

const router= express.Router();

router.post('/create',productController.createProduct);
router.get('/get-all',productController.getProducts);
router.get('/get-by-user/:user',productController.getProductsByUser);




module.exports=router;