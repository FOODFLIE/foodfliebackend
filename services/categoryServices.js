const { Partner } = require("../models");
const Category = require("../models/category");
const { getDistance } = require("../utils/deliveryRadius");
const { getFoodflieoptions } = require("../utils/foodlieutils");

const flies = getFoodflieoptions();
const allowedRadiusKm = flies.allowed_distance;

const AddCategory = async (name, partner_id) => {
  try {
    const category = await Category.create({ name, partner_id });
    return category;
  } catch (error) {
    throw error;
  }
};

const GetAllCategories = async (userLat, userLng) => {
  try {
    // Log user location details (non-blocking)
    if (userLat && userLng) {
      console.log(`User Location - Latitude: ${userLat}, Longitude: ${userLng}`);
      
      // Reverse geocoding in background (don't await)
      const axios = require('axios');
      axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FoodFlieApp/1.0'
          }
        }
      )
      .then(geoResponse => {
        if (geoResponse.data && geoResponse.data.address) {
          const address = geoResponse.data.address;
          const area = address.suburb || address.neighbourhood || address.road || 'Unknown Area';
          const city = address.city || address.town || address.village || address.state_district || 'Unknown City';
          const state = address.state || '';
          
          console.log(`📍 User Area: ${area}`);
          console.log(`🏙️  User City: ${city}`);
          if (state) console.log(`📌 State: ${state}`);
        }
      })
      .catch(geoError => {
        console.log('⚠️  Could not fetch location details:', geoError.message);
      });
    }

    const categories = await Category.findAll({
      include: [
        {
          model: Partner,
          as: "partners",
          attributes: ["latitude", "longitude","is_active"],
          
          through: { attributes: [] },
        },
      ],
    });

    const filteredCategories = categories.filter((category) => {
      return (
        category.partners &&
        category.partners.some((partner) => {
          const distance = getDistance(
            userLat,
            userLng,
            parseFloat(partner.latitude),
            parseFloat(partner.longitude),
          );
          return distance <= allowedRadiusKm;
        })
      );
    });

    return filteredCategories;
  } catch (error) {
    throw error;
  }
};

const GetCategoryById = async (id) => {
  try {
    const category = await Category.findByPk(id);
    return category;
  } catch (error) {
    throw error;
  }
};

const UpdateCategory = async (id, partner_id, name) => {
  try {
    await Category.update({ name }, { where: { id, partner_id } });
    return await Category.findOne({ where: { id, partner_id } });
  } catch (error) {
    throw error;
  }
};

const DeleteCategory = async (id, partner_id) => {
  try {
    await Category.destroy({ where: { id, partner_id } });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  AddCategory,
  GetAllCategories,
  GetCategoryById,
  UpdateCategory,
  DeleteCategory,
};
