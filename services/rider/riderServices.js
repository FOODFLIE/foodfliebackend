const Rider = require("../../models/rider");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const RiderLogin = async (username, password) => {
  try {
    const rider = await Rider.findOne({ where: { username } });

    if (!rider) {
      throw new Error("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(password, rider.password);

    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    if (!rider.is_active) {
      throw new Error("Rider account is inactive");
    }

    const riderToken = jwt.sign(
      { id: rider.id, username: rider.username, role: "rider" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return {
      riderToken,
      rider: { id: rider.id, name: rider.name, username: rider.username },
    };
  } catch (error) {
    console.error("Error during rider login:", error);
    throw error;
  }
};

const UpdateRiderStatus = async (rider_id, status) => {
  try {
    const rider = await Rider.findByPk(rider_id);

    if (!rider) {
      throw new Error("Rider not found");
    }

    await rider.update({ status });

    return {
      message: "Rider status updated successfully",
      status: rider.status,
    };
  } catch (error) {
    throw error;
  }
};

// rider update location
const UpdateLocation = async (rider_id, latitude, longitude) => {
  try {
    const rider = await Rider.findByPk(rider_id);
    if (!rider) {
      throw new Error("Rider not found");
    }

    await rider.update({ latitude, longitude });

    return {
      message: "Rider location updated successfully",
      latitude: rider.latitude,
      longitude: rider.longitude,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { RiderLogin, UpdateRiderStatus, UpdateLocation };
