const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const moment = require('moment')


const BASE_URL = ""



require('./database/db')


const txnRouter = require('./api/v1/router/Transaction')
const userRouter = require('./api/v1/router/User')

const app = express();

app.use(fileUpload())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/uploads", express.static(__dirname+'/uploads'))

app.use('/transaction', txnRouter)
app.use('/user', userRouter)


app.post('/file-upload', (req, res)=>{
    
    let photo = req.files.file
    let uploadPath = __dirname+'/uploads/'

    let splitted = photo.name.split(".")
    console.log(splitted)
    let fileExt = splitted[splitted.length-1]
    uploadPath += moment().unix()+"."+fileExt

    photo.mv(uploadPath, (err)=>{
        if(err){
            res.send('err')
        }
        res.send("uploaded")
    })
    //res.send('file upload')
})


app.listen(3300, () => {
    console.log("server is running")
})