const pool = require("../db");
const ErrorHandler = require("../error");
const logger = require("../logger");
const bcrypt = require("bcryptjs");

function Timetable() {}

Timetable.prototype.createEntry = async function({
  start_time,
  end_time,
  day,
  officer_id,
  vehicle_id,
  route_id
}) {
  let query =
    "insert into timetable(start_time,end_time,day,officer_id,vehicle_id,route_id) values ($1,$2,$3,$4,$5,$6);";
  let query2 =
    "SELECT * FROM timetable where start_time=$1 and end_time=$2 and day = $3 and officer_id=$4 and vehicle_id=$5 and route_id = $6 limit 1";
  return new Promise(async (resolve, reject) => {
    try {
      let officer = await getOfficer(officer_id, reject);
      let vehicle = await getVehicle(vehicle_id, reject);
      let route = await getRoute(route_id, reject);
      console.log(officer, vehicle, route);
      if (officer == null || vehicle == null || route == null) {
        console.log("Reject");
        reject({ code: 404 });
        return;
      }
      let a = await pool.query(query, [
        start_time,
        end_time,
        day,
        officer_id,
        vehicle_id,
        route_id
      ]);
      let { rows } = await pool.query(query2, [
        start_time,
        end_time,
        day,
        officer_id,
        vehicle_id,
        route_id
      ]);

      var se = [];
      rows.forEach(ele => {
        se.push({
          self: "http://localhost:9090/api/timetables/" + ele.id.toString(),
          start_time: ele.start_time,
          end_time: ele.end_time,
          day: ele.day,
          officer,
          vehicle,
          route
        });
      });
      resolve(se);
    } catch (e) {
      console.log(e);
      logger.log(e);
      reject(new ErrorHandler(502, "Internal Server Error"));
    }
  });
};

async function getOfficer(id, reject) {
  let query = "SELECT * FROM officer where id=$1;";
  try {
    let { rows } = await pool.query(query, [id]);
    var se = [];
    if (rows.length === 0) reject({ code: 404 });
    rows.forEach(ele => {
      se.push({
        self: "http://localhost:9090/api/officers/" + ele.id.toString(),
        ...ele
      });
    });
    return se[0];
  } catch (e) {
    reject({ code: 400 });
  }
}
async function getVehicle(id, reject) {
  let query = "SELECT * FROM vehicle where vehicle_id=$1;";
  try {
    let { rows } = await pool.query(query, [id]);
    let se = [];
    if (rows.length === 0) reject({ code: 404 });
    rows.forEach(ele => {
      se.push({
        self: "http://localhost:9090/api/vehicles/" + ele.vehicle_id.toString(),
        ...ele
      });
    });
    return se[0];
  } catch (e) {
    console.log(e);
    reject({ code: 400 });
  }
}
async function getRoute(id, reject) {
  let query1 = "SELECT * FROM route where id=$1;";
  try {
    let { rows } = await pool.query(query1, [id]);
    if (rows.length === 0) reject({ code: 404 });
    let se = [];
    rows.forEach(ele => {
      se.push({
        self: "http://localhost:9090/api/routes/" + ele.id.toString(),
        ...ele
      });
    });
    return se[0];
  } catch (e) {
    console.log(e);
  }
}

Timetable.prototype.getTimetable = async function(timetable_id) {
  let query = "select * from public.timetable where id=$1";

  return new Promise(async (resolve, reject) => {
    try {
      let { rows } = await pool.query(query, [timetable_id]);
      var se = [];
      if (rows.length === 0) {
        reject({
          code: 404,
          message: `No value present timetable_id: ${timetable_id}`,
          developerMessage: `No value present timetable_id: ${timetable_id}`
        });
        return;
      }
      let officer = await getOfficer(rows[0].officer_id, reject);
      let vehicle = await getVehicle(rows[0].vehicle_id, reject);
      let route = await getRoute(rows[0].route_id, reject);
      rows.forEach(ele => {
        se.push({
          self: "http://localhost:9090/api/timetables/" + ele.id.toString(),
          id: ele.id,
          start_time: ele.start_time,
          end_time: ele.end_time,
          day: ele.day,
          officer,
          vehicle,
          route
        });
      });
      resolve(se[0]);
    } catch (e) {
      console.log(e);
      logger.log(e);
      reject(new ErrorHandler(502, "Internal Server Error"));
    }
  });
};
Timetable.prototype.getTimetableByQuery = async function(
  vehicle_id,
  officer_id,
  route_id
) {
  console.log("gooo")

  let query = "select * from public.timetable";
  return new Promise(async (resolve, reject) => {
    try {
      let { rows } = await pool.query(query);
      let se = [];
      let filter1 = [];
      rows.forEach(ele => {
        if (vehicle_id) {
          if (ele.vehicle_id === parseInt(vehicle_id)) {
            filter1.push(ele);
          }
        } else {
          filter1.push(ele);
        }
      });
      console.log(filter1)
      let filter2 = [];
      filter1.forEach(ele => {
        if (officer_id) {
          if (ele.officer_id === parseInt(officer_id)) {
            filter2.push(ele);
          }
        } else {
          filter2.push(ele);
        }
      });
      let filter3 = [];
      filter2.forEach(ele => {
        if (route_id) {
          if (ele.route_id === parseInt(route_id)) {
            filter3.push(ele);
          }
        } else {
          filter3.push(ele);
        }
      });

      for (let i = 0; i < filter3.length; i++) {
        let officer = await getOfficer(filter3[i].officer_id, reject);
        let vehicle = await getVehicle(filter3[i].vehicle_id, reject);
        let route = await getRoute(filter3[i].route_id, reject);

        se.push({
          self:
            "http://localhost:9090/api/timetables/" + filter3[i].id.toString(),
          id: filter3[i].id,
          start_time: filter3[i].start_time,
          end_time: filter3[i].end_time,
          day: filter3[i].day,
          officer,
          vehicle,
          route
        });
      }
      console.log(se);
      resolve(se);
    } catch (e) {
      console.log(e);
      logger.log(e);
      reject(new ErrorHandler(502, "Internal Server Error"));
    }
  });
};

module.exports = Timetable;
