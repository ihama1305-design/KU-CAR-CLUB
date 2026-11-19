import {chromium} from '@playwright/test';
const b=await chromium.launch({headless:true});
try{
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const p=await b.newPage({viewport:{width,height},reducedMotion:'reduce'});await p.goto('http://127.0.0.1:4322/');
 for(let y=0;y<await p.evaluate(()=>document.body.scrollHeight);y+=600){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(80);}
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));await p.evaluate(()=>scrollTo(0,0));
 await p.screenshot({path:`review/${name}-review.png`,fullPage:true});
 console.log(name,'broken images:',await p.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src'))));
 await p.locator('.qr-card').screenshot({path:`review/${name}-qr-card.png`});await p.close();
}
}finally{await b.close();}
