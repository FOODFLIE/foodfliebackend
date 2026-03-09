const Rider = require("../../models/rider");
const bcrypt = require("bcrypt");

const AddRider = async (riderData) => {
  try {
    const hashedPassword = await bcrypt.hash(riderData.password, 10);

    const rider = await Rider.create({
      name: riderData.name,
      phone: riderData.phone,
      username: riderData.username,
      password: hashedPassword,
      vehicle_type: riderData.vehicle_type,
      vehicle_number: riderData.vehicle_number,
      status: "offline",
      is_active: true,
    });

    return rider;
  } catch (error) {
    throw error;
  }
};

const getRiders = async () => {
  try {
    const riders = await Rider.findAll();
    return riders;
  } catch (error) {
    throw error;
  }
};

module.exports = { AddRider, getRiders };
