const Category = require('../../models/category/Category');
const SubCategoryModel = require('../../models/category/SubCategory');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.categoryCreateService = async (name, userID)=>{
    const category = new Category({name, userID});
    await category.save();
    return category;
}

exports.categoryFindByName = async (name)=>{
    return Category.aggregate([
        {$match: {name}}
    ]);
}

exports.categoryFindByID = async (_id)=>{
    return Category.aggregate([
        {$match: {_id: ObjectId(_id)}}
    ]);
}


exports.categoryUpdateService = async (_id, authorID, name)=>{
    return Category.updateOne({authorID:  ObjectId(authorID), _id: ObjectId(_id)}, {name}, {runValidators: true});
}


exports.categoryDeleteService = async (authorID, _id)=>{
    return Category.deleteOne({authorID:  ObjectId(authorID), _id: ObjectId(_id)});
}

exports.showCategoriesService = async ()=>{
    const data = await Category.aggregate([
        {$lookup: {from: 'subcategories', localField: '_id', foreignField: 'parentID', as: 'subCategory'}},
    ]);
    return data
}








