const router = require("express").Router();
const Officer = require("../../models/officers");
const pool = require("../../db");

//Create user Route
router.post('/', async (req, res) => {
    let emp_no = req.body.employment_number;
    let role = req.body.role;
    let officer = new Officer();
    let json_response = {};
    console.log(emp_no)
    try {
        var results = null
        if(!role)
             results = await officer.createOfficerDefault(emp_no);
        else 
             results = await officer.createOfficer(emp_no,role);
        json_response={
            officers:results
        }
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

    let officer = new Officer();
    let json_response = {};
    try {
        let result = await officer.getOfficers();
        console.log(result);
        json_response = ({officers:result});
        res.status(200).json(json_response);
    } catch (e) {
        json_response.message = e;
        let code = e.statusCode || 502;
        console.log(e);
        res.status(502).send();
    }
});


module.exports = router;

