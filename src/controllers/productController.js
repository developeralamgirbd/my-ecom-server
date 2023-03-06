const mongoose = require("mongoose");
const CategoryModel = require('../models/category/Category');
const {categoryFindByID, categoryFindByName} = require("../services/categoryService/categoryService");

const ObjectId = mongoose.Types.ObjectId;

const {
    showAllPostService,
    postCreateService,
    searchPostService,
    showPostByCategoryService,
    postUpdateService,
    postDeleteService, postByID, authShowAllPostService, productCreateService, showAllProductsService,
    listProductsService, getProductByIdService
}
    = require('../services/productService/productService');
const getByIdService = require("../services/common/getByIdService");




exports.postProduct = async (req, res)=>{
    try {
        console.log(req.body);

        const {name, description, price, quantity, sold, categoryID } = req.body;
        const userID = req.auth?._id
        const isExit = await getByIdService({_id: ObjectId(categoryID)}, CategoryModel);

        if (!isExit){
            return res.status(400).json({
                status: 'fail',
                message: 'Category not found'
            });
        }

        const productBody = {name, description, price, quantity, sold, categoryID, userID};

        const product = await productCreateService(productBody);

        res.status(200).json({
            product
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'fail',
            error: 'Server error occurred'
        });
    }

};

exports.authShowAllPost = async (req, res)=>{
    try {
        const authorID = req.auth._id;

        const post = await authShowAllPostService(authorID);

        if (!post[0]){
            return res.status(400).json({
                status: 'fail',
                message: 'Post not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Successfully get all post',
            data: post[0]
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'fail',
            error: error.message
        });
    }
}

exports.getProducts = async (req, res)=>{
    try {
        const perPage = Number(req.params?.perpage) || 12;
        const page = Number(req.params?.page) || 1;
        const products = await listProductsService(page, perPage);

        res.status(200).json({
            products
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'fail',
            error: error.message
        });
    }
}

exports.updatePost = async (req, res)=>{
    try {
        const _id = req.params.id;
        const authorID = req.auth._id;
        const {title, description, categoryID} = req.body;

        const isCategory = await categoryFindByID(categoryID);

        if (!isCategory[0]){
            return res.status(400).json({
                status: 'fail',
                message: 'Category not found'
            });
        }

        const findPost = await postByID(_id);

        if (!findPost[0]){
            return res.status(400).json({
                status: 'fail',
                message: 'Post not found'
            });
        }

        const updateBody = {
            title: title !== '' ? title : findPost[0].title,
            description: description !== '' ? description : findPost[0].description,
            categoryID: categoryID !== '' ? categoryID : findPost[0].categoryID
        };

        // only update logged user post, not allow other person post update
        const data = await postUpdateService(_id, authorID, updateBody);

        if (!data){
            return res.status(400).json({
                status: 'fail',
                message: 'Post not updated'
            });
        }

        res.status(200).json({
            status: 'success',
            data
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'fail',
            error: 'Server error occurred'
        });
    }
}

exports.authSearchPosts = async (req, res)=>{
    try {

        const authorID = req.auth._id;
        const keyword = req.params.keyword;

        const ObjectId = mongoose.Types.ObjectId;

        const searchQuery = { authorID: ObjectId(authorID), title: {"$regex": keyword, "$options": "i" }};

        const posts = await searchPostService(searchQuery)

        if (!posts[0]){
            return res.status(404).json({
                status: 'fail',
                message: 'Post not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            data: posts
        })

    }catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'fail',
            error: 'Server error occurred'
        });
    }
}

exports.searchPosts = async (req, res)=>{
    try {

        const keyword = req.params?.keyword;
        const perPage = 6;
        const page = req.params?.page ? req.params?.page : 1;

        const searchQuery = { title: {$regex: keyword, $options: "i" }};

        const posts = await showAllPostService(searchQuery, page, perPage)

        res.status(200).json({
            status: 'Success',
            data: posts
        })

    }catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'fail',
            error: error.message
        });
    }
}

exports.authShowPostByCategory = async (req, res)=>{
    try {

        const categoryName =  req.params.name.toLowerCase();
        const authorID = req.auth._id;

        const isCategory = await categoryFindByName(categoryName);

        if (!isCategory[0]){
            return res.status(400).json({
                status: 'fail',
                message: 'Category not found'
            });
        }
        const ObjectId = mongoose.Types.ObjectId;
        const query = {authorID: ObjectId(authorID), categoryID: ObjectId(isCategory[0]['_id'])}

        const post = await showPostByCategoryService(query);

        if (!post[0].posts[0]){
            return res.status(400).json({
                status: 'fail',
                message: 'Post not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            message: `Post show by ${categoryName} category successfully`,
            data: post
        })

    }catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'fail',
            error: error.message
        });
    }
}

exports.showPostByCategory = async (req, res)=>{
    try {
        const perPage = 6;
        const page = req.params?.page ? req.params?.page : 1;
        const categoryName =  req.params.name.toLowerCase();

        const isCategory = await categoryFindByName(categoryName);

        if (!isCategory[0]){
            return res.status(400).json({
                status: 'fail',
                error: 'Category not found'
            });
        }
        const ObjectId = mongoose.Types.ObjectId;
        const query = {categoryID: ObjectId(isCategory[0]['_id'])}

        // const post = await showPostByCategoryService(query);
        const post = await showAllPostService(query, page, perPage);

        res.status(200).json({
            status: 'Success',
            message: `Post show by ${categoryName} category successfully`,
            data: post
        })

    }catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'fail',
            error: error.message
        });
    }
}

exports.getProductById = async (req, res)=>{
    try {

        const id =  req.params.id;

        const product = await getProductByIdService(id);

        res.status(200).json({
            product
        })

    }catch (error) {
        console.log(error);
        res.status(404).json({
            status: 'fail',
            error: 'Post Not found'
        });
    }
}

exports.deletePost = async (req, res)=>{
    try {
        const _id = req.params.id;
        const authorID = req.auth._id;
        const result = await postDeleteService(authorID, _id);

        if(!result){
           return res.status(400).json({
                status: 'fail',
                message: 'Invalid request',
            });
        }

        res.status(200).json({
            status: 'success',
            data: result
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'fail',
            error: 'Server error occurred'
        });
    }
}




