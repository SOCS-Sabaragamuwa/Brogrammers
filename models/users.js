const pool = require("../db");
const ErrorHandler = require('../error');
const logger = require('../logger');
const bcrypt = require('bcryptjs');


function User() {

}

User.prototype.createUser = async function (nic, mobile) {
    let query = `insert into "user" ("nic", "mobile")
                 values ($1, $2)`;

    return new Promise((async (resolve, reject) => {
        try {

            let {rows} = await pool.query(query, [nic, mobile]);
            console.log(rows);
            resolve(rows);

        } catch (e) {
            console.log(e);
            logger.log(e);
            reject(new ErrorHandler(502, "Internal Server Error"));
        }
    }));
};

User.prototype.createUserWithPassword = async function (nic, mobile, password) {
    let query = `insert into "user" ("nic", "mobile", "password")
                 values ($1, $2, $3)`;

    let query2 = `select id,nic,mobile from public.user where nic = $1`

    return new Promise((async (resolve, reject) => {
        try {
            let hashedPassword = bcrypt.hashSync(password, 10);
            console.log(nic,mobile,hashedPassword);

            let {rowCount} = await pool.query(query, [nic, mobile, hashedPassword]);
            if(rowCount>0){
                let {rows} = await pool.query(query2, [nic]);
                resolve({
                    self:"http://localhost:9090/api/users/"+rows[0].id.toString(),
                    nic:rows[0].nic,
                    mobile:rows[0].mobile
                })
            }else {
                reject({
                    code:409,
                    message: `A user with nic: ${nic} already exists`,
                    developerMessage: `User creation failed because the nic: ${nic} already exists`
               })
            }

        } catch (e) {
            console.log(e);
            logger.log(e);
            reject(new ErrorHandler(502, "Internal Server Error"));
        }
    }));
};

User.prototype.getUsers = async function () {
    let query = "select * from public.user";

    return new Promise((async (resolve, reject) => {
        try {

            let {rows} = await pool.query(query);
            //console.log(rows);
            resolve(rows);

        } catch (e) {
            console.log(e);
            logger.log(e);
            reject(new ErrorHandler(502, "Internal Server Error"));
        }
    }));
};

User.prototype.getUserByNIC = async function (nic) {
    let query = "select * from public.user where nic=$1";

    return new Promise((async (resolve, reject) => {
        try {

            let {rows} = await pool.query(query,[nic]);
            //console.log(rows);
        
            resolve(rows);

        } catch (e) {
            console.log(e);
            logger.log(e);
            reject(new ErrorHandler(502, "Internal Server Error"));
        }
    }));
};

module.exports = User;