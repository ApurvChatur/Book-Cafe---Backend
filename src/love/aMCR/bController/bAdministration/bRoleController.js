const ErrorHandler = require("../../../cUtils/aErrorHandler")
const catchAsyncError = require("../../../dMiddleware/bCatchAsyncError")
const APIFeature = require("../../../cUtils/bAPIFeature")
const RoleModel = require("../../aModel/bAdministration/bRoleModel")
const MenuModel = require("../../aModel/bAdministration/aMenuModel")


exports.roleController = (Model= RoleModel, Label= 'Role') => {
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
            
            // Assign Menu
            async function idToObject() {
                const ids = request.body.relation_info.menus;
                const objects = [];

                for (const id of ids) {
                    const object_retrieve = await new Promise(async resolve => {
                        resolve(await MenuModel.findById(id.menu))
                    });

                    // Not Found
                    if (!object_retrieve) next(new ErrorHandler(`Menu Not Found`, 404))

                    objects.push({
                        ...id,
                        menu: object_retrieve
                    });
                }
                return objects
            }

            const mahBody = {
                ...request.body,
                relation_info: {
                    ...request.body.relation_info,
                    menus: await idToObject()
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

            // Assign Menu
            async function idToObject() {
                const ids = request.body.relation_info.menus;
                const objects = [];

                for (const id of ids) {
                    const object_retrieve = await new Promise(async resolve => {
                        resolve(await MenuModel.findById(id.menu))
                    });

                    // Not Found
                    if (!object_retrieve) next(new ErrorHandler(`Menu Not Found`, 404))

                    objects.push({
                        ...id,
                        menu: object_retrieve
                    });
                }
                return objects
            }

            const mahBody = {
                ...request.body,
                relation_info: {
                    ...request.body.relation_info,
                    menus: await idToObject()
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
