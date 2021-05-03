const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const bcrypt = require('bcrypt')
const UserModel = require('./models/User')
const mongoose = require('mongoose')
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
            
            let user = new UserModel({ name, email, password:pwd })

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

app.post("/login", async (req, res)=>{
let {email, password} = req.body
let dbData = await UserModel.findOne({email})
if(dbData != null){
    let dbpwd =  dbData['password']
    console.log(dbpwd)
    let isSame = await bcrypt.compare(password, dbpwd)
    let {_id, name} = dbData
    if(isSame){
        //authentication success
        res.send({status:"OK", msg:"successfully logged in ", data:[{id:_id, name}]})

    }else{
        //authentication failed
    res.send({status:"ERR", msg:"Invalid email or password"})


    }
}else{
    res.send({status:"ERR", msg:"Invalid email or password"})
}
})

app.listen(3300, () => {
    console.log("server is running")
})