const pool = require("../db");
const ErrorHandler = require('../error');
const logger = require('../logger');
const bcrypt = require('bcryptjs');

function Officer() {

}

Officer.prototype.createOfficerDefault = async function (emp_no) {
    let query = "insert into officer(employment_number,role) values ($1,'employee');"
    let query2 = "SELECT * FROM officer where employment_number=$1;"
    return new Promise((async (resolve, reject) => {
        try {
            let a = await pool.query(query, [emp_no]);
            let {rows} = await pool.query(query2, [emp_no]);
            console.log(rows)
            var se = []
            rows.forEach(ele=>{
                se.push({
                    self:"http://localhost:9090/api/officers/"+ele.id.toString(),
                    id:ele.id,
                    employment_number:ele.employment_number,
                    role:ele.role
                })
            })
            resolve(se);

        } catch (e) {
            reject({statusCode:409,message: `Officer with employment_number:${emp_no} already exists`,
            developerMessage: `Officer creation failed because the employment_number: ${emp_no} already exists`}
         );}
    }));
};
Officer.prototype.createOfficer = async function (emp_no,role) {
    let query = "insert into officer(employment_number,role) values ($1,$2);"
    let query2 = "SELECT * FROM officer where employment_number=$1;"
    return new Promise((async (resolve, reject) => {
        try {
            let a = await pool.query(query, [emp_no,role]);
            let {rows} = await pool.query(query2, [emp_no]);
            console.log(rows)
            var se = []
            rows.forEach(ele=>{
                se.push({
                    self:"http://localhost:9090/api/officers/"+ele.id.toString(),
                    id:ele.id,
                    employment_number:ele.employment_number,
                    role:ele.role
                })
            })
            resolve(se);

        } catch (e) {
            reject({statusCode:409,message: `Officer with employment_number:${emp_no} already exists`,
            developerMessage: `Officer creation failed because the employment_number: ${emp_no} already exists`}
         );
        }
    }));
};
Officer.prototype.getOfficers = async function () {
    let query = "select * from public.officer";

    return new Promise((async (resolve, reject) => {
        try {

            let {rows} = await pool.query(query);
            var se = []
            rows.forEach(ele=>{
                se.push({
                    self:"http://localhost:9090/api/officers/"+ele.id.toString(),
                    id:ele.id,
                    employment_number:ele.employment_number,
                    role:ele.role
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

module.exports = Officer;