const createService = async (createObj, Model)=>{
    const data = new Model(createObj);
    await data.save();
    return data;
}

module.exports = createService;