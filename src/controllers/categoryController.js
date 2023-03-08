
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
const Category = require("../models/category/Category");

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
            error: 'Server error occurred'
        });
    }
}

exports.getCategoryByID = async (req, res)=>{
    try {
        const id = req.params.id;
        const childName = req.params.childName.toLowerCase();

        const category = await CategoryModel.aggregate([
            {$lookup: {from: 'subcategories', localField: '_id', foreignField: 'parentID', as: 'subCategory'}},
            {$match: {$or: [{_id: ObjectId(id)},{"subCategory._id": ObjectId(id)},{ 'subCategory.children': {$in: [childName] } }]}}
        ]);

        // if (!category){
        //     return res.status(404).json({
        //         message: 'Category not found',
        //     });
        // }

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


exports.getCategoryByName = async (req, res)=>{
    try {
        const id = req.params.id;
        const name = req.params.name;

        // const category = await getByIdService(id, CategoryModel);
        // CategoryModel.aggregate([
        //     {$match: {}}
        // ])
        // CategoryModel.findOne({})
        CategoryModel.findOne( { $or: [ { name: name }, { price: 10 } ] } )

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

        const id = req.params?.id;
        const authorID = req.auth?._id;

        const category = await getByIdService(id, CategoryModel);

        const categoryName = req.body?.name !== '' ? req.body?.name : category?.name;

        const isMatch = await getByPropertyService({_id: {$ne: ObjectId(id)}, name: categoryName}, CategoryModel);

        if (isMatch){
            return res.status(400).json({
                error: 'Category already exit',
            });
        }

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
        const id = req.params?.id;
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

exports.patchSubCategory = async (req, res)=>{
    try {

        const id = req.params?.id;
        const authorID = req.auth?._id;

        const category = await getByIdService(id, SubCategoryModel);

        const categoryName = req.body?.name !== '' ? req.body?.name : category?.name;

        const isMatch = await getByPropertyService({_id: {$ne: ObjectId(id)}, name: categoryName.toLowerCase()}, SubCategoryModel);

        if (isMatch) {
            return res.status(400).json({error: 'Sub Category already exits'})
        }

        const result = await updateService({_id: ObjectId(id), authorID: ObjectId(authorID)}, {name: categoryName}, SubCategoryModel);
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

exports.postSubCategoryChild = async (req, res, next)=>{
    try {
        const {name, id, index} = req.body;
        const key = `children.${index}`;
        const update = index === undefined ? {$addToSet: {children: name}} : {$set: {[key]: name}};

        const children = await SubCategoryModel.updateOne({_id: ObjectId(id)}, update, {upsert: true})
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















