/**
 * 爬页面
 */
import http from 'http';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

//目标地址
let targetUrl = 'https://f-u-g-i-t-i-v-o.tumblr.com/archive';

// 下载目录
const publicFolder = './download/';

getHtml()
async function getHtml(url) {
    return new Promise((resolve, reject) => {
        let rawData = '';
        let options = { 
            method: 'GET',
            host: '127.0.0.1',
            hostname: '127.0.0.1',
            port: 8118,
            path: targetUrl
        };
        var body = '';
        http.request(options, (res) => {
            // console.log(res);
            res.on('data',function(chunk){
                body += chunk;
            }).on('end', function(){
                // console.log(res.headers);
                console.log(body);
                resolve(body);
            })
        }).on("error", (error) => {
            console.log("fuck", error)
        })
    })
}

async function analyseHtml() {
    let htmlString = await getHtml(targetUrl);
    let $body = cheerio.load(htmlString);
    // 爬取规则
    let images = [];
    // console.log($body('.has_imageurl'))
    $body('.has_imageurl').map((index, item) => {
        images.push(item.attribs['data-imageurl']);
    })
    return images;
}
function saveImg(url) {
    let fitlName = path.basename(url);
    let filepath = publicFolder + fitlName;
    let options = { url: url, proxy: proxyUrl };
    request(options)
        .pipe(fs.createWriteStream(filepath))
        .on('close', function () {
            console.log(fitlName, "下载成功");
        });
}
async function download() {
    let images = await analyseHtml();
    // console.log(images);
    images.map((item, index) => { saveImg(item); })
}
function init() {
    fs.stat(publicFolder, (error) => {
        if (error) {
            fs.mkdir(publicFolder, (error) => { console.log(error); })
        }
    })
    download();
}
// init();