const route = require('express').Router()
const productController = require('../controllers/product')




route.post('/',  productController.getProducts)
route.get('/filters',  productController.getFilters)

module.exports = route;