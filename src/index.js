const app = require("./app");
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');
const connectDatabase = require("./love/bConfig/bDatabaseConfig");

// Uncaught Exception
process.on("uncaughtException", (error) => {
    console.log(`Error--> ${error.message}`)
    console.log(`Shutting down the server due to Uncaught Exception`)
    process.exit(1)
})

// Connect Environment Variable
dotenv.config({path: "src/love/bConfig/aConstantConfig.env"})

// Connect Database
connectDatabase()

// Cloudinary
cloudinary.config({
    cloud_name: 'dprguhpph',
    api_key: '636787975923379',
    api_secret: 'wcFaz18DjoJCW5Z7isyzUGrHP9Q'
})

// Server Listen
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})

// Unhandled Promise Rejection
process.on("unhandledRejection", error => {
    console.log(`Error--> ${error.message}`)
    console.log(`Shutting down the server due to Unhandled Promise Rejection`)

    server.close(() => {
        process.exit(1)
    })
})

