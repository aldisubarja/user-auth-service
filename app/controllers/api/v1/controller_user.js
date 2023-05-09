const express = require('express')
const bcrypt = require('bcrypt');
var validator = require('validator');
const router = express.Router()
const jwt_token = require('../../../modules/jwt_token')
const rm = require('../../../modules/response_maker')
const model_user = require('../../../models/model_user')
const module_auth = require('../../../modules/module_auth');
const config = require('../../../modules/configuration')

router.post('/authenticate', async function(req, res){
    console.log("[/api/v1/user/authenticate] Authenticate")
    res.setHeader('Content-Type', 'application/json')

    var token = req.body.token
    var verify = jwt_token.verify_token({
        token : token,
    })
    
    if(verify){
        res.status(200).send(
            rm.build_response(200, "Success", 
                {
                    detail : "Token verified!"
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

router.post('/refresh', async function(req, res){
    console.log("[/api/v1/user/refresh] Refresh")
    res.setHeader('Content-Type', 'application/json')

    var refresh_token = req.body.refresh_token
    var verify = jwt_token.verify_refresh_token({
        token : refresh_token,
    })
    
    if(verify){
        console.log("VERIFYING DATA", verify)
        delete verify.iat
        delete verify.exp
        var token = jwt_token.generate_token(verify)

        res.status(200).send(
            rm.build_response(200, "Success", 
                {
                    detail : "Token generated!",
                    token : token,
                    refresh_token : refresh_token, 
                }
            )
        )
    } else {
        res.status(401).send(
            rm.build_response(401, "Unauthorized", {
                detail : "Refresh token is not verified, please login again!"
            })
        )
    }
    return;
})

router.post('/login', async function(req, res){
    console.log("[/api/v1/user/login] Login")
    res.setHeader('Content-Type', 'application/json')
    
    try{
        var username = req.body.username
        var password = req.body.password
        
        // check if username is registered
        var isRegistered = await module_auth.checkUserRegistered(username)
        if(isRegistered.code != 200){
            return res.status(isRegistered.code).send(isRegistered)
        }

        // check password
        var hash = isRegistered.data.detail.password
        var dataToken = {
            "username": isRegistered.data.detail.username,
            "email": isRegistered.data.detail.email,
            "phone_number": isRegistered.data.detail.phone_number,
        }
        
        var checkPassword = bcrypt.compareSync(password, hash);
        if(checkPassword){
            var token = jwt_token.generate_token(dataToken)
            var refresh_token = jwt_token.generate_refresh_token(dataToken)
            res.status(200).send(
                rm.build_response(200, "Success", 
                    {
                        detail : "Token generated!",
                        token : token,
                        refresh_token : refresh_token, 
                    }
                )
            )
        } else {
            res.status(403).send(
                rm.build_response(403, "Forbidden", {
                    detail : "Wrong Password!"
                })
            )
        }
        return;
    } catch (error){
        console.log(error)
        return res.status(500).send(
            rm.build_response(500,"Internal Server Error")
        )
    }

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
    
        // validate fields
        if( !firstName || !lastName || !username || !password || !email || !phoneNumber || !address){
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
        var saltRounds = config["PS_SALT"];
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
            address : address
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

    try {
        var username = req.body.username
        var password
        var oldPassword = req.body.oldPassword
        var newPassword = req.body.newPassword

        // check if username is registered
        var isRegistered = await module_auth.checkUserRegistered(username)
        if(isRegistered.code != 200){
            return res.status(isRegistered.code).send(isRegistered)
        }

        password = isRegistered.data.detail.password
        var checkPassword = bcrypt.compareSync(oldPassword, password);
        if(checkPassword){
            var saltRounds = config["PS_SALT"];
            var salt = bcrypt.genSaltSync(saltRounds);
            var hash = bcrypt.hashSync(newPassword, salt);

            var [result_update_user_data, error] = await model_user.updateUserData({
                username : username,
                password : hash
            })

            if(result_update_user_data){
                res.status(200).send(
                    rm.build_response(200, "Success", 
                        {
                            detail : "Password successfully changed!"
                        }
                    )
                )
            }
        } else {
            res.status(403).send(
                rm.build_response(403, "Forbidden", {
                    detail : "Wrong Password!"
                })
            )
        }
        return
    } catch (error) {
        console.log(error)
        return res.status(500).send(
            rm.build_response(500,"Internal Server Error")
        )
    }
})

router.post('/get_profile', async function(req, res){
    console.log("[/api/v1/user/get_profile] Get Profile")
    res.setHeader('Content-Type', 'application/json')

    try{
        var username = req.body.username

        // get user data profile
        var [result_get_user_data, error] = await model_user.getUserData({
            username : username
        })
        if(error){
            throw error
        }
        if(result_get_user_data.length == 0){
            return res.status(404).send(
                rm.build_response(404, "Not found", {
                    detail : "Username not found!"
                })
            )
        }
        res.status(200).send(
            rm.build_response(200, "Success", 
                {
                    detail : "User is registered!", 
                    userdata : result_get_user_data[0],
                }
            )
        )
        return
    }catch(error){
        console.log(error)
        return res.status(500).send(
            rm.build_response(500,"Internal Server Error")
        )
    }
})

router.post('/update_profile', async function(req, res){
    console.log("[/api/v1/user/update_profile] Update Profile")
    res.setHeader('Content-Type', 'application/json')
    
    try{
        var firstName = req.body.firstName
        var lastName = req.body.lastName
        var username = req.body.username
        var email = req.body.email
        var phoneNumber = req.body.phoneNumber
        var profilePicture = req.body.profilePicture
        var address = req.body.address

        if(!username){
            return res.status(400).send(
                rm.build_response(400, "Bad Request", {
                    detail : "Please fill the username fields"
                })
            )
        }

        // check if username is registered
        var isRegistered = await module_auth.checkUserRegistered(username)
        if(isRegistered.code != 200){
            return res.status(isRegistered.code).send(isRegistered)
        }

        // update user data
        var [result_update_user_data, error] = await model_user.updateUserData({
            firstName : firstName, 
            lastName : lastName, 
            username : username, 
            email : email, 
            phoneNumber : phoneNumber, 
            profilePicture : profilePicture, 
            address : address,
        })
        if(error){
            throw error
        }
        if(result_update_user_data){
            res.status(200).send(
                rm.build_response(200, "Success", 
                    {
                        detail : "User data is updated!"
                    }
                )
            )
        }

    }catch(error){
        console.log(error)
        return res.status(500).send(
            rm.build_response(500,"Internal Server Error")
        )
    }
})

module.exports = router