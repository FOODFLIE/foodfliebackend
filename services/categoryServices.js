const Category = require("../models/category");

const AddCategory = async (name, partner_id) => {
    try {
        const category = await Category.create({ name, partner_id });
        return category;
    } catch (error) {
        throw error;
    }
}

const GetAllCategories = async () => {
    try {
        const categories = await Category.findAll();
        return categories;
    } catch (error) {
        throw error;
    }
}

const GetCategoryById = async (id) => {
    try {
        const category = await Category.findByPk(id);
        return category;
    } catch (error) {
        throw error;
    }
}

const UpdateCategory = async (id, partner_id, name) => {
    try {
        await Category.update({ name }, { where: { id, partner_id } });
        return await Category.findOne({ where: { id, partner_id } });
    } catch (error) {
        throw error;
    }
}

const DeleteCategory = async (id, partner_id) => {
    try {
        await Category.destroy({ where: { id, partner_id } });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    AddCategory,
    GetAllCategories,
    GetCategoryById,
    UpdateCategory,
    DeleteCategory
}
