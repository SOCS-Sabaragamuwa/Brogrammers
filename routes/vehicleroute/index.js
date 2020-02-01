const router = require("express").Router();
const Vehicleroute = require("../../models/vehicleroute");
const pool = require("../../db");

//Create user Route
router.post('/', async (req, res) => {
    let number = req.body.vehicle_number
    if (!number) {
        res.json({
            "message": "Number no is not set",
            "developerMessage": `Vehicle creation failed because the vehicle_number: $number already exists`
        })
    }
    let vehicleroute = new Vehicleroute();
    let json_response = {};
    try {
        console.log(number);
        let results = await vehicleroute.createVehicleroute();
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

router.get('/', async (req, res) => {

    let vehicleroute = new Vehicleroute();
    let json_response = {};
    try {
        let result = await vehicleroute.getVehicleroute();
        console.log(result); 
        json_response = ({routes:result});
        res.status(200).json(json_response);
    } catch (e) {
        json_response.message = e;
        let code = e.statusCode || 502;
        console.log(e);
        res.status(502).send();
    }
});


module.exports = router;