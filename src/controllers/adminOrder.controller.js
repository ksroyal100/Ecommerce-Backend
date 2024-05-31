const orderService = require('../services/order.service')


const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders()
        return res.status(200).send(orders)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const confirmOrders = async (req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.confirmOrder(orderId)
        return res.status(200).send(orders)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const shippOrders = async (req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.shipOrder(orderId)
        return res.status(200).send(orders)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const deliverOrders = async (req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.deliveredOrder(orderId)
        return res.status(200).send(orders)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const cancelOrders = async (req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.cancelOrder(orderId)
        return res.status(200).send(orders)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const deleteOrders = async (req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.deleteOrder(orderId)
        return res.status(200).send(orders)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports = {
    getAllOrders,
    confirmOrders,
    shippOrders,
    deliverOrders,
    cancelOrders,
    deleteOrders
}