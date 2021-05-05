const jwt = require('jsonwebtoken')
const ENC_KEY = ";lk[poiq;jfd;ljnfjkdsanjfadsfh9qw08pr783045upinoqf"

let checkToken = async (req, res, next)=>{
    let { token } = req.headers
    let decoded = null
    try {
        decoded = await jwt.verify(token, ENC_KEY)

    } catch (e) {
        return res.send({ status: "ERR", msg: "Invalid authentication token" })

    }

    req.decoded = decoded
    next()

}

module.exports = {checkToken}