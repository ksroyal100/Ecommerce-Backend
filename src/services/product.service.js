const Category = require('../models/category.model')
const Product = require('../models/product.model')

async function createProduct(reqData) {
    let topLevel = await Category.findOne({ name: reqData.topLevelCategory })
    if (!topLevel) {
        topLevel = new Category({
            name: reqData.topLevelCategory,
            level:1
        })
        await topLevel.save()
    }
    let secondLevel = await Category.findOne({
        name: reqData.secondLevelCategory,
        parentCategory: topLevel._id,
    })
    if (!secondLevel) {
        secondLevel = new Category({
            name: reqData.secondLevelCategory,
            parentCategory:topLevel._id,
            level:2, 
        })
        await secondLevel.save()
    }
    let thirdLevel = await Category.findOne({
        name: reqData.thirdLevelCategory,
        parentCategory: secondLevel._id,
    })
    if (!thirdLevel) {
        thirdLevel = new Category({
            name: reqData.thirdLevelCategory,
            parentCategory:secondLevel._id,
            level:3
        })
        await thirdLevel.save()
    }

    const product = new Product({
        title: reqData.title,
        color: reqData.color,
        description:reqData.description,
        discountedPrice:reqData.discountedPrice,
        discountedPersent:reqData.discountedPersent,
        imageUrl:reqData.imageUrl,
        brand:reqData.brand,
        price:reqData.price,
        sizes:reqData.sizes,
        quantity:reqData.quantity,
        category:thirdLevel._id,
        
    })

    return await product.save()
}
async function deleteProduct(productId) {
    const product = await findProductById(productId)
    await Product.findByIdAndDelete(productId)
    return "Product deleted Successfully"
}

async function updateProduct(productId, reqData) {
    return await productId.findByIdAndUpdate(productId,reqData)
}

async function findProductById(id) {
    const product = await Product.findById(id).populate("category").exec()
    if (!product) {
        throw new Error("Product not Found with Id"+ id)
    }
    return product;
}

async function getAllProducts(reqQuery) {
    let {
        category,
        color,
        sizes,
        minPrice = 0,
        maxPrice = 1000000,
        minDiscount = 0,
        sort,
        stock,
        pageNumber = 1,
        pageSize = 10,
    } = reqQuery;

    // Convert to proper types
    minPrice = parseInt(minPrice);
    maxPrice = parseInt(maxPrice);
    minDiscount = parseInt(minDiscount);
    pageNumber = parseInt(pageNumber);
    pageSize = parseInt(pageSize);

    // Base query
    let queryConditions = {};

    // Category filter
    if (category) {
        const existingCategory = await Category.findOne({ name: category });
        if (existingCategory) {
            queryConditions.category = existingCategory._id;
        } else {
            return { content: [], currentPage: 1, totalPages: 0 };
        }
    }

    // Color filter
    if (color) {
        const colorList = color.split(',').map(c => new RegExp(`^${c.trim()}$`, 'i'));
        queryConditions.color = { $in: colorList };
    }

    // Sizes filter
    if (sizes) {
        const sizeArray = Array.isArray(sizes) ? sizes : sizes.split(',');
        queryConditions["sizes.name"] = { $in: sizeArray };
    }

    // Price filter
    queryConditions.discountedPrice = { $gte: minPrice, $lte: maxPrice };

    // Discount filter
    if (minDiscount > 0) {
        queryConditions.discountPersent = { $gte: minDiscount };
    }

    // Stock filter
    if (stock === "in_stock") {
        queryConditions.quantity = { $gt: 0 };
    } else if (stock === "out_of_stock") {
        queryConditions.quantity = { $lte: 0 };
    }

    // Create base query
    let query = Product.find(queryConditions).populate("category");

    // Sorting
    if (sort === "price_high") {
        query = query.sort({ discountedPrice: -1 });
    } else if (sort === "price_low") {
        query = query.sort({ discountedPrice: 1 });
    }

    // Total count before pagination
    const totalProducts = await Product.countDocuments(queryConditions);

    // Pagination
    const skip = (pageNumber - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);

    // Execute query
    const products = await query.exec();
    const totalPages = Math.ceil(totalProducts / pageSize);

    return {
        content: products,
        currentPage: pageNumber,
        totalPages,
    };
}


async function createMultipleProduct(products) {
    for (let product of products) {
        await createProduct(product)
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    findProductById,
    getAllProducts,
    createMultipleProduct
}