const express = require('express');
const { authenticatedUser } = require('../../../cUtils/dAuthenticatedUser');
const { branchController } = require('../../bController/cMain/bBranchController');

const router = express.Router();


router.route("/list").get(authenticatedUser, branchController().list);
router.route("/create").post(authenticatedUser, branchController().create);
router.route("/retrieve/:id").get(authenticatedUser, branchController().retrieve);
router.route("/update/:id").put(authenticatedUser, branchController().update);
router.route("/delete/:id").delete(authenticatedUser, branchController().delete);


module.exports = router
