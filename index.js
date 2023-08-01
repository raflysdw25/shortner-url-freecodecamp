require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");

// MongoDB Connection
let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// short URL API

// Function to hash a string using SHA-256
app.get("/api/shorturl/:shorturl", function (req, res) {
  console.log("Params type: ", typeof req.params.shorturl);
  const shortUrl = Number(req.params.shorturl);
  console.log("Params type 2: ", typeof shortUrl);
  const findUrl = require("./urlData.js").findUrlByShortUrl;
  findUrl(shortUrl, function (error, data) {
    console.log(data);
    if (error || data == null) return res.json({ error: "Not Found" });
    res.redirect(data.urlInput);
  });
});
app.post("/api/shorturl", function (req, res) {
  const urlInput = req.body.url;
  let hostname;
  let urlObject;
  try {
    urlObject = new URL(urlInput); //body url harus diubah ke object URL dengan cara ini
    hostname = urlObject.hostname;
  } catch (error) {
    console.error(error);
    res.json({ error: "Invalid URL" });
    return;
  }

  const createUrl = require("./urlData.js").createAndSaveUrl;

  dns.lookup(hostname, (err) => {
    if (err) {
      res.json({ error: "Invalid URL" });
      return console.error(err);
    }

    const payload = {
      urlInput: urlInput,
      shortUrl: Math.floor(Math.random() * 1000),
    };
    createUrl(payload, function (error, data) {
      if (error) return res.json({ error: error });
      res.json({
        original_url: data.urlInput,
        short_url: data.shortUrl,
      });
    });
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
