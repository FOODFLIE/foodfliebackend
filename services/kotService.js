const Order = require("../models/order");
const OrderItem = require("../models/order_item");
const Partner = require("../models/partner");

/**
 * Generate KOT data for thermal printer
 */
const generateKOT = async (order_id) => {
  try {
    const order = await Order.findByPk(order_id);

    if (!order) throw new Error("Order not found");

    const partner = await Partner.findByPk(order.partner_id, {
      attributes: ["store_name", "phone", "address"]
    });

    const orderItems = await OrderItem.findAll({
      where: { order_id },
      attributes: ["item_name", "quantity", "price"]
    });

    const kotData = {
      storeName: partner?.store_name || "Restaurant",
      storePhone: partner?.phone || "",
      storeAddress: partner?.address || "",
      orderNumber: order.id,
      orderDate: new Date(order.created_at).toLocaleString(),
      customerPhone: order.customer_phone,
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
  console.log("Generating ESC/POS KOT for:", kotData);
  const ESC = "\x1B";
  const GS = "\x1D";

  let receipt = "";

  // Initialize
  receipt += ESC + "@";

  // Center
  receipt += ESC + "a" + "\x01";

  // Store Name
  receipt += ESC + "E" + "\x01"; // Bold ON
  receipt += kotData.storeName.toUpperCase() + "\n";
  receipt += ESC + "E" + "\x00";

  if (kotData.storePhone) {
    receipt += kotData.storePhone + "\n";
  }

  receipt += "===============================================\n";

  // KOT NUMBER
  receipt += ESC + "E" + "\x01"; // Bold ON
  receipt += GS + "!" + "\x11"; // Double height and width
  receipt += "\n";
  receipt += `KOT #${kotData.orderNumber}\n`;
  receipt += "\n";
  receipt += GS + "!" + "\x00"; // Normal size
  receipt += ESC + "E" + "\x00"; // Bold OFF

  receipt += "===============================================\n";

  // Left Align
  receipt += ESC + "a" + "\x00";

  receipt += `Date : ${kotData.orderDate}\n`;
  receipt += `Phone: ${kotData.customerPhone}\n`;

  receipt += "===============================================\n";

  // ITEMS HEADER
  receipt += ESC + "E" + "\x01";
  receipt += "ITEMS\n";
  receipt += ESC + "E" + "\x00";

  receipt += "-----------------------------------------------\n";

  // ITEMS
  kotData.items.forEach((item) => {
    receipt += ESC + "E" + "\x01"; // Bold ON
    receipt += GS + "!" + "\x11"; // Double height and width

    receipt += `${item.quantity} x ${item.name}\n`;

    receipt += GS + "!" + "\x00"; // Normal size
    receipt += ESC + "E" + "\x00"; // Bold OFF

    receipt += `    Rs.${item.price.toFixed(2)}\n`;

    receipt += "-----------------------------------------------\n";
  });

  // Instructions
  if (
    kotData.deliveryInstructions &&
    kotData.deliveryInstructions !== "None"
  ) {
    receipt += ESC + "E" + "\x01";
    receipt += "SPECIAL INSTRUCTIONS\n";
    receipt += ESC + "E" + "\x00";

    receipt += kotData.deliveryInstructions + "\n";

    receipt += "-----------------------------------------------\n";
  }

  // Total
  receipt += ESC + "E" + "\x01";
  receipt += `TOTAL : Rs.${kotData.totalAmount.toFixed(2)}\n`;
  receipt += ESC + "E" + "\x00";

  receipt += `PAYMENT : ${kotData.paymentMethod}\n`;

  receipt += "===============================================\n";

  // Feed
  receipt += "\n\n\n\n";

  // Cut
  receipt += GS + "V" + "\x41" + "\x03";

  return receipt;
};

/**
 * Generate simple text KOT
 */
const generateTextKOT = (kotData) => {
  let kot = "";

  kot += `${kotData.storeName.toUpperCase()}\n`;

  if (kotData.storeAddress) {
    kot += `${kotData.storeAddress}\n`;
  }

  kot += "\n";

  kot += `Date : ${kotData.orderDate}\n`;
  kot += `KOT# ${kotData.orderNumber}\n`;

  kot += "========================================\n";

  kot += "Qty  Items                     Amount\n";
  kot += "========================================\n";

  kotData.items.forEach((item) => {
    const qty = String(item.quantity).padEnd(4);

    const price = `₹${item.price.toFixed(2)}`;

    if (item.name.length > 24) {
      const line1 = item.name.substring(0, 24);
      const line2 = item.name.substring(24);

      kot +=
        qty +
        line1.padEnd(24) +
        price.padStart(10) +
        "\n";

      kot +=
        "    " +
        line2 +
        "\n";
    } else {
      kot +=
        qty +
        item.name.padEnd(24) +
        price.padStart(10) +
        "\n";
    }
  });

  kot += "\n";

  kot += "========================================\n";
  kot += "Bill Summary\n";
  kot += "========================================\n";

  kot += `Item Total${" ".repeat(18)}₹${kotData.totalAmount.toFixed(2)}\n`;

  kot += `SGST${" ".repeat(24)}₹0.00\n`;
  kot += `CGST${" ".repeat(24)}₹0.00\n`;

  kot += "----------------------------------------\n";

  kot += `Grand Total${" ".repeat(17)}₹${kotData.totalAmount.toFixed(2)}\n`;

  kot += "\n";

  kot += `Payment : ${kotData.paymentMethod}\n`;

  if (
    kotData.deliveryInstructions &&
    kotData.deliveryInstructions !== "None"
  ) {
    kot += "\n";
    kot += "Instructions:\n";
    kot += kotData.deliveryInstructions + "\n";
  }

  kot += "\n";
  kot += "THANK YOU & VISIT AGAIN\n";

  return kot;
};

module.exports = {
  generateKOT,
  generateESCPOS,
  generateTextKOT
};
