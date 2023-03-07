const BrandModel = require('../models/brand/Brand');
const ProductModel = require('../models/product/Product');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const {checkAssociateService} = require("../services/common/checkAssociateService");
const getByIdService = require("../services/common/getByIdService");
const getByPropertyService = require("../services/common/getByPropertyService");
const createService = require("../services/common/createService");
const {updateService} = require("../services/common/updateService");

exports.postBrand= async (req, res)=>{
    try {
        const {name, logo = ''} = req.body;
        const userID = req.auth._id;

       const isMatch = await getByPropertyService({name}, BrandModel);

       if (isMatch){
          return res.status(400).json({
               error: 'Brand already exit',
           });
       }

        const createObj = {name, logo, userID}
        const brand = await createService(createObj, BrandModel);
        res.status(200).json({
            brand
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Server error occurred'
        });
    }

};

exports.getBrand = async (req, res)=>{
    try {

        const brands = await BrandModel.find({});
        res.status(200).json({
            brands
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Server error occurred'
        });
    }
}

exports.getBrandByID = async (req, res)=>{
    try {
        const id = req.params.brandID;

        const brand = await getByIdService(id, BrandModel);

        if (!brand){
           return res.status(404).json({
                status: 'fail',
                message: 'Brand not found',
            });
        }

        res.status(200).json({
           brand
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Server error occurred'
        });
    }
}

exports.patchBrand = async (req, res)=>{
    try {

        const id = req.params.brandID;
        const name = req.body.name;
        const authorID = req.auth._id;

        const brand = await getByIdService(id, BrandModel);

        const brandName = req.body?.name !== '' ? req.body?.name : brand?.name;

        const result = await updateService({_id: ObjectId(id), authorID: ObjectId(authorID)}, {name: brandName}, BrandModel);
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

exports.deleteBrand = async (req, res)=>{
    try {
        const id = req.params?.brandID;
        const CheckAssociate = await checkAssociateService({brandID: ObjectId(id)}, ProductModel);

        if (CheckAssociate[0]){
            return res.status(400).json({
                error: 'Delete failed, Brand associate with product'
            });
        }

        const result = await BrandModel.findByIdAndDelete(id)

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

