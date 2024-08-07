const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl, validateUser} = require("../middleware.js");
const userController = require("../controllers/users.js");
const passport = require("passport");

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(validateUser, wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}), wrapAsync(userController.login));

router.get("/logout", userController.logout);

module.exports = router;