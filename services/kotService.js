const Order = require("../models/order");
const OrderItem = require("../models/order_item");
const Partner = require("../models/partner");

/**
 * Generate KOT data for thermal printer
 */
const generateKOT = async (order_id) => {
  try {
    const order = await Order.findByPk(order_id, {
      include: [
        {
          model: Partner,
          as: "partner",
          attributes: ["store_name", "phone", "address"]
        }
      ]
    });

    if (!order) throw new Error("Order not found");

    const orderItems = await OrderItem.findAll({
      where: { order_id },
      attributes: ["item_name", "quantity", "price"]
    });

    // Format KOT data for thermal printer
    const kotData = {
      storeName: order.partner?.store_name || "Restaurant",
      storePhone: order.partner?.phone || "",
      storeAddress: order.partner?.address || "",
      orderNumber: order.id,
      orderDate: new Date(order.created_at).toLocaleString(),
      customerPhone: order.customer_phone,
      deliveryAddress: order.address,
      deliveryInstructions: order.delivery_instructions || "None",
      items: orderItems.map(item => ({
        name: item.item_name,
        quantity: item.quantity,
        price: parseFloat(item.price)
      })),
      totalAmount: parseFloat(order.final_amount),
      paymentMethod: order.payment_method
    };

    return kotData;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate ESC/POS commands for thermal printer
 */
const generateESCPOS = (kotData) => {
  const ESC = '\x1B';
  const GS = '\x1D';
  
  let receipt = '';
  
  // Initialize printer
  receipt += ESC + '@';
  
  // Center align
  receipt += ESC + 'a' + '\x01';
  
  // Bold + Double size
  receipt += ESC + 'E' + '\x01';
  receipt += GS + '!' + '\x11';
  receipt += kotData.storeName + '\n';
  
  // Reset formatting
  receipt += ESC + 'E' + '\x00';
  receipt += GS + '!' + '\x00';
  
  // Store details
  receipt += kotData.storePhone + '\n';
  receipt += kotData.storeAddress + '\n';
  
  // Separator
  receipt += '================================\n';
  
  // Left align
  receipt += ESC + 'a' + '\x00';
  
  // Order details
  receipt += ESC + 'E' + '\x01';
  receipt += 'KOT #' + kotData.orderNumber + '\n';
  receipt += ESC + 'E' + '\x00';
  receipt += 'Date: ' + kotData.orderDate + '\n';
  receipt += 'Phone: ' + kotData.customerPhone + '\n';
  receipt += '================================\n';
  
  // Items
  receipt += ESC + 'E' + '\x01';
  receipt += 'ITEMS:\n';
  receipt += ESC + 'E' + '\x00';
  receipt += '--------------------------------\n';
  
  kotData.items.forEach(item => {
    receipt += `${item.quantity}x ${item.name}\n`;
    receipt += `   Rs. ${item.price.toFixed(2)}\n`;
  });
  
  receipt += '================================\n';
  
  // Delivery details
  receipt += 'DELIVERY ADDRESS:\n';
  receipt += kotData.deliveryAddress + '\n';
  receipt += '\n';
  receipt += 'INSTRUCTIONS:\n';
  receipt += kotData.deliveryInstructions + '\n';
  receipt += '================================\n';
  
  // Total
  receipt += ESC + 'E' + '\x01';
  receipt += GS + '!' + '\x11';
  receipt += 'TOTAL: Rs. ' + kotData.totalAmount.toFixed(2) + '\n';
  receipt += ESC + 'E' + '\x00';
  receipt += GS + '!' + '\x00';
  
  receipt += 'Payment: ' + kotData.paymentMethod + '\n';
  receipt += '================================\n';
  
  // Cut paper
  receipt += GS + 'V' + '\x41' + '\x03';
  
  return receipt;
};

/**
 * Generate simple text KOT (for testing or non-ESC/POS printers)
 */
const generateTextKOT = (kotData) => {
  let kot = '';
  
  kot += '================================\n';
  kot += `       ${kotData.storeName}\n`;
  kot += `       ${kotData.storePhone}\n`;
  kot += `    ${kotData.storeAddress}\n`;
  kot += '================================\n';
  kot += `KOT #${kotData.orderNumber}\n`;
  kot += `Date: ${kotData.orderDate}\n`;
  kot += `Phone: ${kotData.customerPhone}\n`;
  kot += '================================\n';
  kot += 'ITEMS:\n';
  kot += '--------------------------------\n';
  
  kotData.items.forEach(item => {
    kot += `${item.quantity}x ${item.name}\n`;
    kot += `   Rs. ${item.price.toFixed(2)}\n`;
  });
  
  kot += '================================\n';
  kot += 'DELIVERY ADDRESS:\n';
  kot += `${kotData.deliveryAddress}\n`;
  kot += '\n';
  kot += 'INSTRUCTIONS:\n';
  kot += `${kotData.deliveryInstructions}\n`;
  kot += '================================\n';
  kot += `TOTAL: Rs. ${kotData.totalAmount.toFixed(2)}\n`;
  kot += `Payment: ${kotData.paymentMethod}\n`;
  kot += '================================\n';
  
  return kot;
};

module.exports = {
  generateKOT,
  generateESCPOS,
  generateTextKOT
};
