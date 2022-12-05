module.exports = {
    /**
     * Function to generate response. Code is a must else 500 generated. Message will generated automatically if it's null. Data should be an object and it's optional.
     * @param {Integer} code
     * @param {String} message
     * @param {Object} data
     */
    build_response: function (code = null, message = null, data = null){
        if(message == null){
            switch(code){
                case 200:
                    message = "OK"
                    break;
                case 201:
                    message = "Created"
                    break;
                case 202:
                    message = "Accepted"
                    break;
                case 400:
                    message = "Bad Request"
                    break;
                case 401:
                    message = "Unauthorized"
                    break;
                case 403:
                    message = "Forbidden"
                    break;
                case 404:
                    message = "Not Found"
                    break;
                case 409:
                    message = "Duplicate"
                    break;
                case 500:
                    message = "Internal Server Error"
                    break;
                case 501:
                    message = "Not Implemented"
                    break;
                case 502:
                    message = "Bad Gateway"
                    break;
                case 503:
                    message = "Service Unavailable"
                    break;
                case 504:
                    message = "Gateway Timeout"
                    break;
                default:
                    code = 500
                    message = "Internal Server Error"
                    data = null
                    break;
            }
        }
        
        var result = {
            code: code,
            message: message
        }

        if(data){
            result.data = data
        }

        return JSON.stringify(result)
    }
};