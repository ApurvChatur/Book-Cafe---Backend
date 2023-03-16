const express = require('express');
const { authenticatedUser } = require('../../../cUtils/dAuthenticatedUser');
const { shopController } = require('../../bController/cMain/aShopController');

const router = express.Router();


router.route("/list").get(authenticatedUser, shopController().list);
router.route("/create").post(authenticatedUser, shopController().create);
router.route("/retrieve/:id").get(authenticatedUser, shopController().retrieve);
router.route("/update/:id").put(authenticatedUser, shopController().update);
router.route("/delete/:id").delete(authenticatedUser, shopController().delete);


module.exports = router
