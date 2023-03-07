/*const CategoryModel = require('../models/category/Category');
const ProductModel = require('../models/product/Product');
const SubCategoryModel = require('../models/category/SubCategory');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const {checkAssociateService} = require("../services/common/checkAssociateService");

const {showCategoriesService,
    categoryFindByName,
    categoryFindByID,
    categoryUpdateService,
    categoryCreateService,
    categoryDeleteService} = require("../services/categoryService/categoryService");
const getByIdService = require("../services/common/getByIdService");*/

/*
exports.postCategory = async (req, res)=>{
    try {
        const {name} = req.body;
        const userID = req.auth._id;

       const findCategory = await getByIdService({name}, CategoryModel);

       if (findCategory){
          return res.status(400).json({
               status: 'fail',
               error: 'Category already created',
           });
       }

        const category = await categoryCreateService(name, userID);
        res.status(200).json({
            status: 'success',
            message: 'Successfully created category',
            data: category
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'fail',
            error: 'Server error occurred'
        });
    }

};

exports.showCategory = async (req, res)=>{
    try {

        const categories = await showCategoriesService();

        // if (!categories[0]){
        //    return res.status(400).json({
        //         status: 'fail',
        //         message: 'Category not found',
        //     });
        // }

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
*/


const CategoryModel = require('../models/category/Category');
const ProductModel = require('../models/product/Product');
const SubCategoryModel = require('../models/category/SubCategory');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const {checkAssociateService} = require("../services/common/checkAssociateService");
const getByIdService = require("../services/common/getByIdService");
const getByPropertyService = require("../services/common/getByPropertyService");
const createService = require("../services/common/createService");
const {updateService} = require("../services/common/updateService");
const {showCategoriesService} = require("../services/categoryService/categoryService");

exports.postCategory= async (req, res)=>{
    try {
        const {name} = req.body;
        const authorID = req.auth._id;

        const isMatch = await getByPropertyService({name}, CategoryModel);

        if (isMatch){
            return res.status(400).json({
                error: 'Category already exit',
            });
        }

        const createObj = {name, authorID}
        const category = await createService(createObj, CategoryModel);
        res.status(200).json({
            category
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Server error occurred'
        });
    }

};

exports.getCategories = async (req, res)=>{
    try {

        const categories = await showCategoriesService();
        res.status(200).json({
            categories
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.toString()
        });
    }
}

exports.getCategoryByID = async (req, res)=>{
    try {
        const id = req.params.categoryID;

        const category = await getByIdService(id, CategoryModel);

        if (!category){
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        res.status(200).json({
            category
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Server error occurred'
        });
    }
}

exports.patchCategory = async (req, res)=>{
    try {

        const id = req.params?.categoryID;
        const name = req.body?.name;
        const authorID = req.auth?._id;

        const category = await getByIdService(id, CategoryModel);

        const categoryName = req.body?.name !== '' ? req.body?.name : category?.name;

        const result = await updateService({_id: ObjectId(id), authorID: ObjectId(authorID)}, {name: categoryName}, CategoryModel);
        res.status(200).json({
            result
        });

    }catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Server error occurred'
        });
    }
}

exports.deleteCategory = async (req, res)=>{
    try {
        const id = req.params?.categoryID;
        const CheckAssociate = await checkAssociateService({categoryID: ObjectId(id)}, ProductModel);

        if (CheckAssociate[0]){
            return res.status(400).json({
                error: "You can't delete, Category associate with product"
            });
        }

        const subCategory = getByPropertyService({parentID: ObjectId(id)}, SubCategoryModel);
        let CheckSubCategoryAssociate;
        if (subCategory){
            CheckSubCategoryAssociate = await checkAssociateService({subCategoryID: ObjectId(subCategory?._id)}, ProductModel);
        }

        if (CheckSubCategoryAssociate[0]){
            return res.status(400).json({
                error: "You can't delete, Category associate with product"
            });
        }

        const result = await CategoryModel.findByIdAndDelete(id)

        res.status(200).json({
            result
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Server error occurred'
        });
    }
}
// Sub Category Controller

exports.postSubCategory = async (req, res, next)=>{
    try {
        const {name, parentID} = req.body;
        const userID = req.auth._id;

        const isMatch = await getByPropertyService({name: name.toLowerCase()}, SubCategoryModel);

        if (isMatch) {
            return res.status(400).json({error: 'Sub Category already exits'})
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

exports.deleteSubChildCategory = async (req, res)=>{
    try {
        const id = req.params?.id;
        const categoryName = req.params?.name;
        const CheckAssociate = await checkAssociateService({categoryName}, ProductModel);

        if (CheckAssociate[0]){
            return res.status(400).json({
                error: "You can't delete, Category associate with product"
            });
        }

        const result = await SubCategoryModel.updateOne({_id: ObjectId(id)}, {$pull: {children: categoryName}});
        res.status(200).json({
            result
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Server error occurred'
        });
    }
}















