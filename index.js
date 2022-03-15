const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const _ = require("lodash");
const { send } = require("process");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("public", path.join(__dirname, "/public"));

const mongodbURI = "mongodb+srv://admin-hexfloo:journal62442time@journal-time.isx9o.mongodb.net/journalDB"
mongoose.connect( mongodbURI || "mongodb://localhost:27017/journalDB")
    .then(function () {
        console.log("Mongo connection open")
    })
    .catch(function (err) {
        console.log("Mongo connection faild");
        console.log(err);
    })

//mongoose schema
const journalSchema = new mongoose.Schema({
    submissionTitle: {
        type: String,
        required: true
    },
    submissionAuthor: {
        type: String,
        required: true
    },
    submissionText: {
        type: String,
        required: true,
    },
    submissionDate: {
        type: Date
    }
})
const Post = mongoose.model("Post", journalSchema);


//home page (the journal):
app.get("/", async function (req, res) {
    let allPosts = await Post.find({});
    res.render("home", { allPosts })
});

//about page:
app.get("/about", function (req, res) {
    res.render("about");
});

//compose new journal entry:
app.get("/compose", function (req, res) {
    res.render("compose");
});
app.post("/compose", async function (req, res) {
    let post = new Post({
        submissionTitle: req.body.submissionTitle,
        submissionAuthor: req.body.submissionAuthor,
        submissionText: req.body.submissionText,
        submissionDate: new Date()
    });
    await post.save(function (err) {
        if (!err) {
            res.redirect("/");
        } else {
            console.log(err)
        }
    });
})

///specific journal entry pages
app.get("/posts/:id", async function (req, res) {
    const { id } = req.params;
    const searchedPost = await Post.findById(id);
    res.render("posts", { searchedPost })
});


////port listening
app.listen( process.env.PORT || 3000, function (req, res) {
    console.log("listening on port")
});
