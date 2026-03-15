const {
  AddAddress,
  GetAddresses,
  UpdateAddress,
  DeleteAddress,
} = require("../../services/customer/addressService");

const AddAddressController = async (req, res) => {
  try {
    const customer_id = req.customer.id;
    const {
      address_line1,
      city,
      pincode,
      latitude,
      longitude,
      address_type,
      is_default,
      receiver_name,
      receiver_number,
    } = req.body;
    const address = await AddAddress(customer_id, {
      address_line1,
      city,
      pincode,
      latitude,
      longitude,
      address_type,
      is_default,
      receiver_name,
      receiver_number,
    });
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetAddressesController = async (req, res) => {
  try {
    const customer_id = req.customer.id;
    const addresses = await GetAddresses(customer_id);
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateAddressController = async (req, res) => {
  try {
    const { address_id } = req.params;
    const customer_id = req.customer.id;
    const {
      address_line1,
      city,
      pincode,
      latitude,
      longitude,
      address_type,
      is_default,
      contact_name,
      phone,
    } = req.body;
    const address = await UpdateAddress(address_id, customer_id, {
      address_line1,
      city,
      pincode,
      latitude,
      longitude,
      address_type,
      is_default,
      contact_name,
      phone,
    });
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const DeleteAddressController = async (req, res) => {
  try {
    const { address_id } = req.params;
    const customer_id = req.customer.id;
    const result = await DeleteAddress(address_id, customer_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  AddAddressController,
  GetAddressesController,
  UpdateAddressController,
  DeleteAddressController,
};
