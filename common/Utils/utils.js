var ErrorCode = require('./ErrorCode');
module.exports ={
    getError : getError
}
function getError(errorName, err) {
    if (!errorName) {
        errorName = 'DEFAULT_ERROR'
    } else if (!ErrorCode[errorName]) {
        errorName = 'DEFAULT_ERROR'
    }

    var error = createError(errorName);
    if (err) {
        error.stack = err.stack;
        error.errorMessage = err.message;
    }

    return error;

}

function createError(errorName) {
    var errorObj = ErrorCode[errorName];
    var error = new Error(errorObj.message);
    error.code = errorName;
    for(key in errorObj){
        if(errorObj.hasOwnProperty(key) && key !== 'message'){
            error[key] = errorObj[key];
        }
    }
    return error;
}


