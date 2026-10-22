(function (root) {
  'use strict';
  const Life=typeof module!=='undefined'&&module.exports?require('./lifetime.js'):root.PenguinLifetime;
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
  const species = typeof module!=='undefined'&&module.exports?require('./species.js'):root.PenguinSpecies;
  const totalWeight=species.reduce((total,p)=>total+p.population.weightPairs,0);
  function probabilityFor(id){const p=species.find(p=>p.id===id);if(!p)throw new RangeError('Unknown penguin species');return p.population.weightPairs/totalWeight;}
  function pickSpecies(unit){if(!Number.isFinite(unit)||unit<0||unit>=1)throw new RangeError('Sample must be in [0,1)');let edge=0;for(const p of species){edge+=p.population.weightPairs;if(unit<edge/totalWeight)return p;}return species.at(-1);}
  function speciesFor(seed,id,model=3) {
    if(id!==undefined && id!==null && !species.some(p=>p.id===id)) throw new RangeError('Unknown penguin species');
    return species.find(p=>p.id===id) || (model===2?species[hash('species:'+seed)%6]:pickSpecies(random('population:'+seed)()));
  }
  function ambientLine(s){const p=s.species||speciesFor(s.seed,undefined,2);return p.flavor[hash(s.seed+':scene:'+s.age)%p.flavor.length];}
  function worldStatus(s) { const p=s.species||speciesFor(s.seed,undefined,2); return p.status[s.age<4?0:s.age<12?1:2]; }
  function events() { return typeof module !== 'undefined' && module.exports ? require('./events.js') : root.PenguinEvents; }
  function createLife(seed,speciesId,model=3,storyVersion=model===3?4:3,lifeVersion=storyVersion===4?2:0) {
    if(![0,1,2].includes(lifeVersion)||lifeVersion>=1&&(model!==3||storyVersion!==4))throw new RangeError('Unknown lifetime model');
    if(![3,4].includes(storyVersion))throw new RangeError('Unknown story version');
    if(![2,3].includes(model))throw new RangeError('Unknown sampling model');
    seed = String(seed || 'ice').slice(0, 48); const rng = random(seed);
    const originDraw=rng(),talent=talents[Math.floor(rng()*talents.length)];
    const penguinSpecies=speciesFor(seed,speciesId,model);
    const habitat={id:'habitat-'+penguinSpecies.id,label:penguinSpecies.habitat,description:penguinSpecies.flavor[0]};
    const origin=model===2?origins[Math.floor(originDraw*origins.length)]:originDraw<0.8?habitat:originDraw<0.92?origins[1]:origins[2];
    const families = ['被一块石头抚养', '父母健在，正在缓冲', '全家只有你承认自己是企鹅'];
    const fortunes = ['继承半平方米阴影', '欠海豹三条鱼', '家徒四壁，四壁都是鱼'];
    const expandedFamilies=[...families,'跟着回声长大，家长会由山出席','全家轮流当闹钟，你负责不醒','树叶是门，风是没带钥匙的亲戚','父母认得你的叫声，但海总抢答','被寒流接送上下学，迟到算洋流的','家里有一只特别安静的明天'];
    const expandedFortunes=[...fortunes,'继承了一场未下完的雨','家有两条洋流，一条负责送饭','拥有一段尚未被使用的黄昏','影子比房子大，暂按影子缴租','账上有三次拥抱，食堂暂不支持刷脸','家中有一座会回信的山'];
    const expandedNames=['小冻','鹅不知','冰有礼','白忙','余鹅','石在','林里','慢半拍','沿海','有眉目','小岛','蓝一下','回声','鱼未凉','日落前'];
    const stats={food:55,dignity:talent.id==='slip'?65:50,bond:talent.id==='stone'?55:40,penguin:talent.id==='shadow'?65:80};
    for(const [k,v] of Object.entries(penguinSpecies.bonus))stats[k]=Math.max(0,Math.min(100,stats[k]+v));
    const names=model===2?expandedNames.slice(0,6):expandedNames;const familyPool=model===2?families:expandedFamilies,fortunePool=model===2?fortunes:expandedFortunes;
    return {version:2,samplingVersion:model,storyVersion,...(lifeVersion>=1?{lifeVersion}:{}),species:penguinSpecies,seed,age:0,name:names[Math.floor(rng()*names.length)],origin,talent,family:familyPool[Math.floor(rng()*familyPool.length)],fortune:fortunePool[Math.floor(rng()*fortunePool.length)],stats,flags:{origin:origin.id,talent:talent.id,species:penguinSpecies.id,...(storyVersion===4?{storyArc:penguinSpecies.id+'_'+(hash('story:'+seed)%2?'b':'a')}: {})},history:[],phase:'birth'};
  }
  function begin(s) { if(s.phase !== 'birth') return s; return {...s,phase:'choice'}; }
  function eventFor(s) {
    const lifeEvent=s.lifeVersion>=1?Life.event(s):null;if(lifeEvent)return lifeEvent;
    const legacy=s.version===1||s.legacy;
    const eligible=events().filter(e=>e.age===s.age+1 && (e.edition||2)<=(s.storyVersion||3) && ((s.samplingVersion||2)===3||(e.edition||2)<3) && (!legacy||(!e.variant&&!e.requires?.species)) && (!e.requires||Object.entries(e.requires).every(([k,v])=>s.flags[k]===v)));
    const chain=eligible.find(e=>e.edition===4&&e.requires?.storyArc);
    if(chain)return chain;
    const established=eligible.find(e=>e.requires&&!e.requires.species);
    if(established)return established;
    const specific=eligible.find(e=>e.requires?.species);
    if(specific&&!(s.lifeVersion>=1&&random('species-encounter:'+s.seed+':'+String(s.age+1))()<.3))return specific;
    const ordinary=eligible.filter(e=>!e.requires);
    const index=s.storyVersion===4?Math.floor(random('event:'+s.seed+':'+String(s.age+1))()*ordinary.length):hash(s.seed+':event:'+String(s.age+1))%ordinary.length;
    return ordinary[legacy?0:index];
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
    const next={...s,age,stats,flags,name:flags.rename || flags.registeredName || s.name,phase:'result',history:[...s.history,{age,eventId:event.id,title:event.title,choice:choice.label,...(s.lifeVersion===2?{choiceIndex:index}:{}),result:choice.result,effects:choice.effects||{},peer}]};
    if(s.lifeVersion>=1){const terminal=Life.resolve(next,choice);if(terminal)next.terminal=terminal;}
    return next;
  }
  function advance(s) { if(s.phase !== 'result') return s; return {...s,phase:s.terminal||!s.lifeVersion&&s.age>=24?'ended':'choice'}; }
  function report(s) {
    const f=s.flags, lines=[];
    const penguinSpecies=s.species||speciesFor(s.seed);
    const endingTitles={'emperor-sunset':'批准太阳准点下班','emperor-chair':'朕是一把折叠椅','emperor-penguin':'皇帝转岗为企鹅','adelie-change':'活体零钱，现金流稳定','adelie-guardian':'石头的法定监护鹅','adelie-earth':'地球永久参展','gentoo-ontime':'终于准时抵达现在','gentoo-yesterday':'昨天送达，昨天退款','gentoo-finish':'终点还在热鱼','chinstrap-visa':'朋友免签，本鹅开放','chinstrap-map':'国境代班，本鹅散步','chinstrap-ocean':'紧急联系人：整片海','rockhopper-retired':'眉毛退休，表情自由','rockhopper-secretary':'全脸秘书长','rockhopper-flying':'表情已出国，本鹅未动','little-comma':'从逗号里通过一生','little-outside':'本人已走出这句话','little-world':'世界缩小，朋友照旧'};
    const endingChoice=events().flatMap(e=>e.choices).find(c=>c.set?.speciesEnding===f.speciesEnding && f.speciesEnding);
    if(!s.legacy&&s.version!==1) lines.push(`${penguinSpecies.label}的一生：${endingChoice?.result||penguinSpecies.description}`);
    if(s.storyVersion===4){const chapter=s.history.find(h=>h.age===15);if(chapter)lines.push('第十五年的怪事留下了回声：'+chapter.result);}
    if(f.stoneLoan) lines.push(f.pension ? '你借给石头的鱼，后来变成了养老金。石头比银行守信。' : '你曾借给石头一条鱼。它至今没有否认这笔债务。');
    if(f.shadowDinner) lines.push('你的影子替你赴宴，后来有了自己的作息。你们仍保持地面联系。');
    if(f.rename) lines.push('你把名字改成了“今日售罄”。世界因此很难预约到你。');
    if(f.chick) lines.push(f.fridgeLanguage ? '你养大的幼鹅证明，你讲的是古代冰箱语。你终于有人听懂。' : '你照顾过一只幼鹅。它记得你分给它的第一条鱼。');
    if(f.partner) lines.push(s.lifeVersion>=1?(f.partnerFriend?'你把认错变成了邻居关系，给彼此留过一份晚饭。':'你曾和一只认错的企鹅住在一起。那次拥抱没有因为认错而作废。'):f.partnerFriend?'你和认错的伙伴成了邻居。门口的路长了一点，晚饭仍有两份。':'你和一只认错的企鹅共同生活了很多年。后来，认错也成了一种认定。');
    if(f.diploma) lines.push('你取得了名誉博士学位。研究方向：地面为什么突然靠近。');
    if(f.sign) lines.push('你捐的路牌让后来的企鹅有组织地走错了路。那条路现在以你命名。');
    if(f.origin==='photo') lines.push('你出生在照片里。后来，照片已经装不下你的经历。');
    if(f.origin==='fridge') lines.push('你曾以为冰箱灯是太阳，后来也给别人照过路。');
    if(!lines.length) lines.push('你没有成为任何传说，但每年都认真回答了一个奇怪的问题。');
    lines.push(`你在${s.origin.label}破壳，留下了${s.history.length}份年度记录。`);
    const title = f.speciesEnding?(endingChoice?.endingTitle||endingTitles[f.speciesEnding]||penguinSpecies.ending):f.pension?'养老金由石头发放':f.fridgeLanguage?'古代冰箱语最后传鹅':f.diploma?'地面接触学名誉博士':f.partner?'彼此认错，终身有效':f.shadowDinner?'影子已上岸，本鹅仍在冰上':f.sign?'迁徙学奠基鹅':'本年度正常企鹅（存疑）';
    const epitaph = f.finalWish==='blank'?'档案最后留了一张空椅子。后来，总有鹅来坐坐。':f.finalWish==='fridge'?'你的遗言已归入文学：冰箱里还有我。':f.pension?'你走后，石头每月仍按时汇款。':f.partnerFriend?'隔壁的企鹅说：明天也来吃饭吧。':f.partner?'那只企鹅说：没有认错，就是你。':f.shadowDinner?'那天，影子替你多站了一会儿。':'你的出生申请，现已转为永久档案。';
    if(s.terminal){
      const chapters=s.history.filter(h=>events().some(e=>e.id===h.eventId&&e.requires?.storyArc));
      const unfinished=s.age<22?(chapters.length?'怪事停在了「'+chapters.at(-1).title+'」。后面的事，还没来得及发生。':'有些怪事还没有找上你，记录就先停了。'):null;
      const trace=s.terminal.cause?'起因在'+s.terminal.cause.age+'岁：「'+s.terminal.cause.title+'」，你选择了「'+s.terminal.cause.choice+'」。':null;
      const memories=lines.filter(line=>!line.startsWith(penguinSpecies.label+'的一生：')||endingChoice);
      return {title:s.terminal.title,lines:[s.terminal.text,...(trace?[trace]:[]),...(unfinished?[unfinished]:[]),...memories].slice(0,6),epitaph:s.terminal.epitaph};
    }
    return {title,lines:lines.slice(0,6),epitaph};
  }
  function validateState(s) {
    if(!s || ![1,2].includes(s.version) || typeof s.seed!=='string' || s.seed.length>48 || !Number.isInteger(s.age) || s.age<0 || s.age>(s.lifeVersion>=1?Life.MAX_AGE:24)) return false;
    if(!['birth','choice','result','ended'].includes(s.phase) || !s.stats || !KEYS.every(k=>Number.isFinite(s.stats[k])&&s.stats[k]>=0&&s.stats[k]<=100)) return false;
    if(!s.flags || ![...origins.map(o=>o.id),...species.map(p=>'habitat-'+p.id)].includes(s.flags.origin) || !talents.some(t=>t.id===s.flags.talent)) return false;
    if(s.version===2 && (!s.species || !species.some(p=>p.id===s.species.id) || s.flags.species!==s.species.id)) return false;
    if(s.samplingVersion!==undefined&&![2,3].includes(s.samplingVersion))return false;
    if(s.storyVersion!==undefined&&![3,4].includes(s.storyVersion))return false;
    if(s.lifeVersion!==undefined&&![1,2].includes(s.lifeVersion))return false;
    if(s.lifeVersion>=1&&(s.version!==2||!s.species||s.storyVersion!==4||s.samplingVersion!==3||s.legacy))return false;
    if(s.terminal){if(!s.lifeVersion||s.terminal.age!==s.age||!['accident','hunger','oldAge','vanished'].includes(s.terminal.kind)||!['id','title','text','epitaph','eventId'].every(k=>typeof s.terminal[k]==='string'&&s.terminal[k])||!['result','ended'].includes(s.phase))return false;}
    if(s.lifeVersion>=1&&(s.phase==='ended'&&!s.terminal||s.age>=Life.profile(s.species.id).limit&&!s.terminal))return false;
    if(s.storyVersion===4&&!['a','b'].some(route=>s.flags.storyArc===s.species?.id+'_'+route))return false;
    if(s.storyVersion===4&&s.age>=3&&!['direct','side'].includes(s.flags.chainRoute))return false;
    if(s.legacy!==undefined&&typeof s.legacy!=='boolean')return false;
    if(!s.origin || s.origin.id!==s.flags.origin || !s.talent || s.talent.id!==s.flags.talent || typeof s.name!=='string') return false;
    if(!Array.isArray(s.history) || s.history.length!==s.age || !s.history.every((h,i)=>h && h.age===i+1 && typeof h.result==='string' && typeof h.title==='string' && typeof h.eventId==='string')) return false;
    if(s.terminal&&!Life.validTerminal(s))return false;
    if(s.phase==='birth'&&s.age!==0 || s.phase==='choice'&&s.age>=(s.lifeVersion>=1?Life.profile(s.species.id).limit:24) || s.phase==='result'&&s.age===0 || s.phase==='ended'&&!s.lifeVersion&&s.age!==24) return false;
    return true;
  }
  function upgradeLife(s){return s?.lifeVersion===1&&!s.terminal&&s.phase!=='ended'?{...s,lifeVersion:2}:s;}
  function migrateState(s) {
    if(!validateState(s))return null;
    if(s.version===2)return {...s,samplingVersion:s.samplingVersion||2,storyVersion:s.storyVersion||3,species:speciesFor(s.seed,s.species.id)};
    const penguinSpecies=speciesFor(s.seed,undefined,2);
    return {...s,version:2,samplingVersion:2,storyVersion:3,legacy:true,species:penguinSpecies,flags:{...s.flags,species:penguinSpecies.id}};
  }
  const api={species,totalWeight,probabilityFor,pickSpecies,speciesFor,lifetimeProfile:Life.profile,mortalityRisk:Life.risk,ambientLine,worldStatus,migrateState,upgradeLife,createLife,begin,eventFor,choose,advance,report,validateState,origins,talents};
  if(typeof module!=='undefined'&&module.exports) module.exports=api; else root.PenguinLife=api;
})(typeof window!=='undefined'?window:globalThis);
