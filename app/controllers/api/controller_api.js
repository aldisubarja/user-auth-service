const express = require('express')
const router = express.Router()
const c_v1 = require('./v1/controller_v1')
const rm = require('../../modules/response_maker')
const config = require('../../modules/configuration')

const basicAuth = function (req, res, next) {
    res.setHeader('Content-Type', 'application/json')
    console.log("[/api] basic auth")

    var username = config["BASIC_USER"]
    var password = config["BASIC_KEY"]

    // get basic auth from postman
    var base64auth = req.headers.authorization
    if(base64auth) {
        base64auth = base64auth.substring(base64auth.indexOf(' ') + 1)
        base64auth = Buffer.from(base64auth, 'base64').toString('utf8')
        var authUsername = base64auth.substring(0, base64auth.indexOf(":"))
        var authPassword = base64auth.substring(base64auth.indexOf(":")+1)
    
        // checking
        if(username == authUsername && password == authPassword){
            console.log("Bener <3")
            next()
        } else {
            console.log("Salah :p")
            res.send(rm.build_response(401, "Username atau password anda salah!"))
        }
    } else {
        res.send(rm.build_response(401, "Tidak ditemukan basic auth!"))
    }
    
}

router.use(basicAuth)
router.use("/v1", c_v1)

module.exports = router