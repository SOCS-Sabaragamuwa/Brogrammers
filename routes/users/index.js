const router = require("express").Router();
const User = require("../../models/users");
const pool = require("../../db");
const passwordValidator = require('password-validator');

//Create user Route
router.post('/', async (req, res) => {
    let nic = req.body.nic;
    let mobile = req.body.mobile;
    let password = req.body.password;
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
        if (password) {
            let schema = new passwordValidator();
            schema
                .is().min(6)                                    // Minimum length 6
                .is().max(8)                                  // Maximum length 8
                .has().uppercase()                              // Must have uppercase letters
                .has().lowercase()                              // Must have lowercase letters
                .has().oneOf(['~', '!', '@', '#', '$', '%', '^', '&', '*', '_', '-', '+', '=', '`', '|', '(', ')', '{', '}', '[', ']', '.', '?']);

            if (!schema.validate(password)) {
                res.status(400).json({
                    "message": "Password complexity requirement not met",
                    "developerMessage": "User creation failed because password complexity requirement not met"
                });
            } else {
                //hash password

                let results = await user.createUserWithPassword(nic, mobile, password);
                res.status(201).end();
            }

        } else {
            console.log(nic, mobile);
            let results = await user.createUser(nic, mobile);
            res.status(201).json(json_response);
        }
    } catch (e) {

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

