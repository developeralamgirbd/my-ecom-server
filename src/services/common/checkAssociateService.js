
exports.checkAssociateService = async (QueryObj, AssociateModel)=>{
    return await AssociateModel.aggregate([
        {$match: QueryObj}
    ]);
}