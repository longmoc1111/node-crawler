const express = require("express");
const { crawler } = require("./crawler");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", crawler); // truyền thẳng req/res

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
