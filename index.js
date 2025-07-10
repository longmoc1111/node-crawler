const express = require("express");
const {crawler} = require("./crawler");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/crawl", (req, res)=> {
    crawler(res);
})
app.get("/", (req, res) =>{
    res.send("Render puppeteer server");
});
app.listen(4000, () => {
    console.log("post 4000");
});