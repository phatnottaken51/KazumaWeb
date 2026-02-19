// ==UserScript==
// @name         Bypass NhapMa V1
// @namespace    bypass.nhapma
// @version      1.0
// @author       PyzyraHT
// @description  Discord: https://discord.gg/6eaKTq2UTc
// @match        ://*/
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      service.nhapma.com
// ==/UserScript==

(function () {
'use strict';

GM_addStyle(`
#nm{
position:fixed;
bottom:20px;
right:20px;
width:190px;
background:rgba(22,27,34,0.9);
backdrop-filter:blur(8px);
color:#e6edf3;
padding:12px;
border-radius:12px;
z-index:999999;
font-size:11px;
font-family:Segoe UI;
box-shadow:0 8px 20px rgba(0,0,0,0.4);
display:none;
}
#nm h4{margin:0 0 6px;color:#58a6ff;font-size:12px;}
#nm input{
width:100%;padding:5px;background:#0d1117;
border:1px solid #30363d;color:#e6edf3;
border-radius:6px;margin-bottom:6px;
}
#nm button{
width:100%;padding:5px;background:#238636;
border:none;color:#fff;border-radius:6px;
margin-bottom:6px;cursor:pointer;
}
.log{
background:#0d1117;border:1px solid #30363d;
padding:4px;border-radius:6px;
text-align:center;font-size:11px;
}
.run{color:#58a6ff;}
.done{color:#3fb950;}
.err{color:#f85149;}
`);

document.body.insertAdjacentHTML("beforeend",`
<div id="nm">
<h4>Bypass NhapMa</h4>
<input id="nm_url" placeholder="Link web lấy code">
<button id="nm_go">Bypass</button>
<div class="log" id="nm_log">...</div>
</div>
`);

let visible=false;
GM_registerMenuCommand("Bypass NhapMa",()=>{
visible=!visible;
document.getElementById("nm").style.display=
visible?"block":"none";
});

const url=document.getElementById("nm_url");
const go=document.getElementById("nm_go");
const log=document.getElementById("nm_log");

const sleep=m=>new Promise(r=>setTimeout(r,m));

function req(url,method="GET",data=null){
return new Promise(r=>{
GM_xmlhttpRequest({
method,url,data,
headers:{"Content-Type":"application/x-www-form-urlencoded"},
onload:x=>r(x.responseText)
});
});
}

function getID(html){
let m=
html.match(/user-vite.*?id=([a-zA-Z0-9\-_]+)/) ||
html.match(/"code"\s*:\s*"([a-zA-Z0-9\-_]{6,})"/) ||
html.match(/id=([a-zA-Z0-9\-_]{6,})/);
return m?m[1]:null;
}

go.onclick=async()=>{

log.className="log run";
log.innerText="Đang lấy ID..";

let html=await req(url.value);
let id=getID(html);

if(!id){
log.className="log err";
log.innerText="Không có ID!";
return;
}

let token=JSON.parse(await req(
"https://service.nhapma.com/step",
"POST",
code=${id}&token=
)).token;

log.className="log run";
log.innerText="Đang chờ mã..";

while(true){

let r=JSON.parse(await req(
"https://service.nhapma.com/continue",
"POST",
code=${id}&token=${token}
));

if(r.success && r.code){
log.className="log done";
log.innerText=r.code;
navigator.clipboard.writeText(r.code);
break;
}

if(r.token) token=r.token;
await sleep(400);
}

};

})();
