const poems = [
  { title: '企鹅需要爱情', author: '胖胖皮', thumb: 'assets/web/poem-01-cover-thumb.webp', cover: 'assets/web/poem-01-cover.webp', text: 'assets/web/poem-01-text.webp', width: 420, height: 562 },
  { title: '某夜的月光和某个心脏', author: '胖胖皮', thumb: 'assets/web/poem-02-cover-thumb.webp', cover: 'assets/web/poem-02-cover.webp', text: 'assets/web/poem-02-text.webp', width: 420, height: 562 },
  { title: '鹅爱你，当然与你有关', author: '胖胖皮', thumb: 'assets/web/poem-03-cover-thumb.webp', cover: 'assets/web/poem-03-cover.webp', text: 'assets/web/poem-03-text.webp', width: 420, height: 562 },
  { title: '无题', author: '胖胖皮', thumb: 'assets/web/poem-04-cover-thumb.webp', cover: 'assets/web/poem-04-cover.webp', text: 'assets/web/poem-04-text.webp', width: 420, height: 700 },
  { title: '你就好像菩萨显灵', author: '胖胖皮', thumb: 'assets/web/poem-05-cover-thumb.webp', cover: 'assets/web/poem-05-cover.webp', text: 'assets/web/poem-05-text.webp', width: 420, height: 909 },
];

const grid = document.querySelector('#poem-grid');
const reader = document.querySelector('#reader');
const readerTitle = document.querySelector('#reader-title');
const readerPosition = document.querySelector('#reader-position');
const readerImage = document.querySelector('#reader-image');
const readerCaption = document.querySelector('#reader-caption');
const closeReader = document.querySelector('#close-reader');
const previousPage = document.querySelector('#previous-page');
const nextPage = document.querySelector('#next-page');

let poemIndex = 0;
let pageIndex = 0;
let opener = null;

function renderArchive() {
  grid.innerHTML = poems.map((poem, index) => `
    <article class="poem-record">
      <button class="poem-cover" type="button" data-poem-index="${index}" aria-label="阅读《${poem.title}》">
        <img src="${poem.thumb}" alt="《${poem.title}》封面" width="${poem.width}" height="${poem.height}" decoding="async">
      </button>
      <h3>${poem.title}</h3>
      <p>${poem.author}</p>
    </article>
  `).join('');
}

function currentPages() {
  const poem = poems[poemIndex];
  return [poem.cover, poem.text];
}

function renderReader() {
  const poem = poems[poemIndex];
  const pageName = pageIndex === 0 ? '封面' : '正文';
  readerTitle.textContent = poem.title;
  readerPosition.textContent = `${poemIndex + 1} / ${poems.length} · ${poem.author}`;
  readerImage.src = currentPages()[pageIndex];
  readerImage.alt = `《${poem.title}》${pageName}`;
  readerCaption.textContent = `${pageName} · ${pageIndex + 1} / 2`;
  previousPage.disabled = poemIndex === 0 && pageIndex === 0;
  nextPage.disabled = poemIndex === poems.length - 1 && pageIndex === 1;
}

function openPoem(index, trigger) {
  poemIndex = index;
  pageIndex = 0;
  opener = trigger;
  renderReader();
  reader.showModal();
  document.body.classList.add('reader-open');
}

function closePoem() {
  reader.close();
  document.body.classList.remove('reader-open');
  if (opener) opener.focus();
}

function movePage(direction) {
  if (direction > 0) {
    if (pageIndex === 0) pageIndex = 1;
    else if (poemIndex < poems.length - 1) {
      poemIndex += 1;
      pageIndex = 0;
    }
  } else if (pageIndex === 1) pageIndex = 0;
  else if (poemIndex > 0) {
    poemIndex -= 1;
    pageIndex = 1;
  }
  renderReader();
}

grid.addEventListener('click', event => {
  const trigger = event.target.closest('[data-poem-index]');
  if (trigger) openPoem(Number(trigger.dataset.poemIndex), trigger);
});
closeReader.addEventListener('click', closePoem);
previousPage.addEventListener('click', () => movePage(-1));
nextPage.addEventListener('click', () => movePage(1));
reader.addEventListener('click', event => {
  if (event.target === reader) closePoem();
});
reader.addEventListener('cancel', event => {
  event.preventDefault();
  closePoem();
});
document.addEventListener('keydown', event => {
  if (!reader.open) return;
  if (event.key === 'ArrowLeft') movePage(-1);
  if (event.key === 'ArrowRight') movePage(1);
});

renderArchive();
