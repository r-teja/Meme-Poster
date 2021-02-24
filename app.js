const express = require("express");
const bodyParser = require("body-parser");
const { response } = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");

require("dotenv").config();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mymemesDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const mySchema = {
    name: String,
    caption: String,
    image_url: String
};

const meme_item = mongoose.model("mymeme", mySchema);

app.route("/")
    .get(function (request, response) {
        meme_item.find(function (err, foundmemes) {
            if (!err) {
                response.render("homepage", {
                    "data": foundmemes
                });
            }
            else {
                response.send(err);
            }
        }).sort({ '_id': -1 }).limit(100);
    })
    .post(function (request, response) {
        const new_meme = new meme_item({
            name: request.body.name,
            caption: request.body.caption,
            image_url: request.body.url
        });
        //console.log(new_meme);
        //console.log('Post request received');
        new_meme.save(function (err, ans) {
            if (!err) {
                const meme_id = {
                    id: ans._id
                }
                //response.send(meme_id);
                response.redirect("/");
            }
            else {
                response.send(err);
            }
        })
    });

app.route("/memes")
    .get(function (request, response) {
        meme_item.find(function (err, foundmemes) {
            if (!err) {
                response.send(foundmemes);
            }
            else {
                response.send(err);
            }
        }).sort({ '_id': -1 }).limit(100);
    })
    .post(function (request, response) {
        const new_meme = new meme_item({
            name: request.body.name,
            caption: request.body.caption,
            image_url: request.body.url
        });
        console.log(new_meme);
        console.log('Post request received');
        new_meme.save(function (err, ans) {
            if (!err) {
                const meme_id = {
                    id: ans._id
                }
                response.send(meme_id);
            }
            else {
                response.send(err);
            }
        })
    });

app.route("/memes/:meme_id")
    .get(function (request, response) {
        meme_item.find({ _id: request.params.meme_id }, function (err, foundmeme) {
            if (!err) {
                response.send(foundmeme);
            }
            else {
                response.send(err);
            }
        })
    })
    .post(function (request, response) {
        meme_item.updateOne(
            { _id: request.params.meme_id },
            request.body,
            function (err) {
                if (!err) {
                    response.send(foundmeme);
                }
                else {
                    response.send(err);
                }
            }
        );
    })
    .patch(function (request, response) {
        meme_item.replaceOne(
            { _id: request.params.meme_id },
            request.body,
            function (err) {
                if (!err) {
                    response.send(foundmeme);
                }
                else {
                    response.send(err);
                }
            }
        );
    });

app.listen(process.env.PORT || 8081, function (req, res) {
    console.log("Server 8081 running.!!");
})