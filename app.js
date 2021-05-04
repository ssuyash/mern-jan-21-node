const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const bcrypt = require('bcrypt')
const UserModel = require('./models/User')
const TransactionModel = require('./models/Transaction')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const ENC_KEY = "9j3j,asdjtp9r3asdfas@#$@$%$^#@dff"
const DB_URL = 'mongodb+srv://ayushi:lgNmRWcUoITrXcJA@cluster0.yq5ua.mongodb.net/mernjan21?retryWrites=true&w=majority'

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(con => {
    console.log("Database server is connnected")
}).catch(err => {

    console.log("Error in DB Connection", err)
})

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ extended: false }))


app.post("/register", async (req, res) => {
    let { name, email, password } = req.body
    UserModel.findOne({ email }).then(async dbres => {
        if (dbres != null) {
            //user already exists
            res.send({ status: "ERR", msg: "user already exists", data: [] })
        } else {
            //user does not exists
            let pwd = await bcrypt.hash(password, 10)
            console.log("pwd is ", pwd)

            let user = new UserModel({ name, email, password: pwd })

            user.save().then(dbres => {
                //data saved successfully  
                res.send({ status: "OK", msg: "successfully saved", data: dbres })
            }).catch(err => {
                //data not saved
                res.send({ status: "ERR", msg: "something went wrong", data: [] })
            })
        }
    }).catch(err => {
        res.send({ status: "ERR", msg: "something went wrong", data: [] })

    })









})

app.post("/login", async (req, res) => {
    let { email, password } = req.body
    let dbData = await UserModel.findOne({ email })
    if (dbData != null) {
        let dbpwd = dbData['password']
        console.log(dbpwd)
        let isSame = await bcrypt.compare(password, dbpwd)
        let { _id, name } = dbData
        if (isSame) {
            //authentication success
            let token = await jwt.sign({ id: _id }, ENC_KEY)
            res.send({ status: "OK", msg: "successfully logged in ", data: [{ token, name }] })

        } else {
            //authentication failed
            res.send({ status: "ERR", msg: "Invalid email or password" })


        }
    } else {
        res.send({ status: "ERR", msg: "Invalid email or password" })
    }
})


app.post('/transaction', async (req, res) => {
    let { amount, type, remark, userid } = req.body
    let { token } = req.headers
    let decoded = null
    try {
        decoded = await jwt.verify(token, ENC_KEY)

    } catch (e) {
        return res.send({ status: "ERR", msg: "Invalid authentication token" })

    }
    let newTxn = new TransactionModel({
        amount, type, remark, userid: decoded.id
    })
    newTxn.save().then(dbRes => {
        res.send({ status: "OK", msg: "Successfully Saved", data: dbRes })
    }).catch(err => {
        console.log(err)
        res.send({ status: "ERR", msg: "Somthing went wrong", data: [] })

    })
})

app.get('/transactions', async (req, res) => {
    let { token } = req.headers
    let decoded = null
    try {
        decoded = await jwt.verify(token, ENC_KEY)

    } catch (e) {
        return res.send({ status: "ERR", msg: "Invalid authentication token" })

    }
    let userid = decoded.id

    try {
        let data = await TransactionModel.find({ userid })
        return res.send({ status: "OK", msg: "successfully fetched", data })

    } catch (e) {
        return res.send({ status: "ERR", msg: "Something went wrong", data: [] })

    }



})


app.delete('/transaction/:txnid', async (req, res) => {
    let { txnid } = req.params
    let { token } = req.headers
    let docoded = null

    try {
        docoded = await jwt.verify(token, ENC_KEY)
    } catch (e) {
        return res.send({ status: "ERR", msg: "Invalid authentication token" })

    }

    let deleted = await TransactionModel.findOneAndDelete({ _id: txnid, userid: docoded.id })
    if (deleted) {
        return res.send({ status: "OK", msg: "Data Deleted", data: deleted })
    } else {
        return res.send({ status: "ERR", msg: "Something went wrong" })
    }
})

app.post('/transaction/edit/:txnid', async (req, res) => {
    let { txnid } = req.params
    let { token } = req.headers
    let { data } = req.body
    let decoded = null
    try {
        decoded = jwt.verify(token, ENC_KEY)
    } catch (e) {
        return res.send({ status: "ERR", msg: "invalid authentication token", data: [] })
    }
    try {
        let updated = await TransactionModel.findOneAndUpdate({ _id: txnid, userid: decoded.id }, data )
        return res.send({status:"OK", msg:"updated successfully", data:updated})

    } catch (e) {
        return res.send({status:"ERR", msg:"Something went wrong"})
    }
})
app.listen(3300, () => {
    console.log("server is running")
})