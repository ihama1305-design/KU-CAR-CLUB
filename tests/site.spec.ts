import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const invite='https://chat.whatsapp.com/JkFbOO5HqYm7sCNGOz8GKF';
const base=process.env.TEST_PATH||'/';
test('responsive pages have no overflow and joining links are direct',async({page})=>{
 for(const [width,height] of [[320,568],[375,812],[390,844],[430,932],[568,320],[768,1024],[820,1180],[1024,768],[1152,800],[1366,768],[1440,900],[1920,1080]]){
  await page.setViewportSize({width,height});await page.goto(base);
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await page.locator('#hero-join').getAttribute('href')).toBe(invite);
 }
 for(const path of ['about/','events/','gallery/','join/','404/']){
  await page.setViewportSize({width:320,height:568});await page.goto(base+path);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
test('mobile menu works by keyboard and closes with Escape',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(base);
 const menu=page.getByRole('button',{name:'Menu'});await menu.focus();await page.keyboard.press('Enter');await expect(menu).toHaveAttribute('aria-expanded','true');await expect(page.getByRole('navigation').getByRole('link',{name:'Gallery',exact:true})).toBeVisible();await page.keyboard.press('Escape');await expect(menu).toHaveAttribute('aria-expanded','false');await expect(menu).toBeFocused();
});
test('gallery filters, lightbox navigation and focus restoration',async({page})=>{
 await page.goto(base+'gallery/');await page.getByRole('button',{name:'Details',exact:true}).click();await expect(page.locator('#gallery-count')).toHaveText('3 photographs');
 const opener=page.locator('.gallery-item:not([hidden]) .gallery-open').first();await opener.click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.locator('#lightbox-position')).toHaveText('1 / 3');await page.keyboard.press('ArrowRight');await expect(page.locator('#lightbox-position')).toHaveText('2 / 3');await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();await expect(opener).toBeFocused();
});
test('reduced motion loads poster only; manual video plays and pause persists',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});const requests:string[]=[];page.on('request',r=>{if(r.url().includes('.mp4'))requests.push(r.url());});await page.goto(base);await page.waitForTimeout(500);expect(requests).toHaveLength(0);await expect(page.locator('#hero-video')).not.toHaveAttribute('src');
 await page.locator('#video-toggle').click();await expect.poll(()=>page.locator('#hero-video').evaluate((v:HTMLVideoElement)=>!v.paused)).toBe(true);await page.locator('#video-toggle').click();await page.locator('.site-footer').scrollIntoViewIfNeeded();await page.locator('#hero-video').scrollIntoViewIfNeeded();await page.waitForTimeout(300);expect(await page.locator('#hero-video').evaluate((v:HTMLVideoElement)=>v.paused)).toBe(true);
});
test('eligible video starts and pauses offscreen; full film is deferred',async({page})=>{
 await page.goto(base);await expect(page.locator('#full-film')).not.toHaveAttribute('src');await expect.poll(()=>page.locator('#hero-video').evaluate((v:HTMLVideoElement)=>!v.paused)).toBe(true);await page.locator('.site-footer').scrollIntoViewIfNeeded();await expect.poll(()=>page.locator('#hero-video').evaluate((v:HTMLVideoElement)=>v.paused)).toBe(true);await page.locator('#hero-video').scrollIntoViewIfNeeded();await expect.poll(()=>page.locator('#hero-video').evaluate((v:HTMLVideoElement)=>!v.paused)).toBe(true);
});
test('rejected autoplay keeps usable fallback and retry control',async({page})=>{
 await page.addInitScript(()=>{HTMLMediaElement.prototype.play=()=>Promise.reject(new DOMException('Blocked','NotAllowedError'));});await page.goto(base);await expect(page.locator('#video-toggle')).toHaveAccessibleName('Retry background video');await expect(page.locator('#hero-join')).toBeVisible();expect(await page.locator('#hero-video').getAttribute('poster')).toContain('hero-poster.jpg');
});
test('save-data defers autoplay',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'connection',{value:{saveData:true,effectiveType:'4g',addEventListener(){},removeEventListener(){}},configurable:true});});await page.goto(base);await page.waitForTimeout(300);await expect(page.locator('#hero-video')).not.toHaveAttribute('src');
});
test('missing media leaves primary actions usable',async({page})=>{
 await page.route('**/*',async r=>{if(r.request().isNavigationRequest()){const response=await r.fetch();let body=await response.text();body=body.replaceAll('hero-desktop.mp4','unavailable-desktop.mp4').replaceAll('hero-mobile.mp4','unavailable-mobile.mp4');await r.fulfill({response,body});}else await r.continue();});await page.goto(base);await expect(page.locator('#video-toggle')).toHaveAccessibleName('Retry background video',{timeout:10000});await expect(page.locator('#hero-join')).toHaveAttribute('href',invite);await expect(page.locator('h1')).toBeVisible();
});
test('pages pass automated accessibility scan',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});for(const path of ['','gallery/','join/']){await page.goto(base+path);const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);}
});
test('no JavaScript navigation, photos and QR remain useful',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto((process.env.TEST_URL||'http://127.0.0.1:4321')+base+'gallery/');await expect(page.locator('.gallery-item')).toHaveCount(14);await expect(page.locator('.gallery-open').first()).toHaveAttribute('href',/\.jpg$/);await page.goto((process.env.TEST_URL||'http://127.0.0.1:4321')+base+'join/');await expect(page.locator('.qr-card img')).toBeVisible();await expect(page.locator('.qr-card a').first()).toHaveAttribute('href',invite);await context.close();
});
test('200 percent text zoom keeps key layouts within viewport',async({page})=>{
 await page.setViewportSize({width:640,height:600});for(const path of ['','gallery/','join/']){await page.goto(base+path);await page.addStyleTag({content:'html{font-size:200%}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('touch menu and photo viewer work',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const page=await context.newPage();await page.goto((process.env.TEST_URL||'http://127.0.0.1:4321')+base);await page.locator('.menu-toggle').tap();await page.locator('#main-nav').getByRole('link',{name:'Gallery',exact:true}).tap();await page.locator('.gallery-open').first().tap();await expect(page.getByRole('dialog')).toBeVisible();await page.locator('#lightbox-close').tap();await expect(page.getByRole('dialog')).not.toBeVisible();await context.close();
});
test('slow video still leaves immediate content and joining available',async({page})=>{
 await page.route('**/media/hero-*.mp4',async route=>{await new Promise(resolve=>setTimeout(resolve,1500));await route.continue().catch(()=>{});});await page.goto(base,{waitUntil:'domcontentloaded'});await expect(page.locator('#hero-join')).toBeVisible();await expect(page.locator('#hero-title')).toBeVisible();await expect(page.locator('#hero-video')).toHaveAttribute('poster',/hero-poster.jpg$/);
});
test('video reacts to preference changes and simulated tab visibility',async({page})=>{
 await page.goto(base);const video=page.locator('#hero-video');await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused)).toBe(true);
 await page.emulateMedia({reducedMotion:'reduce'});await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(true);
 await page.emulateMedia({reducedMotion:'no-preference'});await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused)).toBe(true);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(true);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused)).toBe(true);
});
