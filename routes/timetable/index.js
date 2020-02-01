const router = require("express").Router();
const Timetable = require("../../models/timetable");
const pool = require("../../db");

//Create user Route
router.post("/", async (req, res) => {
  let {
    start_time,
    end_time,
    day,
    officer_id,
    vehicle_id,
    route_id
  } = req.body;
  if (
    start_time == null ||
    end_time == null ||
    day == null ||
    officer_id == null ||
    vehicle_id == null ||
    route_id == null
  ) {
    res.status(400).send();
    return;
  }

  let timetable = new Timetable();
  let json_response = {};
  try {
    var results = null;
    results = await timetable.createEntry(req.body);
    json_response = {
      ...results[0]
    };
    res.status(201).json(json_response);
  } catch (e) {
    if (e.code === 404) {
      res.status(404).send();
    }
  }
});

router.get("/:timetable_id", async (req, res) => {
  let timetable = new Timetable();
  let timetable_id = req.params.timetable_id;
  let json_response = {};
  try {
    let result = await timetable.getTimetable(timetable_id);
    console.log(result);
    json_response = { ...result };
    res.status(200).json(json_response);
  } catch (e) {
    if (e.code === 404) {
      json_response.message = e.message;
      json_response.developerMessage = e.developerMessage;
      res.status(404).json(json_response).send();
      return;
    }
    res.status(502).send();
  }
});

module.exports = router;
