const express = require("express");
const Doctor = require("../models/Doctor");
const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { name, address, coordinates } = req.body;

    const doctor = new Doctor({
      name,
      clinic: {
        address,
        location: {
          type: "Point",
          coordinates,
        },
      },
    });

    await doctor.save();
    return res.status(201).json({
      msg: "Clinic added successfully !",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

router.get("/search", async (req, res) => {

    
  const { lng, lat } = req.query;

  if (!lng || !lat) {
    return res
      .status(400)
      .json({ error: "Please provide 'lng' and 'lat' in query params." });
  }
  try {
    const doctors = await Doctor.find({
      "clinic.location": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 5000,
        },
      },
    });
    res.json(doctors);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;

//http://localhost:3000/api/v1/doctor/add


/*
{
"name":"Mayank Agrawal",
"address":"Jane Street",
"coordinates":[77.56789,76.09878]
}

*/

//http://localhost:3000/api/v1/doctor/search?lng=77.5&lat=12.9