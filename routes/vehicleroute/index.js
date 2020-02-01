const router = require("express").Router();
const Vehicleroute = require("../../models/vehicleroute");
const pool = require("../../db");

//Create user Route
router.post('/', async (req, res) => {
    let route_name = req.body.route_name;
    let route = new Vehicleroute();
    let json_response = {};
    console.log(route_name)
    try {
        
        let results = await route.createVehicleroute(route_name);
        json_response= results
        res.status(201).json(json_response);
    } catch (e) {
        if (e.statusCode == 409){
            console.log(e.massage)
            json_response.message = e.message;
            json_response.developerMessage = e.developerMessage;
            res.status(e.statusCode).json(json_response);
        }
         else {
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
        let code = e.statusCode || 502;
        console.log(e);
        res.status(502).send();
    }
});


module.exports = router;