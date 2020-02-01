module.exports = function (app) {
    app.use("/api/users", require("./users"));
    app.use("/api/officers", require("./officers"));
    app.use("/api/", (req, res) => {
        res.status(200).json({"message": "API up and running"})
    });
};