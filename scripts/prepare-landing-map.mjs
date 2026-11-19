import fs from 'node:fs';
const geo=JSON.parse(fs.readFileSync('countries.geojson','utf8'));const uae=geo.features.find(f=>Object.values(f.properties).includes('United Arab Emirates'));
const polys=uae.geometry.type==='MultiPolygon'?uae.geometry.coordinates:[uae.geometry.coordinates];
const path=polys.map(p=>p.map(r=>'M'+r.filter((_,i)=>i%3===0).map(([x,y])=>`${((x-51.5)/5.5*600).toFixed(2)},${((26.5-y)/4.5*430).toFixed(2)}`).join('L')+'Z').join('')).join('');
let page=fs.readFileSync('src/pages/index.astro','utf8');page=page.replace(/<path class="land" d="[^"]*"\/>/,`<path class="land" d="${path}"/>`);fs.writeFileSync('src/pages/index.astro',page);
// Orthographic globe centred on the Arabian Peninsula, using the same Natural Earth dataset.
const rad=Math.PI/180,lat0=25*rad,lon0=54*rad;const project=([lon,lat])=>{lat*=rad;lon=lon*rad-lon0;const visible=Math.sin(lat0)*Math.sin(lat)+Math.cos(lat0)*Math.cos(lat)*Math.cos(lon)>0;return [175+165*Math.cos(lat)*Math.sin(lon),175-165*(Math.cos(lat0)*Math.sin(lat)-Math.sin(lat0)*Math.cos(lat)*Math.cos(lon)),visible]};
let paths='';for(const f of geo.features){const ps=f.geometry.type==='MultiPolygon'?f.geometry.coordinates:f.geometry.type==='Polygon'?[f.geometry.coordinates]:[];for(const p of ps){const r=p[0].filter((_,i)=>i%12===0).map(project);if(r.length>2&&r.every(x=>x[2]))paths+=`<path d="M${r.map(x=>x.slice(0,2).map(n=>n.toFixed(1)).join(',')).join('L')}Z"/>`}}
fs.writeFileSync('public/media/globe.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 350"><g fill="#21477b" stroke="#4a72a7" stroke-width=".4">${paths}</g><circle cx="175" cy="175" r="4" fill="#a4cbff"/></svg>`);
