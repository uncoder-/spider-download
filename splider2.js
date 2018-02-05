import puppeteer from "puppeteer";
import axios from "axios";
import fs from "fs";
import { Tlog } from "./util";
//目标地址
const targetUrl = "http://f-u-g-i-t-i-v-o.tumblr.com/archive";
// 下载目录
const publicFolder = "./download/";

function down(url) {
  axios({
    method: "get",
    url: url,
    responseType: "stream",
    proxy: {
      host: "127.0.0.1",
      port: 8118
    }
  }).then(function(response) {
    response.data.pipe(fs.createWriteStream(`${publicFolder}index.html`));
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("http://baidu.com/");
  page.on("console", msg => {
    Tlog(msg.text());
  });
  const bodyE = await page.evaluate(sel => {
    const $el = document.querySelector(sel);
    console.log($el.innerHTML);
    // ...
    return {};
  }, "body");
  await page.screenshot({ path: `${publicFolder}example.png` });
  await browser.close();
})();
