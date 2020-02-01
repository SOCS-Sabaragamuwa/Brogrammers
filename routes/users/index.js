const router = require("express").Router();
const User = require("../../models/users");
const pool = require("../../db");

//Create user Route
router.post('/', async (req, res) => {
    let nic = req.body.nic;
    let mobile = req.body.mobile;
    if (!nic) {
        res.status(400).json({
            "message": "Nic no is not set",
            "developerMessage": " User creation failed because the nic no is not set"
        })
    } else if (!mobile) {
        res.status(400).json({
            "message": "Mobile no is not set",
            "developerMessage": " User creation failed because the mobile no is not set"
        })
    }
    let user = new User();
    let json_response = {};
    try {
        console.log(nic, mobile);
        let results = await user.createUser(nic,mobile);
        res.status(201).json(json_response);
    } catch (e) {
        // json_response.message = e;
        // let code = e.statusCode || 502;
        // if (e._message == null && e.details[0].message) {
        //     code = 400;
        //     json_response.message = e.details[0].message;
        //     res.status(code).end();
        // } else {
        //     res.status(code).end();
        // }
        res.status(502).send();
    }
});

router.get('/', async (req, res) => {

    let user = new User();
    let json_response = {};
    try {
        let result = await user.getUsers();
        console.log(result);
        json_response = (result);
        res.status(200).json(json_response);
    } catch (e) {
        json_response.message = e;
        let code = e.statusCode || 502;
        console.log(e);
        res.status(502).send();
    }
});


module.exports = router;

