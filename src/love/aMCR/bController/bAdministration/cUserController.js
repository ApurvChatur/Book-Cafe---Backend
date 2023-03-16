const ErrorHandler = require("../../../cUtils/aErrorHandler")
const catchAsyncError = require("../../../dMiddleware/bCatchAsyncError")
const APIFeature = require("../../../cUtils/bAPIFeature")
const createAndSaveToken = require("../../../cUtils/cCreate&SaveToken")
const RoleModel = require("../../aModel/bAdministration/bRoleModel")
const UserModel = require("../../aModel/bAdministration/cUserModel")


exports.userController = (Model= UserModel, Label= 'User') => {
    return {
        // List Controller
        list: catchAsyncError(async (request, response, next) => {
            // API Feature
            const apiFeature = new APIFeature(Model.find(), request.query).search().filter().pagination(15)

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
                created_by: request.user.email
            }

            async function idToObject() {
                const id = request.body.relation_info.role;
                const object_retrieve = await RoleModel.findById(id)

                // Not Found
                if (!object_retrieve) next(new ErrorHandler(`Role Not Found`, 404))
                return object_retrieve
            }

            const mahBody = {
                ...request.body,
                relation_info: {
                    ...request.body.relation_info,
                    role: await idToObject()
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
                updated_by: request.user.email
            }

            async function idToObject() {
                const id = request.body.relation_info.role;
                const object_retrieve = await RoleModel.findById(id)

                // Not Found
                if (!object_retrieve) next(new ErrorHandler(`Role Naasaot Found`, 404))
                return object_retrieve
            }

            const mahBody = {
                ...request.body,
                relation_info: {
                    ...request.body.relation_info,
                    role: await idToObject()
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

        ///////////////////////// User Authentication Controller //////////////////////////
        // User Register Controller
        register: catchAsyncError(async (request, response, next) => {
            async function idToObject() {
                const id = request.body.relation_info.role;
                const object_retrieve = await RoleModel.findById(id)

                // Not Found
                if (!object_retrieve) next(new ErrorHandler(`Role Not Found`, 404))
                return object_retrieve
            }

            const mahBody = {
                ...request.body,
                relation_info: {
                    ...request.body.relation_info,
                    role: await idToObject()
                }
            }

            // Create
            const user = await Model.create(mahBody)

            // Response
            createAndSaveToken(201, `User Registered Successfully`, `user_register`, user, response)
        }),

        // User Login Controller
        login: catchAsyncError(async (request, response, next) => {
            // Destructure Body
            const {email, password} = request.body

            // Check
            if (!email || !password) next(new ErrorHandler("Please enter email & password", 400))

            // Retrieve
            const user = await Model.findOne({email}).select("+password")

            // Not Found
            if (!user) next(new ErrorHandler("Invalid email or password", 401))

            // Match Password
            const isPasswordMatched = await user.comparePassword(password)

            // Not Matched
            if (!isPasswordMatched) next(new ErrorHandler("Invalid email or password", 401))

            // Response
            createAndSaveToken(200, "User Logged In Successfully", "user_login", user, response)
        }),

        // User Logout Controller
        logout: catchAsyncError(async (request, response, next) => {
            // Remove Token
            const options = {
                expires: new Date(Date.now()),
                httpOnly: true
            }

            // Response
            response.status(200).cookie('token', null, options).json({ 
                success: true,
                message: "User Logged Out Successfully",
                user_logout: request.user
            })

        }),

        // User Profile Retrieve Controller
        profileRetrieve: catchAsyncError(async (request, response, next) => {
            // Retrieve
            const object_retrieve = await UserModel.findById(request.user.id);

            // Not Found
            if (!object_retrieve) next(new ErrorHandler(`${Label} Not Found`, 404))
            
            response.status(200).json({
                success: true,
                message: `${Label} Profile Reterived Successfully`,
                profile_retrieve: object_retrieve
            })
        })



    }   
}
