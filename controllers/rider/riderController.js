const {
  RiderLogin,
  UpdateRiderStatus,
  UpdateLocation,
} = require("../../services/rider/riderServices");

const RiderLoginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await RiderLogin(username, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const UpdateRiderStatusController = async (req, res) => {
  try {
    const rider_id = req.rider.id;
    const { status } = req.body;
    const result = await UpdateRiderStatus(rider_id, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateLocationController = async (req, res) => {
  const rider_id = req.rider.id;
  const { latitude, longitude } = req.body;
  try {
    const result = await UpdateLocation(rider_id, latitude, longitude);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { RiderLoginController, UpdateRiderStatusController, UpdateLocationController };
