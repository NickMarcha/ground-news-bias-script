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
"use strict";(()=>{var v="https://extension.ground.news/search",k="https://production.checkitt.news/api/public/extension/toolbarData";function d(t){let e=new URL(t),n=["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"];for(let o of n)e.searchParams.delete(o);return e.toString()}async function l(t,e){let n=d(t),o=await e(`${v}?url=${encodeURIComponent(n)}`),r=o.event?.id,i=o.source?.id;if(!r||!i)throw new Error("No Ground News story found for this URL");return e(`${k}/${r}/${i}`)}function L(t){return new Promise((e,n)=>{GM_xmlhttpRequest({method:"GET",url:t,timeout:15e3,onload:o=>{if(o.status<200||o.status>299){n(new Error(`Request failed: ${o.status}`));return}try{e(JSON.parse(o.responseText))}catch(r){n(r)}},onerror:()=>n(new Error("Network error")),ontimeout:()=>n(new Error("Request timed out"))})})}function c(t){return l(t,L)}var a="https://groundnews.b-cdn.net/assets/logo/ground_new_logo_header.svg?width=80";function s(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function $(t){let e=t.toLowerCase();return e.includes("far left")||e==="left"||e.includes("lean left")?{bg:"linear-gradient(135deg,#1e3a5f,#2563eb)",color:"#e8f0ff"}:e.includes("far right")||e==="right"||e.includes("lean right")?{bg:"linear-gradient(135deg,#7f1d1d,#dc2626)",color:"#fff1f1"}:e.includes("center")?{bg:"linear-gradient(135deg,#3f3f46,#71717a)",color:"#f4f4f5"}:{bg:"linear-gradient(135deg,#404040,#525252)",color:"#fafafa"}}function p(){return`
    <div style="padding:16px 18px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #2a2a2a">
      <img src="${a}" alt="" width="80" height="20" style="object-fit:contain;opacity:.9"/>
      <span style="color:#a3a3a3">Loading\u2026</span>
    </div>`}function g(t,e){let n=e?.showClose!==!1,o=s(t);return`
    <div style="padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #2a2a2a">
      <img src="${a}" alt="" width="80" height="20" style="object-fit:contain"/>
      ${n?'<button type="button" id="gn-close-btn" style="background:#2a2a2a;color:#fff;border:1px solid #444;border-radius:6px;padding:6px 12px;cursor:pointer;font:inherit">Close</button>':""}
    </div>
    <div style="padding:16px 18px;color:#fca5a5">${o}</div>`}function u(t,e){let n=e?.showClose!==!1,o=$(t.source.readableBias),r=s(t.source.name),i=s(t.source.readableBias),x=encodeURIComponent(t.story.slug),b=s(t.source.circleIcon),h=Math.max(t.story.left,2),y=Math.max(t.story.center,2),w=Math.max(t.story.right,2);return`
    <div style="padding:12px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #2a2a2a;background:linear-gradient(180deg,#1f1f1f,#161616)">
      <img src="${a}" alt="Ground News" width="80" height="20" style="object-fit:contain"/>
      ${n?'<button type="button" id="gn-close-btn" style="background:#2a2a2a;color:#ececec;border:1px solid #444;border-radius:6px;padding:6px 12px;cursor:pointer;font:inherit">Close</button>':""}
    </div>
    <div style="padding:16px 18px 18px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <img src="${b}" alt="" width="44" height="44" style="border-radius:50%;object-fit:cover;border:2px solid #333;background:#222"/>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:15px;color:#fafafa">${r}</div>
          <div style="margin-top:6px;display:inline-block;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:.02em;background:${o.bg};color:${o.color}">${i}</div>
        </div>
      </div>
      <div style="color:#a3a3a3;font-size:13px;margin-bottom:14px">
        <strong style="color:#d4d4d4">${t.story.sourceCount}</strong> sources covering this story
        \xB7 <strong style="color:#d4d4d4">${t.story.biasSourceCount}</strong> with bias ratings
      </div>
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#737373;margin-bottom:8px">Political spectrum (coverage)</div>
      <div style="display:flex;height:10px;border-radius:6px;overflow:hidden;margin-bottom:10px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)">
        <div title="Left ${t.story.left}%" style="flex:${h};min-width:4px;background:linear-gradient(90deg,#1d4ed8,#3b82f6)"></div>
        <div title="Center ${t.story.center}%" style="flex:${y};min-width:4px;background:linear-gradient(90deg,#52525b,#a1a1aa)"></div>
        <div title="Right ${t.story.right}%" style="flex:${w};min-width:4px;background:linear-gradient(90deg,#ef4444,#b91c1c)"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:16px">
        <span style="color:#60a5fa"><strong>${t.story.left}%</strong> left</span>
        <span style="color:#d4d4d4"><strong>${t.story.center}%</strong> center</span>
        <span style="color:#f87171"><strong>${t.story.right}%</strong> right</span>
      </div>
      <a target="_blank" rel="noreferrer" href="https://ground.news/article/${x}" style="display:block;text-align:center;padding:11px 14px;border-radius:8px;background:#262626;color:#93c5fd;font-weight:600;text-decoration:none;border:1px solid #404040">Open full coverage on Ground News</a>
    </div>`}var f="gn-minimal-panel";function G(t){t.style.cssText=["position:fixed","top:16px","right:16px","width:360px","max-height:78vh","overflow:auto","z-index:2147483647","background:#161616","color:#ececec","border:1px solid #333","border-radius:12px","padding:0","font:14px/1.45 system-ui,-apple-system,sans-serif","box-shadow:0 12px 40px rgba(0,0,0,.45)"].join(";")}function C(){let t=document.getElementById(f);if(t)return t;let e=document.createElement("div");return e.id=f,G(e),document.body.appendChild(e),e}function m(t){t.querySelector("#gn-close-btn")?.addEventListener("click",()=>{t.remove()})}async function P(){let t=C();t.innerHTML=p();try{let e=await c(window.location.href);t.innerHTML=u(e,{showClose:!0}),m(t)}catch(e){t.innerHTML=g(e instanceof Error?e.message:"Unexpected lookup error",{showClose:!0}),m(t),GM_notification({title:"Ground News Lookup",text:"No matching Ground News story found for this page.",timeout:4e3})}}GM_registerMenuCommand("Ground News: Check Current Page",()=>{P()});})();
