const puppeteer = require("puppeteer");

const crawler = async (res) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote"
    ]
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://developer.chrome.com/");
    await page.setViewport({ width: 1080, height: 1024 });

    const searchBox = await page.waitForSelector('input[aria-label="Search"]');
    await searchBox.type("automate beyond recorder");
    await page.keyboard.press("Enter");

    await page.waitForNavigation();
    const link = await page.$(".devsite-result-item-link");
    await link.click();

    await page.waitForSelector("h1");
    const title = await page.$eval("h1", el => el.textContent);

    console.log(`Title: ${title}`);
    res.send(title);
  } catch (err) {
    console.error(err);
    res.status(500).send("Crawl failed");
  } finally {
    await browser.close();
  }
};

module.exports = { crawler };
