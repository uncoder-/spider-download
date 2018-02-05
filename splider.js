/**
 * 爬页面
 */
import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import path from "path";

//目标地址
const targetUrl = "http://f-u-g-i-t-i-v-o.tumblr.com/archive";
// 下载目录
const publicFolder = "./download/";

async function getHtml(url) {
  return axios({
    method: "get",
    url: targetUrl,
    responseType: "text",
    proxy: {
      host: "127.0.0.1",
      port: 8118
    }
  }).then(json => {
    return json.data;
  });
}
async function analyseHtml() {
  const htmlString = await getHtml(targetUrl);
  const $body = cheerio.load(htmlString);
  // 爬取规则
  const images = [];
  // console.log($body(".has_imageurl"));
  $body(".has_imageurl").map((index, item) => {
    images.push(item.attribs["data-imageurl"]);
  });
  return images;
}
function saveImg(url) {
  const fitlName = path.basename(url);
  const filepath = publicFolder + fitlName;
  axios({
    method: "get",
    url: url,
    responseType: "stream",
    proxy: {
      host: "127.0.0.1",
      port: 8118
    }
  }).then(function(response) {
    response.data.pipe(fs.createWriteStream(filepath));
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
init();
