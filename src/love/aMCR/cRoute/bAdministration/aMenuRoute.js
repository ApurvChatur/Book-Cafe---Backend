const express = require('express');
const { menuController } = require('../../bController/bAdministration/aMenuController');
const { authenticatedUser } = require('../../../cUtils/dAuthenticatedUser');

const router = express.Router();


router.route("/list").get(authenticatedUser, menuController().list);
router.route("/create").post(authenticatedUser, menuController().create);
router.route("/retrieve/:id").get(authenticatedUser, menuController().retrieve);
router.route("/update/:id").put(authenticatedUser, menuController().update);
router.route("/delete/:id").delete(authenticatedUser, menuController().delete);


module.exports = router
