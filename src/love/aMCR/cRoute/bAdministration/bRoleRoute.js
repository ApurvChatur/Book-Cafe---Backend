const express = require('express');
const { authenticatedUser } = require('../../../cUtils/dAuthenticatedUser');
const { roleController } = require('../../bController/bAdministration/bRoleController');

const router = express.Router();


router.route("/list").get(roleController().list);
router.route("/create").post(authenticatedUser, roleController().create);
router.route("/retrieve/:id").get(authenticatedUser, roleController().retrieve);
router.route("/update/:id").put(authenticatedUser, roleController().update);
router.route("/delete/:id").delete(authenticatedUser, roleController().delete);


module.exports = router
