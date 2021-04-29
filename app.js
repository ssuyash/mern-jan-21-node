const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const UserModel = require('./models/User')
const mongoose = require('mongoose')
const DB_URL = 'mongodb+srv://ayushi:lgNmRWcUoITrXcJA@cluster0.yq5ua.mongodb.net/mernjan21?retryWrites=true&w=majority'

mongoose.connect(DB_URL, {useNewUrlParser: true}).then(con=>{
    console.log("Database server is connnected")
}).catch(err=>{
    
    console.log("Error in DB Connection", err)
})

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ extended: false }))

app.get('/', (req, res)=>{
    UserModel.find({}).then(data=>{
        res.send({status:"OK", msg:"successfully retrieved", data})
    }).catch(err=>{
        res.send({status:"ERR", msg:"something went wrong", data:[]})

    })
})

app.post("/", (req, res)=>{
    let {name, age} = req.body
    let newUser = new UserModel({
        name,
        age
    })

    newUser.save().then(data=>{
        res.send({"status":"OK", msg:"Data Saved Successfully"})
    }).catch(err=>{

        console.log(err)
        res.send({"status":"ERR", msg:"Something went wrong"})

    })
    

})

app.post("/trasaction/:id/:name", (req, res)=>{
    console.log(req.params)
    console.log(req.body)
    fs.writeFile("./user.txt", JSON.stringify(req.params), function(err){
       if(!err){
           res.send("Data saved successfully")
       } else{
           res.send("something went wrong")
       }
    })
  

})

app.listen(3300, ()=>{
    console.log("server is running")
})