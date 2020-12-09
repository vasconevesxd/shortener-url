const express = require("express");
const mongoose = require("mongoose");


const app = express();

mongoose.connect("mongodb://localhost/urlShortener", { //connect to a local db
  useNewUrlParser: true,
  useUnifiedTopology: true, 
});

app.set("view engine", "ejs"); //Set view to use ejs files

app.use(express.urlencoded({ extended: false }));

app.use(express.static('public')); //Config public folder to use img and css 

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();

  let errors = { vld: false, msg: "" }; // don't display alert message

  res.render("index", { shortUrls: shortUrls, errors: errors });
});


app.listen(process.env.PORT || 5000);
