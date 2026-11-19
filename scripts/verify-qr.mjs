import fs from 'node:fs/promises';
import sharp from 'sharp';
import jsQR from 'jsqr';
const expected=(await fs.readFile('src/data/club.ts','utf8')).match(/whatsapp: '([^']+)'/)[1];
let checks=0;
for(const format of ['svg','png']) for(const width of [225,250,270,500]) {
 const {data,info}=await sharp(`public/qr/whatsapp.${format}`).resize(width,width).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const result=jsQR(new Uint8ClampedArray(data),info.width,info.height);
 if(result?.data!==expected)throw Error(`QR decode failed: ${format} at ${width}px`);
 checks++;
}
const qr=await sharp('public/qr/whatsapp.svg').resize(250).png().toBuffer();
const {data,info}=await sharp({create:{width:330,height:400,channels:4,background:'#f5f4ef'}}).composite([{input:qr,left:40,top:65}]).raw().toBuffer({resolveWithObject:true});
if(jsQR(new Uint8ClampedArray(data),info.width,info.height)?.data!==expected)throw Error('Card QR decode failed');
console.log(`${checks+1} independent QR decodes passed; exact canonical invitation confirmed. No group was joined.`);
