const express = require("express");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

const app = express();

app.get("/crawl", async (req, res) => {
  const url = req.query.url;
  const selector = req.query.selector || "body";

  if (!url) return res.status(400).json({ error: "Thiếu URL" });

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    const content = await page.evaluate((sel) => {
      const el = document.querySelector(sel) || document.body;
      return el.innerText;
    }, selector);

    await browser.close();
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Crawler is running on port ${PORT}`);
});
