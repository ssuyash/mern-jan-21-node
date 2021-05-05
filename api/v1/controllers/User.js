const UserModel = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const ENC_KEY = ";lk[poiq;jfd;ljnfjkdsanjfadsfh9qw08pr783045upinoqf"


let login = async (req, res) => {
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
}



let register = async (req, res) => {
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

}


module.exports = {login, register}