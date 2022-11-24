const express = require('express')
const router = express.Router()
const c_api = require('./api/controller_api')
const rm = require('../modules/response_maker')

router.get('/', async function(req, res){
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(rm.build_response(200,"OK"))
    return;
})

router.use("/api", c_api)

router.use(function(req, res){
    res.setHeader('Content-Type', 'application/json')
    res.status(404).send(rm.build_response(404))
    return;
});

module.exports = router
