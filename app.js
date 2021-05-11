const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const moment = require('moment')
const aws = require('aws-sdk')
const cors = require('cors')
const fs = require('fs')





require('./database/db')


const txnRouter = require('./api/v1/router/Transaction')
const userRouter = require('./api/v1/router/User')
const productRouter = require('./api/v1/router/Product')

const app = express();
app.use(cors())


app.use(fileUpload())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/uploads", express.static(__dirname+'/uploads'))

app.use('/transaction', txnRouter)
app.use('/user', userRouter)
app.use('/product', productRouter)


const s3 = new aws.S3({
    accessKeyId:"AKIAZ6KVHWZ5WQD3MF7L",
    secretAccessKey:"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"
})

app.post('/file-upload', (req, res)=>{
    
    let photo = req.files.file
    let uploadPath = __dirname+'/uploads/'

    let splitted = photo.name.split(".")
    console.log(splitted)
    let fileExt = splitted[splitted.length-1]
    let fName = moment().unix()+"."+fileExt
    uploadPath += fName

    photo.mv(uploadPath, (err)=>{
        if(err){
            res.send('err')
        }

        const uploadFileContent = fs.readFileSync(uploadPath)
        const params = {
            Bucket: 'geeksdoor-mern-jan-21',
            Key: fName, // File name you want to save as in S3
            Body: uploadFileContent,
            ACL:'public-read'
        };
        s3.upload(params, function(err, data) {
            if (err) {
                throw err;
            }
            console.log(data)
            console.log(`File uploaded successfully. ${data.Location}`);
            fs.unlinkSync(uploadPath)
            res.send("uploaded")
        });

        
    })
    //res.send('file upload')
})


app.listen(3300, () => {
    console.log("server is running")
})

