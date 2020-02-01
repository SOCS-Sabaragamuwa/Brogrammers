const pool = require("../db");
const ErrorHandler = require('../error');
const logger = require('../logger');
const bcrypt = require('bcryptjs');

function User() {

}

User.prototype.createUser = async function (nic, mobile) {
    let query = `insert into "user" ("nic", "mobile") values ($1, $2)`;

    return new Promise((async (resolve, reject) => {
        try {

            let {rows} = await pool.query(query, [nic.toString(), mobile.toString()]);
            console.log(rows);
            resolve(rows);

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

module.exports = User;