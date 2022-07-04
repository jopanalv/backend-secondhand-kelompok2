const { Products, Profiles, Categories } = require('../models');

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

const getProductSeller = async (req, res) => {
    const userId = req.id
    try {
        const profile = await getProfileByRequest(userId)
        const product = await Products.findAll({
            where: { ProfileId: profile.id }
        })
        res.status(200).json({
            message: 'Success get seller product',
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
        name,
        description,
        CategoryId,
        price,
    } = req.body;
    const userId = req.id
    const image = req.file.filename
    try {
        const profile = await getProfileByRequest(userId)
        const ProfileId = profile.id
        const totalRecord = await Products.count({
            where: { ProfileId: ProfileId }
        })
        if (totalRecord >= 4) {
            res.json({
                message: 'Jumlah post produk maksimal 4'
            })
        } else {
            await Products.create({
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
        price
    } = req.body;
    const image = req.file.filename
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
    try {
        const productId = req.params.id
        await Products.destroy({
            where: { id: productId }
        })
        res.status(204).end()
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const getListCategories = async (req, res) => {
    try {
        const category = await Categories.findAll()
        res.status(200).json({
            message: 'Success get all categories',
            statusCode: 200,
            data: category
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const getProfileByRequest = (id) => {
    return Profiles.findOne({
        where: {
            UserId: id
        }
    })
}

module.exports = {
    getAllProduct,
    getProduct,
    getProductSeller,
    createProduct,
    updateProduct,
    deleteProduct,
    getListCategories
}