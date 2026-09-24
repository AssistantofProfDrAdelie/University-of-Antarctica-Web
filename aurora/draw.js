(() => {
  const templates = {
    'professor-1': {title: '画画阿德利教授', image: '../assets/works/full/w057.webp'},
    'professor-2': {title: '画画帝加索', image: '../assets/works/full/w064.webp'},
    yuyuan: {title: '画画芋圆', image: '../assets/works/full/w065.webp'},
    penguin: {title: '画画帝宝', image: '../assets/works/full/w073.webp'}
  };
  const canvas = document.querySelector('#draw-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const base = document.querySelector('#draw-base');
  const board = document.querySelector('#draw-board');
  const heading = document.querySelector('#draw-workspace-title');
  const brushButton = document.querySelector('#draw-brush');
  const eraserButton = document.querySelector('#draw-eraser');
  const sizeInput = document.querySelector('#draw-size');
  const sizeValue = document.querySelector('#draw-size-value');
  const undoButton = document.querySelector('#draw-undo');
  const clearButton = document.querySelector('#draw-clear');
  const downloadButton = document.querySelector('#draw-download');
  const status = document.querySelector('#draw-status');
  const projectButtons = [...document.querySelectorAll('.draw-project')];
  const colorButtons = [...document.querySelectorAll('.draw-color')];
  const paletteField = document.querySelector('#draw-palette-field');
  const paletteMarker = document.querySelector('#draw-palette-marker');
  const hueInput = document.querySelector('#draw-hue');
  const hexInput = document.querySelector('#draw-hex');
  const currentSwatch = document.querySelector('#draw-current-swatch');
  const storageKey = 'aurora-drawings-v1';
  let drawings = {};
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) drawings = stored;
  } catch (_) { /* A saved draft should never prevent drawing. */ }

  let template = 'professor-1';
  let tool = 'brush';
  let color = '#263f59';
  let hsv = {h: 210, s: 0.59, v: 0.35};
  let activeStroke = null;
  let activePointer = null;
  let imageRequest = 0;

  const actions = () => {
    if (!Array.isArray(drawings[template])) drawings[template] = [];
    return drawings[template];
  };
  const save = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(drawings)); }
    catch (_) { status.textContent = '草稿无法保存在浏览器中，请下载画作。'; }
  };
  const visibleStrokeCount = list => {
    const lastClear = list.findLastIndex(action => action.tool === 'clear');
    return list.slice(lastClear + 1).filter(action => action.tool !== 'clear').length;
  };
  const updateButtons = () => {
    const list = actions();
    undoButton.disabled = list.length === 0;
    clearButton.disabled = visibleStrokeCount(list) === 0;
    downloadButton.disabled = !base.complete || !base.naturalWidth;
  };
  const lineWidth = stroke => stroke.size * canvas.width / 1000;
  const paintStroke = (stroke, start = 0) => {
    if (!stroke?.points?.length) return;
    context.save();
    context.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
    context.strokeStyle = stroke.color;
    context.fillStyle = stroke.color;
    context.lineWidth = lineWidth(stroke);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    const points = stroke.points;
    if (points.length === 1) {
      context.beginPath();
      context.arc(points[0][0], points[0][1], context.lineWidth / 2, 0, Math.PI * 2);
      context.fill();
    } else {
      context.beginPath();
      context.moveTo(points[Math.max(0, start - 1)][0], points[Math.max(0, start - 1)][1]);
      for (let i = Math.max(1, start); i < points.length; i += 1) context.lineTo(points[i][0], points[i][1]);
      context.stroke();
    }
    context.restore();
  };
  const redraw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const list = actions();
    const lastClear = list.findLastIndex(action => action.tool === 'clear');
    for (const stroke of list.slice(lastClear + 1)) paintStroke(stroke);
    updateButtons();
  };
  const pointFor = event => {
    const rect = canvas.getBoundingClientRect();
    return [
      Math.max(0, Math.min(canvas.width, (event.clientX - rect.left) * canvas.width / rect.width)),
      Math.max(0, Math.min(canvas.height, (event.clientY - rect.top) * canvas.height / rect.height))
    ];
  };
  const finishStroke = () => {
    if (!activeStroke) return;
    actions().push(activeStroke);
    activeStroke = null;
    activePointer = null;
    save();
    updateButtons();
  };
  canvas.addEventListener('pointerdown', event => {
    if (!base.naturalWidth || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    activePointer = event.pointerId;
    activeStroke = {tool, color, size: Number(sizeInput.value), points: [pointFor(event)]};
    paintStroke(activeStroke);
  });
  canvas.addEventListener('pointermove', event => {
    if (!activeStroke || event.pointerId !== activePointer) return;
    event.preventDefault();
    const point = pointFor(event);
    const previous = activeStroke.points.at(-1);
    if (Math.hypot(point[0] - previous[0], point[1] - previous[1]) < 2) return;
    const start = activeStroke.points.length;
    activeStroke.points.push(point);
    paintStroke(activeStroke, start);
  });
  for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    canvas.addEventListener(eventName, event => {
      if (event.pointerId === activePointer) finishStroke();
    });
  }

  const setTool = nextTool => {
    tool = nextTool;
    brushButton.classList.toggle('is-active', tool === 'brush');
    eraserButton.classList.toggle('is-active', tool === 'eraser');
    brushButton.setAttribute('aria-pressed', String(tool === 'brush'));
    eraserButton.setAttribute('aria-pressed', String(tool === 'eraser'));
  };
  brushButton.addEventListener('click', () => setTool('brush'));
  eraserButton.addEventListener('click', () => setTool('eraser'));
  const hexToHsv = hex => {
    const channels = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255);
    const [r, g, b] = channels;
    const max = Math.max(...channels);
    const min = Math.min(...channels);
    const difference = max - min;
    let hue = 0;
    if (difference) {
      if (max === r) hue = ((g - b) / difference) % 6;
      else if (max === g) hue = (b - r) / difference + 2;
      else hue = (r - g) / difference + 4;
      hue = (hue * 60 + 360) % 360;
    }
    return {h: hue, s: max === 0 ? 0 : difference / max, v: max};
  };
  const hsvToHex = ({h, s, v}) => {
    const chroma = v * s;
    const secondary = chroma * (1 - Math.abs((h / 60) % 2 - 1));
    const match = v - chroma;
    const sectors = [[chroma, secondary, 0], [secondary, chroma, 0], [0, chroma, secondary], [0, secondary, chroma], [secondary, 0, chroma], [chroma, 0, secondary]];
    return `#${sectors[Math.floor(h / 60) % 6].map(channel => Math.round((channel + match) * 255).toString(16).padStart(2, '0')).join('')}`;
  };
  const markPreset = selectedButton => {
    colorButtons.forEach(item => {
      const selected = item === selectedButton;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
  };
  const syncPalette = () => {
    paletteField.style.setProperty('--palette-hue', `${hsv.h}deg`);
    paletteMarker.style.left = `${hsv.s * 100}%`;
    paletteMarker.style.top = `${(1 - hsv.v) * 100}%`;
    paletteField.setAttribute('aria-valuenow', String(Math.round(hsv.s * 100)));
    paletteField.setAttribute('aria-valuetext', `饱和度 ${Math.round(hsv.s * 100)}%，明度 ${Math.round(hsv.v * 100)}%`);
    hueInput.value = String(Math.round(hsv.h));
    hexInput.value = color.toUpperCase();
    currentSwatch.style.backgroundColor = color;
  };
  const chooseColor = (nextColor, preset = null) => {
    color = nextColor.toLowerCase();
    hsv = hexToHsv(color);
    markPreset(preset);
    syncPalette();
    setTool('brush');
  };
  colorButtons.forEach(button => button.addEventListener('click', () => chooseColor(button.dataset.color, button)));
  const chooseFromPalette = () => {
    color = hsvToHex(hsv);
    markPreset(null);
    syncPalette();
    setTool('brush');
  };
  let palettePointer = null;
  const setPalettePosition = event => {
    const rect = paletteField.getBoundingClientRect();
    hsv.s = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    hsv.v = 1 - Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    chooseFromPalette();
  };
  paletteField.addEventListener('pointerdown', event => {
    event.preventDefault();
    paletteField.setPointerCapture(event.pointerId);
    palettePointer = event.pointerId;
    setPalettePosition(event);
  });
  paletteField.addEventListener('pointermove', event => {
    if (event.pointerId === palettePointer) setPalettePosition(event);
  });
  for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    paletteField.addEventListener(eventName, event => { if (event.pointerId === palettePointer) palettePointer = null; });
  }
  paletteField.addEventListener('keydown', event => {
    const step = event.shiftKey ? 0.1 : 0.02;
    if (event.key === 'ArrowLeft') hsv.s = Math.max(0, hsv.s - step);
    else if (event.key === 'ArrowRight') hsv.s = Math.min(1, hsv.s + step);
    else if (event.key === 'ArrowUp') hsv.v = Math.min(1, hsv.v + step);
    else if (event.key === 'ArrowDown') hsv.v = Math.max(0, hsv.v - step);
    else return;
    event.preventDefault();
    chooseFromPalette();
  });
  hueInput.addEventListener('input', () => {
    hsv.h = Number(hueInput.value);
    chooseFromPalette();
  });
  hexInput.addEventListener('change', () => {
    const nextColor = hexInput.value.trim();
    if (/^#?[0-9a-f]{6}$/i.test(nextColor)) chooseColor(nextColor.startsWith('#') ? nextColor : `#${nextColor}`);
    else syncPalette();
  });
  hsv = hexToHsv(color);
  syncPalette();
  sizeInput.addEventListener('input', () => { sizeValue.value = sizeInput.value; });
  undoButton.addEventListener('click', () => {
    actions().pop();
    save();
    redraw();
    status.textContent = '已撤销。';
  });
  clearButton.addEventListener('click', () => {
    actions().push({tool: 'clear'});
    save();
    redraw();
    status.textContent = '画笔已清空，可以撤销恢复。';
  });

  const selectTemplate = key => {
    finishStroke();
    template = key;
    heading.textContent = templates[key].title;
    projectButtons.forEach(button => {
      const selected = button.dataset.template === key;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    board.setAttribute('aria-busy', 'true');
    downloadButton.disabled = true;
    status.textContent = '正在准备画布…';
    const request = ++imageRequest;
    base.onload = () => {
      if (request !== imageRequest) return;
      canvas.width = base.naturalWidth;
      canvas.height = base.naturalHeight;
      board.style.aspectRatio = `${canvas.width} / ${canvas.height}`;
      board.setAttribute('aria-busy', 'false');
      redraw();
      status.textContent = '可以开始画了。';
    };
    base.onerror = () => {
      if (request !== imageRequest) return;
      board.setAttribute('aria-busy', 'false');
      status.textContent = '底图暂时无法读取，请稍后重试。';
    };
    base.alt = `${templates[key].title}底图`;
    base.src = templates[key].image;
  };
  projectButtons.forEach(button => button.addEventListener('click', () => selectTemplate(button.dataset.template)));

  downloadButton.addEventListener('click', () => {
    if (!base.naturalWidth) return;
    finishStroke();
    const output = document.createElement('canvas');
    output.width = canvas.width;
    output.height = canvas.height;
    const outputContext = output.getContext('2d');
    outputContext.fillStyle = '#ffffff';
    outputContext.fillRect(0, 0, output.width, output.height);
    outputContext.drawImage(canvas, 0, 0);
    outputContext.globalCompositeOperation = 'multiply';
    outputContext.drawImage(base, 0, 0, output.width, output.height);
    output.toBlob(blob => {
      if (!blob) { status.textContent = '下载失败，请重试。'; return; }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `一起画画-${templates[template].title}.png`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      status.textContent = '画作已下载为 PNG 图片。';
    }, 'image/png');
  });

  selectTemplate('professor-1');
})();
