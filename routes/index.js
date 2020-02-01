module.exports = function (app) {
    app.use("/reg_user", require("./user"));
    //Root route-REMOVE this
    app.use("/api/", (req, res) => {
        res.status(200).json({"message": "API up and running"})
    });
};