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
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage", // Giảm sử dụng bộ nhớ
      ],
      ...(isProduction ? {} : { executablePath: puppeteer.executablePath() }),
    });

    const page = await browser.newPage();

    //  Tắt tải ảnh, font, css
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const blocked = ["image", "stylesheet", "font"];
      if (blocked.includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setViewport({ width: 800, height: 600 }); // Giảm độ phân giải

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 15000, // Giới hạn thời gian 
    });

    const content = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? el.innerText.slice(0, 15000) : "Không tìm thấy nội dung.";
    }, selector);

    await browser.close();
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: `Lỗi: ${err.message}` });
  }
};

module.exports = { crawler };
