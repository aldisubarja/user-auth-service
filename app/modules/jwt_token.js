const jwt = require('jsonwebtoken')

module.exports = {
    generate_token: function (data){
        var jwtSecretKey = process.env.JWT_SECRET_KEY
        const token = jwt.sign(
            { data: data }, 
            jwtSecretKey, 
            { expiresIn: "2h" }
        );
        return token;
    },
    verify_token: function (data){
        var jwtSecretKey = process.env.JWT_SECRET_KEY;
        try {
            const token = data.token;
            const verified = jwt.verify(token, jwtSecretKey);
            console.log(verified)
            if(verified){
                return verified;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
};