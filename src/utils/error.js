exports.error = (msg = 'Something went worng', status = 400)=>{
    const error = new Error(msg);
    error.status = status;
    return error;
}