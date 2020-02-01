const router = require("express").Router();
const Vehicle = require("../../models/vehicles");
const pool = require("../../db");

//Create user Route
router.post("/", async (req, res) => {
  let number = req.body.vehicle_number;
  let vehicle = new Vehicle();
  let json_response = {};
  if(!validateVehicleNumber(number)){
    res.status(400).send();
    return
  }
  try {
    var results = null;
    results = await vehicle.createVehicle(number);
    json_response = {
      vehicles: results
    };
    res.status(201).json(json_response);
  } catch (e) {
    json_response.message = e;
    let code = e.statusCode || 502;
    if (e._message == null && e.details[0].message) {
      code = 400;
      json_response.message = e.details[0].message;
      res.status(code).json(json_response);
    } else {
      res.status(code).json(json_response);
    }
    res.status(502).send();
  }
});

validateVehicleNumber=(num)=>{
    console.log(num)
    if(num.includes("-")){
        let set = num.split("-")
        console.log(set)
        if((set[0].length===2 || set[0].length===3 ) && set[1].length==4 ){
            return true
        }
    }
    return false
}

router.get("/", async (req, res) => {
  let vehicle = new Vehicle();
  let json_response = {};
  try {
    let result = await vehicle.getVehicles();
    console.log(result);
    json_response = { vehicles: result };
    res.status(200).json(json_response);
  } catch (e) {
    json_response.message = e;
    let code = e.statusCode || 502;
    console.log(e);
    res.status(502).send();
  }
});

module.exports = router;
