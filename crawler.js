const puppeteer = require("puppeteer");

const crawler = async (req, res) => {
  const url = req.query.url;
  const selector = req.query.selector || "body";

  if (!url) {
    return res.status(400).json({ error: "Thiếu URL" });
  }

  const isProduction = process.env.NODE_ENV === "production";

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ...(isProduction ? {} : { executablePath: puppeteer.executablePath() }),
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
};

module.exports = { crawler };
