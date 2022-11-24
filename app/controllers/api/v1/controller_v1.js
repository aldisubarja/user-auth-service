const express = require('express')
const router = express.Router()
const c_user = require('./controller_user')
const rm = require('../../../modules/response_maker')

router.get('/', async function(req, res){
    console.log("[/api/v1]")
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(rm.build_response(200))
    return;
})

router.use("/user", c_user)

module.exports = router