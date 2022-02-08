const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const _ = require("lodash");
const { send } = require("process");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("public", path.join(__dirname, "/public"));

//all posts:
let allPosts = [];

////pages
//home page (the journal):
app.get("/", function (req, res) {
    res.render("home", { allPosts });
});
//about page:
app.get("/about", function (req, res) {
    res.render("about");
});


//compose new journal entry:
app.get("/compose", function (req, res) {
    res.render("compose");
});
app.post("/compose", function (req, res) {
    let newPost = {
        submissionTitle: req.body.submissionTitle,
        submissionText: req.body.submissionText,
    };
    allPosts.push(newPost);
    res.redirect("/");
})

///specific journal entry pages
app.get("/posts/:searchedTitle", function (req, res) {
    const searchedTitle = _.lowerCase(req.params.searchedTitle);

    allPosts.forEach(function (post) {
        const postTitle = _.lowerCase(post.submissionTitle);
        if (postTitle === searchedTitle) {
            let title = post.submissionTitle;
            let text = post.submissionText;
            res.render("posts", { title, text });
        };
    });
});



////port listening
app.listen(3000, function (req, res) {
    console.log("listening on port 3000")
});

