(function (root) {
  'use strict';
  const KEYS = ['food', 'dignity', 'bond', 'penguin'];
  function hash(text) { let h = 2166136261; for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
  function random(seed) { let n = hash(seed); return () => { n += 0x6D2B79F5; let t = Math.imul(n ^ n >>> 15, 1 | n); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const origins = [
    {id:'ice', label:'普通冰面', description:'出生地点正常。登记员因此多看了你两眼。'},
    {id:'photo', label:'一张南极照片里', description:'父母希望你走出去。相框不同意。'},
    {id:'fridge', label:'科考站冰箱第二层', description:'出生时灯亮了。你以为这是太阳。'}
  ];
  const talents = [
    {id:'shadow', label:'影子早生三天', description:'论辈分，你需要叫它一声哥。'},
    {id:'stone', label:'石头觉得你可靠', description:'你的信用记录目前由地质部门保管。'},
    {id:'slip', label:'滑倒可计学分', description:'地面是你的第一位导师。'}
  ];
  function events() { return typeof module !== 'undefined' && module.exports ? require('./events.js') : root.PenguinEvents; }
  function createLife(seed) {
    seed = String(seed || 'ice').slice(0, 48); const rng = random(seed);
    const origin = origins[Math.floor(rng()*origins.length)], talent = talents[Math.floor(rng()*talents.length)];
    const families = ['被一块石头抚养', '父母健在，正在缓冲', '全家只有你承认自己是企鹅'];
    const fortunes = ['继承半平方米阴影', '欠海豹三条鱼', '家徒四壁，四壁都是鱼'];
    return {version:1,seed,age:0,name:['小冻','鹅不知','冰有礼','白忙','余鹅','石在'][Math.floor(rng()*6)],origin,talent,family:families[Math.floor(rng()*3)],fortune:fortunes[Math.floor(rng()*3)],stats:{food:55,dignity:talent.id==='slip'?65:50,bond:talent.id==='stone'?55:40,penguin:talent.id==='shadow'?65:80},flags:{origin:origin.id,talent:talent.id},history:[],phase:'birth'};
  }
  function begin(s) { if(s.phase !== 'birth') return s; return {...s,phase:'choice'}; }
  function eventFor(s) {
    const eligible = events().filter(e => e.age === s.age+1 && (!e.requires || Object.entries(e.requires).every(([k,v])=>s.flags[k]===v)));
    return eligible.find(e=>e.requires) || eligible.find(e=>!e.requires);
  }
  function choose(s,index) {
    if(s.phase !== 'choice') return s;
    const event = eventFor(s); const choice = event && event.choices[index];
    if(!choice || !Number.isInteger(index)) throw new Error('Invalid choice');
    const stats = {...s.stats};
    for(const k of KEYS) stats[k] = Math.max(0,Math.min(100,stats[k]+(choice.effects?.[k]||0)));
    const flags = {...s.flags,...choice.set};
    const age = s.age+1;
    const peers = [
      '同日破壳的阿白：在冰上摔了一跤，决定起诉重力。',
      '同日登记的冰箱：没有参加考试，保鲜成绩依然第一。',
      '同日破壳的圆圆：找到了伴侣。双方正在核对物种。',
      '同日破壳的阿白：重力败诉，但拒绝执行。',
      '同日登记的冰箱：提前退休，开始学习制热。',
      '同日破壳的圆圆：把一片海命名为家。海没有反对。'
    ];
    const peer = age%4 === 0 ? peers[age/4-1] : null;
    return {...s,age,stats,flags,name:flags.rename || flags.registeredName || s.name,phase:'result',history:[...s.history,{age,eventId:event.id,title:event.title,choice:choice.label,result:choice.result,effects:choice.effects||{},peer}]};
  }
  function advance(s) { if(s.phase !== 'result') return s; return {...s,phase:s.age>=24?'ended':'choice'}; }
  function report(s) {
    const f=s.flags, lines=[];
    if(f.stoneLoan) lines.push(f.pension ? '你借给石头的鱼，后来变成了养老金。石头比银行守信。' : '你曾借给石头一条鱼。它至今没有否认这笔债务。');
    if(f.shadowDinner) lines.push('你的影子替你赴宴，后来有了自己的作息。你们仍保持地面联系。');
    if(f.rename) lines.push('你把名字改成了“今日售罄”。世界因此很难预约到你。');
    if(f.chick) lines.push(f.fridgeLanguage ? '你养大的幼鹅证明，你讲的是古代冰箱语。你终于有人听懂。' : '你照顾过一只幼鹅。它记得你分给它的第一条鱼。');
    if(f.partner) lines.push(f.partnerFriend?'你和认错的伙伴成了邻居。门口的路长了一点，晚饭仍有两份。':'你和一只认错的企鹅共同生活了很多年。后来，认错也成了一种认定。');
    if(f.diploma) lines.push('你取得了名誉博士学位。研究方向：地面为什么突然靠近。');
    if(f.sign) lines.push('你捐的路牌让后来的企鹅有组织地走错了路。那条路现在以你命名。');
    if(f.origin==='photo') lines.push('你出生在照片里。后来，照片已经装不下你的经历。');
    if(f.origin==='fridge') lines.push('你曾以为冰箱灯是太阳，后来也给别人照过路。');
    if(!lines.length) lines.push('你没有成为任何传说，但每年都认真回答了一个奇怪的问题。');
    lines.push(`你在${s.origin.label}破壳，留下了${s.history.length}份年度记录。`);
    const title = f.pension?'养老金由石头发放':f.fridgeLanguage?'古代冰箱语最后传鹅':f.diploma?'地面接触学名誉博士':f.partner?'彼此认错，终身有效':f.shadowDinner?'影子已上岸，本鹅仍在冰上':f.sign?'迁徙学奠基鹅':'本年度正常企鹅（存疑）';
    const epitaph = f.finalWish==='blank'?'档案最后留了一张空椅子。后来，总有鹅来坐坐。':f.finalWish==='fridge'?'你的遗言已归入文学：冰箱里还有我。':f.pension?'你走后，石头每月仍按时汇款。':f.partnerFriend?'隔壁的企鹅说：明天也来吃饭吧。':f.partner?'那只企鹅说：没有认错，就是你。':f.shadowDinner?'那天，影子替你多站了一会儿。':'你的出生申请，现已转为永久档案。';
    return {title,lines:lines.slice(0,6),epitaph};
  }
  function validateState(s) {
    if(!s || s.version!==1 || typeof s.seed!=='string' || s.seed.length>48 || !Number.isInteger(s.age) || s.age<0 || s.age>24) return false;
    if(!['birth','choice','result','ended'].includes(s.phase) || !s.stats || !KEYS.every(k=>Number.isFinite(s.stats[k])&&s.stats[k]>=0&&s.stats[k]<=100)) return false;
    if(!s.flags || !origins.some(o=>o.id===s.flags.origin) || !talents.some(t=>t.id===s.flags.talent)) return false;
    if(!s.origin || s.origin.id!==s.flags.origin || !s.talent || s.talent.id!==s.flags.talent || typeof s.name!=='string') return false;
    if(!Array.isArray(s.history) || s.history.length!==s.age || !s.history.every((h,i)=>h && h.age===i+1 && typeof h.result==='string' && typeof h.title==='string' && typeof h.eventId==='string')) return false;
    if(s.phase==='birth'&&s.age!==0 || s.phase==='choice'&&s.age>=24 || s.phase==='result'&&s.age===0 || s.phase==='ended'&&s.age!==24) return false;
    return true;
  }
  const api={createLife,begin,eventFor,choose,advance,report,validateState,origins,talents};
  if(typeof module!=='undefined'&&module.exports) module.exports=api; else root.PenguinLife=api;
})(typeof window!=='undefined'?window:globalThis);
