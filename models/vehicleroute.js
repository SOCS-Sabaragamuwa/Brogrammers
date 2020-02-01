const pool = require("../db");
const ErrorHandler = require('../error');
const logger = require('../logger');
const bcrypt = require('bcryptjs');

function Vehicleroute() {

}

Vehicleroute.prototype.createVehicleroute = async function (route_name) {
    let query = `insert into "route" ("route_name") values ($1)`;
    let query2 = "SELECT * FROM route where route_name=$1;"

    return new Promise((async (resolve, reject) => {
        try {
            let unique = await pool.query(query2, [route_name]);
            if (unique.rowCount==0){
            let a = await pool.query(query, [route_name]);
            let {rows} = await pool.query(query2, [route_name]);
            console.log(rows)
            var se = []
            rows.forEach(ele=>{
                se.push({
                    self:"http://localhost:9090/api/routes/"+ele.id.toString(),
                    route_name:ele.route_name
                })
            })
            resolve(se[0]);}
            else{
                reject({statusCode:409,message: `A route with route_name: ${route_name} already exists`,
                developerMessage: `Route creation failed because the route_name: ${route_name} already exists`}
             );
            }

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
            var se = []
            rows.forEach(ele=>{
                se.push({
                    self:"http://localhost:9090/api/routes/"+ele.id.toString(),
                    id:ele.id,
                    route_name:ele.route_name
                })
            })
            resolve(se);

        } catch (e) {
            console.log(e);
            logger.log(e);
            reject(new ErrorHandler(502, "Internal Server Error"));
        }
    }));
};

module.exports = Vehicleroute;