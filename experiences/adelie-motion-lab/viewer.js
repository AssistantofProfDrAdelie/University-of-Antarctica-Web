const data=window.PENGUIN_DATA;
const canvases=[...document.querySelectorAll('.sample')];
const resolution=document.querySelector('#resolution'),speed=document.querySelector('#speed'),speedText=document.querySelector('#speedText'),toggle=document.querySelector('#toggle');
let playing=true,phase=0,last=0,selected=0;const cache={};
for(const count of [4,6,8])for(const size of ['24','32','64'])cache[`${count}-${size}`]=data.sets[count].sprites[size].map(src=>{const im=new Image();im.src=src;return im});
function draw(t){if(playing&&last)phase+=(t-last)/1000*8/data.cycle.duration_seconds*Number(speed.value);last=t;const size=resolution.value;
 for(const el of canvases){const count=Number(el.dataset.count),idx=Math.floor(phase*count/8)%count,canvas=el.querySelector('canvas'),ctx=canvas.getContext('2d'),im=cache[`${count}-${size}`][idx];ctx.clearRect(0,0,192,192);ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='#3d5a5b';ctx.fillRect(30,168,132,1);if(im.complete&&im.naturalWidth)ctx.drawImage(im,20,7,152,152);el.querySelector('.frame-index').textContent=`${String(idx+1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
 }requestAnimationFrame(draw)}requestAnimationFrame(draw);
toggle.onclick=()=>{playing=!playing;toggle.textContent=playing?'暂停':'播放';toggle.setAttribute('aria-label',playing?'暂停动画':'播放动画')};speed.oninput=()=>speedText.textContent=`${Number(speed.value).toFixed(1)}×`;
resolution.onchange=()=>setPose(selected);
canvases.forEach(el=>el.onclick=()=>{playing=false;toggle.textContent='播放';phase=(Math.floor(phase)%8+8)%8});
const pips=document.querySelector('#posePips');for(let i=0;i<6;i++){let b=document.createElement('button');b.textContent=String(i+1);b.title=`关键姿态 ${i+1}`;b.onclick=()=>setPose(i);pips.append(b)}
function setPose(i){selected=i;document.querySelector('#cropPreview').src=`assets/key_crops/${String(i).padStart(2,'0')}.png`;document.querySelector('#silPreview').src=`assets/key_silhouettes/${String(i).padStart(2,'0')}.png`;document.querySelector('#pixelPreview').src=data.sets[6].sprites[resolution.value][i];[...pips.children].forEach((b,j)=>b.classList.toggle('active',j===i))}setPose(0);
document.querySelector('#frameCount').textContent=data.frames.length;document.querySelector('#period').textContent=`${data.cycle.duration_seconds.toFixed(2)}s`;document.querySelector('#cycleText').textContent=`候选周期 ${data.cycle.duration_seconds.toFixed(2)} 秒 · ${data.sets[6].times[0].toFixed(2)}–${(data.sets[6].times[0]+data.cycle.duration_seconds).toFixed(2)} 秒`;
const axis=data.frames.map(f=>f.axis_deg),wing=data.frames.map(f=>f.wing_extent);document.querySelector('#axis').textContent=`${Math.round(Math.min(...axis))}° 至 ${Math.round(Math.max(...axis))}°`;document.querySelector('#wing').textContent=`${Math.round(Math.min(...wing))}–${Math.round(Math.max(...wing))} px`;
const svg=document.querySelector('#chart');const lo=Math.min(...axis)-3,hi=Math.max(...axis)+3;const pt=(v,i)=>`${(i/(axis.length-1)*880+10).toFixed(1)},${(135-(v-lo)/(hi-lo)*118).toFixed(1)}`;let markup=`<path d="M 10 135 H 890" stroke="#dbe5e2" fill="none"/>`;
for(const index of data.sets[6].indices){const x=index/(axis.length-1)*880+10;markup+=`<path d="M ${x} 5 V 135" stroke="#add7bc" stroke-dasharray="3 4"/>`}
markup+=`<polyline points="${axis.map(pt).join(' ')}" fill="none" stroke="#24695e" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;svg.innerHTML=markup;
