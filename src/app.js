// Imports
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const errorHandler = require('./love/dMiddleware/aError');

const baseRoute = require('./love/aMCR/cRoute/aSetting/aBaseRoute');

const menuRoute = require('./love/aMCR/cRoute/bAdministration/aMenuRoute');
const roleRoute = require('./love/aMCR/cRoute/bAdministration/bRoleRoute');
const userRoute = require('./love/aMCR/cRoute/bAdministration/cUserRoute');

const shopRoute = require('./love/aMCR/cRoute/cMain/aShopRoute');
const branchRoute = require('./love/aMCR/cRoute/cMain/bBranchRoute');

// App
const app = express()

// Use
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }))
app.use("/api/v1/base", baseRoute)

app.use("/api/v1/menu", menuRoute)
app.use("/api/v1/role", roleRoute)
app.use("/api/v1/user", userRoute)

app.use("/api/v1/shop", shopRoute)
app.use("/api/v1/branch", branchRoute)

app.use(errorHandler)


module.exports = app
