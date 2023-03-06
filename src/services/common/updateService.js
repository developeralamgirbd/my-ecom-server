
exports.updateService = async (FindQuery, UpdateObj, Model)=>{
    return await Model.updateOne(FindQuery, UpdateObj, {runValidators: true});
}

