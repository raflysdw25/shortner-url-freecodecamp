require("dotenv").config();
let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}

let urlSchema = new mongoose.Schema({
  urlInput: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: Number,
    required: true,
  },
});

let URL_MODEL = mongoose.model("URL", urlSchema);

const createAndSaveUrl = (payload, done) => {
  const addUrl = new URL_MODEL(payload);
  addUrl.save(function (error, data) {
    done(error, data);
  });
};

const findUrlByShortUrl = (shortUrl, done) => {
  console.log("Params 3: ", typeof shortUrl);
  URL_MODEL.findOne({ shortUrl: shortUrl }, function (error, urlData) {
    done(error, urlData);
  });
};

exports.createAndSaveUrl = createAndSaveUrl;
exports.findUrlByShortUrl = findUrlByShortUrl;
