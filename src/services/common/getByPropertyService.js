const getByPropertyService = async (query, Model)=>{
    const data = await Model.aggregate([
        {$match: query}
    ]);

    return data[0]
}

module.exports = getByPropertyService;