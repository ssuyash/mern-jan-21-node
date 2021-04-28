const express = require('express')
const bodyParser = require('body-parser')


const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ extended: false }))

app.get('/', (req, res)=>{
    console.log(req.query)
    res.send("Express App root route with GET")
})

app.post("/", (req, res)=>{
    console.log(req.body)
    res.send("Hwllo from post route afd")

})

app.post("/trasaction/:id/:name", (req, res)=>{
    console.log(req.params)
    console.log(req.body)
    res.send("Transactions")

})

app.listen(3300, ()=>{
    console.log("server is running")
})