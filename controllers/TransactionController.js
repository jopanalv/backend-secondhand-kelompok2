const { Profiles, Products, Transactions } = require('../models')

const detailTransaction = async (req, res) => {
    const transactionId = req.params.id

    try {
        const transaction = await Transactions.findOne({
            include: {
                model: Profiles,
                required: true
            },
            where: {
                id: transactionId
            }
        })
        res.status(200).json({
            message: 'Success get detail transaction',
            statusCode: 200,
            data: transaction
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const getNotifSeller = async (req, res) => {
    const sellerId = req.id
    const status = 'pending'

    try {
        const notifSeller = await Transactions.findAll({
            include: {
                model: Products,
                required: true,
                where: {
                    ProfileId: sellerId
                }
            },
            where: {
                status
            }
        })
        res.status(200).json({
            message: 'Success get notif seller',
            statusCode: 200,
            data: notifSeller
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const getNotifBuyer = async (req, res) => {
    const buyerId = req.id
    const status = 'accept'

    try {
        const notifBuyer = await Transactions.findAll({
            where: {
                ProfileId: buyerId,
                status: status
            }
        })
        res.status(200).json({
            message: 'Success get notif buyer',
            statusCode: 200,
            data: notifBuyer
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const getTransactionHistoryBuyer = async (req, res) => {
    const buyerId = req.id
    const status = 'success'

    try {
        const history = await Transactions.findAll({
            where: {
                ProfileId: buyerId,
                status
            }
        })
        res.status(200).json({
            message: 'Success get transaction history',
            statusCode: 200,
            data: history
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const getTransactionHistorySeller = async (req, res) => {
    const sellerId = req.id
    const status = 'success'

    try {
        const history = await Transactions.findAll({
            include: {
                model: Products,
                required: true,
                where: {
                    ProfileId: sellerId
                }
            },
            where: {
                status
            }
        })
        res.status(200).json({
            message: 'Success get transaction history',
            statusCode: 200,
            data: history
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const buyProduct = async (req, res) => {
    const buyerId = req.id
    const productId = req.params.id
    const offer_price = req.body.offer_price
    const status = 'pending'

    try {
        const buyer = await Profiles.findOne({
            where: {
                UserId: req.id
            }
        })
        if (buyer.address === null || buyer.no_hp === null) {
            res.json({
                message: 'Lengkapi profile terlebih dahulu!'
            })
        } else {
            await Transactions.create({
                ProfileId: buyerId,
                ProductId: productId,
                offer_price,
                status
            })
            res.status(201).json({
                message: 'Success buy product',
                statusCode: 201
            })
        }
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const acceptTransaction = async (req, res) => {
    const transactionId = req.params.id
    const status = 'accept'

    try {
        const transaction = await Transactions.findOne({
            where: {
                id: transactionId
            }
        })
        await transaction.update({
            status
        })
        res.status(200).json({
            message: 'Success update status transaction',
            statusCode: 200
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const cancelTransaction = async (req, res) => {
    const transactionId = req.params.id
    const status = 'cancel'

    try {
        const transaction = await Transactions.findOne({
            where: {
                id: transactionId
            }
        })
        await transaction.update({
            status
        })
        res.status(200).json({
            message: 'Success update status transaction',
            statusCode: 200
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const successTransaction = async (req, res) => {
    const transactionId = req.params.id
    const status = 'success'

    try {
        const transaction = await Transactions.findOne({
            where: {
                id: transactionId
            }
        })
        await transaction.update({
            status
        })
        res.status(200).json({
            message: 'Success update status transaction',
            statusCode: 200
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

module.exports = {
    buyProduct,
    getTransactionHistoryBuyer,
    getTransactionHistorySeller,
    getNotifSeller,
    getNotifBuyer,
    detailTransaction,
    acceptTransaction,
    cancelTransaction,
    successTransaction
}