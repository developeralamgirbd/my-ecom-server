const CategoryModel = require('../models/category/Category');
const SubCategoryModel = require('../models/category/SubCategory');
const PostModel = require('../models/product/Product');
const mongoose = require('mongoose');
const {error} = require('../utils/error');
const ObjectId = mongoose.Types.ObjectId;

const {checkAssociateService} = require("../services/common/checkAssociateService");

const {showCategoriesService,
    categoryFindByName,
    categoryFindByID,
    categoryUpdateService,
    categoryCreateService,
    categoryDeleteService} = require("../services/categoryService/categoryService");
const getByIdService = require("../services/common/getByIdService");
const createService = require("../services/common/createService");

exports.postSubCategory = async (req, res, next)=>{
    try {
        const {name, parentID} = req.body;
        const userID = req.auth._id;

       const findCategory = await getByIdService({name: name.toLowerCase()}, SubCategoryModel);
        // console.log(findCategory)

       if (findCategory) {
           return res.status(400).json({error: 'Category already created'})
       }

       const createObj = {name, parentID, userID}
        const subCategory = await createService(createObj, SubCategoryModel);
        res.status(200).json({
            subCategory
        });

    }catch (error) {
        console.log(error)
        res.status(500).json({error: 'Server error occurred'})
    }

};

exports.postSubCategoryChild = async (req, res, next)=>{
    try {
        const {name, id} = req.body;

      const children = await SubCategoryModel.updateOne({_id: ObjectId(id)}, {
            $addToSet: {children: name}
        }, {upsert: true})

        res.status(200).json({
            children
        });

    }catch (error) {
        console.log(error)
        res.status(500).json({error: 'Server error occurred'})
    }

};

exports.showCategory = async (req, res)=>{
    try {

        const categories = await showCategoriesService();

        if (!categories[0]){
           return res.status(400).json({
                status: 'fail',
                message: 'Category not found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: categories
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'fail',
            error: error.message
        });
    }
}

exports.getSingleCategory = async (req, res)=>{
    try {
        const catID = req.params.categoryID;

        const category = await categoryFindByID(catID);

        if (!category[0]){
           return res.status(400).json({
                status: 'fail',
                message: 'Category not found',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Successfully get all category',
            data: category[0]
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'fail',
            error: 'Server error occurred'
        });
    }
}

exports.updateCategory = async (req, res)=>{
    try {

        const _id = req.params.categoryID;
        const name = req.body.name;
        const authorID = req.auth._id;

        if (name === ''){
            return res.status(400).json({
                status: 'fail',
                error: 'Category name is required'
            });
        }

        const result = await categoryUpdateService(_id, authorID, name)

        if (!result){
            return res.status(400).json({
                status: 'fail',
                error: 'Category not update'
            });
        }

        res.status(200).json({
            status: 'success',
            result
        });

    }catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'fail',
            error: 'Server error occurred'
        });
    }
}

exports.deleteCategory = async (req, res)=>{
    try {
        const _id = req.params.categoryID;
        const authorID = req.auth._id;

        const ObjectId = mongoose.Types.ObjectId;

        const isCategory = await categoryFindByID(_id);

        if(!isCategory[0]){
            return res.status(400).json({
                status: 'fail',
                error: 'Category not found',
            });
        }

        const CheckAssociate = await checkAssociateService({categoryID: ObjectId(_id)}, PostModel);

        if (CheckAssociate[0]){
            return res.status(400).json({
                status: 'fail',
                error: 'Delete failed, Category associate with post'
            });
        }

        const result = await categoryDeleteService(authorID, _id);

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

