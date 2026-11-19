import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import QRCode from 'qrcode';
import ffmpeg from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';

const input = process.argv[2] || 'media-originals';
await fs.mkdir('public/media',{recursive:true});
await fs.mkdir('public/qr',{recursive:true});
await fs.mkdir('review',{recursive:true});
const files=(await fs.readdir(input)).filter(f=>/\.jpe?g$/i.test(f)).sort();
const mapping=[];
const selected=new Set(['P01','P04','P07','P08','P09','P12','P13','P15','P16','P17','P18','P19','P20','P22']);
for (let i=0;i<files.length;i++) {
 const id=`P${String(i+1).padStart(2,'0')}`, file=path.join(input,files[i]);
 const metadata=await sharp(file).metadata();
 mapping.push({id,file:files[i],width:metadata.width,height:metadata.height,sha256:crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex')});
 if(!selected.has(id))continue;
 for (const width of [480,800,1280].filter(w=>w<=metadata.width)) {
  await Promise.all(['avif','webp','jpg'].map(format=>sharp(file).rotate().resize({width,withoutEnlargement:true}).toFormat(format,{quality:format==='avif'?58:80}).toFile(`public/media/${id}-${width}.${format}`)));
 }
}
await fs.writeFile('src/data/asset-map.json',JSON.stringify({note:'Provisional P IDs assigned by actual filename sort; master asset-map and A27 logo were not supplied. Original filenames, dimensions and SHA256 retained here. No A-ID equivalence asserted.',assets:mapping},null,2));
const club=await fs.readFile('src/data/club.ts','utf8');
const invitation=club.match(/whatsapp: '([^']+)'/)[1];
await QRCode.toFile('public/qr/whatsapp.svg',invitation,{type:'svg',errorCorrectionLevel:'Q',margin:4,width:500});
await QRCode.toFile('public/qr/whatsapp.png',invitation,{errorCorrectionLevel:'Q',margin:4,width:1000});
const source=path.join(input,'WhatsApp Video 2026-11-19 at 2.39.22 AM.mp4');
function run(args) {const r=spawnSync(ffmpeg,['-y',...args],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);}
await fs.copyFile(source,'public/media/club-film.mp4');
for (const [name,height,crf] of [['desktop',720,27],['mobile',480,29]]) {
 run(['-i',source,'-t','10','-an','-vf',`scale=-2:${height},fade=t=in:st=0:d=0.35,fade=t=out:st=9.6:d=0.4`,'-c:v','libx264','-preset','slow','-crf',String(crf),'-pix_fmt','yuv420p','-movflags','+faststart',`public/media/hero-${name}.mp4`]);
}
run(['-ss','0.5','-i',source,'-frames:v','1','-update','1','public/media/hero-poster.jpg']);
for(const second of [0,3,6,9,12,20,30]) run(['-ss',String(second),'-i',source,'-frames:v','1','-vf','scale=480:-2','-update','1',`review/video-${second}.jpg`]);
const sizes={};for(const f of ['hero-desktop.mp4','hero-mobile.mp4','club-film.mp4','hero-poster.jpg'])sizes[f]=(await fs.stat(`public/media/${f}`)).size;
await fs.writeFile('review/media-sizes.json',JSON.stringify({excerpt:'0–10 seconds, silent, short fade at loop seam',sizes},null,2));
console.log('Prepared',mapping.length,'photos, QR SVG/PNG and video.',sizes);
