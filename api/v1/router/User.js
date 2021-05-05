const router = require('express').Router()
const userController = require('../controllers/User')

router.post("/register", userController.register)



router.post("/login", userController.login )

module.exports = router;