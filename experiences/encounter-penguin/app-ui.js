const $=selector=>document.querySelector(selector);
const fileInput=$("#fileInput"),dropZone=$("#dropZone"),intro=$("#intro"),encounter=$("#encounter");
const source=$("#sourceCanvas"),visitor=$("#visitorCanvas"),srcCtx=source.getContext("2d"),visitorCtx=visitor.getContext("2d");
const photoFrame=$("#photoFrame"),saveButton=$("#saveButton");

// Approved assets and the presentations that suit their supplied poses form one
// vocabulary. Future assets can add only their compatible directions here.
const encounterVocabulary=[{
  id:"professor-adelie-owner-approved",
  src:"assets/professor-adelie-owner-approved.png",
  crop:{x:114,y:1035,width:1866,height:2485},
  regions:[
    {weight:55,center:0,spread:72},
    {weight:18,center:90,spread:42},
    {weight:9,center:180,spread:58},
    {weight:18,center:270,spread:42},
  ],
}];

// Variety is deliberately curated rather than assembled from independent
// random effects. Most visits remain the plain encounter; unusual beats stay
// legible because they arrive as rare complete gestures.
const choreographyVocabulary=[
  {id:"classic",weight:66,reveal:.84,exit:"retreat"},
  {id:"head-peek",weight:12,reveal:.46,exit:"retreat"},
  {id:"quiet-fade",weight:8,reveal:.80,exit:"fade"},
  {id:"side-slip",weight:7,reveal:.78,exit:"slip"},
  {id:"double-take",weight:5,reveal:.82,exit:"retreat",doubleTake:true},
  {id:"two-heads",weight:1.5,reveal:.42,exit:"retreat",pair:"offset"},
  {id:"mirror-heads",weight:.5,reveal:.42,exit:"retreat",pair:"mirror"},
];

const absenceModel={minimum:1000,maximum:1800};
const approvedVisitors=encounterVocabulary.map(entry=>({...entry,image:new Image(),ready:false}));
let loaded=false,running=false,firstEncounterStarted=false,animationFrame=0,encounterTimer=0,fileStem="penguin-encounter",savePrepared=false,saveWindowOpen=false,saveUrl="",encounterGeneration=0,previousAngle=null;

approvedVisitors.forEach(entry=>{
  entry.image.onload=()=>{entry.ready=true;scheduleFirstEncounter(encounterGeneration);};
  entry.image.src=entry.src;
});

const prefersReducedMotion=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ease=value=>value<.5?4*value*value*value:1-Math.pow(-2*value+2,3)/2;
const highQualitySmoothing=context=>{context.imageSmoothingEnabled=true;context.imageSmoothingQuality="high";};

function weightedChoice(entries){
  const total=entries.reduce((sum,entry)=>sum+entry.weight,0);
  let cursor=Math.random()*total;
  for(const entry of entries){cursor-=entry.weight;if(cursor<0)return entry;}
  return entries[entries.length-1];
}

function encounterCandidates(){
  return approvedVisitors.filter(entry=>entry.ready).flatMap(entry=>
    entry.regions.map(region=>({asset:entry,region,weight:region.weight})),
  );
}

function chooseEncounter(){
  let choice,angle,difference=180;
  for(let attempt=0;attempt<12;attempt+=1){
    choice=weightedChoice(encounterCandidates());
    const variation=(Math.random()+Math.random()-1)*choice.region.spread;
    angle=(choice.region.center+variation+360)%360;
    if(previousAngle===null)break;
    const rawDifference=Math.abs(angle-previousAngle);difference=Math.min(rawDifference,360-rawDifference);
    if(difference>=70)break;
  }
  if(previousAngle!==null&&difference<70)angle=(previousAngle+110+Math.random()*140)%360;
  const choreography=weightedChoice(choreographyVocabulary);
  const angles=[angle];
  if(choreography.pair==="mirror")angles.push((angle+180)%360);
  if(choreography.pair==="offset")angles.push((angle+145+Math.random()*70)%360);
  previousAngle=angle;return{asset:choice.asset,angle,angles,choreography};
}

function chooseAbsence(){
  const humanScaleVariation=(Math.random()+Math.random())/2;
  return Math.round(absenceModel.minimum+humanScaleVariation*(absenceModel.maximum-absenceModel.minimum));
}

function loadFile(file){
  if(!file||!file.type.startsWith("image/"))return;
  encounterGeneration+=1;clearTimeout(encounterTimer);cancelAnimationFrame(animationFrame);loaded=false;running=false;firstEncounterStarted=false;previousAngle=null;saveWindowOpen=false;saveButton.hidden=true;visitorCtx.clearRect(0,0,visitor.width,visitor.height);
  const generation=encounterGeneration,image=new Image(),url=URL.createObjectURL(file);
  image.onload=()=>{
    if(generation!==encounterGeneration){URL.revokeObjectURL(url);return;}
    const max=1800,scale=Math.min(1,max/Math.max(image.width,image.height));
    source.width=visitor.width=Math.round(image.width*scale);source.height=visitor.height=Math.round(image.height*scale);
    highQualitySmoothing(srcCtx);highQualitySmoothing(visitorCtx);photoFrame.style.maxWidth=`${source.width}px`;photoFrame.style.setProperty("--photo-aspect",String(source.width/source.height));
    srcCtx.drawImage(image,0,0,source.width,source.height);visitorCtx.clearRect(0,0,visitor.width,visitor.height);
    URL.revokeObjectURL(url);loaded=true;fileStem=(file.name.replace(/\.[^.]+$/,"" )||"photograph")+"-professor-adelie";saveButton.download=`${fileStem}.png`;
    intro.hidden=true;encounter.hidden=false;encounter.scrollIntoView({behavior:"smooth",block:"start"});scheduleFirstEncounter(generation);
  };
  image.onerror=()=>{URL.revokeObjectURL(url);alert("That photograph could not be opened. Please try another.");};image.src=url;
}

function visitorReady(){return approvedVisitors.some(entry=>entry.ready);}

function scheduleFirstEncounter(generation){
  if(!loaded||!visitorReady()||running||firstEncounterStarted||generation!==encounterGeneration)return;
  clearTimeout(encounterTimer);encounterTimer=setTimeout(()=>animateEncounter(generation),250);
}

function scheduleReturn(generation){
  if(!loaded||generation!==encounterGeneration)return;
  clearTimeout(encounterTimer);const absence=chooseAbsence();visitor.dataset.nextAbsence=String(absence);
  encounterTimer=setTimeout(()=>{
    if(document.hidden){scheduleReturn(generation);return;}
    animateEncounter(generation);
  },absence);
}

// The supplied photograph is naturally cut at its right and lower bounds. Keep
// those source edges beyond the visitor's photograph rather than disguising
// them with blur or transparency. The samples describe only the two cut edges;
// all other transparent contours remain untouched.
function cutEdgesOutside(centerX,centerY,radians,drawWidth,drawHeight,margin=2){
  const cosine=Math.cos(radians),sine=Math.sin(radians);
  const outside=(localX,localY)=>{
    const x=centerX+localX*cosine-localY*sine,y=centerY+localX*sine+localY*cosine;
    return x<=-margin||x>=source.width+margin||y<=-margin||y>=source.height+margin;
  };
  for(let step=0;step<=12;step+=1){
    const localY=drawHeight*(.266+(.5-.266)*step/12);
    if(!outside(drawWidth/2,localY))return false;
  }
  for(let step=0;step<=18;step+=1){
    const localX=drawWidth*(-.313+(.5+.313)*step/18);
    if(!outside(localX,drawHeight/2))return false;
  }
  return true;
}

function safeVisibleOffset(boundaryX,boundaryY,inwardX,inwardY,radians,drawWidth,drawHeight,extent,desiredOffset){
  const safe=offset=>cutEdgesOutside(boundaryX+inwardX*offset,boundaryY+inwardY*offset,radians,drawWidth,drawHeight);
  if(safe(desiredOffset))return desiredOffset;
  let low=-extent*1.08,high=desiredOffset;
  for(let iteration=0;iteration<18;iteration+=1){
    const middle=(low+high)/2;
    if(safe(middle))low=middle;else high=middle;
  }
  return low;
}

function placement(encounterChoice,angle,progress,tangentOffset=0){
  const {asset,choreography}=encounterChoice,radians=angle*Math.PI/180,ratio=asset.crop.width/asset.crop.height;
  const cosine=Math.abs(Math.cos(radians)),sine=Math.abs(Math.sin(radians)),verticalness=cosine;
  let drawHeight=source.height*(.50+.10*verticalness),drawWidth=drawHeight*ratio;
  let footprintWidth=drawWidth*cosine+drawHeight*sine,footprintHeight=drawWidth*sine+drawHeight*cosine;
  const maxFootprintWidth=source.width*.45;
  if(footprintWidth>maxFootprintWidth){const scale=maxFootprintWidth/footprintWidth;drawWidth*=scale;drawHeight*=scale;footprintWidth*=scale;footprintHeight*=scale;}
  const inwardX=Math.sin(radians),inwardY=-Math.cos(radians),outwardX=-inwardX,outwardY=-inwardY;
  const halfSourceWidth=source.width/2,halfSourceHeight=source.height/2;
  const xDistance=Math.abs(outwardX)<.0001?Infinity:halfSourceWidth/Math.abs(outwardX);
  const yDistance=Math.abs(outwardY)<.0001?Infinity:halfSourceHeight/Math.abs(outwardY);
  const boundaryDistance=Math.min(xDistance,yDistance);
  const boundaryX=halfSourceWidth+outwardX*boundaryDistance,boundaryY=halfSourceHeight+outwardY*boundaryDistance;
  const extent=Math.abs(outwardX)*footprintWidth/2+Math.abs(outwardY)*footprintHeight/2;
  const revealRatio=choreography.reveal+.02*verticalness;
  const hiddenCenterX=boundaryX+outwardX*extent*1.08,hiddenCenterY=boundaryY+outwardY*extent*1.08;
  const desiredOffset=extent*(revealRatio*2-1);
  const tangentX=Math.cos(radians),tangentY=Math.sin(radians);
  const shiftedBoundaryX=boundaryX+tangentX*tangentOffset,shiftedBoundaryY=boundaryY+tangentY*tangentOffset;
  const visibleOffset=safeVisibleOffset(shiftedBoundaryX,shiftedBoundaryY,inwardX,inwardY,radians,drawWidth,drawHeight,extent,desiredOffset);
  const visibleCenterX=shiftedBoundaryX+inwardX*visibleOffset,visibleCenterY=shiftedBoundaryY+inwardY*visibleOffset;
  const centerX=hiddenCenterX+(visibleCenterX-hiddenCenterX)*progress,centerY=hiddenCenterY+(visibleCenterY-hiddenCenterY)*progress;
  return{x:centerX-footprintWidth/2,y:centerY-footprintHeight/2,drawWidth,drawHeight,footprintWidth,footprintHeight};
}

function drawProfessor(encounterChoice,progress,opacity=1,tangentOffset=0){
  visitorCtx.clearRect(0,0,visitor.width,visitor.height);if(progress<=0)return;
  const {asset,angles}=encounterChoice;
  angles.forEach((angle,index)=>{
    const direction=index%2===0?1:-1;
    let{x,y,drawWidth,drawHeight,footprintWidth,footprintHeight}=placement(encounterChoice,angle,progress,tangentOffset*direction);
    if(progress===1){x=Math.round(x);y=Math.round(y);drawWidth=Math.round(drawWidth);drawHeight=Math.round(drawHeight);footprintWidth=Math.round(footprintWidth);footprintHeight=Math.round(footprintHeight);}
    const lift=Math.sin(progress*Math.PI)*source.height*.006,lean=(1-progress)*-.012;
    visitorCtx.save();visitorCtx.globalAlpha=opacity;visitorCtx.translate(x+footprintWidth/2,y+footprintHeight/2+lift);visitorCtx.rotate(lean+angle*Math.PI/180);
    visitorCtx.drawImage(asset.image,asset.crop.x,asset.crop.y,asset.crop.width,asset.crop.height,-drawWidth/2,-drawHeight/2,drawWidth,drawHeight);
    visitorCtx.restore();
  });
}

function encounterMotion(elapsed,encounterChoice,reduced){
  const choreography=encounterChoice.choreography;
  if(choreography.doubleTake){
    const durations=reduced?[350,300,500,300,300,350,2200,350]:[1000,700,850,650,450,1000,3600,1200];
    let cursor=0;
    const phase=duration=>{const start=cursor;cursor+=duration;return{start,end:cursor,duration};};
    const pause=phase(durations[0]),firstEnter=phase(durations[1]),firstHold=phase(durations[2]),firstLeave=phase(durations[3]),gap=phase(durations[4]),secondEnter=phase(durations[5]),secondHold=phase(durations[6]),secondLeave=phase(durations[7]);
    if(elapsed<pause.end)return{progress:0,opacity:1,tangent:0,visiting:false,done:false};
    if(elapsed<firstEnter.end)return{progress:ease((elapsed-firstEnter.start)/firstEnter.duration)*.60,opacity:1,tangent:0,visiting:false,done:false};
    if(elapsed<firstHold.end)return{progress:.60,opacity:1,tangent:0,visiting:false,done:false};
    if(elapsed<firstLeave.end)return{progress:.60*(1-ease((elapsed-firstLeave.start)/firstLeave.duration)),opacity:1,tangent:0,visiting:false,done:false};
    if(elapsed<gap.end)return{progress:0,opacity:1,tangent:0,visiting:false,done:false};
    if(elapsed<secondEnter.end)return{progress:ease((elapsed-secondEnter.start)/secondEnter.duration),opacity:1,tangent:0,visiting:false,done:false};
    if(elapsed<secondHold.end)return{progress:1,opacity:1,tangent:0,visiting:true,done:false};
    if(elapsed<secondLeave.end)return{progress:1-ease((elapsed-secondLeave.start)/secondLeave.duration),opacity:1,tangent:0,visiting:false,done:false};
    return{progress:0,opacity:0,tangent:0,visiting:false,done:true};
  }
  const pause=reduced?500:1000,enter=reduced?350:1600,hold=reduced?3400:5000,leave=reduced?350:1600;
  if(elapsed<pause)return{progress:0,opacity:1,tangent:0,visiting:false,done:false};
  if(elapsed<pause+enter)return{progress:ease((elapsed-pause)/enter),opacity:1,tangent:0,visiting:false,done:false};
  if(elapsed<pause+enter+hold)return{progress:1,opacity:1,tangent:0,visiting:true,done:false};
  if(elapsed<pause+enter+hold+leave){
    const departure=ease((elapsed-pause-enter-hold)/leave);
    if(choreography.exit==="fade")return{progress:1,opacity:1-departure,tangent:0,visiting:false,done:false};
    if(choreography.exit==="slip")return{progress:1-departure*.25,opacity:1-departure,tangent:departure*source.width*.24,visiting:false,done:false};
    return{progress:1-departure,opacity:1,tangent:0,visiting:false,done:false};
  }
  return{progress:0,opacity:0,tangent:0,visiting:false,done:true};
}

function animateEncounter(generation){
  if(!loaded||!visitorReady()||running||generation!==encounterGeneration)return;
  running=true;firstEncounterStarted=true;savePrepared=false;saveWindowOpen=false;saveButton.hidden=true;
  const reduced=prefersReducedMotion();
  const encounterChoice=chooseEncounter(),started=performance.now();
  visitor.dataset.entryAngle=encounterChoice.angle.toFixed(1);visitor.dataset.encounterAsset=encounterChoice.asset.id;visitor.dataset.choreography=encounterChoice.choreography.id;
  function frame(now){
    if(generation!==encounterGeneration){running=false;return;}
    const motion=encounterMotion(now-started,encounterChoice,reduced);
    drawProfessor(encounterChoice,motion.progress,motion.opacity,motion.tangent);
    const visiting=motion.visiting;
    saveWindowOpen=visiting;
    if(visiting&&!savePrepared){savePrepared=true;recordEncounter();prepareSave(generation);}
    if(!visiting)saveButton.hidden=true;
    if(!motion.done)animationFrame=requestAnimationFrame(frame);
    else{drawProfessor(encounterChoice,0);saveWindowOpen=false;saveButton.hidden=true;running=false;scheduleReturn(generation);}
  }
  animationFrame=requestAnimationFrame(frame);
}

function prepareSave(generation){
  const output=document.createElement("canvas"),ctx=output.getContext("2d");output.width=source.width;output.height=source.height;ctx.drawImage(source,0,0);ctx.drawImage(visitor,0,0);
  output.toBlob(blob=>{if(!blob||!running||!saveWindowOpen||generation!==encounterGeneration)return;if(saveUrl)URL.revokeObjectURL(saveUrl);saveUrl=URL.createObjectURL(blob);saveButton.href=saveUrl;saveButton.hidden=false;},"image/png");
}

fileInput.addEventListener("change",event=>loadFile(event.target.files[0]));
["dragenter","dragover"].forEach(type=>dropZone.addEventListener(type,event=>{event.preventDefault();dropZone.classList.add("dragging");}));
["dragleave","drop"].forEach(type=>dropZone.addEventListener(type,event=>{event.preventDefault();dropZone.classList.remove("dragging");}));
dropZone.addEventListener("drop",event=>loadFile(event.dataTransfer.files[0]));
$("#changeButton").addEventListener("click",()=>{fileInput.value="";fileInput.click();});

const identityLightbox=$("#identityLightbox"),identityLightboxImage=$("#identityLightboxImage"),identityLightboxClose=$("#identityLightboxClose");
let identityLightboxReturnFocus=null;
function closeIdentityLightbox(){
  identityLightbox.hidden=true;identityLightboxImage.src="";
  if(identityLightboxReturnFocus)identityLightboxReturnFocus.focus();
}
document.querySelectorAll('[data-lightbox="identity"]').forEach(trigger=>trigger.addEventListener("click",event=>{
  event.preventDefault();identityLightboxReturnFocus=trigger;identityLightboxImage.src=trigger.href;identityLightboxImage.alt=trigger.dataset.lightboxAlt||"";identityLightbox.hidden=false;identityLightboxClose.focus();
}));
identityLightbox.addEventListener("click",event=>{if(event.target.closest("[data-close-lightbox]"))closeIdentityLightbox();});
identityLightboxClose.addEventListener("click",closeIdentityLightbox);
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!identityLightbox.hidden)closeIdentityLightbox();});

const penguinCountValue=$("#penguinCountValue"),penguinCountStorageKey="encounter-penguin-count-v1";
let penguinEncounterCount=0;
try{penguinEncounterCount=Math.max(0,parseInt(localStorage.getItem(penguinCountStorageKey)||"0",10)||0);}catch(error){}
penguinCountValue.textContent=penguinEncounterCount.toLocaleString("en-US");
function recordEncounter(){
  penguinEncounterCount+=1;penguinCountValue.textContent=penguinEncounterCount.toLocaleString("en-US");
  try{localStorage.setItem(penguinCountStorageKey,String(penguinEncounterCount));}catch(error){}
}
