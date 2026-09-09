function setupLightbox({modalId, imageId, closeId, triggerSelector, closeAttribute}) {
  const modal = document.querySelector(modalId);
  const image = document.querySelector(imageId);
  const close = document.querySelector(closeId);
  const triggers = [...document.querySelectorAll(triggerSelector)];
  if (!modal || !image || !close || !triggers.length) return;
  let activeTrigger = null;
  const open = trigger => {
    activeTrigger = trigger;
    image.src = trigger.getAttribute('href');
    image.alt = trigger.dataset.lightboxAlt || trigger.querySelector('img')?.alt || '';
    modal.hidden = false;
    close.focus();
  };
  const dismiss = () => {
    modal.hidden = true;
    image.removeAttribute('src');
    if (activeTrigger) activeTrigger.focus();
  };
  triggers.forEach(trigger => trigger.addEventListener('click', event => {
    event.preventDefault();
    open(trigger);
  }));
  close.addEventListener('click', dismiss);
  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.matches(`[${closeAttribute}]`)) dismiss();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.hidden) dismiss();
  });
}

function loadAuroraArtists() {
  const spatialConfig = {
    '7%溶剂': {x:'7%', y:'5%', mobileX:'-8%', mobileY:'25px', scale:'.98', rotation:'-1deg', driftX:'3px', driftY:'-6px', duration:'13s', delay:'-2s'},
    'Hyggelgloo': {x:'30%', y:'2%', mobileX:'8%', mobileY:'290px', scale:'1.04', rotation:'1deg', driftX:'-4px', driftY:'5px', duration:'16s', delay:'-8s'},
    'ICEBEBE艾斯比比': {x:'55%', y:'8%', mobileX:'-4%', mobileY:'555px', scale:'.94', rotation:'-2deg', driftX:'4px', driftY:'7px', duration:'11s', delay:'-4s'},
    'skny': {x:'79%', y:'3%', mobileX:'7%', mobileY:'820px', scale:'1.01', rotation:'2deg', driftX:'-3px', driftY:'-5px', duration:'17s', delay:'-10s'},
    '卡波鼠博士': {x:'17%', y:'23%', mobileX:'-7%', mobileY:'1085px', scale:'1.05', rotation:'1deg', driftX:'3px', driftY:'6px', duration:'14s', delay:'-1s'},
    '叶无殊': {x:'42%', y:'20%', mobileX:'8%', mobileY:'1350px', scale:'.96', rotation:'-1deg', driftX:'-4px', driftY:'-7px', duration:'9s', delay:'-5s'},
    '团子': {x:'67%', y:'25%', mobileX:'-5%', mobileY:'1615px', scale:'1.02', rotation:'2deg', driftX:'4px', driftY:'4px', duration:'15s', delay:'-7s'},
    '小琉': {x:'88%', y:'19%', mobileX:'7%', mobileY:'1880px', scale:'.93', rotation:'-2deg', driftX:'-3px', driftY:'6px', duration:'12s', delay:'-3s'},
    '幽灵': {x:'7%', y:'39%', mobileX:'-8%', mobileY:'2145px', scale:'1.03', rotation:'-1deg', driftX:'4px', driftY:'-4px', duration:'18s', delay:'-12s'},
    '晚风': {x:'33%', y:'36%', mobileX:'8%', mobileY:'2410px', scale:'.97', rotation:'1deg', driftX:'-4px', driftY:'5px', duration:'10s', delay:'-6s'},
    '未来小道士': {x:'58%', y:'42%', mobileX:'-4%', mobileY:'2675px', scale:'1.06', rotation:'-2deg', driftX:'3px', driftY:'-6px', duration:'16s', delay:'-9s'},
    '柏贤也': {x:'82%', y:'37%', mobileX:'7%', mobileY:'2940px', scale:'.95', rotation:'2deg', driftX:'-4px', driftY:'4px', duration:'13s', delay:'-2s'},
    '燃海': {x:'19%', y:'55%', mobileX:'-8%', mobileY:'3205px', scale:'1.01', rotation:'1deg', driftX:'3px', driftY:'7px', duration:'11s', delay:'-8s'},
    '睡觉闪闪': {x:'45%', y:'52%', mobileX:'8%', mobileY:'3470px', scale:'.94', rotation:'-1deg', driftX:'-3px', driftY:'-5px', duration:'17s', delay:'-4s'},
    '第六封信': {x:'70%', y:'57%', mobileX:'-5%', mobileY:'3735px', scale:'1.04', rotation:'2deg', driftX:'4px', driftY:'6px', duration:'14s', delay:'-11s'},
    '萝卜萝卜马': {x:'91%', y:'51%', mobileX:'7%', mobileY:'4000px', scale:'.98', rotation:'-2deg', driftX:'-4px', driftY:'-6px', duration:'9s', delay:'-1s'},
    '骷髅柴人': {x:'9%', y:'73%', mobileX:'-8%', mobileY:'4265px', scale:'1.05', rotation:'1deg', driftX:'3px', driftY:'5px', duration:'15s', delay:'-6s'},
    '魅力棕熊姨': {x:'39%', y:'70%', mobileX:'8%', mobileY:'4530px', scale:'.92', rotation:'-1deg', driftX:'-3px', driftY:'7px', duration:'12s', delay:'-3s'},
    '鸟好鸟坏': {x:'69%', y:'76%', mobileX:'-4%', mobileY:'4795px', scale:'1.03', rotation:'2deg', driftX:'4px', driftY:'-5px', duration:'18s', delay:'-10s'}
  };
  const grid = document.querySelector('#aurora-grid');
  const count = document.querySelector('#artist-count');
  const request = new XMLHttpRequest();
  request.open('GET', '../data/aurora-artists.json?gallery=1', true);
  request.timeout = 10000;
  request.setRequestHeader('Accept', 'application/json');
  request.onload = () => {
    if (request.status < 200 || request.status >= 300) throw new Error(`Aurora data request failed: ${request.status}`);
    const artists = JSON.parse(request.responseText);
    count.textContent = `${artists.length} ARTISTS`;
    grid.innerHTML = artists.map(artist => {
      const imagePath = encodeURI(`../${artist.certificate_path}`).replace(/#/g, '%23');
      const layout = spatialConfig[artist.artist_name];
      return `
      <article class="aurora-certificate" style="--x:${layout.x};--y:${layout.y};--mobile-x:${layout.mobileX};--mobile-y:${layout.mobileY};--duration:${layout.duration};--delay:${layout.delay};--drift-x:${layout.driftX};--drift-y:${layout.driftY};--scale:${layout.scale};--rotation:${layout.rotation}">
        <div class="aurora-certificate-motion">
        <a class="aurora-certificate-link" href="${imagePath}" data-lightbox-alt="${artist.artist_name} 的极光艺术家荣誉证书" aria-label="查看 ${artist.artist_name} 的极光艺术家荣誉证书">
          <img src="${imagePath}" alt="${artist.artist_name} 的极光艺术家荣誉证书" loading="lazy" decoding="async">
        </a>
        <p>${artist.artist_name}</p>
        </div>
      </article>`;
    }).join('');
    setupLightbox({modalId: '#aurora-lightbox', imageId: '#aurora-lightbox-image', closeId: '#aurora-lightbox-close', triggerSelector: '.aurora-certificate-link', closeAttribute: 'data-close-aurora-lightbox'});
  };
  request.onerror = () => { grid.innerHTML = '<p class="load-error">极光艺术家名录暂时无法读取。</p>'; };
  request.ontimeout = () => { grid.innerHTML = '<p class="load-error">极光艺术家名录读取超时。</p>'; };
  request.send();
}

setupLightbox({modalId: '#identity-lightbox', imageId: '#identity-lightbox-image', closeId: '#identity-lightbox-close', triggerSelector: '[data-lightbox="identity"]', closeAttribute: 'data-close-lightbox'});
loadAuroraArtists();
