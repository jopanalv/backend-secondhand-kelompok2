const { Profiles, Products, Transactions } = require('../models')

statusTransaction = {
    SUCCESS: 'success',
    PENDING: 'pending',
    ACCEPT: 'accept',
    CANCEL: 'cancel'
}

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
        const product = await Products.findOne({
            where: {
                id: transaction.ProductId
            }
        })
        res.status(200).json({
            message: 'Success get detail transaction',
            statusCode: 200,
            data: {transaction, product}
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const getNotifSeller = async (req, res) => {
    const sellerId = req.id

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
                status: statusTransaction.PENDING
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

    try {
        const notifBuyer = await Transactions.findAll({
            include: {
                model: Products,
                required: true,
            },
            where: {
                ProfileId: buyerId,
                status: statusTransaction.ACCEPT
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

    try {
        const history = await Transactions.findAll({
            where: {
                ProfileId: buyerId,
                status: statusTransaction.SUCCESS
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
                status: statusTransaction.SUCCESS
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

    try {
        const buyer = await Profiles.findOne({
            where: {
                UserId: req.id
            }
        })
        if (buyer.address === null || buyer.no_hp === null) {
            res.json({
                statusCode: 400,
                message: 'Lengkapi profile terlebih dahulu!'
            })
        } else {
            await Transactions.create({
                ProfileId: buyerId,
                ProductId: productId,
                offer_price,
                status: statusTransaction.PENDING
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

    try {
        const transaction = await getTransactionByRequest(transactionId)
        await transaction.update({
            status: statusTransaction.ACCEPT
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

    try {
        const transaction = await getTransactionByRequest(transactionId)
        await transaction.update({
            status: statusTransaction.CANCEL
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

    try {
        const transaction = await getTransactionByRequest(transactionId)
        await transaction.update({
            status: statusTransaction.SUCCESS
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

const getTransactionByRequest = (id) => {
    return Transactions.findOne({
        where: {
            id: id
        }
    })
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