const mysql = require('./../modules/mysql');

module.exports = {
    addUser:async function (data) {
        // menambahkan user saat register
        try {
            await mysql.connectAsync()
            var sql =  "INSERT INTO ms_user(first_name, last_name, username, password, email, phone_number, profile_picture, address) "
                sql += "VALUES (?, ?, ?, ?, ?, ?, ?, ?) "

            var [result, cache] = await mysql.executeAsync(sql, [data.firstName, data.lastName, data.username, data.password, data.email, data.phoneNumber, data.profilePicture, data.address])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    checkUser:async function (data) {
        // query select ms_user
        try {
            await mysql.connectAsync()
            var sql =  "SELECT * FROM ms_user "
                sql += "WHERE username = ? "

            var [result, cache] = await mysql.executeAsync(sql, [data.username])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    getUserData :async function (data) {
        // query to get user data
        try {
            await mysql.connectAsync()
            var sql =  "SELECT first_name, last_name, username, email, phone_number, profile_picture, address FROM ms_user "
                sql += "WHERE username = ? "

            var [result, cache] = await mysql.executeAsync(sql, [data.username])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    updateUserData :async function (data) {
        // query to get user data
        try {
            await mysql.connectAsync()
            var userdata = []
            var sql =  "UPDATE ms_user SET "
            if (data.firstName) {
                sql += "first_name = ?,"
                userdata.push(data.firstName)
            }
            if (data.lastName) {
                sql += "last_name = ?,"
                userdata.push(data.lastName)
            }
            if (data.email) {
                sql += "email = ?,"
                userdata.push(data.email)
            }
            if (data.phoneNumber) {
                sql += "phone_number = ?,"
                userdata.push(data.phoneNumber)
            }
            if (data.profilePicture) {
                sql += "profile_picture = ?,"
                    userdata.push(data.profilePicture)
                }
            if (data.address) {
                sql += "address = ?,"
                userdata.push(data.address)
            }
            if (data.password) {
                sql += "password = ?,"
                userdata.push(data.password)
            }
            sql += "WHERE username = ? "
            
            sql = sql.replace(",WHERE", " WHERE")
            userdata.push(data.username)

            var [result, cache] = await mysql.executeAsync(sql, userdata)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
};