const express = require('express')
const router = express.Router()
const rm = require('../../modules/response_maker')

router.get('/', async function(req, res){
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(rm.build_response(200))
    return;
})

module.exports = router