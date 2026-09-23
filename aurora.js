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

function artworkNode(work, album) {
  const figure = document.createElement('figure');
  figure.className = 'artwork';
  const link = document.createElement('a');
  link.className = 'artwork-link';
  link.href = `./${work.full}`;
  link.setAttribute('data-aurora-lightbox', '');
  link.dataset.lightboxAlt = `${work.artist}的${album.artist === '团子' ? '照片' : '作品'}`;
  const img = document.createElement('img');
  img.src = `./${work.full}`;
  img.alt = link.dataset.lightboxAlt;
  img.loading = 'lazy';
  img.decoding = 'async';
  link.append(img);
  const caption = document.createElement('figcaption');
  const label = document.createElement('span');
  label.textContent = work.project ? work.artist : album.artist === '团子' ? '团子' : album.artist;
  caption.append(label);
  figure.append(link, caption);
  return figure;
}

function albumCardNode(album, onOpen) {
  const card = document.createElement('button');
  card.className = `exhibition-album-card${album.works.length === 1 ? ' single-work' : ''}`;
  card.type = 'button';
  card.setAttribute('aria-label', `打开${album.title}`);
  const cover = document.createElement('span');
  cover.className = 'exhibition-album-cover';
  const image = document.createElement('img');
  image.src = `./${album.works[0].thumb}`;
  image.alt = album.title;
  image.loading = 'lazy';
  image.decoding = 'async';
  cover.append(image);
  const kicker = document.createElement('small');
  kicker.className = 'album-kicker';
  kicker.textContent = album.project ? '共创项目' : album.artist === '团子' ? '照片相册' : '';
  const title = document.createElement('strong');
  title.textContent = album.title;
  card.append(cover);
  if (kicker.textContent) card.append(kicker);
  card.append(title);
  card.addEventListener('click', () => onOpen(card));
  return card;
}

async function loadExhibition() {
  const grid = document.querySelector('#exhibition-grid');
  const collectiveGrid = document.querySelector('#collective-grid');
  const overview = document.querySelector('#exhibition-overview');
  const detail = document.querySelector('#exhibition-detail');
  const directory = document.querySelector('#artist-directory');
  let albums = [];
  let lastTrigger = null;
  const route = () => {
    const album = albums.find(item => `#${item.id}` === location.hash);
    overview.hidden = !!album;
    detail.hidden = !album;
    directory.hidden = !!album;
    if (!album) return;
    document.querySelector('#exhibition-detail-label').textContent = album.project ? '共创项目' : album.artist === '团子' ? '照片相册' : '';
    document.querySelector('#exhibition-detail-title').textContent = album.title;
    document.querySelector('#exhibition-works').replaceChildren(
      ...album.works.map(work => artworkNode(work, album))
    );
    document.querySelector('#exhibition-detail-title').focus({preventScroll: true});
    detail.scrollIntoView({behavior: 'instant'});
  };
  document.querySelector('#back-exhibition').addEventListener('click', () => {
    history.replaceState(null, '', '#exhibition');
    route();
    document.querySelector('#exhibition').scrollIntoView({behavior: 'instant'});
    lastTrigger?.focus({preventScroll: true});
  });
  window.addEventListener('hashchange', route);
  try {
    const response = await fetch('./exhibition.json');
    if (!response.ok) throw new Error(`Exhibition data: ${response.status}`);
    const works = await response.json();
    const individual = works.filter(work => !work.project);
    const artists = [...new Set(individual.map(work => work.artist))]
      .sort((a, b) => Number(b === 'Amon') - Number(a === 'Amon') || a.localeCompare(b, 'zh-CN'));
    albums = artists.map(artist => {
      const artistWorks = individual.filter(work => work.artist === artist);
      return {id: `artist-${artistWorks[0].id}`, title: artist === '团子' ? '团子的相册' : artist, artist, project: false, works: artistWorks};
    });
    const collective = works.filter(work => work.project === '画画教授')
      .sort((a, b) => Number(b.artist === '企鹅研究员') - Number(a.artist === '企鹅研究员'));
    albums.push({id: 'project-paint-professor', title: '画画教授', artist: null, project: true, works: collective});
    const onOpen = card => {
      lastTrigger = card;
      location.hash = card.dataset.albumId;
    };
    grid.replaceChildren(...albums.filter(album => !album.project).map(album => {
      const card = albumCardNode(album, onOpen);
      card.dataset.albumId = album.id;
      return card;
    }));
    const collectiveCard = albumCardNode(albums.find(album => album.project), onOpen);
    collectiveCard.dataset.albumId = 'project-paint-professor';
    collectiveGrid.replaceChildren(collectiveCard);
    route();
  } catch (error) {
    grid.innerHTML = '<p class="empty-gallery">极光艺术展暂时无法读取。</p>';
    console.error(error);
  }
}

async function loadAuroraArtists() {
  const grid = document.querySelector('#aurora-grid');
  const count = document.querySelector('#artist-count');
  try {
    const response = await fetch('../data/aurora-artists.json');
    if (!response.ok) throw new Error(`Aurora artist data: ${response.status}`);
    const artists = await response.json();
    count.textContent = `${artists.length} 位艺术家`;
    const nodes = artists.map(artist => {
      const article = document.createElement('article');
      article.className = 'aurora-certificate';
      const link = document.createElement('a');
      link.className = 'aurora-certificate-link';
      link.href = `../${artist.certificate_path}`;
      link.setAttribute('data-aurora-lightbox', '');
      link.dataset.lightboxAlt = `${artist.artist_name}的极光艺术家荣誉证书`;
      link.setAttribute('aria-label', `查看${artist.artist_name}的极光艺术家荣誉证书`);
      const image = document.createElement('img');
      image.src = link.href;
      image.alt = link.dataset.lightboxAlt;
      image.loading = 'lazy';
      image.decoding = 'async';
      link.append(image);
      const name = document.createElement('p');
      name.textContent = artist.artist_name;
      article.append(link, name);
      return article;
    });
    grid.replaceChildren(...nodes);
  } catch (error) {
    grid.innerHTML = '<p class="empty-gallery">艺术家名录暂时无法读取。</p>';
    console.error(error);
  }
}

setupLightbox({modalId: '#identity-lightbox', imageId: '#identity-lightbox-image', closeId: '#identity-lightbox-close', triggerSelector: '[data-lightbox="identity"]', closeAttribute: 'data-close-lightbox'});
setupLightbox({modalId: '#aurora-lightbox', imageId: '#aurora-lightbox-image', closeId: '#aurora-lightbox-close', triggerSelector: '[data-aurora-lightbox]', closeAttribute: 'data-close-aurora-lightbox'});
loadExhibition();
loadAuroraArtists();
