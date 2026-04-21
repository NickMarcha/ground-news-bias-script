// ==UserScript==
// @name         Ground News Lookup (Minimal)
// @namespace    https://github.com/NickMarcha/ground-news-bias-script
// @version      0.0.0-dev
// @description  Manual Ground News lookup for current page URL
// @author       Nicol
// @match        http://*/*
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      extension.ground.news
// @connect      production.checkitt.news
// @connect      groundnews.b-cdn.net
// ==/UserScript==
"use strict";(()=>{var m="https://extension.ground.news/search",x="https://production.checkitt.news/api/public/extension/toolbarData";function a(t){return new Promise((e,o)=>{GM_xmlhttpRequest({method:"GET",url:t,timeout:15e3,onload:r=>{if(r.status<200||r.status>299){o(new Error(`Request failed: ${r.status}`));return}try{e(JSON.parse(r.responseText))}catch(n){o(n)}},onerror:()=>o(new Error("Network error")),ontimeout:()=>o(new Error("Request timed out"))})})}function b(t){let e=new URL(t),o=["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"];for(let r of o)e.searchParams.delete(r);return e.toString()}async function d(t){let e=b(t),o=await a(`${m}?url=${encodeURIComponent(e)}`),r=o.event?.id,n=o.source?.id;if(!r||!n)throw new Error("No Ground News story found for this URL");return a(`${x}/${r}/${n}`)}var c="gn-minimal-panel",s="https://groundnews.b-cdn.net/assets/logo/ground_new_logo_header.svg?width=72";function i(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function h(t){let e=t.toLowerCase();return e.includes("far left")||e==="left"||e.includes("lean left")?{bg:"linear-gradient(135deg,#1e3a5f,#2563eb)",color:"#e8f0ff"}:e.includes("far right")||e==="right"||e.includes("lean right")?{bg:"linear-gradient(135deg,#7f1d1d,#dc2626)",color:"#fff1f1"}:e.includes("center")?{bg:"linear-gradient(135deg,#3f3f46,#71717a)",color:"#f4f4f5"}:{bg:"linear-gradient(135deg,#404040,#525252)",color:"#fafafa"}}function y(t){t.style.cssText=["position:fixed","top:16px","right:16px","width:360px","max-height:78vh","overflow:auto","z-index:2147483647","background:#161616","color:#ececec","border:1px solid #333","border-radius:12px","padding:0","font:14px/1.45 system-ui,-apple-system,sans-serif","box-shadow:0 12px 40px rgba(0,0,0,.45)"].join(";")}function v(){let t=document.getElementById(c);if(t)return t;let e=document.createElement("div");return e.id=c,y(e),document.body.appendChild(e),e}function w(t){t.innerHTML=`
    <div style="padding:16px 18px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #2a2a2a">
      <img src="${s}" alt="" width="72" height="18" style="object-fit:contain;opacity:.9"/>
      <span style="color:#a3a3a3">Loading\u2026</span>
    </div>`}function k(t,e){let o=i(e);t.innerHTML=`
    <div style="padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #2a2a2a">
      <img src="${s}" alt="" width="72" height="18" style="object-fit:contain"/>
      <button type="button" id="gn-close-btn" style="background:#2a2a2a;color:#fff;border:1px solid #444;border-radius:6px;padding:6px 12px;cursor:pointer;font:inherit">Close</button>
    </div>
    <div style="padding:16px 18px;color:#fca5a5">${o}</div>`,t.querySelector("#gn-close-btn")?.addEventListener("click",()=>t.remove())}function $(t,e){let o=h(e.sourceBias),r=i(e.sourceName),n=i(e.sourceBias),l=encodeURIComponent(e.storySlug),g=i(e.sourceIcon),u=Math.max(e.left,2),p=Math.max(e.center,2),f=Math.max(e.right,2);t.innerHTML=`
    <div style="padding:12px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #2a2a2a;background:linear-gradient(180deg,#1f1f1f,#161616)">
      <img src="${s}" alt="Ground News" width="80" height="20" style="object-fit:contain"/>
      <button type="button" id="gn-close-btn" style="background:#2a2a2a;color:#ececec;border:1px solid #444;border-radius:6px;padding:6px 12px;cursor:pointer;font:inherit">Close</button>
    </div>
    <div style="padding:16px 18px 18px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <img src="${g}" alt="" width="44" height="44" style="border-radius:50%;object-fit:cover;border:2px solid #333;background:#222"/>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:15px;color:#fafafa">${r}</div>
          <div style="margin-top:6px;display:inline-block;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:.02em;background:${o.bg};color:${o.color}">${n}</div>
        </div>
      </div>
      <div style="color:#a3a3a3;font-size:13px;margin-bottom:14px">
        <strong style="color:#d4d4d4">${e.sourceCount}</strong> sources covering this story
        \xB7 <strong style="color:#d4d4d4">${e.biasSourceCount}</strong> with bias ratings
      </div>
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#737373;margin-bottom:8px">Political spectrum (coverage)</div>
      <div style="display:flex;height:10px;border-radius:6px;overflow:hidden;margin-bottom:10px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)">
        <div title="Left ${e.left}%" style="flex:${u};min-width:4px;background:linear-gradient(90deg,#1d4ed8,#3b82f6)"></div>
        <div title="Center ${e.center}%" style="flex:${p};min-width:4px;background:linear-gradient(90deg,#52525b,#a1a1aa)"></div>
        <div title="Right ${e.right}%" style="flex:${f};min-width:4px;background:linear-gradient(90deg,#ef4444,#b91c1c)"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:16px">
        <span style="color:#60a5fa"><strong>${e.left}%</strong> left</span>
        <span style="color:#d4d4d4"><strong>${e.center}%</strong> center</span>
        <span style="color:#f87171"><strong>${e.right}%</strong> right</span>
      </div>
      <a target="_blank" rel="noreferrer" href="https://ground.news/article/${l}" style="display:block;text-align:center;padding:11px 14px;border-radius:8px;background:#262626;color:#93c5fd;font-weight:600;text-decoration:none;border:1px solid #404040">Open full coverage on Ground News</a>
    </div>`,t.querySelector("#gn-close-btn")?.addEventListener("click",()=>t.remove())}async function L(){let t=v();w(t);try{let e=await d(window.location.href);$(t,{sourceName:e.source.name,sourceIcon:e.source.circleIcon,sourceBias:e.source.readableBias,sourceCount:e.story.sourceCount,biasSourceCount:e.story.biasSourceCount,left:e.story.left,center:e.story.center,right:e.story.right,storySlug:e.story.slug})}catch(e){k(t,e instanceof Error?e.message:"Unexpected lookup error"),GM_notification({title:"Ground News Lookup",text:"No matching Ground News story found for this page.",timeout:4e3})}}GM_registerMenuCommand("Ground News: Check Current Page",()=>{L()});})();
