const userService = require('./user.service');
const CartItem = require('../models/cartitem.model');

async function updateCartItem(userId, cartItemId, cartItemData) {
    console.log(`userId - ${userId}, cartItemId - ${cartItemId}`);

    try {
        const item = await findCartItemById(cartItemId)
        console.log(item)
        if (!item) {
            throw new Error('cart item not found: ', cartItemId)
        }
        const user = await userService.findUserById(item.userId);

        if (!user) {
            throw new Error("User not found", userId)
        }
        if(user._id===userId.toString()){
            item.quantity = cartItemData.quantity;
            item.price = item.quantity * item.product.price;
            item.discountedPrice = item.quantity * item.product.discountedPrice;
            const updatedCartItem = await item.save();
            return updatedCartItem;
        }
        else {
            throw new Error("Please update your cart Items");
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

async function removeCartItem(userId, cartItemId) {
    // console.log(`userId - ${userId}, cartItemId - ${cartItemId}`);
    
    const cartItem = await findCartItemById(cartItemId)
    const user = await userService.findUserById(cartItem.userId)
    const reqUser = await userService.findUserById(userId);
    
    // console.log("user", user.id)
    
    if (user.id === reqUser.id) {
        await CartItem.findByIdAndDelete(cartItem.id);
        console.log("Item remove from Cart")
    }
    throw new Error("You cannot remove another user's item")
}

async function findCartItemById(cartItemId) {
    const cartItem = await CartItem.findById(cartItemId).populate("product");
    if (cartItem) {
        return cartItem
    }
    else {
        throw new Error("Cartitem not found with id:", cartItemId)
    }
}

module.exports= {updateCartItem, removeCartItem, findCartItemById}