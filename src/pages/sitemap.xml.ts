import type { APIRoute } from 'astro';
import { url } from '../data/club';
export const GET: APIRoute = ({site}) => new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site?['','about/','events/','gallery/','join/'].map(p=>`<url><loc>${new URL(url(p),site).href}</loc></url>`).join(''):''}</urlset>`,{headers:{'Content-Type':'application/xml'}});
