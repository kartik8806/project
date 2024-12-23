if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
};

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore  =       require('connect-mongo');
const flash = require ("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User  = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// to connect with mongodb and create data folder in mongodb

const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to DB");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

// mongostore 

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log('error in mongo session store ',err);
});


// session option 
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() +  7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


// app.get('/', (req, res) => {
//     res.send("server is working");
// });

app.use(session(sessionOptions));
app.use(flash());

// passport authentication (configure strategy)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res, next)=>{
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   next();
});

// demo user
// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//         email:"student123@.com",
//         username:"delta-student",
//     });

//   let newUser =await User.register(fakeUser,"hellowworld");
//   res.send(newUser);

// })




app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);




app.all("*", (req, res, next) => {
    next(new ExpressError(statusCode = 500, message = "page not found"));
});
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
    // res.send("something went wrong!")
})


app.listen(8080, () => {
    console.log("server is listing to port 8080");
})