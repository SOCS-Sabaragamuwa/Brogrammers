const router = require("express").Router();
const Officer = require("../../models/officers");
const pool = require("../../db");

//Create user Route
router.post('/', async (req, res) => {
    let emp_no = req.body.employment_number;
    let role = req.body.role;
    let officer = new Officer();
    let json_response = {};
    
    if(!emp_no || (emp_no && typeof emp_no != "number") || (role && !isIn(role))){
        res.status(400).send()
        return
    }
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

function isIn(val){
    if(val==="employee"||val==="admin"||val==="super-admin"){
        return true
    }
    return false
}

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

