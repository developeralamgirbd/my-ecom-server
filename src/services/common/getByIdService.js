const getByIdService = async (id, Model)=>{
    return  Model.findById(id);
}

module.exports = getByIdService;