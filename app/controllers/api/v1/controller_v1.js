const express = require('express')
const router = express.Router()
const c_user = require('./controller_user')
const rm = require('../../../modules/response_maker')

router.use("/user", c_user)

module.exports = router
