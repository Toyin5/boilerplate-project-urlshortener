import "dotenv/config";
import express from "express";
import cors from "cors";
import database from "./db.js";
import dns from "dns";
import urlDb from "./models/url.js";
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

await database();

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
  console.log(url);
  options.all = true;
  dns.lookup(url, options, async (err, addresses) => {
    if (err) {
      res.status(404).json({ error: "invalid url" });
    } else {
      try {
        const newUrl = new urlDb({ main_url: url });
        await newUrl.save();
        res.status(200).json({ original_url: url, short_url: newUrl._id });
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
      res.writeHead(301);
      res.location(result.main_url);
      res.end();
    })
    .catch((err) => {
      res.status(404).json({ message: "url id not found" });
    });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
