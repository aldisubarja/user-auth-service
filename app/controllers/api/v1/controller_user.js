const express = require('express')
const router = express.Router()
const jwt_token = require('../../../modules/jwt_token')
const rm = require('../../../modules/response_maker')

router.get('/', async function(req, res){
    console.log("[/api/v1/user] Bisa di akses!")
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(rm.build_response(200))
    return;
})

router.post('/authorize', async function(req, res){
    console.log("[/api/v1/user/authorize] Check role")
    res.setHeader('Content-Type', 'application/json')

    var token = req.body.token
    var verify = jwt_token.verify_token({
        token : token,
    })
    
    if(verify){
        res.status(200).send(
            rm.build_response(200, "Token verified!", 
                {username : verify.data.username, token : token}
            )
        )
    } else {
        res.status(401).send(
            rm.build_response(401, "Token not verified!")
        )
    }
    return;
})

router.post('/login', async function(req, res){
    console.log("[/api/v1/user/login] Login")
    res.setHeader('Content-Type', 'application/json')
    
    var username = req.body.username
    var password = req.body.password
    var token = jwt_token.generate_token({
        username : username,
    })
    
    res.status(200).send(
        rm.build_response(200, "Token generated!", 
            {"username" : username, "token" : token}
        )
    )
    return;
})

router.post('/register', async function(req, res){
    console.log("[/api/v1/user/register] Register")
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(rm.build_response(200))
    return;
})

router.post('/change_password', async function(req, res){
    console.log("[/api/v1/user/change_password] Change Password")
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(rm.build_response(200))
    return;
})

router.post('/get_profile', async function(req, res){
    console.log("[/api/v1/user/get_profile] Get Profile")
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(rm.build_response(200))
    return;
})

router.post('/update_profile', async function(req, res){
    console.log("[/api/v1/user/update_profile] Update Profile")
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(rm.build_response(200))
    return;
})

module.exports = router