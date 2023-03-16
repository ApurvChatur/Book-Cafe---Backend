const express = require('express');
const { authenticatedUser } = require('../../../cUtils/dAuthenticatedUser');
const { baseController } = require('../../bController/aSetting/aBaseController');

const router = express.Router();


router.route("/list").get(authenticatedUser, baseController().list);
router.route("/create").post(authenticatedUser, baseController().create);
router.route("/retrieve/:id").get(authenticatedUser, baseController().retrieve);
router.route("/update/:id").put(authenticatedUser, baseController().update);
router.route("/delete/:id").delete(authenticatedUser, baseController().delete);


module.exports = router
