const mongoose = require('mongoose')
const Schema  = mongoose.Schema

const transactionSchema = new Schema({
    amount:Number,
    type:String,
    remark:String,
    userid:String
}, {timestamps:true})

const TransactionModel = mongoose.model('Transaction', transactionSchema)

module.exports = TransactionModel