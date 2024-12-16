// В случае успеха аутентификации веб-приложение создает session token, который обычно помещается в cookies.

// обеспечивает FORMS-аутентификацию на основе сессий
// идентификатор аутентифицированной сессии пользователя
const fs = require("fs");
const express = require("express");
const session = require("express-session");     // для исп-я сессии
const passport = require("passport");       // для аутентификации по логину
const LocalStrategy = require("passport-local").Strategy;   // и паролю
const accounts = require("./accounts.json");    // все зарег-е пользователи


function authenticateUser(username, password, done) {
    if (accounts[username] === undefined) {
        return done(null, false, { message: "No user with that username" });
    }
    else if (accounts[username] !== password) {
        return done(null, false, { message: "Wrong password" });
    }
    else {
        user = {};
        user.username = username;
        user.password = password;
        return done(null, user);
    }
}

function checkAuthencticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        return res.redirect("/login");
    }
}

function checkNotAuthencticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    else {
        return next();
    }
}


const app = express();


passport.use(new LocalStrategy(authenticateUser));
passport.serializeUser((user, done) => done(null, user.username));
passport.deserializeUser((username, done) => { 
    return done(null, {username: username, password: accounts[username]});
 });


app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "some-random-text",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.get("/register", checkNotAuthencticated, (req, res) => {
    res.sendFile(__dirname + "/html/register.html");
});

app.post("/register", checkNotAuthencticated, (req, res) => {
    if (accounts[req.body.username] !== undefined) {
        res.redirect("/register");
        return;
    }
    accounts[req.body.username] = req.body.password;
    fs.writeFile("accounts.json", JSON.stringify(accounts), () => {});
    res.redirect("/login");
});

// Вернуть форму
app.get("/login", checkNotAuthencticated, (req, res) => {
    res.sendFile(__dirname + "/html/login.html");
});

// Производить аутентификацию
app.post("/login", checkNotAuthencticated, passport.authenticate("local", {
    // переадресация
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: false
}));

// Отключить аутентифицированный доступ к ресурсу 
app.get("/logout", checkAuthencticated, (req, res) => {
    req.logOut( (err) => {  } );    // удаляет св-во req.user и очищает сеанс
    res.redirect("/login");
});

app.get("/profile", checkAuthencticated, (req, res) => {
    res.sendFile(__dirname + "/html/profile.html");
    res.send(`Username ${req.user.password}`);
});


app.listen(3000);
