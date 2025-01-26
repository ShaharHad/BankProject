

exports.createError = (statusCode, message) =>{
    const err = new Error();
    err.statusCode = statusCode || 500;
    err.message = message;

    return err;
}