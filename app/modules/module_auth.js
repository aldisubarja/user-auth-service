const bcrypt = require('bcrypt');
const jwt_token = require('../modules/jwt_token')
const rm = require('../modules/response_maker')
const model_user = require('../models/model_user')

module.exports = {
    checkUserRegistered : async function (username){
        try {
            var response
            var [result_search_user, error] = await model_user.checkUser({
                username : username
            })
            if(error){
                throw error
            }
            if (result_search_user.length == 0){
                response = {
                    code : 404,
                    message : "Not found",
                    data : {
                        detail : "Username not found",
                    }
                }
            } else {
                response = {
                    code : 200,
                    message : "Success",
                    data : {
                        detail : result_search_user[0],
                    }
                }                
            }
            return response 
        } catch (error) {
            console.log(error)
            response = {
                code : 500,
                message : "Internal Server Error",
            }
            return response = rm.build_response(500,"Internal Server Error");
        }
    }
}