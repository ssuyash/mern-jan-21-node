const ProductModel = require('../models/Product')

let productController = {}


productController.getProducts = async (req, res) => {
    

    let {limit, page, sortby, minPrice, maxPrice, brands, allBrands} = req.body
    console.log(brands, minPrice, maxPrice)
    if(brands.length == 0){
        console.log("here")
        brands = [...allBrands]
    }
    let skipVal = (page-1)*limit
    limit = parseInt(limit)

    let sortConfig = {
        'name_asc':{sortKey:'name', order:1},
        'name_desc':{sortKey:'name', order:-1},
        'price_asc':{sortKey:'price', order:1},
        'price_desc':{sortKey:'price', order:-1}
    }


    let count = await ProductModel.find({$and:[
        {price:{$gte:minPrice}},
        {price:{$lte:maxPrice}},
        {brand:{$in:brands}}
     ]}).count()
    let nPages = Math.floor(count/limit)
    let {sortKey, order} = sortConfig[sortby]
    console.log("we are here", sortKey, order)
    let data = await ProductModel.find({$and:[
        {price:{$gte:minPrice}},
        {price:{$lte:maxPrice}},
        {brand:{$in:brands}}
     ]})
                .sort({ [sortKey] : [order] })
                .limit(limit)
                .skip(skipVal)

    res.send({
        status: "OK", msg:"successfully fetched products", data, nPages
    })

}


productController.getFilters = async (req, res)=>{
   let brands =  await ProductModel.distinct("brand")
   let minPrice = await ProductModel.findOne({}, {price:1, _id:0}).sort({price:1})
   let maxPrice = await ProductModel.findOne({}, {price:1, _id:0}).sort({price:-1})
   return res.send({ 
       brands,
       minPrice, 
       maxPrice
   })

}


module.exports = productController