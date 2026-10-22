(function(){
  'use strict';
  const G=window.PenguinLife,$=id=>document.getElementById(id);
  const SAVE='ua-penguin-life-v1',ARCHIVE='ua-penguin-life-archive-v1';
  const labels={food:'饱腹',dignity:'体面',bond:'鹅缘',penguin:'含鹅量'};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let storageOK=true,state=null,past=[],viewing=false,showAll=false,automatic=false,timer=null,toastTimer,pendingSeed=null;
  const incoming=new URLSearchParams(location.search).get('seed');
  const sharedSeed=incoming&&/^[a-zA-Z0-9_-]{1,48}$/.test(incoming)?incoming:null;
  try{const raw=JSON.parse(localStorage.getItem(SAVE));if(G.validateState(raw))state=raw;const entries=JSON.parse(localStorage.getItem(ARCHIVE));if(Array.isArray(entries))past=entries.filter(s=>G.validateState(s)&&s.phase==='ended').slice(0,6);}catch{storageOK=false;}
  function persist(){try{localStorage.setItem(SAVE,JSON.stringify(state));localStorage.setItem(ARCHIVE,JSON.stringify(past));storageOK=true;}catch{storageOK=false;}}
  function freshSeed(){if(window.crypto?.getRandomValues){const a=new Uint32Array(2);crypto.getRandomValues(a);return Array.from(a,n=>n.toString(36)).join('-');}return Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);}
  function toast(text){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}
  function stopAuto(){automatic=false;clearTimeout(timer);const button=$('auto');if(button){button.setAttribute('aria-pressed','false');button.textContent='自动代鹅选择';}}
  function archive(){if(state.phase==='ended'){past=[state,...past.filter(s=>s.seed!==state.seed)].slice(0,6);}}
  function start(seed){stopAuto();viewing=false;showAll=false;state=G.createLife(seed||freshSeed());persist();render();focusHeading();}
  function focusHeading(){const h=$('stage').querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}if(window.innerWidth<601)$('stage').scrollIntoView({behavior:'instant',block:'start'});}
  function act(fn){state=fn(state);archive();persist();render();focusHeading();}
  function renderDossier(){
    $('file-number').textContent=state?'NO. '+state.seed.slice(0,8).toUpperCase():'待分配';
    $('identity').innerHTML=state?`<dl><dt>姓名</dt><dd>${esc(state.name)}</dd><dt>出生</dt><dd>${esc(state.origin.label)}</dd><dt class="family-detail">家庭</dt><dd class="family-detail">${esc(state.family)}</dd></dl>`:'<p>尚未出生，暂无意见。</p>';
    $('stats').hidden=!state;
    if(state)$('stats').innerHTML=Object.entries(labels).map(([k,label])=>`<div class="stat"><label for="stat-${k}">${label}</label><meter id="stat-${k}" min="0" max="100" value="${state.stats[k]}">${state.stats[k]}</meter><output>${state.stats[k]}</output></div>`).join('');
    $('save-note').textContent=storageOK?'无需登录 · 记录只保存在此浏览器':'浏览器未允许保存 · 本次仍可完整游玩';
  }
  function renderWelcome(){
    $('stage').innerHTML=`<h1 class="intro-title">这辈子<br>先当<em>企鹅。</em></h1><p class="intro-text">你的出生申请已通过。<br>物种调剂为企鹅。</p><p class="intro-small">随机破壳，认真胡来。<br>石头会记得你的鱼，影子有自己的前程。<br>24 年，24 次选择。没有标准鹅生。</p><div class="intro-actions"><button class="primary" id="new-life">${sharedSeed?'接受同一出身':'接受调剂'} <span aria-hidden="true">&nbsp; →</span></button>${state?`<button class="secondary" id="resume">${state.phase==='ended'?'查看上辈子':'继续当这只'}</button>`:''}</div>${sharedSeed?'<p class="intro-small">朋友把出生申请转给了你。相同起点，选择由你。</p>':''}`;
    $('new-life').onclick=()=>requestStart(sharedSeed);
    if($('resume'))$('resume').onclick=()=>{viewing=false;render(false);focusHeading();};
    $('journal').hidden=true;
  }
  function renderBirth(){
    $('stage').innerHTML=`<h1 class="birth-heading">这次，你是${esc(state.name)}。</h1><p class="intro-small">申请已批。以下条件不接受讨价还价。</p><dl class="birth-details"><div class="birth-row"><dt>出生地</dt><dd>${esc(state.origin.label)}<small>${esc(state.origin.description)}</small></dd></div><div class="birth-row"><dt>家庭</dt><dd>${esc(state.family)}</dd></div><div class="birth-row"><dt>家境</dt><dd>${esc(state.fortune)}</dd></div><div class="birth-row"><dt>天赋</dt><dd>${esc(state.talent.label)}<small>${esc(state.talent.description)}</small></dd></div></dl><span class="birth-stamp">物种审核：大致通过</span><button class="primary wide" id="begin">开始这段鹅生 →</button>`;
    $('begin').onclick=()=>act(G.begin);
  }
  function yearHeader(age){return `<div class="year-heading"><div class="age">${String(age).padStart(2,'0')}<small>岁</small></div><div class="year-tools"><p>这辈子先当企鹅 · ${age} / 24 年</p><button id="auto" class="auto-button" aria-pressed="${automatic}">${automatic?'暂停代鹅选择':'自动代鹅选择'}</button></div></div>`;}
  function wireAuto(){const b=$('auto');if(b)b.onclick=()=>{automatic=!automatic;render();};}
  function renderChoice(){
    const e=G.eventFor(state);
    $('stage').innerHTML=yearHeader(state.age+1)+`<article class="event"><h1>${esc(e.title)}</h1><p>${esc(e.text)}</p></article><div class="choices">${e.choices.map((c,i)=>`<button class="choice" data-choice="${i}"><span class="number" aria-hidden="true">${i+1}</span><span>${esc(c.label)}</span><svg viewBox="0 0 10 16" fill="none" aria-hidden="true"><path d="m2 2 5 6-5 6" stroke="currentColor" stroke-width="1.5"/></svg></button>`).join('')}</div>`;
    for(const b of $('stage').querySelectorAll('[data-choice]'))b.onclick=()=>act(s=>G.choose(s,Number(b.dataset.choice)));
    wireAuto();
  }
  function renderResult(){
    const h=state.history.at(-1);
    $('stage').innerHTML=yearHeader(state.age)+`<article class="event"><p class="result-choice">你选择了：${esc(h.choice)}</p><h1>${esc(h.title)}</h1><div class="outcome"><p>${esc(h.result)}</p></div></article><div class="deltas">${Object.entries(h.effects).map(([k,n])=>`<span>${labels[k]} ${n>0?'+':''}${n}</span>`).join('')}</div>${h.peer?`<p class="peer">${esc(h.peer)}</p>`:''}<button class="primary wide" id="next">${state.age===24?'归档这段鹅生':'翻到下一年'} →</button>`;
    $('next').onclick=()=>act(G.advance);wireAuto();
  }
  function reportText(){const r=G.report(state);return `《这辈子先当企鹅》\n${state.name} · 24 年\n${r.title}\n\n${r.lines.join('\n')}\n\n${r.epitaph}\n${state.flags.finalWish==='fridge'?'遗言：冰箱里还有我。\n':''}\n南极大学 · ${location.origin+location.pathname}`;}
  async function copyText(text){try{await navigator.clipboard.writeText(text);toast('已复制。请对这份鹅生负责。');}catch{$('copy-text').value=text;$('copy-dialog').showModal();$('copy-text').select();}}
  function shareStart(){const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('seed',state.seed);copyText(`我这辈子是企鹅，出生在${state.origin.label}。从同一出身开始，你会过成什么样？\n${url.href}`);}
  function renderReport(){
    const r=G.report(state);stopAuto();
    $('stage').innerHTML=`<div class="year-heading"><div class="age">24<small>年</small></div><div class="year-tools"><p>${esc(state.name)}的鹅生已归档</p><p>档案永久有效，合理性另议。</p></div></div><h1 class="report-title">${esc(r.title)}</h1><div class="report-lines">${r.lines.map(l=>`<p>${esc(l)}</p>`).join('')}</div><p class="epitaph">${esc(r.epitaph)}</p>${state.flags.finalWish==='fridge'?'<p class="intro-small">本人遗言：冰箱里还有我。</p>':''}<div class="report-actions"><button class="primary" id="download">下载鹅生卡</button><button class="secondary" id="copy-report">复制报告</button><button class="secondary" id="share-birth">邀请同出身的鹅</button></div><div class="report-bottom"><button class="quiet-button" id="another">再当一次企鹅</button>${viewing?'<button class="quiet-button" id="back-current">回到当前鹅生</button>':'<a href="../../campus/">返回校园</a>'}</div>`;
    $('download').onclick=downloadCard;$('copy-report').onclick=()=>copyText(reportText());$('share-birth').onclick=shareStart;$('another').onclick=()=>requestStart();
    if($('back-current'))$('back-current').onclick=()=>{state=currentState;viewing=false;render();};
  }
  let currentState=null;
  function renderPast(){
    $('past').hidden=!past.length;
    $('past-list').innerHTML=past.map((s,i)=>`<div class="past-item"><button data-past="${i}">${esc(s.name)} · ${esc(G.report(s).title)}</button><small>24 年 / 查看</small></div>`).join('');
    for(const b of $('past-list').querySelectorAll('[data-past]'))b.onclick=()=>{if(!viewing)currentState=state;state=past[Number(b.dataset.past)];viewing=true;showAll=false;stopAuto();render();focusHeading();};
  }
  function renderJournal(){
    const visible=state&&state.history.length&&state.phase!=='birth';$('journal').hidden=!visible;if(!visible)return;
    $('journal-count').textContent=state.history.length+' 份年度记录';
    const records=[...state.history].reverse();
    $('journal-list').innerHTML=(showAll?records:records.slice(0,3)).map(h=>`<li><time>${String(h.age).padStart(2,'0')} 岁</time><details><summary>${esc(h.title)}</summary><small>你选择：${esc(h.choice)}</small><p>${esc(h.result)}</p>${h.peer?`<small>${esc(h.peer)}</small>`:''}</details></li>`).join('');
    $('all-history').hidden=records.length<=3;$('all-history').textContent=showAll?'收起早年记录':'查看完整记录';
    $('all-history').onclick=()=>{showAll=!showAll;renderJournal();};
  }
  function schedule(){clearTimeout(timer);if(!automatic||document.hidden||!state||!['choice','result'].includes(state.phase))return;
    timer=setTimeout(()=>{if(state.phase==='choice')act(s=>G.choose(s,Math.floor(Math.random()*3)));else act(G.advance);},state.phase==='choice'?2400:3200);
  }
  function requestStart(seed){const active=viewing?currentState:state;if(active&&active.phase!=='ended'){pendingSeed=seed;stopAuto();$('restart-dialog').showModal();}else start(seed);}
  $('restart').onclick=()=>requestStart();
  $('cancel-restart').onclick=()=>{$('restart-dialog').close();render();};
  $('confirm-restart').onclick=()=>{$('restart-dialog').close();start(pendingSeed);pendingSeed=null;};
  function render(welcome=false){
    clearTimeout(timer);document.body.classList.toggle('is-welcome',welcome||!state);renderDossier();$('restart').hidden=!state||state.phase==='ended';
    if(welcome||!state)renderWelcome();else{if(state.phase==='birth')renderBirth();else if(state.phase==='choice')renderChoice();else if(state.phase==='result')renderResult();else renderReport();renderJournal();}
    renderPast();$('stage').classList.remove('enter');void $('stage').offsetWidth;$('stage').classList.add('enter');schedule();
  }
  function wrapText(ctx,text,x,y,maxWidth,lineHeight){let line='';for(const c of text){if(ctx.measureText(line+c).width>maxWidth&&line){ctx.fillText(line,x,y);line='';y+=lineHeight;}line+=c;}if(line){ctx.fillText(line,x,y);y+=lineHeight;}return y;}
  async function downloadCard(){
    const button=$('download');button.disabled=true;
    try{
      await document.fonts.ready;
      const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1560;const c=canvas.getContext('2d');
      c.fillStyle='#f5f3ea';c.fillRect(0,0,canvas.width,canvas.height);c.fillStyle='#183d35';c.font='bold 32px "Songti SC",serif';c.fillText('南极大学 · 鹅生档案',65,82);c.fillRect(65,110,950,2);
      const art=document.querySelector('.portrait img');if(art.complete&&art.naturalWidth)c.drawImage(art,65,145,300,375);
      const r=G.report(state);c.fillStyle='#cd5433';c.font='bold 43px "Songti SC",serif';let headingY=wrapText(c,r.title,410,235,600,62);
      c.fillStyle='#183d35';c.font='28px "PingFang SC",sans-serif';wrapText(c,`${state.name} / 24 年`,410,headingY+28,600,40);
      c.fillStyle='#6b7a70';c.font='24px "PingFang SC",sans-serif';wrapText(c,`破壳地点：${state.origin.label}`,410,headingY+95,600,38);
      c.font='21px "PingFang SC",sans-serif';c.fillText('档案永久有效，合理性另议。',410,480);
      let y=605;c.fillStyle='#183d35';c.font='26px "Songti SC",serif';for(const line of r.lines)y=wrapText(c,line,65,y,950,40)+18;
      c.fillStyle='#cd5433';c.fillRect(65,1305,950,2);c.font='bold 29px "Songti SC",serif';wrapText(c,r.epitaph,65,1360,950,44);
      c.fillStyle='#6b7a70';c.font='21px "PingFang SC",sans-serif';c.fillText('这辈子先当企鹅 · 纯属虚构，认真胡来。',65,1480);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('export');const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='鹅生档案-'+state.name+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);toast('鹅生卡已生成，正在下载。');
    }catch{toast('图片导出暂不可用，可以先复制报告。');}finally{button.disabled=false;}
  }
  $('help').onclick=()=>{stopAuto();$('help-dialog').showModal();};$('close-help').onclick=$('understood').onclick=()=>{$('help-dialog').close();render();};$('close-copy').onclick=()=>$('copy-dialog').close();
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAuto();}else if(!$('new-life'))render();});
  document.addEventListener('keydown',e=>{if(e.repeat||document.querySelector('dialog[open]')||!state||viewing||!['1','2','3'].includes(e.key)||/INPUT|TEXTAREA|BUTTON/.test(document.activeElement?.tagName))return;if(state.phase==='choice'){stopAuto();act(s=>G.choose(s,Number(e.key)-1));}});
  // Resume is explicit so a shared birth never silently replaces an existing life.
  render(true);
})();
