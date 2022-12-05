const express = require('express')
const bcrypt = require('bcrypt');
var validator = require('validator');
const router = express.Router()
const jwt_token = require('../../../modules/jwt_token')
const rm = require('../../../modules/response_maker')
const model_user = require('../../../models/model_user')

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
            rm.build_response(200, "Success", 
                {
                    detail : "Token verified!",
                    username : verify.data.username, 
                    token : token
                }
            )
        )
    } else {
        res.status(401).send(
            rm.build_response(401, "Unauthorized", {
                detail : "Token not verified!"
            })
        )
    }
    return;
})

router.post('/authenticate', async function(req, res){
    console.log("[/api/v1/user/authenticate] Authenticate")
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(rm.build_response(200))
    return;
})

router.post('/login', async function(req, res){
    console.log("[/api/v1/user/login] Login")
    res.setHeader('Content-Type', 'application/json')
    
    var username = req.body.username
    var password = req.body.password
    
    // check if username is registered
    var [result_search_user, error] = await model_user.checkUser({
        username : username
    })
    if(error){
        throw error
    } 
    if (result_search_user.length == 0){
        return res.status(404).send(
            rm.build_response(404, "Not found", {
                detail : "Username not found!"
            })
        )
    }

    // check password
    var hash = result_search_user[0].password
    var checkPassword = bcrypt.compareSync(password, hash);
    if(checkPassword){
        var token = jwt_token.generate_token({
            username : username,
        })
        res.status(200).send(
            rm.build_response(200, "Success", 
                {
                    detail : "Token generated!",
                    username : username, 
                    token : token
                }
            )
        )
    } else {
        return res.status(403).send(
            rm.build_response(403, "Forbidden", {
                detail : "Wrong Password!"
            })
        )
    }
    return;
})

router.post('/register', async function(req, res){
    console.log("[/api/v1/user/register] Register")
    res.setHeader('Content-Type', 'application/json')
    
    try{
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        var phoneNumber = req.body.phoneNumber;
        var profilePicture = req.body.profilePicture;
        var address = req.body.address;
        var role = req.body.role;
    
        // validate fields
        if( !firstName || !lastName || !username || !password || !email || !phoneNumber || !address || !role ){
            return res.status(400).send(
                rm.build_response(400, "Bad Request", {
                    detail : "Please fill all the fields"
                })
            )
        }
        if(!validator.isEmail(email)){
            return res.status(400).send(
                rm.build_response(400, "Bad Request", {
                    detail : "Email not valid"
                })
            )
        }
        if(!validator.isMobilePhone(phoneNumber, 'id-ID')){
            return res.status(400).send(
                rm.build_response(400,"Bad Request", {
                    detail : "Phone number not valid"
                })
            )
        }

        // check role
        var roleCode
        var [result_check_role, error] = await model_user.checkRole({
            role_name : role.toLowerCase()
        })
        if(error){
            throw error
        }
        if(result_check_role.length == 0){
            return res.status(400).send(
                rm.build_response(400, "Bad Request", {
                    detail : "Role is not valid"
                })
            )
        } else {
            roleCode = result_check_role[0].id
        }

        // check if username is already used or not
        var [result_search_user, error] = await model_user.checkUser({
            username : username
        })
        if(error){
            throw error
        } 
        if (result_search_user.length != 0){
            return res.status(409).send(
                rm.build_response(409, "Duplicate Username", {
                    detail : "Username already used!"
                })
            )
        }
    
        // hashing password
        var saltRounds = 10;
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(password, salt);

        // add user
        var [result_add, error] = await model_user.addUser({
            firstName : firstName, 
            lastName : lastName, 
            username : username, 
            password : hash,
            email : email, 
            phoneNumber : phoneNumber, 
            profilePicture : profilePicture, 
            address : address,
            roleId : roleCode
        })
        if(error){
            throw error
        }
        if(result_add){
            res.status(200).send(
                rm.build_response(200, "Success", 
                    {
                        detail : "User is registered!", 
                        username : username
                    }
                )
            )
        }
    } catch(error) {
        console.log(error)
        return res.status(500).send(
            rm.build_response(500,"Internal Server Error")
        )
    }
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