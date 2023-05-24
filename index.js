require("dotenv").config();
const express = require("express");
const cors = require("cors");
const database = require("./db.js");
const urlDb = require("./models/url.js");
const dns = require("node:dns");

const app = express();

const options = {
  // family: 6,
  // hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded());

// app.use("/public", express.static(`${process.cwd()}/public`));

database();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async (req, res) => {
  const { url } = req.body;
  // const arr = new Uint32Array(5);
  // const id = crypto.getRandomValues(arr)[0];
  let hostname = url;
  if (url.indexOf(":") !== -1) {
    hostname = url.slice(url.indexOf(":") + 3);
  }
  if (url.indexOf("/") !== -1) {
    hostname = hostname.slice(0, hostname.indexOf("/"));
  }
  options.all = true;
  dns.lookup(hostname, options, async (err, addresses) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      try {
        // const newUrl = new urlDb({ _id: id, main_url: url });
        const newUrl = new urlDb({ main_url: url });
        const doc = await newUrl.save();
        res.json({ original_url: url, short_url: doc._id });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
});

app.get("/api/shorturl/:url", async (req, res) => {
  const { url } = req.params;
  console.log(url);
  await urlDb
    .findById(url)
    .then((result) => {
      console.log(result);
      if (result.main_url.indexOf(":") !== -1) {
        res.redirect(result.main_url);
      } else {
        res.redirect("https://" + result.main_url);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: "url id not found" });
    });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
