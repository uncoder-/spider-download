import puppeteer from "puppeteer";
import devices from "puppeteer/DeviceDescriptors";
import axios from "axios";
import fs from "fs";
import { Tlog } from "./util";

// 模拟移动设备
const iPhone = devices["iPhone 6"];

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
  // 创建一个浏览器
  const browser = await puppeteer.launch({
    slowMo: 200,
    headless: false,
    devtools: true
  });

  // 新建一个page的选项卡
  const page = await browser.newPage();

  // 拦截浏览器中的console内容并显示到terminal里
  page.on("console", msg => {
    Tlog(msg.text());
  });

  // 启用请求前拦截
  await page.setRequestInterception(true);
  page.on("request", async interceptedRequest => {
    // 请求类型
    // Tlog("request.method", interceptedRequest.method());
    if (interceptedRequest.url().endsWith(".svg")) {
      // 如果是svg，则请求被终止
      interceptedRequest.abort();
    } else {
      // 其他继续
      interceptedRequest.continue();
    }
  });

  // 请求成功后拦截
  let counter = 0;
  page.on("requestfinished", async request => {
    const matches = /.*\.(jpg|png|svg|gif)$/.exec(request.url());
    if (matches && matches.length === 2) {
      const extension = matches[1];
      const response = request.response();
      Tlog("response headers", JSON.stringify(response.headers()));
      const buffer = await response.buffer();
      fs.writeFileSync(
        `./download/image-${counter}.${extension}`,
        buffer,
        "base64"
      );
      counter += 1;
    }
  });

  // 打开一个网站
  await page.goto("http://baidu.com/");

  // 模拟器
  // await page.emulate(iPhone);

  // page内容
  // Tlog("page内容", await page.content());

  // page截屏
  // await page.screenshot({ path: `${publicFolder}example.png` });

  // 生成pdf,设置屏幕类型,并且必须在handleless的情况
  // await page.emulateMedia("screen");
  // await page.pdf({ path: "./download/page.pdf", format: "A4" });

  // 插入自定义js文件
  await page.addScriptTag({
    path: "./test/test.js"
  });

  // 插入自定义css文件
  page.addStyleTag({
    path: "./test/test.css"
  });

  // JShandle
  const bodyJSHandle = await page.evaluate(sel => {
    const $el = document.querySelector(sel);
    // console.log($el.innerText);
    return {
      height: $el.offsetHeight
    };
  }, "body");

  // 元素handle，继承自JShandle
  const bodyElHandle = await page.$("body");

  // 获取一个输入框
  const inputElHandle = await bodyElHandle.$("#kw");

  // 获取一个按钮
  const clickElHandle = await bodyElHandle.$("#su");

  // 元素输入
  await inputElHandle.type("World", { delay: 100 });

  // 元素点击
  // await clickElHandle.click();

  // 元素截图
  bodyElHandle.screenshot({ path: `${publicFolder}body.png` });

  // 获取元素文本内容
  Tlog(await bodyElHandle.getProperty("innerText"));

  // 关闭浏览器
  // await browser.close();
})();
