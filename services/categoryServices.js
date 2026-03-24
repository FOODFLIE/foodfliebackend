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
