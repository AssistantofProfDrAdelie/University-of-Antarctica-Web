const audioElement = document.querySelector('#audio');
const artworkButton = document.querySelector('#artwork-button');
const artworkDisc = artworkButton.querySelector('.artwork-disc');
const SCRATCH_SECONDS_PER_REVOLUTION = 1.8;
const PHYSICAL_DEGREES_PER_SECOND = 360 / SCRATCH_SECONDS_PER_REVOLUTION;

let audioContext;
let vinylNode;
let duration = 0;
let playhead = 0;
let enginePromise;
let playing = false;
let dragging = false;
let movedDuringDrag = false;
let suppressClick = false;
let gestureWasPlaying = false;
let lastPointerAngle = 0;
let lastPointerTime = 0;
let silenceTimer = 0;
let displayAngle = 0;
let displayOffset = 0;
let lastScratchRate = 0;

function wrapTime(time) {
  if (!duration) return 0;
  return ((time % duration) + duration) % duration;
}

function pointerAngle(event) {
  const bounds = artworkButton.getBoundingClientRect();
  const x = event.clientX - (bounds.left + bounds.width / 2);
  const y = event.clientY - (bounds.top + bounds.height / 2);
  return Math.atan2(y, x) * 180 / Math.PI;
}

function radiusSensitivity(event) {
  const bounds = artworkButton.getBoundingClientRect();
  const x = event.clientX - (bounds.left + bounds.width / 2);
  const y = event.clientY - (bounds.top + bounds.height / 2);
  const radius = Math.hypot(x, y) / (bounds.width / 2);
  return 0.35 + Math.min(1, radius) * 0.85;
}

function shortestAngle(from, to) {
  return ((to - from + 540) % 360) - 180;
}

function renderDisc() {
  if (!dragging) displayAngle = duration ? (playhead / duration) * 360 + displayOffset : 0;
  artworkDisc.style.transform = `rotate(${displayAngle}deg)`;
  requestAnimationFrame(renderDisc);
}

function setRate(rate, rampSeconds = 0) {
  if (!vinylNode || !audioContext) return;
  const parameter = vinylNode.parameters.get('rate');
  const now = audioContext.currentTime;
  parameter.cancelScheduledValues(now);
  parameter.setValueAtTime(parameter.value, now);
  if (rampSeconds) parameter.linearRampToValueAtTime(rate, now + rampSeconds);
  else parameter.setValueAtTime(rate, now);
}

function seek(seconds) {
  playhead = wrapTime(seconds);
  vinylNode?.port.postMessage({ type: 'seek', seconds: playhead });
}

async function createEngine() {
  audioContext = new AudioContext();
  await audioContext.resume();
  await audioContext.audioWorklet.addModule('vinyl-processor.js?v=2');

  const response = await fetch(audioElement.currentSrc || audioElement.src);
  const decoded = await audioContext.decodeAudioData(await response.arrayBuffer());
  duration = decoded.duration;
  const channels = Array.from(
    { length: decoded.numberOfChannels },
    (_, channel) => decoded.getChannelData(channel).slice(),
  );

  vinylNode = new AudioWorkletNode(audioContext, 'vinyl-processor', {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [Math.max(1, Math.min(2, channels.length))],
  });
  vinylNode.connect(audioContext.destination);
  vinylNode.port.onmessage = ({ data }) => {
    if (data.type === 'position' && !dragging) {
      const nextPlayhead = wrapTime(data.seconds);
      if (nextPlayhead < playhead - duration / 2) displayOffset += 360;
      playhead = nextPlayhead;
    }
  };
  const transfer = channels.map(channel => channel.buffer);
  vinylNode.port.postMessage({ type: 'load', channels }, transfer);
  audioElement.removeAttribute('src');
  audioElement.load();
}

function ensureEngine() {
  if (!enginePromise) enginePromise = createEngine();
  return enginePromise;
}

async function startPlayback() {
  try {
    await ensureEngine();
    await audioContext.resume();
    playing = true;
    artworkButton.classList.add('is-started', 'is-playing');
    artworkButton.setAttribute('aria-label', 'Drag anywhere on the record to scratch the emperor penguin recording');
    setRate(1, 0.12);
  } catch (error) {
    console.error('The turntable could not be started.', error);
  }
}

artworkButton.addEventListener('click', (event) => {
  if (suppressClick) {
    suppressClick = false;
    event.preventDefault();
    return;
  }
  if (!vinylNode) {
    startPlayback();
  }
});

artworkButton.addEventListener('pointerdown', (event) => {
  if (event.button !== 0 || !vinylNode) return;
  dragging = true;
  movedDuringDrag = false;
  gestureWasPlaying = playing;
  lastPointerAngle = pointerAngle(event);
  lastPointerTime = performance.now();
  lastScratchRate = 0;
  artworkButton.style.setProperty('--scratch-intensity', '0');
  artworkButton.classList.add('is-scratching');
  try {
    artworkButton.setPointerCapture(event.pointerId);
  } catch {
    // The gesture still works in browsers without pointer capture.
  }
  event.preventDefault();
});

artworkButton.addEventListener('pointermove', (event) => {
  if (!dragging || !duration) return;
  const now = performance.now();
  const angle = pointerAngle(event);
  const deltaDegrees = shortestAngle(lastPointerAngle, angle);
  const deltaSeconds = Math.max(0.008, (now - lastPointerTime) / 1000);
  lastPointerAngle = angle;
  lastPointerTime = now;

  if (Math.abs(deltaDegrees) < 0.08) return;
  movedDuringDrag = true;
  const sensitivity = radiusSensitivity(event);
  displayAngle += deltaDegrees;
  playhead = wrapTime(playhead + (deltaDegrees / 360) * SCRATCH_SECONDS_PER_REVOLUTION * sensitivity);
  seek(playhead);

  const signedRate = Math.max(
    -3,
    Math.min(3, ((deltaDegrees / deltaSeconds) / PHYSICAL_DEGREES_PER_SECOND) * sensitivity),
  );
  lastScratchRate = signedRate;
  artworkButton.style.setProperty('--scratch-intensity', String(Math.min(1, Math.abs(signedRate) / 3)));
  setRate(signedRate);

  clearTimeout(silenceTimer);
  silenceTimer = setTimeout(() => {
    if (dragging) {
      const direction = lastScratchRate < 0 ? -1 : 1;
      const coastRate = lastScratchRate
        ? direction * Math.max(0.18, Math.min(0.75, Math.abs(lastScratchRate) * 0.35))
        : 1;
      lastScratchRate = coastRate;
      artworkButton.style.setProperty('--scratch-intensity', String(Math.min(0.25, Math.abs(coastRate) / 3)));
      setRate(coastRate, 0.22);
    }
  }, 70);
  event.preventDefault();
});

function finishScratch(event) {
  if (!dragging) return;
  clearTimeout(silenceTimer);
  dragging = false;
  displayOffset = displayAngle - (playhead / duration) * 360;
  suppressClick = movedDuringDrag;
  artworkButton.classList.remove('is-scratching');
  artworkButton.style.setProperty('--scratch-intensity', '0');
  if (gestureWasPlaying) {
    playing = true;
    artworkButton.classList.add('is-playing');
    setRate(1, movedDuringDrag ? 0.42 : 0.18);
  } else {
    playing = true;
    artworkButton.classList.add('is-playing');
    setRate(1, 0.3);
  }
  if (artworkButton.hasPointerCapture(event.pointerId)) {
    artworkButton.releasePointerCapture(event.pointerId);
  }
}

artworkButton.addEventListener('pointerup', finishScratch);
artworkButton.addEventListener('pointercancel', finishScratch);

requestAnimationFrame(renderDisc);
