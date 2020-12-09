const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl"); //Import model
const { customAlphabet } = require("nanoid");
const yup = require("yup");

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

const schema = yup.object().shape({ //validate if the slug respect the regex sintax below
  slug: yup
    .string()
    .trim()
    .matches(/^[a-zA-Z0-9]*$/),
});

app.post("/shortUrls", async (req, res, next) => {
  let slug = req.body.slugUrl;
  const shortUrls = await ShortUrl.find();

  try {


    let shortUrl = await ShortUrl.findOne({ short: slug });

    if (shortUrl) { //check if Slug already exist
      let errors = { vld: true, msg: "Slug in use. 🍔" };

      res.render("index", { shortUrls: shortUrls, errors: errors });
    }

    if (!slug) { // if slug don't exist will generate one
      const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6) //only characters that are allowed to be generated
      slug = nanoid(); //generate slug

    }

    //validating slug with regex
    await schema.validate({
      slug
    });

    
    let created_at = new Date();

    await ShortUrl.create({ //will wait until this is finished
      full: req.body.fullUrl,
      short: slug,
      created_at: created_at,
    });

    res.redirect("/");

  } catch (error) {

    let errors = { vld: true, msg: error + "🛑" }; //display this error message if something went wrong
    res.render("index", { shortUrls: shortUrls, errors: errors });
  }
});



app.get("/:short/stats", async (req, res) => { //go to the slug stats page if exists
  let shortUrl = await ShortUrl.findOne({ short: req.params.short });

  if (shortUrl == null) return res.render('404')

  res.render("stats", { shortUrl: shortUrl }); 
});

app.get("/:shortUrl", async (req, res) => {
  let shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  
  if (shortUrl == null) return res.render('404')

  shortUrl.clicks++;
  shortUrl.last_click = new Date();

  shortUrl.save(); //update the click counter and the date that was clicked 

  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000);
