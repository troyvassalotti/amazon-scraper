const puppeteer = require("puppeteer");

(async () => {
  try {
    const chrome = await puppeteer.launch();
    const page = await chrome.newPage();
    await page.goto("https://www.reddit.com/r/Kanye/hot/");
    await page.waitForSelector(".rpBJOHq2PR60pnwJlUyP0", { timeout: 200 });

    const body = await page.evaluate(() => {
      return document.querySelector("body").innerHTML;
    });

    console.log(body);

    await chrome.close();
  } catch (error) {
    throw error;
  }
})();
