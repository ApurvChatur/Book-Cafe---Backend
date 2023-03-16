const createAndSaveToken = (statusCode, message, userKey, user, response) => {
    // Create Token
    const token = user.getJWTToken()

    // Save Token
    const options = {
        exires: new Date(
            Date.now + process.env.COOKIE_EXPIRE * 24 * 60 * 60 *1000
        ),
        httpOnly: true
    }

    // Response
    response.status(statusCode).cookie('token', token, options ).json({ 
        // cookie saves in request...
        success: true,
        message: message,
        [userKey]: user,
        token_create: token
    })
} 

module.exports = createAndSaveToken;
