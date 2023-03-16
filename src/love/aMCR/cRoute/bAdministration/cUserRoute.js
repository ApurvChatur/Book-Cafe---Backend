const express = require('express');
const { authenticatedUser } = require('../../../cUtils/dAuthenticatedUser');
const { userController } = require('../../bController/bAdministration/cUserController');

const router = express.Router();


router.route("/list").get(authenticatedUser, userController().list);
router.route("/create").post(authenticatedUser, userController().create);
router.route("/retrieve/:id").get(authenticatedUser, userController().retrieve);
router.route("/update/:id").put(authenticatedUser, userController().update);
router.route("/delete/:id").delete(authenticatedUser, userController().delete);

router.route("/register").post(userController().register);
router.route("/login").post(userController().login);
router.route("/logout").get(authenticatedUser, userController().logout);

router.route("/profile-retrieve").get(authenticatedUser, userController().profileRetrieve);


module.exports = router
