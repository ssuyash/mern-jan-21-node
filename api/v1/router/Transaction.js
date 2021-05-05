const route = require('express').Router()
const txnController = require('../controllers/Transaction')
const authMiddleWare = require('../middleware/Auth')


route.post('/', authMiddleWare.checkToken, txnController.addTransaction)
route.get('/transactions', authMiddleWare.checkToken, txnController.getTransactions)
route.delete('/transaction/:txnid', authMiddleWare.checkToken, txnController.deleteTransaction)
route.post('/transaction/edit/:txnid', authMiddleWare.checkToken, txnController.updateTransaction)

module.exports = route;