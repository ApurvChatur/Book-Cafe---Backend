const ErrorHandler = require("./aErrorHandler");

exports.destructureID = async function(ids, model, next) {
    const objects = [];

    for (const id of ids) {
      const object = await new Promise(async (resolve, reject) => {
        resolve(await model.findById(id))
        reject(next(new ErrorHandler(`${Label} Not Found`, 404)))
      });
      objects.push(object);
    }

    return ids
}
