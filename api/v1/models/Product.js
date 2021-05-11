const mongoose = require('mongoose')
const Schema  = mongoose.Schema

const productSchema = new Schema({
    sku:String,
    brand:String,
    name:String,
    price:Number,
    sale_price:Number,
    url:String,
    image_key:String
})

const ProductModel = mongoose.model('Product', productSchema)

module.exports = ProductModel