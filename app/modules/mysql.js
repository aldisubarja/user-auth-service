var config = require("./configuration");
var mysql = require("mysql2");

function createPool() {
    try {
        const pool = mysql.createPool({
            host: config["DB_HOST"],
            port: config["DB_PORT"],
            user: config["DB_USER"],
            password: config["DB_PASS"],
            database: config["DATABASE"],
            connectionLimit: 20,
            waitForConnections: false,
            queueLimit: 0,
            multipleStatements: true
        });
        const promisePool = pool.promise();
        return promisePool;
    } catch (error) {
        console.log(`Could not connect - ${error}`);
        throw new Error(error.toString());
    }
}

const pool = createPool();

module.exports = {
    connectAsync: async function(){
        return true
    },
    queryAsync: async function(sql){
        try{
            var [rows, fields] = await pool.query(sql)
        }catch(ex){
            console.log(sql)
            console.log(ex.message)
            throw new Error(ex.message);
        }
        return [rows, fields]
    },
    executeAsync: async function(sql, data){
        try{
            var[rows, fields] = await pool.query(sql, data)
        }catch(ex){
            console.log(sql)
            console.log(ex.message)
            throw new Error(ex.message);
        }
        return [rows, fields]
    },
    endPool: async function(){
        return true
    },
    escape: function(data){
        return mysql.escape(data)
    },
    connection: function(){
        return pool.getConnection()
    }
}