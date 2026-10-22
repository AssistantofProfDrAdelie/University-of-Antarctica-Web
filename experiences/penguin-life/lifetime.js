/* 寿命曲线为游戏参数，不是18物种的真实年度死亡率。 */
(function(root){'use strict';
const content=typeof module!=='undefined'&&module.exports?require('./life-events.js'):root.PenguinLifeEvents;
function hash(text){let h=2166136261;for(const c of text)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
function draw(text){let n=hash(text)+0x6D2B79F5;let t=Math.imul(n^n>>>15,1|n);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296;}
function profile(id){return id==='little'?{onset:8,limit:30,label:'较早进入晚年'}:id==='emperor'?{onset:18,limit:50,label:'较晚进入晚年'}:{onset:14,limit:42,label:'中间衰老曲线'};}
function risk(s,choice={}){
 const age=s.age,food=s.stats.food;
 const p=profile(s.species.id),aging=.005*Math.pow(Math.max(0,age-p.onset),1.55);
 const hunger=food===0?.32:food<10?.16:food<20?.07:0;
 const environment=(age<=2?.032:.014)*(s.stats.bond>=70?.7:1);
 const adventure=Number.isFinite(choice.risk)?Math.max(0,Math.min(.5,choice.risk)):0;
 return {chance:age>=p.limit?1:Math.min(.97,environment+hunger+aging+adventure),aging,hunger,adventure,environment};
}
function resolve(s,choice={}){
 const r=risk(s,choice),roll=draw('mortality:'+s.seed+':'+s.age);
 if(roll>=r.chance)return null;
 const cap=s.age>=profile(s.species.id).limit;
 const causeRoll=draw('cause:'+s.seed+':'+s.age)*(r.environment+r.hunger+r.aging+r.adventure);
 let kind=cap?'oldAge':causeRoll<r.hunger?'hunger':causeRoll<r.hunger+r.aging?'oldAge':causeRoll<r.hunger+r.aging+r.adventure?'accident':draw('strange:'+s.seed+':'+s.age)<.22?'vanished':'accident';
 const hazard=content.hazards.find(e=>e.id===s.history.at(-1).eventId);
 const adventureCaused=!cap&&causeRoll>=r.hunger+r.aging&&causeRoll<r.hunger+r.aging+r.adventure;
 if(adventureCaused&&hazard?.id==='hazard-unwritten-door')kind='vanished';
 const pool=content.endings[kind],ending=pool[Math.floor(draw('ending:'+s.seed+':'+s.age)*pool.length)];
 const cold=['emperor','adelie','chinstrap'].includes(s.species.id);
 const causes=[cold?'返程时，浮冰突然断开，急流切断了归路。':'回岸途中，骤然增强的风浪切断了归路。','风暴突然追上了回巢的路，熟悉的地形消失在风里。','觅食时，你没能甩开一只海中的捕食者。'];
 const context=adventureCaused&&hazard?'「'+hazard.title+'」留下的险情没有散去。':kind==='accident'?causes[Math.floor(draw('accident-scene:'+s.seed+':'+s.age)*causes.length)]:'';
 const text=context+ending.text;
 return {...ending,text,kind,age:s.age,eventId:s.history.at(-1).eventId};
}
function event(s){
 const age=s.age+1,cold=['emperor','adelie','chinstrap'].includes(s.species.id);
 const hazards=content.hazards.filter(e=>!e.habitat||e.habitat==='any'||e.habitat===(cold?'cold':'warm'));
 if(![3,8,15,22].includes(age)&&draw('hazard:'+s.seed+':'+age)<.20){const e=hazards[Math.floor(draw('hazard-pick:'+s.seed+':'+age)*hazards.length)];return {...e,age,lifeEvent:true};}
 if(age<24)return null;
 const eligible=content.late.filter(e=>!e.requires||Object.entries(e.requires).every(([key,value])=>s.flags[key]===value));
 const used=new Set(s.history.slice(-8).map(h=>h.eventId));const fresh=eligible.filter(e=>!used.has(e.id));const pool=fresh.length?fresh:eligible;
 return {...pool[Math.floor(draw('late:'+s.seed+':'+age)*pool.length)],age,lifeEvent:true};
}
function validTerminal(s){const t=s.terminal;return s.age>0&&content.endings[t.kind]?.some(e=>e.id===t.id)&&t.eventId===s.history.at(-1)?.eventId;}
const api={profile,risk,resolve,event,validTerminal,MAX_AGE:50};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PenguinLifetime=api;
})(typeof window!=='undefined'?window:globalThis);
