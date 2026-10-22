/* 先有真实选择，再有因果回访；不从未发生的剧情抽结局。 */
(function(root){'use strict';
const common=typeof module!=='undefined'&&module.exports;
const arcs=common?[...require('./fates-a.js'),...require('./fates-b.js'),...require('./fates-c.js')]:[...root.PenguinFatesA,...root.PenguinFatesB,...root.PenguinFatesC];
const events=common?require('./events.js'):root.PenguinEvents;
const life=common?require('./life-events.js'):root.PenguinLifeEvents;
const eventMap=new Map(events.map(e=>[e.id,e])),openingMap=new Map(events.filter(e=>e.age===3&&e.requires?.storyArc).map(e=>[e.requires.storyArc,e]));
const R=(flag,title,warning,label,result,text,epitaph)=>({id:'fate-memory-'+flag,flag,title,warning,release:{label,result},text,epitaph});
const memories=[
R('stoneLoan','本鹅已计入复利','借过鱼的石头把你的名字列进利息，名单正向你的脚下沉。','把本金改写为赠鱼','石头把你的名字移出账目，债务变成了一次普通请客。','你当年没催那条鱼，石头便按沉默计息。它算到最后，发现利息刚好是一只你。你被折成借条夹进石缝，本金继续游泳，你开始每月长出一粒沙。','石头说已结清，岸上少了一位债主。'),
R('stoneBank','抵押物取得本鹅抚养权','你收下的两块抵押石开始夹住地面，说债权人也算资产。','给两块石头各留一个出口','两块石头停止合拢，仍是抵押物，却无权替你决定住址。','你要求的抵押物终于足额了。两块石头把你夹在中间，宣布债主也是债务的一部分。地质部门认定这是合法夹心层，你从企鹅变成了中间那条黑色年轮。','可以申请解押，办理时间为下一次造山运动。'),
R('shadowDinner','影子本人到场，本鹅作为附件','替你赴宴的影子拿来一张座次表，你的名字被写进了附件。','重新确认两个独立座位','你和影子各领到一张座位牌，它仍可赴宴，却不能替你签到。','你曾让影子替你赴宴，它学会了代表你出席所有事情。后来正午点名，影子答了到，阳光便把你当成多余的投影擦掉。它继续吃鱼，偶尔向地面举杯。','本鹅未缺席，只是被代表得过于彻底。'),
R('rename','今日售罄，连本人也不补货','你改过的名字又亮了起来，食堂正试着把你从库存中划掉。','给名字加上仅限菜单的注释','食堂只关闭同名菜品，你仍可以用这个名字出门吃饭。','你把名字改成今日售罄，世界终于认真执行了一次。所有窗口同时将你标成缺货，连你的脚印也开始补货失败。你从人群里撤架，包装上写着上架日期待定。','本人不是限定款，但库存系统坚持清零。'),
R('clerkFamily','全家福里只剩一声啊','被你登记成家属的登记员拿着户口册，正在把全家排成叫声。','补登记：叫声不等于本人','登记员给叫声单列一栏，家属关系保留，身体不再需要改格式。','你让登记员先叫，再把它登记成家属。它学会了这套办法，挨个叫完所有亲戚，终于把你登记为一声啊。户口册合上时，你跟着最后一个音节住进了册页。','家属都到齐了，就是再也拍不出一张清楚的照片。'),
R('chick','学费已退还，付款鹅暂存','你替幼鹅交过的学费被退了回来，退款栏里开始出现你的轮廓。','把付款鹅与学费分开登记','学校只退还鱼，幼鹅仍照常上学，也不必领走一只找零的你。','你用鱼给幼鹅交学费，学校把付款者也当成了货币。退费时它们找不开一只完整的你，于是把你兑成许多声鸣叫，装进幼鹅将来的词典。','它以后会说很多话，其中有一页一直很像你。'),
R('sign','路牌写这边，本鹅成为这边','你写的那句这边应该是开始挪动，箭头尖端正指向你的身体。','注明指路不负责变成道路','路牌仍保留你的字，箭头却只指方向，不再征收身体。','你写下这边应该是，路牌便一直向你学习肯定。后来它找不到这边，决定由签字鹅本人补上。你被拉成一条弯弯的路，所有路过的鹅都说方向很熟。','没有走丢，本鹅现在属于地图图例。'),
R('diploma','名誉博士被地面永久引用','地面翻开你的学位证，把参考文献里的你描成一块贴地脚注。','注明引用不包括占用本人','地面保留你的学位与论文，只把名字排成字，没有把你压进去。','你取得了地面学位，地面决定把你写成自己的代表作。你的脚先变成页码，身体随后被压进一条脚注。后来者走过时都能踩到充分的论据，就是再也叫不起作者。','本文可以引用，作者暂不支持离地。')
];
const hazardRows={
 'hazard-current':[
 ['沿岸绕行，绕成本岸','你选择沿岸绕行，洋流认真沿着你画了一圈，把你围成了新的岸线。大家终于找到了安全的岸，可岸不再能回家。','回程路线还在，你现在负责被抵达。'],
 ['本鹅已被回流无限重播','你等那阵回流，回流却把等待也带回了起点。每次你准备离开，就又回到准备离开以前。岸上的鹅只看见一个不停刷新的出发动作。','不是没出发，是出发被循环播放了。'],
 ['急流捷径通向流体编制','你冲进最急的水道，水流把你误认成新来的支流。你的轮廓被拉成长长一段弯，汇入海里。从此这条捷径有了名字，也再没有出口。','本鹅仍在流动，但无法办理上岸。']],
 'hazard-storm':[
 ['避风处给本鹅装了门轴','你缩在遮蔽处等风，风等得不耐烦，把你留在门缝里当挡风条。暴风过去以后，门终于关严了，你却再也没从安全的地方走出来。','这一处很安全，安全得没有出口。'],
 ['近路折叠，本鹅随路收纳','你选的熟悉近路被风折成便携地图。它收起时顺手把你折进了那一段熟悉，展开时只有一个朝家的小箭头，怎么抖也抖不出企鹅。','路线正确，尺寸发生了变化。'],
 ['穿过风口后只剩开口音','你冲过风口那道亮缝，风以为你在报名加入自己的发音。身体被拆成一串开口音，绕着海岸喊了很久，却再也没有嘴能把你叫回原样。','回声记录到场，本体未能随附。']],
 'hazard-ice-crack':[
 ['退回原路，退成昨日脚印','你沿原路退回，冰面为表歉意不断把时间也往回退。等裂口合上，你已经退成昨天那串脚印。大家循着它找到安全地方，却找不到留下它的你。','已按原路返回，返回到了动词以前。'],
 ['本鹅正式成为稳固边缘','你沿较稳的边缘移动，冰面把这份信任解释成了长期支撑。脚先结成白线，身体慢慢延伸成一小段冰沿，你从通行者变成了通过这里的条件。','边缘稳定了，企鹅暂时无法离岗。'],
 ['跳过裂口，落入一个标点','你一口气冲过裂缝，冰没来得及铺好落点，只好补了一个逗号。你落进这个暂停里，海一句话接一句话地说，始终没人记得把逗号念完。','落点存在，但不属于地理。']],
 'hazard-heat':[
 ['阴凉处把本鹅续成永久阴影','你先去阴凉休息，阴影觉得终于有鹅愿意留下，悄悄把你的轮廓缝进自己。下午来时阴凉搬了家，只剩一块长得像你的深色安静。','休息被批准为永久性岗位。'],
 ['短暂觅食变成限时照片','你靠近凉水，打算短暂觅食后返回。太阳把这段短暂拍成快照，水把照片叠好放进波光。你一直保持着刚要上岸的姿势，时间却不再继续曝光。','预计片刻后返回，片刻未能结束。'],
 ['追上鱼影后被算作一束光','你没停下，追着远处的鱼影游。太阳把不停前进的你认成自己的光线，立即接入照明。你终于追上那一闪，却再也无法把身体从亮处拧下来。','鱼仍在逃跑，本鹅改为负责闪烁。']],
 'hazard-unwritten-door':[
 ['警戒线圈走了负责劝退的鹅','你离远一点围出警戒线，门发现最危险的恰好是画线的那只。它把线轻轻一拉，圈内突然变成你，圈外再也没有可以走回去的方向。','提醒已经留下，提醒者被收进了提醒。'],
 ['半个问号申请接管整只鹅','你伸进去的树枝变成问号，你把它收回时，也收回了一点门里的语法。问号开始追问谁在提问，直到你整只弯成了那个没有答案的弯。','问题仍有效，提问者改为标点。'],
 ['把本鹅写进句子，句子拒绝完稿','你把自己写进那句没写完的话，世界终于有了主语，却没给你安排谓语。你永远停在准备做什么的那一格，下一页只肯印出一个空白姓名栏。','本鹅存在于语法，暂未存在于岸上。']],
 'hazard-fish-shortcut':[
 ['普通晚饭升级为包装上的企鹅','你放弃优惠去找普通晚饭，鱼群为表尊敬，把你印成安全食品的标志。以后每条普通鱼都带着你的脸，真正那只却一直卡在包装封口里。','没有参加限时活动，仍被做成了赠品。'],
 ['守住出口后被出口录用了','你和同伴守住出口，水道觉得终于找到可靠门框，把你竖着装了上去。同伴仍能听见你的回应，却只能在穿过你时说一声借过。','出口没有失守，只是多了一只终身门框。'],
 ['最后一批鱼把本鹅当成截止日期','你独自追上最后一群鱼，鱼把最后一批的牌子交给了你。促销一结束，世界按期把你也下架，留下所有鱼继续经营一家没有截止日期的店。','优惠已经结束，参加者未获自动续期。']]
};
const hazardFates=Object.entries(hazardRows).flatMap(([eventId,rows])=>rows.map(([title,text,epitaph],choice)=>({id:'fate-'+eventId+'-'+choice,eventId,choice,title,text,epitaph})));
function hash(text){let h=2166136261;for(const c of text)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
function source(s,def){
 const opening=def.arc?openingMap.get(def.arc):null;
 for(const h of s.history){const event=opening?.id===h.eventId?opening:!def.arc?eventMap.get(h.eventId):null;if(!event)continue;const index=event.choices.findIndex(c=>c.label===h.choice);if(index<0)continue;if(def.arc?index!==def.choice:!event.choices[index].set?.[def.flag])continue;return{def,record:h,index,key:def.id};}
 return null;
}
function pending(s){const settled=Array.isArray(s.flags.settledFates)?s.flags.settledFates:[];return [...arcs.filter(def=>def.arc===s.flags.storyArc),...memories].map(def=>source(s,def)).filter(x=>x&&!settled.includes(x.key));}
function event(s){
 const age=s.age+1;if([3,8,15,22].includes(age))return null;
 const available=pending(s).filter(x=>age>=x.record.age+2+hash(s.seed+':due:'+x.key)%4&&age>=(Number(s.flags.fateCooldown?.[x.key])||0));
 // Main species thread gets its callback before minor debts once both are due.
 const found=available.sort((a,b)=>Number(!!b.def.arc)-Number(!!a.def.arc)||a.record.age-b.record.age)[0];if(!found)return null;
 const {def,record,key}=found;
 return {id:'echo-'+key,age,lifeEvent:true,fateEvent:true,title:record.title+'，后来呢',text:def.warning,provenance:{age:record.age,title:record.title,choice:record.choice,result:record.result},choices:[
 {label:def.release.label,result:def.release.result,effects:{dignity:4},set:{settledFates:[...(Array.isArray(s.flags.settledFates)?s.flags.settledFates:[]),key]},risk:0,fateAction:'release'},
 {label:'有风险 · 先稳住它，过几年再处理',result:'你把这件事暂时放慢。它仍认得当年的约定，只答应晚些时候再来找你。',effects:{food:-3},set:{fateCooldown:{...(s.flags.fateCooldown||{}),[key]:age+3}},risk:.025,fateId:key,fateAction:'defer'},
 {label:'风险高 · 顺着当年的选择，再往前一步',result:'你没有撤回那次决定，又向它靠近了一点。它也开始认真地把你算进结果。',effects:{penguin:-6,dignity:6},set:{fateCooldown:{...(s.flags.fateCooldown||{}),[key]:age+1}},risk:.28,fateId:key,fateAction:'follow'}
 ]};
}
function causeOf(record,index){return{age:record.age,eventId:record.eventId,title:record.title,choice:record.choice,result:record.result,choiceIndex:index};}
function ending(s,choice){
 const found=choice.fateId?[...arcs,...memories].map(def=>source(s,def)).find(x=>x?.key===choice.fateId):null;
 if(found)return{...found.def,kind:'vanished',causeLabel:'因果脱轨',cause:causeOf(found.record,found.index),fateId:found.key};
 const record=s.history.at(-1),hazard=life.hazards.find(e=>e.id===record.eventId);if(!hazard)return null;
 const index=hazard.choices.findIndex(c=>c.label===record.choice),def=hazardFates.find(e=>e.eventId===record.eventId&&e.choice===index);
 return def?{...def,kind:'vanished',causeLabel:'险情失控',cause:causeOf(record,index),fateId:def.id}:null;
}
function validTerminal(s){const t=s.terminal;if(!t.fateId||t.kind!=='vanished')return false;const def=[...arcs,...memories,...hazardFates].find(e=>e.id===t.fateId);if(!def||t.id!==def.id)return false;const last=s.history.at(-1);if(!def.eventId&&(last.eventId!=='echo-'+def.id||![1,2].includes(last.choiceIndex)||last.choice!==(last.choiceIndex===1?'有风险 · 先稳住它，过几年再处理':'风险高 · 顺着当年的选择，再往前一步')))return false;const c=t.cause,h=s.history.find(h=>h.age===c?.age&&h.eventId===c?.eventId);if(!h||h.choice!==c.choice||h.result!==c.result||h.title!==c.title)return false;const actual=def.eventId?life.hazards.find(e=>e.id===h.eventId):eventMap.get(h.eventId);if(!actual||actual.choices[c.choiceIndex]?.label!==h.choice)return false;if(def.arc)return source(s,def)?.record.age===h.age;if(def.flag)return !!actual.choices[c.choiceIndex].set?.[def.flag];return def.eventId===h.eventId&&def.choice===c.choiceIndex;}
const api={arcs,memories,hazardFates,source,pending,event,ending,validTerminal};
if(common)module.exports=api;else root.PenguinFates=api;
})(typeof window!=='undefined'?window:globalThis);
