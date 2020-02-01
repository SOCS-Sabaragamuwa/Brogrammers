const fs = require("fs");
const path =  require("path");
const pgConfig = {
    user: 'dwacdnmvgairhp',
    host: 'ec2-54-92-174-171.compute-1.amazonaws.com',
    database: 'd18f08st1j25e3',
    password: 'a893c80dea1c53d296c45018ed08697b96f9a1e0f299b3d60b88a689fc9b0c16',
    port: 5432,
    ssl: true,
    rejectUnauthorized: false
};

module.exports = pgConfig;