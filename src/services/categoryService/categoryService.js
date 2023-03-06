const Category = require('../../models/category/Category');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.categoryCreateService = async (name, userID)=>{
    const category = new Category({name, userID});
    await category.save();
    return category;
}

exports.showCategoriesService = async ()=>{
    return Category.aggregate([
        {$facet: {
           totalCategory: [
               {$group: {_id:0, count: {$sum: 1}}},
               {$project: {'_id':0}}
           ],
           categories: [
               {$project: {_id:1, name:1, authorID:1, status:1, createdAt:1, updatedAt:1 }}
           ]
        }},
    ]);
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








