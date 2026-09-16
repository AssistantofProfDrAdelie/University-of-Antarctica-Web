(() => {
  'use strict';

  const HUDDLE_LOGIC_CONFIG = Object.freeze({
    population: Object.freeze({ desktop: 40, tablet: 28, mobile: 18 }),
    breakpoints: Object.freeze({ mobile: 600, tablet: 960 }),
    initialSpawnInterval: 1600, finalSpawnInterval: 760, spawnRampDuration: 24000,
    entryDuration: Object.freeze([1250, 2050]), exitDuration: 460, refillDelay: 900,
    reducedMotionPopulation: 16
  });

  const HUDDLE_PHYSICS_CONFIG = Object.freeze({
    collisionRadius: 21, minimumGap: 2, collisionTolerance: 0.12, movementStep: 5,
    huddleEnvelopeWidth: 0.58, huddleEnvelopeHeight: 0.54,
    maxEnvelopeWidth: 720, maxEnvelopeHeight: 470, approachLaneSpread: 0.82,
    maxCollisionIterations: 14, resizeResetThreshold: 60
  });

  const HUDDLE_RENDER_CONFIG = Object.freeze({
    className: 'huddle-entity', tokenWidth: 38, tokenHeight: 44,
    mobileTokenWidth: 34, mobileTokenHeight: 40, scaleVariation: 0.08
  });

  const LIFECYCLE = Object.freeze({
    SPAWNING: 'spawning', ENTERING: 'entering', SETTLED: 'settled',
    EXITING: 'exiting', REMOVED: 'removed'
  });

  const localDevelopment = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const parameters = new URLSearchParams(location.search);
  const testMode = localDevelopment && parameters.has('huddleTest');
  const manualTestMode = testMode && parameters.has('huddleManual');
  const physicsDebug = localDevelopment && parameters.has('huddlePhysicsDebug');
  const reducedMotionQuery = matchMedia('(prefers-reduced-motion: reduce)');

  class TriangleRenderer {
    constructor(stage, renderConfig, physicsConfig) {
      this.stage = stage;
      this.config = renderConfig;
      this.physics = physicsConfig;
    }

    createEntityElement(entity, tokenSize, onSelect) {
      const element = document.createElement('button');
      element.type = 'button';
      element.className = this.config.className;
      element.tabIndex = -1;
      element.setAttribute('aria-hidden', 'true');
      element.dataset.entityId = String(entity.id);
      element.dataset.state = entity.state;
      element.dataset.entryEdge = entity.entryEdge;
      element.style.setProperty('--huddle-token-width', `${tokenSize.width}px`);
      element.style.setProperty('--huddle-token-height', `${tokenSize.height}px`);
      element.style.setProperty('--huddle-collider-diameter', `${this.physics.collisionRadius * 2}px`);
      element.addEventListener('pointerdown', onSelect);
      this.stage.append(element);
      return element;
    }

    place(entity, tokenSize, rotation = 0) {
      const x = entity.position.x - tokenSize.width / 2;
      const y = entity.position.y - tokenSize.height / 2;
      entity.element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${entity.scale}) rotate(${rotation}deg)`;
      entity.element.style.zIndex = String(1 + Math.round(entity.position.y));
    }

    createLane(start, target) {
      const deltaX = target.x - start.x;
      const deltaY = target.y - start.y;
      const lane = document.createElement('div');
      lane.className = 'huddle-debug-lane';
      lane.style.width = `${Math.hypot(deltaX, deltaY)}px`;
      lane.style.transform = `translate3d(${start.x}px, ${start.y}px, 0) rotate(${Math.atan2(deltaY, deltaX)}rad)`;
      this.stage.append(lane);
      return lane;
    }

    remove(entity) {
      entity.laneElement?.remove();
      entity.element.remove();
    }
  }

  class HuddleEngine {
    constructor(overlay, stage, closeButton, envelopeElement) {
      this.overlay = overlay;
      this.stage = stage;
      this.closeButton = closeButton;
      this.envelopeElement = envelopeElement;
      this.renderer = new TriangleRenderer(stage, HUDDLE_RENDER_CONFIG, HUDDLE_PHYSICS_CONFIG);
      this.entities = new Map();
      this.settledIds = new Set();
      this.guidePoints = [];
      this.timers = new Set();
      this.frames = new Set();
      this.sessionState = 'idle';
      this.nextEntityId = 1;
      this.edgeIndex = 0;
      this.guideIndex = 0;
      this.startedAt = 0;
      this.spawnBlockedUntil = 0;
      this.scrollY = 0;
      this.previousScrollBehavior = '';
      this.previousFocus = null;
      this.sessionViewport = null;
      this.collisionErrors = [];
      this.contactLog = [];
      this.boundKeydown = this.onKeydown.bind(this);
      this.boundClose = this.stop.bind(this);
      this.boundResize = this.onResize.bind(this);
    }

    get reducedMotion() { return reducedMotionQuery.matches || (testMode && parameters.has('huddleReducedMotion')); }

    viewportProfile() {
      if (innerWidth <= HUDDLE_LOGIC_CONFIG.breakpoints.mobile) return 'mobile';
      if (innerWidth <= HUDDLE_LOGIC_CONFIG.breakpoints.tablet) return 'tablet';
      return 'desktop';
    }

    maxPopulation() { return HUDDLE_LOGIC_CONFIG.population[this.viewportProfile()]; }

    tokenSize() {
      const mobile = this.viewportProfile() === 'mobile';
      return {
        width: mobile ? HUDDLE_RENDER_CONFIG.mobileTokenWidth : HUDDLE_RENDER_CONFIG.tokenWidth,
        height: mobile ? HUDDLE_RENDER_CONFIG.mobileTokenHeight : HUDDLE_RENDER_CONFIG.tokenHeight
      };
    }

    envelope() {
      const width = Math.min(innerWidth * HUDDLE_PHYSICS_CONFIG.huddleEnvelopeWidth, HUDDLE_PHYSICS_CONFIG.maxEnvelopeWidth);
      const height = Math.min(innerHeight * HUDDLE_PHYSICS_CONFIG.huddleEnvelopeHeight, HUDDLE_PHYSICS_CONFIG.maxEnvelopeHeight);
      return {
        left: (innerWidth - width) / 2, right: (innerWidth + width) / 2,
        top: (innerHeight - height) / 2, bottom: (innerHeight + height) / 2,
        width, height, center: { x: innerWidth / 2, y: innerHeight / 2 }
      };
    }

    start() {
      if (this.sessionState === 'active') return;
      this.sessionState = 'active';
      this.nextEntityId = 1;
      this.edgeIndex = 0;
      this.guideIndex = 0;
      this.collisionErrors = [];
      this.contactLog = [];
      this.startedAt = performance.now();
      this.spawnBlockedUntil = 0;
      this.previousFocus = document.activeElement;
      this.scrollY = scrollY;
      this.previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      this.sessionViewport = { width: innerWidth, height: innerHeight };
      this.guidePoints = this.createGuidePoints(this.maxPopulation() * 3);
      this.updateDebugEnvelope();
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollY}px`;
      document.body.style.width = '100%';
      this.overlay.hidden = false;
      document.addEventListener('keydown', this.boundKeydown, true);
      addEventListener('resize', this.boundResize);
      this.closeButton.addEventListener('click', this.boundClose);
      this.closeButton.focus();
      if (this.reducedMotion) {
        const target = Math.min(this.maxPopulation(), HUDDLE_LOGIC_CONFIG.reducedMotionPopulation);
        let attempts = 0;
        while (this.settledIds.size < target && attempts < target * 6) {
          this.spawn({ immediate: true });
          attempts += 1;
        }
      } else if (!manualTestMode) {
        this.scheduleSpawn(120);
      }
    }

    stop() {
      if (this.sessionState !== 'active') return;
      this.sessionState = 'stopping';
      this.timers.forEach(timer => clearTimeout(timer));
      this.frames.forEach(frame => cancelAnimationFrame(frame));
      this.timers.clear();
      this.frames.clear();
      this.entities.forEach(entity => this.renderer.remove(entity));
      this.entities.clear();
      this.settledIds.clear();
      this.guidePoints = [];
      this.overlay.hidden = true;
      document.removeEventListener('keydown', this.boundKeydown, true);
      removeEventListener('resize', this.boundResize);
      this.closeButton.removeEventListener('click', this.boundClose);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      scrollTo(0, this.scrollY);
      document.documentElement.style.scrollBehavior = this.previousScrollBehavior;
      this.sessionState = 'idle';
      if (this.previousFocus instanceof HTMLElement) this.previousFocus.focus();
    }

    onKeydown(event) {
      if (event.key !== 'Escape' || this.sessionState !== 'active') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.stop();
    }

    onResize() {
      if (!this.sessionViewport) return;
      if (Math.max(Math.abs(innerWidth - this.sessionViewport.width), Math.abs(innerHeight - this.sessionViewport.height)) >= HUDDLE_PHYSICS_CONFIG.resizeResetThreshold) this.stop();
    }

    updateDebugEnvelope() {
      const envelope = this.envelope();
      Object.assign(this.envelopeElement.style, {
        left: `${envelope.left}px`, top: `${envelope.top}px`,
        width: `${envelope.width}px`, height: `${envelope.height}px`
      });
    }

    createGuidePoints(count) {
      const envelope = this.envelope();
      const radius = HUDDLE_PHYSICS_CONFIG.collisionRadius;
      const usableWidth = Math.max(radius * 4, envelope.width - radius * 2);
      const usableHeight = Math.max(radius * 4, envelope.height - radius * 2);
      const columns = Math.max(7, Math.ceil(Math.sqrt(count * 1.7)));
      const rows = Math.max(7, Math.ceil(count / columns) + 5);
      const candidates = [];
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const nx = (column / (columns - 1)) * 2 - 1;
          const ny = (row / (rows - 1)) * 2 - 1;
          const stagger = row % 2 ? 0.42 / columns : 0;
          const distance = (nx + stagger) ** 2 + ny ** 2;
          if (distance > 1.02) continue;
          const seed = row * columns + column + 1;
          candidates.push({
            x: envelope.center.x + (nx + stagger) * usableWidth * HUDDLE_PHYSICS_CONFIG.approachLaneSpread / 2 + Math.sin(seed * 8.17) * 5,
            y: envelope.center.y + ny * usableHeight * HUDDLE_PHYSICS_CONFIG.approachLaneSpread / 2 + Math.cos(seed * 5.31) * 5,
            distance
          });
        }
      }
      candidates.sort((a, b) => a.distance - b.distance || a.y - b.y || a.x - b.x);
      return candidates.slice(0, count);
    }

    schedule(callback, delay) {
      const timer = setTimeout(() => {
        this.timers.delete(timer);
        if (this.sessionState === 'active') callback();
      }, delay);
      this.timers.add(timer);
    }

    requestFrame(callback) {
      const frame = requestAnimationFrame(timestamp => {
        this.frames.delete(frame);
        if (this.sessionState === 'active') callback(timestamp);
      });
      this.frames.add(frame);
    }

    scheduleSpawn(delay = this.spawnInterval()) {
      if (this.sessionState !== 'active' || this.reducedMotion) return;
      this.schedule(() => {
        this.spawn();
        this.scheduleSpawn();
      }, testMode ? Math.min(delay, 55) : delay);
    }

    spawnInterval() {
      const progress = Math.min(1, (performance.now() - this.startedAt) / HUDDLE_LOGIC_CONFIG.spawnRampDuration);
      return HUDDLE_LOGIC_CONFIG.initialSpawnInterval + (HUDDLE_LOGIC_CONFIG.finalSpawnInterval - HUDDLE_LOGIC_CONFIG.initialSpawnInterval) * progress;
    }

    hasEnteringEntity() {
      return [...this.entities.values()].some(entity => entity.state === LIFECYCLE.ENTERING);
    }

    nextGuide() {
      const guide = this.guidePoints[this.guideIndex % this.guidePoints.length];
      this.guideIndex += 1;
      return guide || this.envelope().center;
    }

    entryPoint(edge, guide) {
      const radius = HUDDLE_PHYSICS_CONFIG.collisionRadius;
      const laneJitter = ((this.nextEntityId * 37) % 19) - 9;
      if (edge === 'left') return { x: -radius - 8, y: guide.y + laneJitter };
      if (edge === 'right') return { x: innerWidth + radius + 8, y: guide.y + laneJitter };
      if (edge === 'top') return { x: guide.x + laneJitter, y: -radius - 8 };
      return { x: guide.x + laneJitter, y: innerHeight + radius + 8 };
    }

    spawn(options = {}) {
      if (this.sessionState !== 'active' || this.entities.size >= this.maxPopulation() || performance.now() < this.spawnBlockedUntil) return null;
      if (!options.immediate && this.hasEnteringEntity()) return null;
      const edge = options.edge || ['left', 'right', 'top', 'bottom'][this.edgeIndex++ % 4];
      const guide = options.guide || this.nextGuide();
      const start = this.entryPoint(edge, guide);
      if (!this.isSpawnSafe(start)) return null;
      const id = this.nextEntityId++;
      const tokenSize = this.tokenSize();
      const entity = {
        id, state: LIFECYCLE.SPAWNING, entryEdge: edge, exitDirection: null,
        position: { ...start }, previousPosition: { ...start }, guide: { ...guide }, start: { ...start },
        scale: 1 + Math.sin(id * 3.17) * HUDDLE_RENDER_CONFIG.scaleVariation,
        radius: HUDDLE_PHYSICS_CONFIG.collisionRadius, contactWith: null, pathDistance: 0,
        element: null, laneElement: null, lastFrameAt: null
      };
      entity.element = this.renderer.createEntityElement(entity, tokenSize, event => {
        event.preventDefault();
        this.exitEntity(entity.id);
      });
      if (physicsDebug) entity.laneElement = this.renderer.createLane(start, guide);
      this.entities.set(id, entity);
      this.renderer.place(entity, tokenSize);
      if (options.immediate || this.reducedMotion) {
        const result = this.traceToFirstContact(entity.position, entity.guide, entity.radius);
        if (!result.valid) { this.discardEntity(entity); return null; }
        entity.position = result.position;
        entity.contactWith = result.contactWith;
        this.settleEntity(entity);
        return entity;
      }
      entity.state = LIFECYCLE.ENTERING;
      entity.element.dataset.state = entity.state;
      entity.element.dataset.contactWith = entity.contactWith === null ? '' : String(entity.contactWith);
      entity.element.style.transitionDuration = '0ms';
      const [minimum, maximum] = HUDDLE_LOGIC_CONFIG.entryDuration;
      const duration = testMode ? 230 : minimum + ((id * 137) % (maximum - minimum));
      entity.speed = this.distance(start, guide) / duration;
      this.requestFrame(timestamp => this.advanceEntity(entity, timestamp));
      return entity;
    }

    advanceEntity(entity, timestamp) {
      if (entity.state !== LIFECYCLE.ENTERING) return;
      const elapsed = entity.lastFrameAt === null ? 16 : Math.min(40, timestamp - entity.lastFrameAt);
      entity.lastFrameAt = timestamp;
      let remaining = entity.speed * elapsed;
      while (remaining > 0 && entity.state === LIFECYCLE.ENTERING) {
        const distanceToGuide = this.distance(entity.position, entity.guide);
        if (distanceToGuide <= 0.01) { this.settleEntity(entity); break; }
        const step = Math.min(remaining, HUDDLE_PHYSICS_CONFIG.movementStep, distanceToGuide);
        const proposed = this.moveToward(entity.position, entity.guide, step);
        const collision = this.firstCollision(proposed, entity.radius);
        if (collision) {
          entity.position = this.findLastSafePosition(entity.position, proposed, entity.radius);
          entity.contactWith = collision.id;
          this.settleEntity(entity);
          break;
        }
        entity.previousPosition = entity.position;
        entity.position = proposed;
        entity.pathDistance += step;
        remaining -= step;
      }
      this.renderer.place(entity, this.tokenSize());
      this.assertEnteringInvariant(entity);
      if (entity.state === LIFECYCLE.ENTERING) this.requestFrame(next => this.advanceEntity(entity, next));
    }

    traceToFirstContact(start, target, radius) {
      let current = { ...start };
      while (this.distance(current, target) > 0.01) {
        const proposed = this.moveToward(current, target, Math.min(HUDDLE_PHYSICS_CONFIG.movementStep, this.distance(current, target)));
        const collision = this.firstCollision(proposed, radius);
        if (collision) {
          const position = this.findLastSafePosition(current, proposed, radius);
          return { valid: this.insideEnvelope(position, radius) && !this.firstCollision(position, radius), position, contactWith: collision.id };
        }
        current = proposed;
      }
      return { valid: this.insideEnvelope(current, radius) && !this.firstCollision(current, radius), position: current, contactWith: null };
    }

    settleEntity(entity) {
      if (!this.insideEnvelope(entity.position, entity.radius) || this.firstCollision(entity.position, entity.radius)) {
        this.discardEntity(entity);
        return false;
      }
      entity.state = LIFECYCLE.SETTLED;
      entity.element.dataset.state = entity.state;
      entity.element.dataset.contactWith = entity.contactWith === null ? '' : String(entity.contactWith);
      entity.laneElement?.remove();
      entity.laneElement = null;
      this.settledIds.add(entity.id);
      this.renderer.place(entity, this.tokenSize());
      if (entity.contactWith !== null) this.contactLog.push({ id: entity.id, edge: entity.entryEdge, contactWith: entity.contactWith, position: { ...entity.position } });
      this.assertSettledInvariant();
      return true;
    }

    discardEntity(entity) {
      entity.state = LIFECYCLE.REMOVED;
      this.renderer.remove(entity);
      this.entities.delete(entity.id);
    }

    isSpawnSafe(position) {
      const closeRect = this.closeButton.getBoundingClientRect();
      const closestX = Math.max(closeRect.left, Math.min(position.x, closeRect.right));
      const closestY = Math.max(closeRect.top, Math.min(position.y, closeRect.bottom));
      if (Math.hypot(position.x - closestX, position.y - closestY) < HUDDLE_PHYSICS_CONFIG.collisionRadius) return false;
      return ![...this.entities.values()].some(entity =>
        [LIFECYCLE.ENTERING, LIFECYCLE.SETTLED].includes(entity.state) &&
        this.distance(position, entity.position) < entity.radius + HUDDLE_PHYSICS_CONFIG.collisionRadius + HUDDLE_PHYSICS_CONFIG.minimumGap
      );
    }

    firstCollision(position, radius, ignoredId = null) {
      const required = radius + HUDDLE_PHYSICS_CONFIG.collisionRadius + HUDDLE_PHYSICS_CONFIG.minimumGap;
      for (const id of this.settledIds) {
        if (id === ignoredId) continue;
        const other = this.entities.get(id);
        if (other && this.distance(position, other.position) < required - HUDDLE_PHYSICS_CONFIG.collisionTolerance) return other;
      }
      return null;
    }

    findLastSafePosition(safe, colliding, radius) {
      let low = { ...safe };
      let high = { ...colliding };
      for (let iteration = 0; iteration < HUDDLE_PHYSICS_CONFIG.maxCollisionIterations; iteration += 1) {
        const midpoint = { x: (low.x + high.x) / 2, y: (low.y + high.y) / 2 };
        if (this.firstCollision(midpoint, radius)) high = midpoint;
        else low = midpoint;
      }
      return low;
    }

    assertEnteringInvariant(entity) {
      const collision = this.firstCollision(entity.position, entity.radius, entity.id);
      if (!collision) return;
      const message = `Huddle physics invariant: entering entity ${entity.id} penetrated settled entity ${collision.id}`;
      this.collisionErrors.push(message);
      if (localDevelopment) console.error(message);
    }

    assertSettledInvariant() {
      const settled = [...this.settledIds].map(id => this.entities.get(id)).filter(Boolean);
      const required = HUDDLE_PHYSICS_CONFIG.collisionRadius * 2 + HUDDLE_PHYSICS_CONFIG.minimumGap;
      for (let first = 0; first < settled.length; first += 1) {
        for (let second = first + 1; second < settled.length; second += 1) {
          const actual = this.distance(settled[first].position, settled[second].position);
          if (actual >= required - HUDDLE_PHYSICS_CONFIG.collisionTolerance) continue;
          const message = `Huddle physics invariant: settled entities ${settled[first].id} and ${settled[second].id} overlap (${actual.toFixed(3)} < ${required})`;
          this.collisionErrors.push(message);
          if (localDevelopment) console.error(message);
        }
      }
    }

    insideEnvelope(position, radius) {
      const envelope = this.envelope();
      return position.x >= envelope.left + radius && position.x <= envelope.right - radius &&
        position.y >= envelope.top + radius && position.y <= envelope.bottom - radius;
    }

    distance(first, second) { return Math.hypot(second.x - first.x, second.y - first.y); }

    moveToward(from, to, distance) {
      const total = this.distance(from, to);
      if (total <= distance || total === 0) return { ...to };
      const ratio = distance / total;
      return { x: from.x + (to.x - from.x) * ratio, y: from.y + (to.y - from.y) * ratio };
    }

    nearestEdge(position) {
      return [['left', position.x], ['right', innerWidth - position.x], ['top', position.y], ['bottom', innerHeight - position.y]].sort((a, b) => a[1] - b[1])[0][0];
    }

    exitPoint(edge, current) {
      const radius = HUDDLE_PHYSICS_CONFIG.collisionRadius;
      if (edge === 'left') return { x: -radius - 40, y: current.y };
      if (edge === 'right') return { x: innerWidth + radius + 40, y: current.y };
      if (edge === 'top') return { x: current.x, y: -radius - 40 };
      return { x: current.x, y: innerHeight + radius + 40 };
    }

    exitEntity(id) {
      const entity = this.entities.get(id);
      if (!entity || ![LIFECYCLE.ENTERING, LIFECYCLE.SETTLED].includes(entity.state)) return false;
      this.settledIds.delete(entity.id);
      entity.state = LIFECYCLE.EXITING;
      entity.exitDirection = this.nearestEdge(entity.position);
      entity.element.dataset.state = entity.state;
      entity.laneElement?.remove();
      entity.laneElement = null;
      this.spawnBlockedUntil = Math.max(this.spawnBlockedUntil, performance.now() + (testMode ? 100 : HUDDLE_LOGIC_CONFIG.refillDelay));
      const duration = this.reducedMotion ? 0 : (testMode ? 80 : HUDDLE_LOGIC_CONFIG.exitDuration);
      entity.element.style.transitionDuration = `${duration}ms`;
      entity.position = this.exitPoint(entity.exitDirection, entity.position);
      const rotation = entity.exitDirection === 'left' ? -9 : entity.exitDirection === 'right' ? 9 : 0;
      this.renderer.place(entity, this.tokenSize(), rotation);
      this.schedule(() => this.removeEntity(entity), duration + 25);
      return true;
    }

    removeEntity(entity) {
      if (!this.entities.has(entity.id)) return;
      entity.state = LIFECYCLE.REMOVED;
      entity.element.dataset.state = entity.state;
      this.renderer.remove(entity);
      this.entities.delete(entity.id);
      if (this.reducedMotion) this.schedule(() => this.spawn({ immediate: true }), testMode ? 100 : HUDDLE_LOGIC_CONFIG.refillDelay);
    }

    minimumSettledSeparation() {
      const settled = [...this.settledIds].map(id => this.entities.get(id)).filter(Boolean);
      let minimum = Infinity;
      for (let first = 0; first < settled.length; first += 1) for (let second = first + 1; second < settled.length; second += 1) minimum = Math.min(minimum, this.distance(settled[first].position, settled[second].position));
      return minimum === Infinity ? null : minimum;
    }

    snapshot() {
      const edgeCounts = { left: 0, right: 0, top: 0, bottom: 0 };
      const stateCounts = {};
      this.entities.forEach(entity => {
        edgeCounts[entity.entryEdge] += 1;
        stateCounts[entity.state] = (stateCounts[entity.state] || 0) + 1;
      });
      return {
        sessionState: this.sessionState, activeEntities: this.entities.size,
        settledEntities: this.settledIds.size, maxPopulation: this.maxPopulation(),
        edgeCounts, stateCounts, minimumSettledSeparation: this.minimumSettledSeparation(),
        requiredSeparation: HUDDLE_PHYSICS_CONFIG.collisionRadius * 2 + HUDDLE_PHYSICS_CONFIG.minimumGap,
        collisionErrors: [...this.collisionErrors], contactLog: [...this.contactLog],
        entities: [...this.entities.values()].map(entity => ({
          id: entity.id, state: entity.state, entryEdge: entity.entryEdge,
          exitDirection: entity.exitDirection, position: { ...entity.position },
          start: { ...entity.start }, guide: { ...entity.guide },
          contactWith: entity.contactWith, pathDistance: entity.pathDistance
        })),
        reducedMotion: this.reducedMotion, timerCount: this.timers.size, frameCount: this.frames.size
      };
    }
  }

  function setupHuddlePrototype() {
    const nav = document.querySelector('.site-header nav');
    if (!nav || document.querySelector('.huddle-start')) return;
    const startButton = document.createElement('button');
    startButton.type = 'button';
    startButton.className = 'huddle-start';
    startButton.textContent = 'Huddle';
    startButton.setAttribute('aria-haspopup', 'dialog');
    nav.prepend(startButton);
    const overlay = document.createElement('div');
    overlay.className = `huddle-overlay${physicsDebug ? ' huddle-physics-debug' : ''}`;
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Huddle logic prototype');
    overlay.innerHTML = '<div class="huddle-stage" aria-hidden="true"><div class="huddle-debug-envelope"></div></div><button class="huddle-close" type="button" aria-label="Close Huddle">×</button>';
    document.body.append(overlay);
    const engine = new HuddleEngine(overlay, overlay.querySelector('.huddle-stage'), overlay.querySelector('.huddle-close'), overlay.querySelector('.huddle-debug-envelope'));
    startButton.addEventListener('click', () => engine.start());
    if (localDevelopment) {
      window.huddlePrototype = Object.freeze({
        start: () => engine.start(), stop: () => engine.stop(), snapshot: () => engine.snapshot(),
        exitEntity: id => engine.exitEntity(id),
        spawnFromEdge: edge => engine.spawn({ edge, guide: engine.envelope().center }),
        config: HUDDLE_LOGIC_CONFIG, physicsConfig: HUDDLE_PHYSICS_CONFIG,
        renderConfig: HUDDLE_RENDER_CONFIG, lifecycle: LIFECYCLE
      });
    }
  }

  setupHuddlePrototype();
})();
