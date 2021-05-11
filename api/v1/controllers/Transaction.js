const TransactionModel = require('../models/Transaction')

let TransactionController = {}


TransactionController.addTransaction = async (req, res) => {
    let { amount, type, remark } = req.body
    
    let newTxn = new TransactionModel({
        amount, type, remark, userid: req.decoded.id
    })
    newTxn.save().then(dbRes => {
        res.send({ status: "OK", msg: "Successfully Saved", data: dbRes })
    }).catch(err => {
        console.log(err)
        res.send({ status: "ERR", msg: "Somthing went wrong", data: [] })

    })
}

TransactionController.getTransactions = async (req, res) => {
    
    let userid = req.decoded.id
    let {limit, page} = req.query
    console.log(limit, page)
    limit = parseInt(limit)
    let skipVal = (page-1)*limit

    let filter = {
        
    }
    try {
        let data = await TransactionModel.find(filter, {_id:0, __v:0})
        .limit(limit)
        .skip(skipVal)
        .sort({createdAt:-1})
        return res.send({ status: "OK", msg: "successfully fetched", data })

    } catch (e) {
        console.log(e)
        return res.send({ status: "ERR", msg: "Something went wrong", data: [] })

    }



}


TransactionController.deleteTransaction = async (req, res) => {
    let { txnid } = req.params
    

    let deleted = await TransactionModel.findOneAndDelete({ _id: txnid, userid: req.docoded.id })
    if (deleted) {
        return res.send({ status: "OK", msg: "Data Deleted", data: deleted })
    } else {
        return res.send({ status: "ERR", msg: "Something went wrong" })
    }
}


TransactionController.updateTransaction = async (req, res) => {
    let { txnid } = req.params
    
    let { data } = req.body
    
    try {
        let updated = await TransactionModel.findOneAndUpdate({ _id: txnid, userid: req.decoded.id }, data )
        return res.send({status:"OK", msg:"updated successfully", data:updated})

    } catch (e) {
        return res.send({status:"ERR", msg:"Something went wrong"})
    }
}


module.exports = TransactionController;