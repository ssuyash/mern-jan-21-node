const ProductModel = require('../models/Product')

let productController = {}


productController.getProducts = async (req, res) => {
    let {limit, page, sortby, sortorder} = req.query
    let skipVal = (page-1)*limit
    limit = parseInt(limit)
    let count = await ProductModel.find({}).count()
    let nPages = Math.floor(count/limit)
    let data = await ProductModel.find({}).sort({[sortby]: sortorder}).limit(limit).skip(skipVal)
    res.send({
        status: "OK", msg:"successfully fetched product", data, nPages
    })

}


module.exports = productController