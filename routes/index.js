module.exports = function (app) {
    app.use("/api/users", require("./users"));
    app.use("/api/officers", require("./officers"));
    app.use("/api/routes", require("./vehicleroute"));
    app.use("/api/vehicles", require("./vehicles"));
    app.use("/api/timetables", require("./timetable"));
    app.use("/api/", (req, res) => {
        res.status(200).json({"message": "API up and running"})
    });
};