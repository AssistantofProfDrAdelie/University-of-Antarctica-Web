const auroraArtistOrder = [
  'Amon', '鸟好鸟坏', '骷髅柴人', 'skny', '第六封信', '柏闲也', '叶无殊',
  'Mariella', '卡波鼠博士', '燃海', 'Hyggelgloo', '萝卜萝卜马', '晚风',
  '团子', '未来小道士', '小琉', '魅力棕熊姨', '幽灵', '7%溶剂',
  'ICEBEBE艾斯比比', '睡觉闪闪'
];

function setupLightbox({modalId, imageId, closeId, triggerSelector, closeAttribute}) {
  const modal = document.querySelector(modalId);
  const image = document.querySelector(imageId);
  const close = document.querySelector(closeId);
  if (!modal || !image || !close) return;
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
    activeTrigger?.focus();
  };
  document.addEventListener('click', event => {
    const trigger = event.target.closest(triggerSelector);
    if (trigger) {
      event.preventDefault();
      open(trigger);
    }
  });
  close.addEventListener('click', dismiss);
  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.matches(`[${closeAttribute}]`)) dismiss();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.hidden) dismiss();
  });
}

function artworkNode(work, album, assetBase = './') {
  const figure = document.createElement('figure');
  figure.className = 'artwork';
  const link = document.createElement('a');
  link.className = 'artwork-link';
  link.href = `${assetBase}${work.full}`;
  link.setAttribute('data-aurora-lightbox', '');
  link.dataset.lightboxAlt = `${work.artist}的${album.artist === '团子' ? '照片' : '作品'}`;
  const img = document.createElement('img');
  img.src = `${assetBase}${work.thumb}`;
  img.alt = link.dataset.lightboxAlt;
  img.loading = 'lazy';
  img.decoding = 'async';
  link.append(img);
  const caption = document.createElement('figcaption');
  const label = document.createElement('span');
  label.textContent = work.project ? work.artist : album.title;
  caption.append(label);
  figure.append(link, caption);
  return figure;
}

function albumCardNode(album, onOpen, assetBase = './') {
  const card = document.createElement('button');
  card.className = `exhibition-album-card${album.works.length === 1 ? ' single-work' : ''}`;
  card.type = 'button';
  card.setAttribute('aria-label', `查看${album.title}的作品`);
  const cover = document.createElement('span');
  cover.className = 'exhibition-album-cover';
  const image = document.createElement('img');
  image.src = `${assetBase}${album.works[0].thumb}`;
  image.alt = album.title;
  image.loading = 'lazy';
  image.decoding = 'async';
  cover.append(image);
  const kicker = document.createElement('small');
  kicker.className = 'album-kicker';
  kicker.textContent = '';
  const title = document.createElement('strong');
  title.textContent = album.title;
  card.append(cover);
  if (kicker.textContent) card.append(kicker);
  card.append(title);
  card.addEventListener('click', () => onOpen(card));
  return card;
}

async function loadExhibition() {
  const grid = document.querySelector('#exhibition-grid, #collectives-grid');
  if (!grid) return;
  const collectivePage = grid.id === 'collectives-grid';
  const assetBase = collectivePage ? '../' : './';
  const viewer = document.querySelector('#exhibition-viewer');
  const viewerImage = document.querySelector('#exhibition-viewer-image');
  const viewerTitle = document.querySelector('#exhibition-viewer-title');
  const viewerCredit = document.querySelector('#exhibition-viewer-credit');
  const viewerIndex = document.querySelector('#exhibition-viewer-index');
  const thumbs = document.querySelector('#exhibition-viewer-thumbs');
  const closeButton = document.querySelector('#exhibition-viewer-close');
  let lastTrigger = null;
  viewerImage.addEventListener('load', () => {
    viewer.classList.toggle('is-landscape', viewerImage.naturalWidth > viewerImage.naturalHeight);
  });
  const closeViewer = () => {
    viewer.hidden = true;
    viewerImage.removeAttribute('src');
    thumbs.replaceChildren();
    document.body.classList.remove('exhibition-viewer-open');
    lastTrigger?.focus({preventScroll: true});
  };
  const openViewer = (album, trigger) => {
    lastTrigger = trigger;
    viewerTitle.textContent = album.title;
    const thumbButtons = album.works.map((work, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `查看${album.title}的第${index + 1}张作品`);
      const image = document.createElement('img');
      image.src = `${assetBase}${work.thumb}`;
      image.alt = '';
      image.loading = 'lazy';
      button.append(image);
      button.addEventListener('click', () => showWork(index));
      return button;
    });
    const showWork = index => {
      const work = album.works[index];
      viewer.classList.remove('is-landscape');
      viewerImage.src = `${assetBase}${work.full}`;
      viewerImage.alt = `${album.title}的作品${work.artist ? `，作者${work.artist}` : ''}`;
      viewerCredit.textContent = album.project ? (work.artist || '') : '';
      viewerCredit.hidden = !viewerCredit.textContent;
      thumbButtons.forEach((button, buttonIndex) => button.setAttribute('aria-pressed', String(buttonIndex === index)));
    };
    thumbs.replaceChildren(...thumbButtons);
    viewerCredit.hidden = !album.project;
    viewerIndex.hidden = album.works.length < 2;
    showWork(0);
    viewer.hidden = false;
    document.body.classList.add('exhibition-viewer-open');
    closeButton.focus();
  };
  closeButton.addEventListener('click', closeViewer);
  viewer.addEventListener('click', event => {
    if (event.target === viewer || event.target.matches('[data-close-exhibition-viewer]')) closeViewer();
  });
  document.addEventListener('keydown', event => {
    if (viewer.hidden) return;
    if (event.key === 'Escape') closeViewer();
    if (event.key === 'Tab') {
      const controls = [closeButton, ...thumbs.querySelectorAll('button')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  try {
    const response = await fetch(collectivePage ? '../collectives.json' : './exhibition.json');
    if (!response.ok) throw new Error(`Exhibition data: ${response.status}`);
    const works = await response.json();
    const individual = works.filter(work => !work.project);
    const artists = [...new Set(individual.map(work => work.artist))]
      .sort((a, b) => {
        const aIndex = auroraArtistOrder.indexOf(a);
        const bIndex = auroraArtistOrder.indexOf(b);
        if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
        if (aIndex >= 0) return -1;
        if (bIndex >= 0) return 1;
        return a.localeCompare(b, 'zh-CN');
      });
    const albums = artists.map(artist => {
      const artistWorks = individual.filter(work => work.artist === artist);
      const coverIds = {'第六封信': 'w034', '卡波鼠博士': 'w013', '骷髅柴人': 'w033', '魅力棕熊姨': 'w016', '幽灵': 'w021', '叶无殊': 'w004', 'ICEBEBE艾斯比比': 'w052'};
      const cover = artistWorks.find(work => work.id === coverIds[artist]);
      if (cover) artistWorks.unshift(...artistWorks.splice(artistWorks.indexOf(cover), 1));
      return {id: `artist-${artistWorks[0].id}`, title: artist === '晚风' ? '晚風' : artist, artist, project: false, works: artistWorks};
    });
    if (collectivePage) {
      for (const project of ['画画教授', '画画芋圆', '画画企鹅']) {
        const projectWorks = works.filter(work => work.project === project);
        albums.push({id: `project-${{'画画教授': 'paint-professor', '画画芋圆': 'paint-yuyuan', '画画企鹅': 'paint-penguin'}[project]}`, title: project, project: true, works: projectWorks});
      }
    }
    grid.replaceChildren(...(collectivePage ? albums.filter(album => album.project) : albums).map(album => albumCardNode(album, card => openViewer(album, card), assetBase)));
    const linkedAlbum = albums.find(album => `#${album.id}` === location.hash);
    if (linkedAlbum) openViewer(linkedAlbum, null);
  } catch (error) {
    grid.innerHTML = `<p class="empty-gallery">${collectivePage ? '一起画画' : '极光画廊'}暂时无法读取。</p>`;
    console.error(error);
  }
}

async function loadCollectiveProject() {
  const grid = document.querySelector('#collective-works');
  if (!grid) return;
  try {
    const response = await fetch('../exhibition.json');
    if (!response.ok) throw new Error(`Exhibition data: ${response.status}`);
    const works = (await response.json()).filter(work => work.project === '画画教授');
    works.sort((a, b) => Number(b.artist === '企鹅研究员') - Number(a.artist === '企鹅研究员'));
    grid.replaceChildren(...works.map(work => artworkNode(work, {artist: null, title: '画画教授'}, '../')));
  } catch (error) {
    grid.innerHTML = '<p class="empty-gallery">画画教授作品暂时无法读取。</p>';
    console.error(error);
  }
}

async function loadAuroraArtists() {
  const grid = document.querySelector('#aurora-grid');
  if (!grid) return;
  const count = document.querySelector('#artist-count');
  try {
    const response = await fetch(grid.dataset.source || '../data/aurora-artists.json');
    if (!response.ok) throw new Error(`Aurora artist data: ${response.status}`);
    const artists = await response.json();
    if (count) count.textContent = `${artists.length} 位艺术家`;
    const nodes = artists.map(artist => {
      const article = document.createElement('article');
      article.className = 'aurora-certificate';
      const link = document.createElement('a');
      link.className = 'aurora-certificate-link';
      const encodedPath = artist.certificate_path.split('/').map(encodeURIComponent).join('/');
      link.href = `${grid.dataset.assets || '../'}${encodedPath}`;
      link.setAttribute('data-aurora-lightbox', '');
      link.dataset.lightboxAlt = `${artist.artist_name}的极光艺术家荣誉证书`;
      link.setAttribute('aria-label', `查看${artist.artist_name}的极光艺术家荣誉证书`);
      const image = document.createElement('img');
      image.src = `${grid.dataset.assets || '../'}${artist.thumbnail_path}`;
      image.alt = link.dataset.lightboxAlt;
      image.loading = 'lazy';
      image.decoding = 'async';
      link.append(image);
      const name = document.createElement('p');
      name.textContent = artist.artist_name === '晚风' ? '晚風' : artist.artist_name;
      article.append(link, name);
      return article;
    });
    grid.replaceChildren(...nodes);
  } catch (error) {
    grid.innerHTML = '<p class="empty-gallery">极光艺术家暂时无法读取。</p>';
    console.error(error);
  }
}

setupLightbox({modalId: '#identity-lightbox', imageId: '#identity-lightbox-image', closeId: '#identity-lightbox-close', triggerSelector: '[data-lightbox="identity"]', closeAttribute: 'data-close-lightbox'});
setupLightbox({modalId: '#aurora-lightbox', imageId: '#aurora-lightbox-image', closeId: '#aurora-lightbox-close', triggerSelector: '[data-aurora-lightbox]', closeAttribute: 'data-close-aurora-lightbox'});
if (location.hash === '#artist-directory') location.replace('./artists/');
loadExhibition();
loadAuroraArtists();
loadCollectiveProject();
