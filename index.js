const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const fetchShelves = async () => {
  try {
    const response = await axios.get(
      "https://www.amazon.com/s?crid=36QNR0DBY6M7J&k=shelves&ref=glow_cls&refresh=1&sprefix=s%2Caps%2C309"
    );
    const html = response.data;
    const $ = cheerio.load(html);
    const shelves = [];

    $(
      "div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20"
    ).each((_idx, el) => {
      const shelf = $(el);

      const title = shelf
        .find("span.a-size-base-plus.a-color-base.a-text-normal")
        .text();
      const image = shelf.find("img.s-image").attr("src");
      const link = shelf.find("a.a-link-normal.a-text-normal").attr("href");
      const reviews = shelf
        .find(
          "div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small"
        )
        .children("span")
        .last()
        .attr("aria-label");
      const stars = shelf
        .find("div.a-section.a-spacing-none.a-spacing-top-micro > div > span")
        .attr("aria-label");
      const price = shelf.find("span.a-price > span.a-offscreen").text();

      let element = {
        title,
        image,
        link: `https://amazon.com${link}`,
        price,
      };

      if (reviews) {
        element.reviews = reviews;
      }

      if (stars) {
        element.stars = stars;
      }

      shelves.push(element);
    });

    return shelves;
  } catch (error) {
    throw error;
  }
};

fetchShelves().then((shelves) => {
  let csvContent = shelves
    .map((element) => {
      return Object.values(element)
        .map((item) => `"${item}"`)
        .join(".");
    })
    .join("\n");

  fs.writeFile(
    "saved-shelves.csv",
    "Title, Image, Link, Price, Reviews, Stars" + "\n" + csvContent,
    "utf8",
    function (err) {
      if (err) {
        console.log(
          "Some error occurred - file either not saved or corrupted."
        );
      } else {
        console.log("File has been saved!");
      }
    }
  );
});
