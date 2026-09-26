(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let albums = [], year = 'all', selected = null, position = 0, lastTrigger = null, heroPosition = 0, heroTimer = null;
  const dateText = album => album.datePending ? '时间待确认' : album.date ? album.date.slice(0,7).replace('-', '.') : '时间待确认';
  const mediaText = album => `${album.photos.length} 张照片${album.videos?.length ? ` · ${album.videos.length} 段视频` : ''}`;
  const node = (tag, className, text) => { const el = document.createElement(tag); if(className) el.className = className; if(text !== undefined) el.textContent = text; return el; };
  const image = (photo, alt, large = false) => {const img = node('img'); img.src = large ? photo.src : photo.thumb; img.alt = alt; img.loading = large ? 'eager' : 'lazy'; img.decoding = 'async'; return img;};
  function renderAlbums() {
    const filtered = albums.filter(a => year === 'all' || a.date?.startsWith(year)).sort((a,b) => $('sort').value === 'asc' ? (a.date || '9999').localeCompare(b.date || '9999') : (b.date || '').localeCompare(a.date || ''));
    $('album-count').textContent = `${filtered.length} 本相册 · ${filtered.reduce((n,a) => n+a.photos.length,0)} 张照片 · ${filtered.reduce((n,a) => n+(a.videos?.length || 0),0)} 段视频`;
    $('album-grid').replaceChildren(); $('separate-grid').replaceChildren();
    filtered.forEach(album => {
      const card = node('button', 'album-card'); card.type = 'button';
      card.setAttribute('aria-label', `打开${album.title}相册，${mediaText(album)}`);
      const cover = node('div', 'album-cover');
      if(album.photos.length) cover.append(image(album.photos[0], album.title));
      else {const empty = node('div','empty-cover'); empty.append(node('span','','○'),node('small','','等待下一张回忆')); cover.append(empty);}
      card.append(cover,node('p','album-date',dateText(album)),node('h3','',album.title),node('p','album-location',album.location));
      card.addEventListener('click',()=>{lastTrigger=card; location.hash=album.id;});
      $(album.category && album.category !== '与鹅同行' ? 'separate-grid' : 'album-grid').append(card);
    });
    $('separate-albums').hidden = !$('separate-grid').children.length;
  }
  function route() {
    selected = albums.find(a => `#${a.id}` === location.hash) || null;
    $('albums').hidden = !!selected; $('album-detail').hidden = !selected;
    if(!selected) return;
    $('detail-title').textContent=selected.title; $('detail-meta').textContent=dateText(selected);
    $('detail-location').textContent=selected.location; $('detail-count').textContent=mediaText(selected);
    $('photo-grid').replaceChildren(...selected.photos.map((photo,i)=>{
      const button=node('button','photo-tile'); button.setAttribute('aria-label',`查看${selected.title}第${i+1}张照片`);
      button.append(image(photo,`${selected.title} · 合影 ${i+1}`),node('span','',`${String(i+1).padStart(3,'0')} / ${String(selected.photos.length).padStart(3,'0')} · ${photo.id.slice(0,6)}`));
      button.addEventListener('click',()=>{position=i;showPhoto();$('viewer').showModal();}); return button;
    }));
    (selected.videos || []).forEach((video,i)=>{
      const tile=node('div','video-tile');
      const player=node('video'); player.controls=true; player.preload='none'; player.playsInline=true; player.poster=video.poster;
      const source=node('source'); source.src=video.src; source.type='video/mp4'; player.append(source);
      player.setAttribute('aria-label',`${selected.title} · 视频 ${i+1}`);
      tile.append(player,node('span','',`视频 ${String(i+1).padStart(2,'0')} / ${String(selected.videos.length).padStart(2,'0')}`));
      $('photo-grid').append(tile);
    });
    if(!selected.photos.length && !selected.videos?.length) $('photo-grid').append(node('p','empty-message','这场相聚已经记下，合影正在整理中。'));
    $('detail-title').focus({preventScroll:true}); $('album-detail').scrollIntoView({behavior:'instant'});
  }
  function showPhoto(){const photo=selected.photos[position]; $('viewer-image').src=photo.src; $('viewer-image').alt=`${selected.title} · 第 ${position+1} 张合影`; $('viewer-title').textContent=selected.title; $('viewer-count').textContent=`${position+1} / ${selected.photos.length} · ${dateText(selected)}`; $('previous-photo').disabled=position===0; $('next-photo').disabled=position===selected.photos.length-1;}
  function step(direction){if(!selected)return; const next=position+direction;if(next>=0&&next<selected.photos.length){position=next;showPhoto();}}
  function renderHero() {
    const preferred = ['event-09','event-11','event-12','event-07','event-16'];
    const slides = preferred.map(id=>albums.find(a=>a.id===id)).filter(a=>a?.photos.length);
    if(!slides.length) return;
    const stage=node('div','hero-stage');
    const caption=node('figcaption','hero-caption');
    const captionText=node('span');
    const dots=node('div','hero-dots'); dots.setAttribute('role','group'); dots.setAttribute('aria-label','选择精选照片');
    const pictures=slides.map((album,index)=>{const img=image(album.photos[0],album.title,index===0);img.className='hero-slide';if(index===0)img.classList.add('is-active');stage.append(img);return img;});
    const buttons=slides.map((album,index)=>{const button=node('button','hero-dot');button.type='button';button.setAttribute('aria-label',`显示${album.title}`);button.addEventListener('click',()=>show(index));dots.append(button);return button;});
    function show(index){heroPosition=index;pictures.forEach((img,i)=>img.classList.toggle('is-active',i===index));buttons.forEach((button,i)=>button.setAttribute('aria-current',String(i===index)));captionText.textContent=slides[index].title;}
    function stop(){if(heroTimer){clearInterval(heroTimer);heroTimer=null;}}
    function start(){stop();if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.hidden)heroTimer=setInterval(()=>show((heroPosition+1)%slides.length),4200);}
    caption.append(captionText,dots);$('hero-photo').replaceChildren(stage,caption);show(0);start();
    $('hero-photo').addEventListener('mouseenter',stop);$('hero-photo').addEventListener('mouseleave',start);$('hero-photo').addEventListener('focusin',stop);$('hero-photo').addEventListener('focusout',start);
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  }
  document.querySelectorAll('[data-year]').forEach(button=>button.addEventListener('click',()=>{year=button.dataset.year;document.querySelectorAll('[data-year]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderAlbums();}));
  $('sort').addEventListener('change',renderAlbums);
  $('back-albums').addEventListener('click',()=>{history.replaceState(null,'','#albums');route();$('albums').scrollIntoView({behavior:'instant'});lastTrigger?.focus({preventScroll:true});});
  $('close-viewer').addEventListener('click',()=>$('viewer').close());
  $('previous-photo').addEventListener('click',()=>step(-1));$('next-photo').addEventListener('click',()=>step(1));
  $('viewer').addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();step(-1);}if(event.key==='ArrowRight'){event.preventDefault();step(1);}});
  window.addEventListener('hashchange',route);
  fetch('albums.json?v=20260926-1').then(response=>{if(!response.ok)throw Error(response.status);return response.json();}).then(data=>{
    albums=data;renderAlbums();
    renderHero();
    route();
  }).catch(()=>{$('load-error').hidden=false;$('hero-photo').replaceChildren(node('p','photo-placeholder','相聚的故事，稍后再来翻阅。'));});
})();
