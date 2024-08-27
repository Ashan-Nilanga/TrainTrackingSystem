const express = require("express");
const router = express.Router();
const VehiclePosition = require("../schemas/TrainPosition");

router.post("/vehicles/position", async (req, res) => {
  const { vehicleId, coords } = req.body;
  const { lat, long } = coords;

  const newPosition = new VehiclePosition({
    vehicleId,
    lat,
    long,
  });

  try {
    const savedPosition = await newPosition.save();
    res.status(201).json(savedPosition);
  } catch (error) {
    res.status(500).json({ message: "Error saving position", error });
  }
});

router.post("/vehicles/positions", async (req, res) => {
  const positions = req.body;

  try {
    const savedPositions = await Promise.all(
      positions.map(async (positionData) => {
        const { vehicleId, coords } = positionData;
        const { lat, long } = coords;

        const newPosition = new VehiclePosition({
          vehicleId,
          lat,
          long,
        });

        return await newPosition.save();
      })
    );

    res.status(201).json(savedPositions);
  } catch (error) {
    res.status(500).json({ message: "Error saving positions", error });
  }
});


router.get("/vehicles/:vehicleId/position", async (req, res) => {
  const { vehicleId } = req.params;
  try {
    const position = await VehiclePosition.findOne({ vehicleId }).sort({
      recordedAt: -1,
    });
    if (position) {
      res.json(position);
    } else {
      res.status(404).json({ message: "Position not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/vehicles/position/history", async (req, res) => {
  const { vehicleId, start, end } = req.query;

  if (!vehicleId || !start || !end) {
    return res
      .status(400)
      .json({ message: "vehicleId, start, and end are required." });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  endDate.setHours(23, 59, 59, 999); 

  if (isNaN(startDate) || isNaN(endDate)) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD format." });
  }

  try {
    const positions = await VehiclePosition.find({
      vehicleId,
      recordedAt: { $gte: startDate, $lte: endDate },
    });
    res.json(positions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving position history", error });
  }
});


router.get("/vehicles/latest-positions", async (req, res) => {
  try {
    const latestPositions = await VehiclePosition.aggregate([
      {
        $sort: { recordedAt: -1 },
      },
      {
        $group: {
          _id: "$vehicleId",
          latestPosition: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$latestPosition" },
      },
    ]);

    res.json(latestPositions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving latest positions", error });
  }
});

module.exports = router;
