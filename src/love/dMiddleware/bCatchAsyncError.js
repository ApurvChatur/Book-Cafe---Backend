module.exports = someFunction => (request, response, next) => {
    Promise.resolve(someFunction(request, response, next)).catch(next)
} 