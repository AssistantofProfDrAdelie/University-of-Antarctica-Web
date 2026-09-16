const $=selector=>document.querySelector(selector);
const fileInput=$("#fileInput"),dropZone=$("#dropZone"),intro=$("#intro"),encounter=$("#encounter");
const source=$("#sourceCanvas"),visitor=$("#visitorCanvas"),srcCtx=source.getContext("2d"),visitorCtx=visitor.getContext("2d");
const photoFrame=$("#photoFrame"),saveButton=$("#saveButton");
const professor=new Image();
const professorCrop={x:114,y:1035,width:1866,height:2485};
const professorPresentation={
  right:{heightRatio:.60,maxWidthRatio:.42,revealRatio:.84},
  left:{heightRatio:.60,maxWidthRatio:.42,revealRatio:.84},
  bottom:{heightRatio:.62,maxWidthRatio:.38,revealRatio:.88},
};
const encounterDirections=["right","left","bottom"];
professor.src="assets/professor-adelie-owner-approved.png";
let loaded=false,professorReady=false,running=false,animationFrame=0,encounterTimer=0,fileStem="penguin-encounter",savePrepared=false,saveUrl="",encounterCount=0;
const directionOffset=Math.floor(Math.random()*encounterDirections.length);
professor.onload=()=>{professorReady=true;scheduleEncounter();};

const prefersReducedMotion=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ease=value=>value<.5?4*value*value*value:1-Math.pow(-2*value+2,3)/2;
const highQualitySmoothing=context=>{context.imageSmoothingEnabled=true;context.imageSmoothingQuality="high";};

function loadFile(file){
  if(!file||!file.type.startsWith("image/"))return;
  clearTimeout(encounterTimer);cancelAnimationFrame(animationFrame);loaded=false;running=false;saveButton.hidden=true;visitorCtx.clearRect(0,0,visitor.width,visitor.height);
  const image=new Image(),url=URL.createObjectURL(file);
  image.onload=()=>{
    const max=1800,scale=Math.min(1,max/Math.max(image.width,image.height));
    source.width=visitor.width=Math.round(image.width*scale);source.height=visitor.height=Math.round(image.height*scale);
    highQualitySmoothing(srcCtx);highQualitySmoothing(visitorCtx);photoFrame.style.maxWidth=`${source.width}px`;
    srcCtx.drawImage(image,0,0,source.width,source.height);visitorCtx.clearRect(0,0,visitor.width,visitor.height);
    URL.revokeObjectURL(url);loaded=true;fileStem=(file.name.replace(/\.[^.]+$/,"" )||"photograph")+"-professor-adelie";saveButton.download=`${fileStem}.png`;
    intro.hidden=true;encounter.hidden=false;encounter.scrollIntoView({behavior:"smooth",block:"start"});scheduleEncounter();
  };
  image.onerror=()=>{URL.revokeObjectURL(url);alert("That photograph could not be opened. Please try another.");};image.src=url;
}

function scheduleEncounter(){
  clearTimeout(encounterTimer);if(!loaded||!professorReady)return;
  encounterTimer=setTimeout(animateEncounter,250);
}

function placement(direction,progress){
  const presentation=professorPresentation[direction],ratio=professorCrop.width/professorCrop.height,maxWidth=source.width*presentation.maxWidthRatio;
  let height=source.height*presentation.heightRatio,width=height*ratio;
  if(width>maxWidth){width=maxWidth;height=width/ratio;}
  if(direction==="bottom"){
    const x=Math.round((source.width-width)/2),hidden=source.height+height*.035,visible=source.height-height*presentation.revealRatio;
    return{x,y:hidden+(visible-hidden)*progress,width,height};
  }
  const y=Math.max(source.height*.18,source.height-height*.97);
  const hidden=direction==="right"?source.width+width*.035:-width*1.035;
  const visible=direction==="right"?source.width-width*presentation.revealRatio:-width*(1-presentation.revealRatio);
  return{x:hidden+(visible-hidden)*progress,y,width,height};
}

function drawProfessor(direction,progress){
  visitorCtx.clearRect(0,0,visitor.width,visitor.height);if(progress<=0)return;
  let{x,y,width,height}=placement(direction,progress);
  if(progress===1){x=Math.round(x);y=Math.round(y);width=Math.round(width);height=Math.round(height);}
  const lift=Math.sin(progress*Math.PI)*source.height*.006,lean=(1-progress)*(direction==="left"?.012:-.012);visitorCtx.save();
  visitorCtx.translate(x+width/2,y+height+lift);visitorCtx.rotate(lean);
  if(direction==="left")visitorCtx.scale(-1,1);
  visitorCtx.drawImage(professor,professorCrop.x,professorCrop.y,professorCrop.width,professorCrop.height,-width/2,-height,width,height);
  visitorCtx.restore();
}

function animateEncounter(){
  if(!loaded||!professorReady||running)return;
  running=true;savePrepared=false;saveButton.hidden=true;
  const reduced=prefersReducedMotion(),pause=reduced?500:1000,enter=reduced?350:1600,hold=reduced?3400:5000,leave=reduced?350:1600,total=pause+enter+hold+leave;
  const direction=encounterDirections[(directionOffset+encounterCount++)%encounterDirections.length],started=performance.now();visitor.dataset.entryDirection=direction;
  function frame(now){
    const elapsed=now-started;let progress=0;
    if(elapsed<pause)progress=0;
    else if(elapsed<pause+enter)progress=ease((elapsed-pause)/enter);
    else if(elapsed<pause+enter+hold)progress=1;
    else if(elapsed<total)progress=1-ease((elapsed-pause-enter-hold)/leave);
    drawProfessor(direction,progress);
    const visiting=elapsed>=pause+enter&&elapsed<pause+enter+hold;
    if(visiting&&!savePrepared){savePrepared=true;prepareSave();}
    if(!visiting&&elapsed>=pause+enter+hold)saveButton.hidden=true;
    if(elapsed<total)animationFrame=requestAnimationFrame(frame);else{drawProfessor(direction,0);saveButton.hidden=true;running=false;}
  }
  animationFrame=requestAnimationFrame(frame);
}

function prepareSave(){
  const output=document.createElement("canvas"),ctx=output.getContext("2d");output.width=source.width;output.height=source.height;ctx.drawImage(source,0,0);ctx.drawImage(visitor,0,0);
  output.toBlob(blob=>{if(!blob||!running)return;if(saveUrl)URL.revokeObjectURL(saveUrl);saveUrl=URL.createObjectURL(blob);saveButton.href=saveUrl;saveButton.hidden=false;},"image/png");
}

fileInput.addEventListener("change",event=>loadFile(event.target.files[0]));
["dragenter","dragover"].forEach(type=>dropZone.addEventListener(type,event=>{event.preventDefault();dropZone.classList.add("dragging");}));
["dragleave","drop"].forEach(type=>dropZone.addEventListener(type,event=>{event.preventDefault();dropZone.classList.remove("dragging");}));
dropZone.addEventListener("drop",event=>loadFile(event.dataTransfer.files[0]));
$("#changeButton").addEventListener("click",()=>{fileInput.value="";fileInput.click();});
