
exports.deleteService = async (QueryObj, Model)=>{
    return await Model.deleteOne(QueryObj)
}

