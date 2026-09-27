import { createGame } from './simulation.js';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const modal = document.querySelector('#modal');
const modalBody = document.querySelector('#modalBody');
const primaryButton = document.querySelector('#primaryButton');
const primaryLabel = document.querySelector('#primaryLabel');
const pauseButton = document.querySelector('#pauseButton');
const restartButton = document.querySelector('#restartButton');
const helpButton = document.querySelector('#helpButton');
const colonyMarkers = document.querySelector('#colonyMarkers');
const launchCounter = document.querySelector('#launchCounter');
const launchCount = document.querySelector('#launchCount');
const launchIcon = document.querySelector('#launchIcon');
const ruleDiagram = document.querySelector('#ruleDiagram');

const compactBoard = window.matchMedia('(max-width: 600px)').matches;
if (compactBoard) {
  canvas.width = 600;
  canvas.height = 720;
  canvas.parentElement.style.aspectRatio = '5 / 6';
}
const game = createGame(compactBoard ? {
  width: 600, height: 720, maxPopulation: 34,
  radius: 20, linkDistance: 48, grabRadius: 35,
} : {});
const sprite = new Image();
sprite.src = '../adelie-motion-lab/assets/sheet_8f_64.png';
const COLORS = ['#d66d62', '#65a9bd', '#daa94e', '#9c81bd', '#4b9534'];
const PENGUIN_SIZE = 54;
let paused = false;
let helpOpen = false;
let lastTime = 0;
let cursorDown = false;
let animationTime = 0;
let markerSignature = '';
let shownLaunchCount = -1;

function drawLaunchIcon() {
  const icon = launchIcon.getContext('2d');
  icon.clearRect(0, 0, 26, 35);
  icon.fillStyle = '#e8ab6c';
  icon.beginPath(); icon.moveTo(8, 20); icon.lineTo(13, 34); icon.lineTo(18, 20); icon.fill();
  icon.fillStyle = '#fff2bd';
  icon.beginPath(); icon.moveTo(11, 20); icon.lineTo(13, 29); icon.lineTo(15, 20); icon.fill();
  if (sprite.complete && sprite.naturalWidth) {
    icon.imageSmoothingEnabled = false;
    icon.drawImage(sprite, 0, 0, 64, 64, 1, 0, 24, 24);
  } else {
    icon.fillStyle = '#1d2d38';
    icon.beginPath(); icon.ellipse(13, 12, 6, 11, 0, 0, Math.PI * 2); icon.fill();
  }
}
sprite.addEventListener('load', drawLaunchIcon);
drawLaunchIcon();

function drawRuleDiagram() {
  const diagram = ruleDiagram.getContext('2d');
  diagram.clearRect(0, 0, 240, 56);
  const color = COLORS[Math.floor(animationTime / 2.4) % COLORS.length];
  const frame = Math.floor(animationTime * 8) % 8;
  for (const [x, y] of [[7, 2], [34, 2], [61, 2], [21, 27], [48, 27]]) {
    diagram.fillStyle = color;
    diagram.beginPath(); diagram.ellipse(x + 11, y + 21, 8, 3, 0, 0, Math.PI * 2); diagram.fill();
    if (sprite.complete && sprite.naturalWidth) {
      diagram.imageSmoothingEnabled = false;
      diagram.drawImage(sprite, frame * 64, 0, 64, 64, x, y, 22, 22);
    } else {
      diagram.fillStyle = '#1d2d38';
      diagram.beginPath(); diagram.ellipse(x + 11, y + 10, 5, 10, 0, 0, Math.PI * 2); diagram.fill();
    }
  }
  diagram.fillStyle = '#64878c';
  diagram.fillRect(101, 22, 17, 2);
  diagram.fillRect(101, 30, 17, 2);
  diagram.drawImage(launchIcon, 150, 5, 31, 42);
  diagram.strokeStyle = '#315e68';
  diagram.lineWidth = 2.5;
  diagram.beginPath();
  diagram.moveTo(207, 43); diagram.lineTo(207, 8);
  diagram.moveTo(199, 16); diagram.lineTo(207, 8); diagram.lineTo(215, 16);
  diagram.stroke();
}

function point(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
}

function syncPauseButton() {
  pauseButton.textContent = paused ? '▶' : 'Ⅱ';
  pauseButton.setAttribute('aria-label', paused ? '继续' : '暂停');
}

function begin() {
  game.restart();
  paused = false;
  helpOpen = false;
  modal.hidden = true;
  modalBody.hidden = true;
  pauseButton.disabled = false;
  restartButton.disabled = false;
  syncPauseButton();
}

primaryButton.addEventListener('click', () => {
  if (helpOpen && game.phase === 'playing') {
    helpOpen = false;
    paused = false;
    modal.hidden = true;
    modalBody.hidden = true;
    pauseButton.disabled = false;
    syncPauseButton();
  } else begin();
});
restartButton.addEventListener('click', begin);
pauseButton.addEventListener('click', () => {
  paused = !paused;
  if (paused) game.release();
  syncPauseButton();
});
helpButton.addEventListener('click', () => {
  if (game.phase === 'playing') {
    paused = true;
    game.release();
    helpOpen = true;
    syncPauseButton();
  }
  modalBody.hidden = false;
  modalBody.textContent = '按住并拖动企鹅；几秒后它会挣脱。';
  modal.hidden = false;
  primaryButton.setAttribute('aria-label', helpOpen ? '继续游戏' : '开始游戏');
  primaryLabel.textContent = helpOpen ? '继续' : '开始';
  pauseButton.disabled = true;
});

canvas.addEventListener('pointerdown', event => {
  if (game.phase !== 'playing' || paused || !modal.hidden) return;
  const p = point(event);
  if (game.grab(p.x, p.y)) {
    cursorDown = true;
    canvas.setPointerCapture(event.pointerId);
    event.preventDefault();
  }
});
canvas.addEventListener('pointermove', event => {
  if (!cursorDown) return;
  const p = point(event);
  game.moveGrab(p.x, p.y);
});
function releasePointer() { if (cursorDown) { cursorDown = false; game.release(); } }
canvas.addEventListener('pointerup', releasePointer);
canvas.addEventListener('pointercancel', releasePointer);
window.addEventListener('blur', () => { releasePointer(); if (game.phase === 'playing') { paused = true; syncPauseButton(); } });
document.addEventListener('visibilitychange', () => { if (document.hidden && game.phase === 'playing') { releasePointer(); paused = true; syncPauseButton(); } });

function drawBackground() {
  ctx.save();
  ctx.scale(canvas.width / 960, canvas.height / 600);
  const snow = ctx.createLinearGradient(0, 0, 0, 600);
  snow.addColorStop(0, '#deedf1');
  snow.addColorStop(.45, '#edf6f5');
  snow.addColorStop(1, '#f8fbf8');
  ctx.fillStyle = snow;
  ctx.fillRect(0, 0, 960, 600);
  // Broad wind-shaped snowdrifts give depth without dividing the playfield.
  ctx.fillStyle = '#e1eff1';
  ctx.beginPath();
  ctx.moveTo(0, 142);
  ctx.bezierCurveTo(170, 104, 276, 171, 446, 139);
  ctx.bezierCurveTo(641, 101, 753, 146, 960, 113);
  ctx.lineTo(960, 177);
  ctx.bezierCurveTo(762, 206, 626, 163, 452, 196);
  ctx.bezierCurveTo(256, 224, 149, 157, 0, 207);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f7fbf9';
  ctx.beginPath();
  ctx.moveTo(0, 326);
  ctx.bezierCurveTo(156, 294, 288, 354, 478, 319);
  ctx.bezierCurveTo(650, 292, 821, 346, 960, 315);
  ctx.lineTo(960, 600); ctx.lineTo(0, 600);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#d8e9eb';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 11; i++) {
    const x = (i * 197 + 58) % 910;
    const y = 92 + (i * 149) % 455;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 26, y - 7, x + 67, y - 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#c9dfe3';
  for (let i = 0; i < 82; i++) {
    const x = (i * 223 + 71) % 960;
    const y = (i * 137 + 39) % 600;
    ctx.fillRect(x, y, i % 7 === 0 ? 3 : 2, 1);
  }
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 30; i++) {
    const x = (i * 193 + 31 + animationTime * (7 + i % 5)) % 960;
    const y = (i * 271 + 17 + animationTime * (13 + i % 4)) % 600;
    ctx.fillRect(Math.round(x), Math.round(y), i % 5 === 0 ? 3 : 2, i % 5 === 0 ? 3 : 2);
  }
  ctx.restore();
}

function colorOf(penguin) {
  return COLORS[penguin.color] || COLORS[0];
}

function syncMarkers() {
  const present = game.penguins.filter(p => p.state !== 'launching');
  const signature = present.map(p => `${p.id}:${p.color}`).join('|');
  if (signature === markerSignature) return;
  markerSignature = signature;
  const colonies = new Map();
  for (const penguin of present) {
    if (!colonies.has(penguin.color)) colonies.set(penguin.color, []);
    colonies.get(penguin.color).push(penguin);
  }
  const content = document.createDocumentFragment();
  for (const members of colonies.values()) {
    const group = document.createElement('span');
    group.className = 'colony-group';
    group.style.gridTemplateColumns = `repeat(${Math.min(5, members.length)}, 11px)`;
    for (const member of members) {
      const dot = document.createElement('i');
      dot.className = 'marker';
      dot.style.backgroundColor = colorOf(member);
      group.append(dot);
    }
    content.append(group);
  }
  colonyMarkers.replaceChildren(content);
  colonyMarkers.setAttribute('aria-label', present.length ? `场上 ${present.length} 只企鹅；各颜色分别计数，每五只换行` : '场上还没有企鹅');
}

function drawPenguin(p) {
  const held = p.state === 'held';
  const launching = p.state === 'launching';
  const windup = p.state === 'windup';
  const bob = p.state === 'walking' ? Math.sin(animationTime * 22 + p.id * 2.8) * 1.4 : 0;
  const wobble = held ? Math.sin(animationTime * 38 + p.id) * .15 : 0;
  const x = Math.round(p.x), y = Math.round(p.y);
  ctx.save();
  ctx.translate(x, y + bob);
  if (launching) {
    const flame = 8 + Math.sin(animationTime * 35 + p.id) * 4;
    ctx.fillStyle = '#e8ab6c';
    ctx.beginPath(); ctx.moveTo(-7, 17); ctx.lineTo(0, 26 + flame); ctx.lineTo(7, 17); ctx.fill();
    ctx.fillStyle = '#fff2bd';
    ctx.beginPath(); ctx.moveTo(-3, 16); ctx.lineTo(0, 20 + flame * .5); ctx.lineTo(3, 16); ctx.fill();
  }
  ctx.globalAlpha *= windup ? .55 + Math.sin(animationTime * 23) * .28 : .95;
  ctx.strokeStyle = '#f3f8f4'; ctx.lineWidth = 2;
  ctx.fillStyle = colorOf(p);
  ctx.beginPath(); ctx.ellipse(0, 20, windup ? 17 : 15, windup ? 6 : 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.rotate(wobble);
  if (p.facing === 1) ctx.scale(-1, 1);
  if (sprite.complete && sprite.naturalWidth) {
    const frame = held ? Math.floor(animationTime * 19) % 8 : Math.floor(animationTime * 8 + p.id * .9) % 8;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprite, frame * 64, 0, 64, 64, -PENGUIN_SIZE / 2, -31, PENGUIN_SIZE, PENGUIN_SIZE);
  } else {
    ctx.fillStyle = '#1d2d38';
    ctx.beginPath(); ctx.ellipse(0, -7, 12, 20, -.15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#edf0e4'; ctx.fillRect(-6, -10, 6, 14);
  }
  if (held) {
    ctx.strokeStyle = '#416b74'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(0, -6, 31, -.2, Math.PI * 1.23); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = colorOf(p);
  ctx.fillRect(-7, 19, 14, 3);
  ctx.restore();
}

function render() {
  drawRuleDiagram();
  drawBackground();
  const sorted = [...game.penguins].sort((a, b) => a.y - b.y);
  for (const p of sorted) drawPenguin(p);
  syncMarkers();
  if (shownLaunchCount !== game.stats.launched) {
    shownLaunchCount = game.stats.launched;
    launchCount.textContent = String(shownLaunchCount);
    launchCounter.setAttribute('aria-label', `已升天 ${shownLaunchCount} 只企鹅`);
  }
}

function frame(time) {
  const dt = Math.min((time - (lastTime || time)) / 1000, .05);
  lastTime = time;
  if (game.phase === 'playing' && !paused && modal.hidden) {
    game.update(dt);
    animationTime += dt;
  }
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
