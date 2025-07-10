const puppeteer = require("puppeteer");
require("dotenv").config();
const crawler = async (res) => {
  // Or import puppeteer from 'puppeteer-core';

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"
    ],
    executablePath:process.env.NODE_ENV === "production" ?
     process.env.PUPPETEER_EXECUTABLE_PATH
     : puppeteer.executablePath(), 
  });
  try {
    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto("https://developer.chrome.com/");

    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });

    // Type into search box using accessible input name.
    await page.locator("aria/Search").fill("automate beyond recorder");

    // Wait and click on first result.
    await page.locator(".devsite-result-item-link").click();

    // Locate the full title with a unique string.
    const textSelector = await page
      .locator("text/Customize and automate")
      .waitHandle();
    const fullTitle = await textSelector?.evaluate((el) => el.textContent);

    // Print the full title.
    console.log('The title of this blog post is "%s".', fullTitle);
    res.send(fullTitle);
  } catch (e) {
    console.error(e);
    res.send("some wrong");
  } finally {
    await browser.close();
  }
};
module.exports = { crawler };
