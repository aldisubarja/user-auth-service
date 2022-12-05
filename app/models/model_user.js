const mysql = require('./../modules/mysql');

module.exports = {
    addUser:async function (data) {
        // menambahkan user saat register
        try {
            await mysql.connectAsync()
            var sql =  "INSERT INTO ms_user(first_name, last_name, username, password, email, phone_number, profile_picture, address, role_id) "
                sql += "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) "

            var [result, cache] = await mysql.executeAsync(sql, [data.firstName, data.lastName, data.username, data.password, data.email, data.phoneNumber, data.profilePicture, data.address, data.roleId])
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
    checkRole:async function (data) {
        // query check ms_role
        try {
            await mysql.connectAsync()
            var sql =  "SELECT * FROM ms_role "
                sql += "WHERE role_name = ? "

            var [result, cache] = await mysql.executeAsync(sql, [data.role_name])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
};