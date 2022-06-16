const { Products, Profiles } = require('../models');

const getAllProduct = async (req, res) => {
    try {
        const products = await Products.findAll({
            attributes: ['id', 'ProfileId', 'image', 'name', 'price', 'CategoryId']
        })
        res.status(200).json({
            message: 'Success get all products',
            statusCode: 200,
            data: products
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const getProduct = async (req, res) => {
    const productId = req.params.id
    try {
        const product = await Products.findOne({
            include: {
                model: Profiles,
                required: true,
                attributes: ['image', 'name', 'address', 'no_hp']
            },
            where: {
                id: productId
            }
        })
        res.status(200).json({
            message: 'Success get product',
            statusCode: 200,
            data: product
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const createProduct = async (req, res) => {
    const {
        ProfileId,
        name,
        description,
        CategoryId,
        price,
        image,
    } = req.body;
    try {
        const totalRecord = await Products.count({
            where: { ProfileId: ProfileId }
        })
        if (totalRecord > 3) {
            res.json({
                message: 'Jumlah post produk maksimal 4'
            })
        } else {
            const product = await Products.create({
                ProfileId, 
                name, 
                description, 
                CategoryId, 
                price, 
                image
            })
            res.status(201).json({
                message: 'Success create product',
                statusCode: 201
            })
        }
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const updateProduct = async (req, res) => {
    const productId = req.params.id
    const {
        name,
        description,
        CategoryId,
        price,
        image,
    } = req.body;
    try {
        const product = await Products.findOne({
            where: { id: productId }
        })
        await product.update({
            name,
            description,
            CategoryId,
            price,
            image
        })
        res.status(200).json({
            message: 'Success update product',
            statusCode: 200
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id
    await Products.destroy({
        where: { id: productId }
    })
    res.status(204).end()
}

module.exports = {
    getAllProduct,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}