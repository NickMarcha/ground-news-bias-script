// ==UserScript==
// @name         Ground News Lookup (Minimal)
// @namespace    https://github.com/nicol/ground-news-bias-userscript
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
// ==/UserScript==
"use strict";(()=>{var d="https://extension.ground.news/search",c="https://production.checkitt.news/api/public/extension/toolbarData";function s(t){return new Promise((e,o)=>{GM_xmlhttpRequest({method:"GET",url:t,timeout:15e3,onload:r=>{if(r.status<200||r.status>299){o(new Error(`Request failed: ${r.status}`));return}try{e(JSON.parse(r.responseText))}catch(n){o(n)}},onerror:()=>o(new Error("Network error")),ontimeout:()=>o(new Error("Request timed out"))})})}function a(t){let e=new URL(t),o=["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"];for(let r of o)e.searchParams.delete(r);return e.toString()}async function i(t){let e=a(t),o=await s(`${d}?url=${encodeURIComponent(e)}`),r=o.event?.id,n=o.source?.id;if(!r||!n)throw new Error("No Ground News story found for this URL");return s(`${c}/${r}/${n}`)}var u="gn-minimal-panel";function l(){let t=document.getElementById(u);if(t)return t;let e=document.createElement("div");return e.id=u,e.style.position="fixed",e.style.top="16px",e.style.right="16px",e.style.width="340px",e.style.maxHeight="70vh",e.style.overflow="auto",e.style.zIndex="2147483647",e.style.background="#111",e.style.color="#f2f2f2",e.style.border="1px solid #444",e.style.borderRadius="8px",e.style.padding="12px",e.style.font="14px/1.4 system-ui, sans-serif",e.style.boxShadow="0 8px 30px rgba(0,0,0,0.4)",document.body.appendChild(e),e}function g(t){t.innerHTML="<strong>Ground News</strong><div>Loading...</div>"}function m(t,e){t.innerHTML=`<strong>Ground News</strong><div>${e}</div>`}function p(t,e){t.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <strong>Ground News</strong>
      <button id="gn-close-btn" style="background:#333;color:#fff;border:1px solid #555;border-radius:4px;padding:2px 8px;cursor:pointer">Close</button>
    </div>
    <div style="margin-top:8px">
      <div><strong>Source:</strong> ${e.sourceName}</div>
      <div><strong>Bias:</strong> ${e.sourceBias}</div>
      <div><strong>Coverage:</strong> ${e.sourceCount} sources (${e.biasSourceCount} with bias data)</div>
      <div style="margin-top:8px"><strong>Distribution</strong></div>
      <div>Left: ${e.left}% | Center: ${e.center}% | Right: ${e.right}%</div>
      <div style="margin-top:8px">
        <a target="_blank" rel="noreferrer" href="https://ground.news/article/${e.storySlug}" style="color:#7db7ff">Open on Ground News</a>
      </div>
    </div>
  `,t.querySelector("#gn-close-btn")?.addEventListener("click",()=>{t.remove()})}async function f(){let t=l();g(t);try{let e=await i(window.location.href);p(t,{sourceName:e.source.name,sourceBias:e.source.readableBias,sourceCount:e.story.sourceCount,biasSourceCount:e.story.biasSourceCount,left:e.story.left,center:e.story.center,right:e.story.right,storySlug:e.story.slug})}catch(e){m(t,e instanceof Error?e.message:"Unexpected lookup error"),GM_notification({title:"Ground News Lookup",text:"No matching Ground News story found for this page.",timeout:4e3})}}GM_registerMenuCommand("Ground News: Check Current Page",()=>{f()});})();
