const pool = require("../db");
const ErrorHandler = require('../error');
const logger = require('../logger');
const bcrypt = require('bcryptjs');

function Vehicle() {

}

Vehicle.prototype.createVehicle = async function (number) {
    let query = "insert into vehicle(number) values ($1);"
    let query2 = "SELECT * FROM vehicle where number=$1;"
    return new Promise((async (resolve, reject) => {
        try {

            let unique = await pool.query(query2, [number]);
            if (unique.rowCount==0){
            let a = await pool.query(query, [number]);
            let {rows} = await pool.query(query2, [number]);
            console.log(rows)
            var se = []
            rows.forEach(ele=>{
                se.push({
                    self:"http://localhost:9090/api/vehicles/"+ele.vehicle_id.toString(),
                    vehicle_number:ele.number
                })
            })
            resolve(se[0]);

        }else{
            
            reject({statusCode:409,message: `A vehicle with vehicle_number: ${number} already exists`,
            developerMessage: `Vehicle creation failed because the vehicle_number: ${number} already exists`}
         );

        }
    } catch (e) {
        console.log(e);
        logger.log(e);
        reject(new ErrorHandler(502, "Internal Server Error"));
        }
    }));
};
Vehicle.prototype.getVehicles = async function () {
    let query = "select * from public.vehicle";

    return new Promise((async (resolve, reject) => {
        try {
            let {rows} = await pool.query(query);
            var se = []
            rows.forEach(ele=>{
                se.push({
                    self:"http://localhost:9090/api/vehicles/"+ele.vehicle_id.toString(),
                    id:ele.vehicle_id,
                    vehicle_number:ele.number
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

module.exports = Vehicle;