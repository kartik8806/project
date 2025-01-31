const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs")
 };

module.exports.userSignup = async(req,res)=>{
    try{

        let {username ,email, password} = req.body;
        const newUser = new User({email, username});
        const registedUser = await User.register(newUser, password);
        console.log(registedUser);
        req.login(registedUser,(err)=>{
            if(err){
                return next(err);

            };
            req.flash("success", "Welcome to the wandarlust!");
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }

};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
};

module.exports.userLogin = async (req,res)=>{
    req.flash('success',"welcome back to wanderlust! ");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.userLogout = (req,res,next)=>{
    req.logout((err)=>{
       if(err){
           return next(err);
       }
       req.flash("success","you are loged out!");
       res.redirect("/listings");
   });
};