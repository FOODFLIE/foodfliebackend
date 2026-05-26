const Order = require("../../models/order");
const Rider = require("../../models/rider");
const sequelize = require("../../config/sequelize");
const OrderItem = require("../../models/order_item");
const Partner = require("../../models/partner");

const autoAssignOrder = async (orderId) => {
  const t = await sequelize.transaction();

  try {
    // Get the order
    const order = await Order.findByPk(orderId, { transaction: t });
    
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "placed") {
      await t.commit();
      return { success: false, message: "Order is not in placed status" };
    }

    // Find available rider
    const rider = await Rider.findOne({
      where: {
        status: "available",
        is_active: true,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    // If no rider available, keep order as placed
    if (!rider) {
      await t.commit();
      return { success: false, message: "No riders available" };
    }

    // Update order with rider and status
    await order.update(
      {
        rider_id: rider.id,
        status: "assigned",
      },
      { transaction: t }
    );

    // Update rider status to busy
    await rider.update({ status: "busy" }, { transaction: t });
    await t.commit();
    
    return {
      success: true,
      message: "Order assigned successfully",
      order_id: order.id,
      rider_id: rider.id,
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

// rider to get orders 
const getRiderOrders = async (rider_id) => {
  try {
    const orders = await Order.findAll({
      where: { rider_id },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: OrderItem,
          attributes: ["id", "item_name", "total_price","quantity","variant"],
          as: "items"
        },
        {
          model: Partner,
          attributes: ["latitude", "longitude", "store_name", "address"],
          as: "partner"
        }
      ]
    });
    return orders;
  } catch (error) {
    throw error;
  }
};


const updateOrderStatus = async (order_id, rider_id, status) => {
  const t = await sequelize.transaction();

  try {
    const order = await Order.findOne({
      where: { id: order_id, rider_id },
      transaction: t,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const statusMap = {
      picked_up: { orderStatus: "picked_up", timestamp: "picked_up_at" },
      delivered: { orderStatus: "delivered", timestamp: "delivered_at" },
    };

    const statusUpdate = statusMap[status];
    if (!statusUpdate) {
      throw new Error("Invalid status");
    }

    await order.update(
      {
        status: statusUpdate.orderStatus,
        [statusUpdate.timestamp]: new Date(),
      },
      { transaction: t }
    );

    // If delivered, set rider back to available and assign next order
    if (status === "delivered") {
      await Rider.update(
        { status: "available" },
        { where: { id: rider_id }, transaction: t }
      );
      
      await t.commit();
      
      // Try to assign next pending order from queue
      await assignNextOrderFromQueue();
      
      return { message: "Order status updated successfully", order };
    }

    await t.commit();
    return { message: "Order status updated successfully", order };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const assignNextOrderFromQueue = async () => {
  try {
    // Get oldest pending order
    const pendingOrder = await Order.findOne({
      where: { status: "placed", rider_id: null },
      order: [["created_at", "ASC"]],
    });

    if (pendingOrder) {
      await autoAssignOrder(pendingOrder.id);
    }
  } catch (error) {
    console.error("Queue assignment failed:", error.message);
  }
};

module.exports = { autoAssignOrder, getRiderOrders, updateOrderStatus, assignNextOrderFromQueue };
