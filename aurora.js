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
      return `
      <article class="aurora-certificate">
        <a class="aurora-certificate-link" href="${imagePath}" data-lightbox-alt="${artist.artist_name} 的极光艺术家荣誉证书" aria-label="查看 ${artist.artist_name} 的极光艺术家荣誉证书">
          <img src="${imagePath}" alt="${artist.artist_name} 的极光艺术家荣誉证书" loading="lazy" decoding="async">
        </a>
        <p>${artist.artist_name}</p>
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
