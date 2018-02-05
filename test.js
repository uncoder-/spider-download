import puppeteer from "puppeteer";
import axios from "axios";
import fs from "fs";
import chalk from "chalk";

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
function Tlog() {
  const args = Array.from(arguments).join(",");
  console.log(chalk.red(args));
}
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // await page.screenshot({ path: `${publicFolder}example.png` });
  // await browser.close();
  await page.goto("http://baidu.com/");
  page.on("console", msg => {
    Tlog("debugger from console", msg.text());
  });
  const bodyE = await page.evaluate(sel => {
    const $els = document.querySelectorAll(sel);
    console.log($els.length);
    // ...
  }, ".bg");
})();
