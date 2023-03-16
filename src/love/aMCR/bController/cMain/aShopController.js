const ErrorHandler = require("../../../cUtils/aErrorHandler")
const catchAsyncError = require("../../../dMiddleware/bCatchAsyncError")
const APIFeature = require("../../../cUtils/bAPIFeature")
const ShopModel = require("../../aModel/cMain/aShopModel")
const UserModel = require("../../aModel/bAdministration/cUserModel")


exports.shopController = (Model= ShopModel, Label= 'Shop') => {
    return {
        // List Controller
        list: catchAsyncError(async (request, response, next) => {
            // API Feature
            const apiFeature = new APIFeature(Model.find(), request.query).search().filter().pagination(10)

            // List
            const object_list = await apiFeature.query

            // Response
            response.status(201).json({
                success: true,
                message: `${Label} Listed Successfully`,
                total_count: await Model.countDocuments(),
                page_count: object_list.length,
                list: object_list
            })
        }),

        // Create Controller
        create: catchAsyncError(async (request, response, next) => {
            // Personal Info
            request.body.personal_info = {
                created_at: new Date(Date.now()),
                created_by: request.user
            }

            // Assign Owner
            async function idToObject1() {
                const ids = request.body.relation_info.user_owners;
                const objects = [];

                for (const id of ids) {
                    const object_retrieve = await new Promise(async resolve => {
                        resolve(await UserModel.findById(id))
                    });

                    // Not Found
                    if (!object_retrieve) next(new ErrorHandler(`User Not Found`, 404))

                    // Not Owner
                    if (object_retrieve.relation_info.role.basic_info.title !== "Owner") next(new ErrorHandler(`User Role is not Owner`, 404))

                    objects.push(object_retrieve);
                }
                return objects
            }

            async function idToObject2() {
                const ids = request.body.relation_info.user_employees;
                const objects = [];

                for (const id of ids) {
                    const object_retrieve = await new Promise(async resolve => {
                        resolve(await UserModel.findById(id))
                    });

                    // Not Found
                    if (!object_retrieve) next(new ErrorHandler(`User Not Found`, 404))

                    // Not Owner
                    if (object_retrieve.relation_info.role.basic_info.title !== "Employee") next(new ErrorHandler(`User Role is not Employee`, 404))

                    objects.push(object_retrieve);
                }
                return objects
            }

            const mahBody = {
                ...request.body,
                relation_info: {
                    ...request.body.relation_info,
                    user_owners: await idToObject1(),
                    user_employees: await idToObject2()
                }
            }
            
            // Create
            const object_create = await Model.create(mahBody)
        
            // Response
            response.status(201).json({
                success: true,
                message: `${Label} Created Successfully`,
                create: object_create
            })
        }),

        // Retrieve Controller
        retrieve: catchAsyncError(async (request, response, next) => {
            // Retrieve
            let object_retrieve = await Model.findById(request.params.id)

            // Not Found
            if (!object_retrieve) next(new ErrorHandler(`${Label} Not Found`, 404))

            // Response
            response.status(200).json({
                success: true,
                message: `${Label} Reterived Successfully`,
                retrieve: object_retrieve
            })
        }),

        // Update Controller
        update: catchAsyncError(async (request, response, next) => {
            // Retrieve
            let object_retrieve = await Model.findById(request.params.id)

            // Not Found
            if (!object_retrieve) next(new ErrorHandler(`${Label} Not Found`, 404))

            // Personal Info
            request.body.personal_info = {
                updated_at: new Date(Date.now()),
                created_by: object_retrieve.personal_info.created_by,
                updated_by: request.user
            }

            // Assign Owner
            async function idToObject() {
                const ids = request.body.relation_info.user_owners;
                const objects = [];

                for (const id of ids) {
                    const object_retrieve = await new Promise(async resolve => {
                        resolve(await UserModel.findById(id))
                    });

                    // Not Found
                    if (!object_retrieve) next(new ErrorHandler(`User Not Found`, 404))

                    // Not Owner
                    if (object_retrieve.relation_info.role.basic_info.title !== "Owner") next(new ErrorHandler(`User Role is not Owner`, 404))

                    objects.push(object_retrieve);
                }
                return objects
            }

            const mahBody = {
                ...request.body,
                relation_info: {
                    ...request.body.relation_info,
                    user_owners: await idToObject()
                }
            }

            // Update
            object_retrieve = await Model.findByIdAndUpdate(
                request.params.id,
                mahBody, {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false
            })
        
            // Response
            response.status(200).json({
                success: true,
                message: `${Label} Updated Successfully`,
                update: object_retrieve
            })
        }),

        // Delete Controller
        delete: catchAsyncError(async (request, response, next) => {
            // Retrieve
            let object_retrieve = await Model.findById(request.params.id)

            // Not Found
            if (!object_retrieve) next(new ErrorHandler(`${Label} Not Found`, 404))

            // Delete
            await object_retrieve.remove()

            // Response
            response.status(200).json({
                success: true,
                message: `${Label} Deleted Successfully`,
                delete: object_retrieve
            })
        }),
    }
}
