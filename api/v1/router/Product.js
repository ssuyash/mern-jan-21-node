const route = require('express').Router()
const productController = require('../controllers/product')




route.get('/',  productController.getProducts)

module.exports = route;