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
    let { category, color, sizes, minPrice, maxPrice, minDiscount, sort, stock, pageNumber = 1, pageSize = 10 } = reqQuery;

    minPrice = parseInt(minPrice) || 0;
    maxPrice = parseInt(maxPrice) || 1000000;
    minDiscount = parseInt(minDiscount) || 0;
    pageNumber = parseInt(pageNumber);
    pageSize = parseInt(pageSize);

    let query = Product.find().populate("category");

    if (category) {
        const existCategory = await Category.findOne({ name: category });
        if (existCategory) {
            query = query.where("category").equals(existCategory._id);
        } else {
            return { content: [], currentPage: 1, totalPages: 0 };
        }
    }

    if (color) {
        const colorSet = new Set(color.split(",").map(c => c.trim().toLowerCase()));
        if (colorSet.size > 0) {
            const colorRegex = new RegExp([...colorSet].join("|"), "i");
            query = query.where("color").regex(colorRegex);
        }
    }

    if (sizes) {
        const sizesSet = Array.isArray(sizes) ? sizes : [sizes];
        query = query.where("sizes.name").in(sizesSet);
    }

    // Always apply price filter (even if 0 or large)
    query = query.where('discountedPrice').gte(minPrice).lte(maxPrice);

    if (minDiscount > 0) {
        query = query.where("discountPersent").gte(minDiscount);
    }

    if (stock) {
        if (stock === "in_stock") {
            query = query.where('quantity').gt(0);
        }
        if (stock === "out_of_stock") {
            query = query.where("quantity").lte(0);
        }
    }

    // Sorting
    if (sort) {
        const sortDirection = sort === "price_high" ? -1 : 1; // fix typo: it was "price_height" in your code
        query = query.sort({ discountedPrice: sortDirection });
    }

    // Total count
    const totalProducts = await Product.countDocuments(query.getQuery());

    // Pagination
    const skip = (pageNumber - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);

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