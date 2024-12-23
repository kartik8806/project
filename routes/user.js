const express = require('express');
const router = express.Router()
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const usercontroller = require("../controllers/users.js");


router
.route("/signup")
.get(usercontroller.renderSignupForm )
.post( wrapAsync(usercontroller.userSignup));


router
.route("/login")
.get(usercontroller.renderLoginForm)
.post(
    
    saveRedirectUrl,
    passport.authenticate('local',{
        failureRedirect:"/login", 
        failureFlash: true
    }),
    usercontroller.userLogin,
    
);

router.get("/logout", usercontroller.userLogout);
module.exports = router;