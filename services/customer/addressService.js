const Address = require("../../models/address");

const AddAddress = async (customer_id, addressData) => {
 
  try {
    const address = await Address.create({
      user_id: customer_id,
      address_line1: addressData.address_line1,
      city: addressData.city,
      pincode: addressData.pincode,
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      address_type: addressData.address_type,
      is_default: addressData.is_default || false,
      contact_name: addressData.receiver_name,
      phone: addressData.receiver_number,
    });
    return address;
  } catch (error) {
    throw error;
  }
};

const GetAddresses = async (customer_id) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: customer_id },
      order: [
        ["is_default", "DESC"],
        ["created_at", "DESC"],
      ],
    });
    return addresses;
  } catch (error) {
    throw error;
  }
};

const UpdateAddress = async (address_id, customer_id, addressData) => {
  try {
    const address = await Address.findOne({
      where: { id: address_id, user_id: customer_id },
    });

    if (!address) throw new Error("Address not found");

    await address.update({
      address_line1: addressData.address_line1,
      city: addressData.city,
      pincode: addressData.pincode,
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      address_type: addressData.address_type,
      is_default: addressData.is_default,
      contact_name: addressData.contact_name,
      phone: addressData.phone,
    });
    return address;
  } catch (error) {
    throw error;
  }
};

const DeleteAddress = async (address_id, customer_id) => {
  try {
    const address = await Address.findOne({
      where: { id: address_id, user_id: customer_id },
    });

    if (!address) throw new Error("Address not found");

    await address.destroy();
    return { message: "Address deleted successfully" };
  } catch (error) {
    throw error;
  }
};

module.exports = { AddAddress, GetAddresses, UpdateAddress, DeleteAddress };
