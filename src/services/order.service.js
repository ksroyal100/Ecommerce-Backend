const Address = require("../models/address.model");
const Order = require("../models/order.model");
const cartService = require("./cart.service");
const OrderItem = require("../models/orderitems.model");

async function createOrder(user, shipAddress) {
  let address;

  if (shipAddress._id) {
    address = await Address.findById(shipAddress._id);
  } else {
    address = new Address(shipAddress);
    address.user = user._id; // Ensure user is saved as an ObjectId

    try {
      await address.save();

      if (!Array.isArray(user.addresses)) {
        user.addresses = [];
      }

      user.addresses.push(address._id); // Save address as ObjectId reference
      await user.save();

      console.log("Address and user saved successfully");
      console.log(address);
    } catch (error) {
      console.error("Error saving address or user:", error);
      throw error; // Ensure error propagation
    }
  } 

  const cart = await cartService.findUserCart(user._id);
  const orderItems = [];

  for (const item of cart.cartItems) {
    const orderItem = new OrderItem({
      product: item.product._id, // Ensure this is an ObjectId
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      userId: item.userId,
      discountedPrice: item.discountedPrice,
    });

    try {
      const createdOrderItem = await orderItem.save();
      orderItems.push(createdOrderItem._id); // Save ObjectId reference
    } catch (error) {
      console.error("Error saving order item:", error);
      throw error; // Ensure error propagation
    }
  }

  const createdOrder = new Order({
    user: user._id, // Ensure this is an ObjectId
    orderItems,
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalDiscountedPrice,
    discount: cart.discounts,
    totalItem: cart.totalItems, // Ensure this is a number
    shippingAddress: address, // Ensure this is an ObjectId
    orderDate: new Date(),
    orderStatus: "PENDING",
  });

  try {
    const savedOrder = await createdOrder.save();
    return savedOrder;
  } catch (error) {
    console.error("Error saving order:", error);
    throw error; // Ensure error propagation
  }
}


async function placeOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "PLACED";
  order.paymentDetails.status = "COMPLETED";

  return await order.save();
}
async function confirmOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "CONFIRM";

  return await order.save();
}

async function shipOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "SHIPPED";

  return await order.save();
}
async function deliveredOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "DELIVERED";

  return await order.save();
}

async function cancelOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "CANCELLED";

  return await order.save();
}

async function findOrderById(orderId) {
  const order = await Order.findById(orderId)
    .populate("user")
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("shippingAddress");

  return order;
}

async function usersOrderHistory(userId) {
  try {
    const orders = await Order.find({ user: userId, orderStatus: "PLACED" })
      .populate({ path: "orderItems", populate: { path: "product" } })
      .lean();
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllOrders() {
  return await Order.find()
    .populate({ path: "orderItems", populate: { path: "product" } })
    .lean();
}

async function deleteOrder(orderId) {
  const order = await findOrderById(orderId);
  await Order.findByIdAndDelete(order._id);
}

module.exports = {
  createOrder,
  placeOrder,
  confirmOrder,
  shipOrder,
  deliveredOrder,
  cancelOrder,
  findOrderById,
  usersOrderHistory,
  getAllOrders,
  deleteOrder,
};
