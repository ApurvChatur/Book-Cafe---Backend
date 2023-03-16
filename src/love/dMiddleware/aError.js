const ErrorHandler = require("../cUtils/aErrorHandler");


module.exports = (error, request, response, next) => {
    error.code = error.code || 500
    error.message = error.message || "Some Internal Server Error"

    // Cast Error
    if (error.name === "CastError") {
        const message = `Resource Not Found. Invalid: ${error.path}`
        error = new ErrorHandler(message, 400)
    }

    // Mongoose Duplicate Key Error
    if (error.code === 11000) {
        const message = `Duplicate ${Object.keys(error.keyValue)} entered`
        error = new ErrorHandler(message, 400)
    }

    // Wrong JWT Error
    if (error.name === "JsonWebTokenError") {
        const message = `JSON Web Toke is invalid, try again`
        error = new ErrorHandler(message, 400)
    }

    // Expire JWT Error
    if (error.name === "TokenExpiredError") {
        const message = `JSON Web Toke is expired, try again`
        error = new ErrorHandler(message, 400)
    }


    // Response
    response.status(error.code).json({
        success: false,
        message: error.message
    })
}
