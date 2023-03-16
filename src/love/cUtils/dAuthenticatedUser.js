const jsonwebtoken = require('jsonwebtoken');
const UserModel = require('../aMCR/aModel/bAdministration/cUserModel');
const catchAsyncError = require('../dMiddleware/bCatchAsyncError');
const ErrorHandler = require('./aErrorHandler');

exports.authenticatedUser = catchAsyncError( async (request, response, next) => {
    // Retrieve
    const { token } = request.cookies

    // Not Found
    if (!token || token === "j:null") {
        return next(new ErrorHandler("Please login to access this resource", 401))
    }

    // Found
    // Decode Token & Save User in Request
    const decodedData = jsonwebtoken.verify(
        token,
        process.env.JWT_SECRET
    )
    request.user = await UserModel.findById(decodedData.id)
    next()
} )

exports.authorizeRoles = (...roles) => {
    return (request, response, next) => {
        if (!roles.includes(request.user.relation_info.role.title)) next(new ErrorHandler(`Role '${request.user.relation_info.role.title}' is not allowed to access this resource`, 403))
        next()
    }
}