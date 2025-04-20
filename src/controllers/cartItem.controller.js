const cartItemService = require('../services/cartItem.service')

const updateCartItem = async (req, res) => {
    const user = await req.user
    // console.log(req.body.quantity)
    
    try {
        await cartItemService.updateCartItem(user._id, req.params.id, req.body)
        return res.status(200).send("Adding Cart")
    } catch (error) {
        console.log("error",error.message)
        return res.status(500).send({error:error.message})
    }
}

const removeCartItem = async (req, res) => {
    const user = await req.user
    // console.log(user._id,"userId")
    try {
         await cartItemService.removeCartItem(user._id, req.params.id)
        return res.status(200).send({message: "Cart item remove successfully"})
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports = {
    updateCartItem,
    removeCartItem
}