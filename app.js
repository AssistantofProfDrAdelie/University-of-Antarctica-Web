function normalizeSearchText(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

function searchTokens(query) {
  return normalizeSearchText(query).split(' ').filter(Boolean);
}

function studentMatches(student, query) {
  const tokens = searchTokens(query);
  if (!tokens.length) return true;
  const searchableText = [student.name_cn, student.major_cn, student.major_en]
    .map(normalizeSearchText)
    .filter(Boolean)
    .join(' ');
  return tokens.every(token => searchableText.includes(token));
}

function matchingMajors(student, query) {
  const tokens = searchTokens(query);
  if (!tokens.length) return [];
  return [student.major_cn, student.major_en]
    .filter(Boolean)
    .filter(value => {
      const text = normalizeSearchText(value);
      return tokens.some(token => text.includes(token));
    })
    .filter((value, position, values) => values.indexOf(value) === position);
}

function setupCrestModal() {
  const trigger = document.querySelector('#crest-trigger');
  const modal = document.querySelector('#crest-modal');
  const close = document.querySelector('#crest-close');
  if (!trigger || !modal || !close) return;
  const open = () => {
    modal.hidden = false;
    close.focus();
  };
  const dismiss = () => {
    modal.hidden = true;
    trigger.focus();
  };
  trigger.addEventListener('click', open);
  close.addEventListener('click', dismiss);
  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.matches('[data-close-crest]')) dismiss();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.hidden) dismiss();
  });
}

function loadStudents() {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', 'data/students.json?directory=1', true);
    request.timeout = 10000;
    request.setRequestHeader('Accept', 'application/json');
    request.onload = () => {
      if (request.status < 200 || request.status >= 300) {
        reject(new Error(`Student data request failed: ${request.status}`));
        return;
      }
      try {
        resolve(JSON.parse(request.responseText));
      } catch (error) {
        reject(new Error(`Student data JSON is invalid: ${error.message}`));
      }
    };
    request.onerror = () => reject(new Error('Student data request could not be completed'));
    request.ontimeout = () => reject(new Error('Student data request timed out'));
    request.send();
  }).then(students => {
  const searchInput = document.querySelector('#directory-search-input');
  const count = document.querySelector('#student-count');
  const index = document.querySelector('#directory-index');
  const grid = document.querySelector('#student-grid');
  const matchDetails = (student, query) => {
    return matchingMajors(student, query).join(' · ');
  };
  const parseBatchNumber = batch => {
    const token = batch.match(/第([一二三四五六七八九十百]+)/)?.[1] || '';
    const digits = {一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9};
    if (token === '十') return 10;
    if (token.startsWith('十')) return 10 + (digits[token[1]] || 0);
    if (token.endsWith('十')) return (digits[token[0]] || 0) * 10;
    if (token.includes('十')) return (digits[token[0]] || 0) * 10 + (digits[token[2]] || 0);
    return digits[token] || 0;
  };
  const render = query => {
    const filtered = students.filter(student => studentMatches(student, query));
    const groups = new Map();
    filtered.forEach(student => {
    const year = String(student.admission_year);
    if (!groups.has(year)) groups.set(year, new Map());
    if (!groups.get(year).has(student.admission_batch)) groups.get(year).set(student.admission_batch, []);
    groups.get(year).get(student.admission_batch).push(student);
  });
  groups.forEach(batches => batches.forEach(records => records.sort((a, b) => {
    const aDate = a.admission_date || '9999-99-99';
    const bDate = b.admission_date || '9999-99-99';
    return aDate.localeCompare(bDate) || a.original_order - b.original_order;
  })));
  const orderedGroups = [...groups].sort(([a], [b]) => Number(a) - Number(b)).map(([year, batches]) => [year, [...batches].sort(([a], [b]) => parseBatchNumber(a) - parseBatchNumber(b))]);
  const renderGallery = (records) => `<div class="letter-grid">${records.map(student => {
        const imagePath = encodeURI(student.source.path).replace(/#/g, '%23');
        const detail = matchDetails(student, query);
        return `<article class="letter-record">
          <a class="letter-link" href="${imagePath}" target="_blank" rel="noreferrer" aria-label="查看 ${student.name_cn || student.source.filename} 的原始录取通知书">
            <img src="${imagePath}" alt="${student.name_cn || student.source.filename} 的录取通知书" loading="lazy" decoding="async">
          </a>
          <p class="letter-caption">${student.name_cn || student.source.filename}${detail ? `<span class="search-match-detail">${detail}</span>` : ''}</p>
        </article>`;
      }).join('')}</div>`;
  count.textContent = query ? `${filtered.length} ${filtered.length === 1 ? 'RESULT' : 'RESULTS'}` : `${students.length} RECORDS`;
  index.innerHTML = orderedGroups.map(([year, batches]) => `
    <div class="index-year"><a href="#year-${year}">${year}</a><span>${batches.map(([batch], batchIndex) => `<a class="period-button" href="#batch-${year}-${batchIndex}">${batch.replace('录取通知书', '')}</a>`).join('')}</span></div>`).join('');
  grid.innerHTML = orderedGroups.length ? orderedGroups.map(([year, batches]) => `
    <section class="year-group" id="year-${year}" aria-labelledby="year-title-${year}"><h3 id="year-title-${year}">${year}</h3>
      ${batches.map(([batch, records], batchIndex) => `<section class="batch-group" id="batch-${year}-${batchIndex}"><h4>${batch.replace('录取通知书', '')}<span>${records.length} records</span></h4>${renderGallery(records)}</section>`).join('')}
    </section>`).join('') : '<p class="empty-search">未找到匹配的学生或专业</p>';
  };
  searchInput.addEventListener('input', event => render(event.target.value.trim()));
  render('');
});
}

loadStudents().catch(error => { document.querySelector('#student-grid').innerHTML = `<p class="load-error">学生名录暂时无法读取：${error.message}</p>`; console.error(error); });
setupCrestModal();
