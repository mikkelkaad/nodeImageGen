require("dotenv").config();
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const downloadImage = async (url) => {
  try {
    const response = await axios.get(url, {
      responseType: "stream",
    });
    const path = "downloaded_image.jpg";
    const writer = fs.createWriteStream(path);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (err) {
    console.error(err);
  }
};
const picsomUrl = "https://picsum.photos/1080/1080?grayscale";

QuoteURL = "https://zenquotes.io/api/quotes/";
async function getQuotes(url) {
  const response = await fetch(url);
  const data = await response.json();
  console.log("New quotes retrived!");
  fs.writeFileSync(
    path.resolve(__dirname, "quotes.json"),
    JSON.stringify(data)
  );
}
async function addTextOnImage() {
  quotes = JSON.parse(fs.readFileSync(path.resolve(__dirname, "quotes.json")));
  rawText = quotes[0].q;
  author = quotes[0].a;
  quotes.shift();
  if (quotes.length > 0) {
    fs.writeFileSync(
      path.resolve(__dirname, "quotes.json"),
      JSON.stringify(quotes)
    );
  } else {
    getQuotes(QuoteURL);
  }

  let texts = [];
  let wordedArray = [];
  rawArray = rawText.split(/,|\.|;|-| /gm);
  wordsPerLine = 4;
  lineLengthLimit = 25;
  for (i = 0; i < rawArray.length; i += wordsPerLine) {
    const line = rawArray.slice(i, i + wordsPerLine).join(" ");
    if (line.length > lineLengthLimit) {
      rawArray.unshit(line.pop());
    }
    wordedArray.push(line);
  }
  wordedArray.forEach((line, index) => {
    line = `<text x="50%" y="${
      20 + 10 * index
    }%" text-anchor="middle" class="title text">${line}</text>`;
    texts.push(line);
  });
  try {
    const width = 1080;
    const height = 1080;

    const svg = `
    <svg width="${width}" height="${height}">
      <style>
      .text { fill: #ebcc34; font-weight: bold; font-family: Verdana, sans-serif;}
      .title {  font-size: 60px;}
      .bottom { font-size: 40px;}
      svg {
        filter: drop-shadow(3px 3px 3px rgb(0 0 0 / 1));
      }
      </style>
      ${texts}
      <text x="10%" y="90%" text-anchor="left" class="bottom text">-${author}</text>
      <text x="10%" y="95%" text-anchor="left" class="bottom text">Quotes by zenquotes.io</text>
    </svg>
    `;
    const svgBuffer = Buffer.from(svg);
    await downloadImage(picsomUrl);
    await sharp("./downloaded_image.jpg")
      .composite([
        {
          input: svgBuffer,
          top: 0,
          left: 0,
        },
      ])
      .toFile("text-overlay.jpg");
    console.log("Image created");
  } catch (error) {
    console.log(error);
  }
}
module.exports = addTextOnImage;
