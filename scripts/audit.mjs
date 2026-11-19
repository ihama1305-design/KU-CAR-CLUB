import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const chrome=await launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--no-sandbox','--mute-audio']});
try{
const result=await lighthouse('http://127.0.0.1:4322/',{port:chrome.port,output:['html','json'],onlyCategories:['performance','accessibility','best-practices','seo'],logLevel:'error'});
await fs.writeFile('review/lighthouse.html',result.report[0]);await fs.writeFile('review/lighthouse.json',result.report[1]);
console.log(JSON.stringify({scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,v.score*100])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(k=>[k,result.lhr.audits[k].displayValue])),warnings:result.lhr.runWarnings},null,2));
}finally{await chrome.kill();}
