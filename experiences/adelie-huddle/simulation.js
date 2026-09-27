// Pure simulation for the Adelie huddle prototype. All times are seconds.
const DEFAULTS = Object.freeze({
  width: 960, height: 600, seed: 73021, mode: 'colors', colonyCount: 5,
  radius: 15, maxPopulation: 44, initialPopulation: 4,
  spawnInterval: 2.5, spawnRamp: 0, minSpawnInterval: 2.5,
  centerSpeed: 41, maxSpeed: 65, separation: 115,
  facingTurnMargin: 105,
  groupSize: 5, linkDistance: 38, groupDwell: 0.52,
  windupTime: 0.26, launchTime: 0.72,
  grabTime: 2.15, grabRadius: 29,
});

function seededRandom(seed) {
  let value = (seed >>> 0) || 1;
  return () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (value >>> 0) / 4294967296;
  };
}

const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));

export function createGame(options = {}, randomSource) {
  const config = { ...DEFAULTS, ...options };
  const game = {
    config,
    width: config.width,
    height: config.height,
    penguins: [],
    phase: 'ready',
    stats: { launched: 0, groups: 0, time: 0 },
    heldId: null,
    grabPoint: null,
    update,
    grab,
    moveGrab,
    release,
    start,
    restart: start,
    pause() { if (game.phase === 'playing') game.phase = 'paused'; },
    resume() { if (game.phase === 'paused') game.phase = 'playing'; },
  };

  let random = randomSource || seededRandom(config.seed);
  let nextId = 1;
  let spawnClock = 0;
  let fixedRemainder = 0;
  let groupClocks = new Map();

  function rand() { return random(); }

  function inside(x, y) {
    return x >= config.radius && x <= game.width - config.radius &&
      y >= config.radius && y <= game.height - config.radius;
  }

  function clearAt(x, y, except = null, padding = 1) {
    if (!inside(x, y)) return false;
    for (const p of game.penguins) {
      if (p === except || p.state === 'held' || p.state === 'launching') continue;
      if (Math.hypot(p.x - x, p.y - y) < config.radius * 2 + padding) return false;
    }
    return true;
  }

  function findDrop(x, y, except) {
    const ox = clamp(x, config.radius, game.width - config.radius);
    const oy = clamp(y, config.radius, game.height - config.radius);
    const offset = config.radius * 0.6;
    const angle = rand() * Math.PI * 2;
    for (let ring = 0; ring <= 18; ring += 1) {
      const distance = offset + ring * config.radius * 0.72;
      const count = Math.max(8, ring * 9);
      for (let i = 0; i < count; i += 1) {
        const a = angle + i * Math.PI * 2 / count;
        const px = ox + Math.cos(a) * distance;
        const py = oy + Math.sin(a) * distance;
        if (clearAt(px, py, except, 1.5)) return { x: px, y: py };
      }
    }
    // A full board can still release the penguin: choose the least crowded spot.
    let best = { x: ox, y: oy, gap: -Infinity };
    for (let gy = config.radius; gy <= game.height - config.radius; gy += config.radius) {
      for (let gx = config.radius; gx <= game.width - config.radius; gx += config.radius) {
        let gap = Infinity;
        for (const p of game.penguins) {
          if (p === except || p.state === 'held' || p.state === 'launching') continue;
          gap = Math.min(gap, Math.hypot(gx - p.x, gy - p.y));
        }
        if (gap > best.gap) best = { x: gx, y: gy, gap };
      }
    }
    return best;
  }

  function makePenguin(x, y, edge = 'left') {
    return {
      id: nextId++, x, y, vx: 0, vy: 0,
      color: config.mode === 'single' ? 0 : Math.floor(rand() * config.colonyCount),
      state: 'walking', angle: 0, facing: x < game.width / 2 ? 1 : -1, spawnEdge: edge,
      age: 0, phaseOffset: rand() * 10, speedFactor: 0.82 + rand() * 0.36,
      heldFor: 0, launchProgress: 0, animationTime: 0,
    };
  }

  function spawn() {
    if (game.penguins.length >= config.maxPopulation) return false;
    const first = Math.floor(rand() * 4);
    for (let edgeOffset = 0; edgeOffset < 4; edgeOffset += 1) {
      const edge = (first + edgeOffset) % 4;
      for (let attempt = 0; attempt < 14; attempt += 1) {
        const along = 0.10 + rand() * 0.80;
        const r = config.radius + 2;
        let x; let y; let label;
        if (edge === 0) { x = r; y = r + along * (game.height - 2 * r); label = 'left'; }
        else if (edge === 1) { x = game.width - r; y = r + along * (game.height - 2 * r); label = 'right'; }
        else if (edge === 2) { x = r + along * (game.width - 2 * r); y = r; label = 'top'; }
        else { x = r + along * (game.width - 2 * r); y = game.height - r; label = 'bottom'; }
        if (clearAt(x, y, null, 2)) {
          game.penguins.push(makePenguin(x, y, label));
          return true;
        }
      }
    }
    return false;
  }

  function start() {
    game.penguins = [];
    game.phase = 'playing';
    game.stats = { launched: 0, groups: 0, time: 0 };
    game.heldId = null;
    game.grabPoint = null;
    random = randomSource || seededRandom(config.seed);
    nextId = 1;
    spawnClock = 0;
    fixedRemainder = 0;
    groupClocks = new Map();
    for (let i = 0; i < config.initialPopulation; i += 1) spawn();
    return game;
  }

  function grab(x, y) {
    if (game.phase !== 'playing' || game.heldId !== null) return false;
    let best = null;
    let bestDistance = config.grabRadius;
    for (const p of game.penguins) {
      if (p.state !== 'walking') continue;
      const distance = Math.hypot(p.x - x, p.y - y);
      if (distance < bestDistance) { best = p; bestDistance = distance; }
    }
    if (!best) return false;
    best.state = 'held';
    best.heldFor = 0;
    best.vx = 0;
    best.vy = 0;
    game.heldId = best.id;
    game.grabPoint = { x, y };
    return true;
  }

  function moveGrab(x, y) {
    if (game.heldId === null) return;
    game.grabPoint = { x, y };
  }

  function release() {
    if (game.heldId === null) return false;
    const p = game.penguins.find(item => item.id === game.heldId);
    if (p) {
      const point = game.grabPoint || { x: p.x, y: p.y };
      const landing = findDrop(point.x, point.y, p);
      p.x = landing.x;
      p.y = landing.y;
      p.vx = (rand() - 0.5) * 22;
      p.vy = (rand() - 0.5) * 22;
      p.state = 'walking';
      p.heldFor = 0;
    }
    game.heldId = null;
    game.grabPoint = null;
    return true;
  }

  function update(dt) {
    if (game.phase !== 'playing' || !Number.isFinite(dt) || dt <= 0) return;
    // Fixed steps keep collision and connected-group results stable across frame rates.
    fixedRemainder += Math.min(dt, 0.5);
    const step = 1 / 60;
    while (fixedRemainder >= step - 1e-9 && game.phase === 'playing') {
      tick(step);
      fixedRemainder -= step;
    }
  }

  function tick(dt) {
    game.stats.time += dt;
    spawnClock += dt;
    const interval = Math.max(config.minSpawnInterval,
      config.spawnInterval - config.spawnRamp * game.stats.time);
    if (spawnClock >= interval) {
      spawnClock -= interval;
      spawn();
    }
    move(dt);
    resolveCollisions();
    updateGroups(dt);
    updateLaunches(dt);
  }

  function move(dt) {
    const cx = game.width / 2;
    const cy = game.height / 2;
    for (const p of game.penguins) {
      p.age += dt;
      p.animationTime += dt;
      if (p.state === 'held') {
        p.heldFor += dt;
        const point = game.grabPoint || p;
        const struggle = 2 + 7 * Math.pow(clamp(p.heldFor / config.grabTime, 0, 1), 2);
        p.x = clamp(point.x + Math.sin(p.age * 29 + p.phaseOffset) * struggle,
          config.radius, game.width - config.radius);
        p.y = clamp(point.y - config.radius * 1.1 +
          Math.cos(p.age * 23 + p.phaseOffset) * struggle,
        config.radius, game.height - config.radius);
        p.angle = Math.sin(p.age * 24) * (0.07 + p.heldFor * 0.12);
        if (p.heldFor >= config.grabTime) release();
        continue;
      }
      if (p.state !== 'walking') continue;
      // Hold direction through the busy centre; collision nudges should not
      // make the walking sprite flip every frame.
      if (p.x < cx - config.facingTurnMargin) p.facing = 1;
      else if (p.x > cx + config.facingTurnMargin) p.facing = -1;
      const dx = cx - p.x;
      const dy = cy - p.y;
      const distance = Math.hypot(dx, dy) || 1;
      const orbit = Math.sin(p.age * 1.1 + p.phaseOffset) * 0.34;
      const desiredX = (dx / distance - dy / distance * orbit) * config.centerSpeed * p.speedFactor;
      const desiredY = (dy / distance + dx / distance * orbit) * config.centerSpeed * p.speedFactor;
      const response = Math.min(1, dt * 3.5);
      p.vx += (desiredX - p.vx) * response;
      p.vy += (desiredY - p.vy) * response;
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > config.maxSpeed) {
        p.vx *= config.maxSpeed / speed;
        p.vy *= config.maxSpeed / speed;
      }
      p.x = clamp(p.x + p.vx * dt, config.radius, game.width - config.radius);
      p.y = clamp(p.y + p.vy * dt, config.radius, game.height - config.radius);
      p.angle = Math.atan2(p.vy, p.vx);
    }
  }

  function resolveCollisions() {
    const birds = game.penguins.filter(p => p.state === 'walking' || p.state === 'windup');
    const minDistance = config.radius * 2 + 0.5;
    for (let iteration = 0; iteration < 3; iteration += 1) {
      for (let i = 0; i < birds.length; i += 1) {
        for (let j = i + 1; j < birds.length; j += 1) {
          const a = birds[i]; const b = birds[j];
          let dx = b.x - a.x; let dy = b.y - a.y;
          let distance = Math.hypot(dx, dy);
          if (distance >= minDistance) continue;
          if (distance < 0.001) {
            const angle = ((a.id * 19 + b.id * 7) % 360) * Math.PI / 180;
            dx = Math.cos(angle); dy = Math.sin(angle); distance = 1;
          }
          const overlap = minDistance - distance;
          const nx = dx / distance; const ny = dy / distance;
          const aFixed = a.state === 'windup';
          const bFixed = b.state === 'windup';
          const aShare = aFixed ? 0 : bFixed ? 1 : 0.5;
          const bShare = bFixed ? 0 : aFixed ? 1 : 0.5;
          a.x = clamp(a.x - nx * overlap * aShare, config.radius, game.width - config.radius);
          a.y = clamp(a.y - ny * overlap * aShare, config.radius, game.height - config.radius);
          b.x = clamp(b.x + nx * overlap * bShare, config.radius, game.width - config.radius);
          b.y = clamp(b.y + ny * overlap * bShare, config.radius, game.height - config.radius);
          if (!aFixed) { a.vx -= nx * config.separation * 0.01; a.vy -= ny * config.separation * 0.01; }
          if (!bFixed) { b.vx += nx * config.separation * 0.01; b.vy += ny * config.separation * 0.01; }
        }
      }
    }
  }

  function updateGroups(dt) {
    const walking = game.penguins.filter(p => p.state === 'walking');
    const seen = new Set();
    const nextClocks = new Map();
    for (const p of walking) {
      if (seen.has(p.id)) continue;
      const component = [];
      const queue = [p];
      seen.add(p.id);
      while (queue.length) {
        const current = queue.pop();
        component.push(current);
        for (const candidate of walking) {
          if (seen.has(candidate.id) || candidate.color !== current.color) continue;
          if (Math.hypot(current.x - candidate.x, current.y - candidate.y) <= config.linkDistance) {
            seen.add(candidate.id);
            queue.push(candidate);
          }
        }
      }
      if (component.length < config.groupSize) continue;
      const key = component.map(bird => bird.id).sort((a, b) => a - b).join(',');
      const elapsed = (groupClocks.get(key) || 0) + dt;
      if (elapsed >= config.groupDwell) {
        for (const bird of component) {
          bird.state = 'windup';
          bird.launchProgress = 0;
          bird.vx = 0;
          bird.vy = 0;
        }
        game.stats.groups += 1;
      } else nextClocks.set(key, elapsed);
    }
    groupClocks = nextClocks;
  }

  function updateLaunches(dt) {
    for (const p of game.penguins) {
      if (p.state === 'windup') {
        p.launchProgress += dt;
        if (p.launchProgress >= config.windupTime) {
          p.state = 'launching';
          p.launchProgress = 0;
        }
      } else if (p.state === 'launching') {
        p.launchProgress += dt;
        p.y -= (130 + 1150 * (p.launchProgress / config.launchTime) ** 2) * dt;
      }
    }
    const before = game.penguins.length;
    game.penguins = game.penguins.filter(p => p.state !== 'launching' ||
      (p.launchProgress < config.launchTime && p.y > -config.radius * 3));
    game.stats.launched += before - game.penguins.length;
  }

  return game;
}
