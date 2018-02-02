/**
 * 爬页面
 */
import request from "request";
import cheerio from "cheerio";
import fs from "fs";
import path from "path";

//目标地址
const targetUrl = "https://f-u-g-i-t-i-v-o.tumblr.com/archive";
// 翻墙代理
const proxyUrl = "http://127.0.0.1:8118";
// 下载目录
const publicFolder = "./download/";

async function getHtml(url) {
  return new Promise((resolve, reject) => {
    const options = { url: targetUrl, proxy: proxyUrl };
    request
      .get(options, (error, response, body) => {
        // console.log(body);
        resolve(body);
      })
      .on("error", error => {
        console.log("fuck", error);
      });
  });
}
async function analyseHtml() {
  const htmlString = await getHtml(targetUrl);
  const $body = cheerio.load(htmlString);
  // 爬取规则
  const images = [];
  // console.log($body('.has_imageurl'))
  $body(".has_imageurl").map((index, item) => {
    images.push(item.attribs["data-imageurl"]);
  });
  return images;
}
function saveImg(url) {
  const fitlName = path.basename(url);
  const filepath = publicFolder + fitlName;
  const options = { url: url, proxy: proxyUrl };
  request(options)
    .pipe(fs.createWriteStream(filepath))
    .on("close", function() {
      console.log(fitlName, "下载成功");
    });
}
async function download() {
  const images = await analyseHtml();
  // console.log(images);
  images.map((item, index) => {
    saveImg(item);
  });
}
function init() {
  fs.stat(publicFolder, error => {
    if (error) {
      fs.mkdir(publicFolder, error => {
        console.log(error);
      });
    }
  });
  download();
}
//init();
