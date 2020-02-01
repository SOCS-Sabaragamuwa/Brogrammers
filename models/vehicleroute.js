const pool = require("../db");
const ErrorHandler = require('../error');
const logger = require('../logger');
const bcrypt = require('bcryptjs');

function Vehicleroute() {

}

Vehicleroute.prototype.createVehicleroute = async function (route_name) {
    let query = `insert into "route" ("route_name") values ($1)`;

    return new Promise((async (resolve, reject) => {
        try {

            let {rows} = await pool.query(query, [route_name]);
            console.log(rows);
            resolve(rows);

        } catch (e) {
            console.log(e);
            logger.log(e);
            reject(new ErrorHandler(502, "Internal Server Error"));
        }
    }));
};
Vehicleroute.prototype.getVehicleroute = async function () {
    let query = "select * from public.route";

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

module.exports = Vehicleroute;