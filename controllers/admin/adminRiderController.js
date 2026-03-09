const {
  AddRider,
  getRiders,
} = require("../../services/admin/adminRiderServices");

const AddRiderController = async (req, res) => {
  try {
    const { name, phone, username, password, vehicle_type, vehicle_number } =
      req.body;
    const rider = await AddRider({
      name,
      phone,
      username,
      password,
      vehicle_type,
      vehicle_number,
    });
    res.status(201).json({ message: "Rider added successfully", rider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetRidersController = async (req, res) => {
  try {
    const riders = await getRiders();
    res.status(200).json({ riders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { AddRiderController, GetRidersController };
