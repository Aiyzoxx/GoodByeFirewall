var QuickLiquid = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/quick-liquid/dist/index.mjs
  var index_exports = {};
  __export(index_exports, {
    AnimationScheduler: () => AnimationScheduler,
    DEFAULT_CONFIG: () => DEFAULT_CONFIG,
    LiquidButton: () => LiquidButton,
    LiquidDrag: () => LiquidDrag,
    LiquidGesture: () => LiquidGesture,
    LiquidGlassEngine: () => LiquidGlassEngine,
    LiquidGroup: () => LiquidGroup,
    LiquidLayoutAnimation: () => LiquidLayoutAnimation,
    LiquidMetaball: () => LiquidMetaball,
    LiquidMorph: () => LiquidMorph,
    LiquidTabBar: () => LiquidTabBar,
    LiquidTransition: () => LiquidTransition,
    MATERIAL_PRESETS: () => MATERIAL_PRESETS,
    SPRING_PRESETS: () => SPRING_PRESETS,
    Spring: () => Spring,
    SpringVector: () => SpringVector,
    generateMergeBlob: () => generateMergeBlob
  });

  // node_modules/quick-liquid/dist/chunk-4TLGP4GF.mjs
  var DEFAULT_CONFIG = {
    blur: 3,
    saturation: 1.5,
    tint: "255, 255, 255",
    tintOpacity: 0.04,
    refractionStrength: 22,
    bezelWidth: 34,
    thickness: 24,
    ior: 1.5,
    chromaticAberration: 0.18,
    lightAngle: -35,
    edgeHighlight: 0.9,
    specularStrength: 0.26,
    fresnelPower: 2.2,
    // Off by default: a hover-triggered rim brightening reads as a broken
    // hover state in practice — light shouldn't change because a cursor
    // entered the element. Opt-in only.
    hoverLighting: false,
    cursorTracking: false,
    parallax: false,
    inertia: true,
    dynamicLighting: false,
    elevation: 1,
    noiseOpacity: 0,
    noiseScale: 1,
    borderRadius: 28,
    quality: "high",
    refractionMode: "auto",
    appearance: "auto",
    tintStrength: 1,
    respectPreferences: true,
    dispersionMode: "auto"
  };
  var MATERIAL_PRESETS = {
    // Inspired by clear Liquid Glass — transparent, strong lensing
    clear: { blur: 2, saturation: 1.55, tintOpacity: 0.03, refractionStrength: 26, bezelWidth: 36, thickness: 26 },
    thin: { blur: 6, saturation: 1.5, tintOpacity: 0.05, refractionStrength: 18, bezelWidth: 26, thickness: 18 },
    // Inspired by regular Liquid Glass — frosted, softer lensing
    regular: { blur: 14, saturation: 1.7, tintOpacity: 0.09, refractionStrength: 16, bezelWidth: 30, thickness: 20 },
    thick: { blur: 22, saturation: 1.8, tintOpacity: 0.13, refractionStrength: 12, bezelWidth: 28, thickness: 18 },
    ultra: { blur: 30, saturation: 1.85, tintOpacity: 0.17, refractionStrength: 10, bezelWidth: 26, thickness: 16 },
    adaptive: { blur: 12, saturation: 1.6, tintOpacity: 0.06, refractionStrength: 18, bezelWidth: 30, thickness: 20, adaptiveTint: true }
  };
  function resolveGlassConfig(input) {
    const config = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== void 0));
    const preset = config.material ? MATERIAL_PRESETS[config.material] : void 0;
    const resolved = { ...DEFAULT_CONFIG, ...preset, ...config };
    if (config.distortionStrength !== void 0 && config.refractionStrength === void 0) resolved.refractionStrength = config.distortionStrength;
    if (config.dynamicLighting && config.cursorTracking === void 0) resolved.cursorTracking = true;
    const bounds = {
      blur: [0, 80],
      saturation: [0, 4],
      tintOpacity: [0, 1],
      refractionStrength: [0, 150],
      bezelWidth: [0.5, 256],
      thickness: [0.1, 256],
      ior: [1, 3],
      chromaticAberration: [0, 1],
      edgeHighlight: [0, 1],
      specularStrength: [0, 1],
      fresnelPower: [1, 6],
      elevation: [0, 5],
      noiseOpacity: [0, 1],
      noiseScale: [0.1, 10],
      borderRadius: [0, 1e4],
      backdropLuminance: [0, 1],
      tintStrength: [0, 5]
    };
    for (const [key, range] of Object.entries(bounds)) {
      const k = key;
      const value = resolved[k];
      if (value === void 0) continue;
      const [lo, hi] = range;
      resolved[key] = typeof value === "number" && Number.isFinite(value) ? Math.max(lo, Math.min(hi, value)) : DEFAULT_CONFIG[k];
    }
    if (!Number.isFinite(resolved.lightAngle)) resolved.lightAngle = DEFAULT_CONFIG.lightAngle;
    return resolved;
  }
  var PROFILE_SAMPLES = 512;
  var profiles = /* @__PURE__ */ new Map();
  function refractionProfile(thickness, bezel, ior) {
    const ratio = thickness / Math.max(bezel, 1e-3);
    const key = `${ratio}|${ior}`;
    const hit = profiles.get(key);
    if (hit) {
      profiles.delete(key);
      profiles.set(key, hit);
      return hit;
    }
    const lut = new Float32Array(PROFILE_SAMPLES + 1);
    if (ior <= 1 || thickness <= 0) return lut;
    const eta = 1 / Math.max(1, ior);
    let peak = 0;
    for (let i = 1; i < PROFILE_SAMPLES; i++) {
      const s = i / PROFILE_SAMPLES;
      const root = Math.sqrt(s * (2 - s));
      const slope = ratio * (1 - s) / root;
      const cosI = 1 / Math.sqrt(1 + slope * slope);
      const sinI = slope * cosI;
      const k = eta * cosI - Math.sqrt(Math.max(0, 1 - eta * eta * sinI * sinI));
      const displacement = root * Math.abs(k * sinI / (-eta + k * cosI));
      lut[i] = displacement;
      peak = Math.max(peak, displacement);
    }
    if (peak > 0) for (let i = 1; i < PROFILE_SAMPLES; i++) lut[i] /= peak;
    if (profiles.size >= 32) profiles.delete(profiles.keys().next().value);
    profiles.set(key, lut);
    return lut;
  }
  function rasterizeLens(g) {
    const { width: w, height: h, mapWidth: mw, mapHeight: mh } = g;
    const sx = mw / w, sy = mh / h;
    const padX = Math.ceil(g.padding * sx), padY = Math.ceil(g.padding * sy);
    const bw = mw + 2 * padX, bh = mh + 2 * padY;
    const data = new Uint8ClampedArray(bw * bh * 4);
    const littleEndian = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;
    new Uint32Array(data.buffer).fill(littleEndian ? 4278222976 : 2155872511);
    const radius = Math.min(g.radius, w / 2, h / 2);
    const bezel = Math.min(g.bezel, w / 2, h / 2);
    const profile = refractionProfile(g.thickness, bezel, g.ior);
    const band = Math.max(radius, bezel) + 1 / Math.min(sx, sy);
    const qw = Math.ceil(mw / 2), qh = Math.ceil(mh / 2);
    let pixelsComputed = 0;
    const put = (x, y, dx, dy) => {
      const i = ((y + padY) * bw + x + padX) * 4;
      data[i] = 128 + dx;
      data[i + 1] = 128 + dy;
    };
    for (let y = 0; y < qh; y++) {
      const ey = (y + 0.5) / sy;
      const limit = ey <= bezel ? qw : Math.min(qw, Math.ceil((ey <= band ? band : bezel + 1 / sx) * sx));
      for (let x = 0; x < limit; x++) {
        const ex = (x + 0.5) / sx;
        const qx = radius - ex, qy = radius - ey;
        let distance, nx, ny;
        if (qx > 0 && qy > 0) {
          const length = Math.hypot(qx, qy);
          distance = radius - length;
          nx = qx / length;
          ny = qy / length;
        } else if (qx > qy) {
          distance = ex;
          nx = 1;
          ny = 0;
        } else {
          distance = ey;
          nx = 0;
          ny = 1;
        }
        if (distance <= 0 || distance >= bezel) continue;
        pixelsComputed++;
        const f = distance / bezel * PROFILE_SAMPLES;
        const i = Math.min(PROFILE_SAMPLES - 1, Math.floor(f));
        const displacement = profile[i] + (profile[i + 1] - profile[i]) * (f - i);
        const dx = x === mw - 1 - x ? 0 : Math.round(nx * displacement * 127);
        const dy = y === mh - 1 - y ? 0 : Math.round(ny * displacement * 127);
        put(x, y, dx, dy);
        put(mw - 1 - x, y, -dx, dy);
        put(x, mh - 1 - y, dx, -dy);
        put(mw - 1 - x, mh - 1 - y, -dx, -dy);
      }
    }
    return { data, width: bw, height: bh, padX, padY, mapWidth: mw, mapHeight: mh, pixelsComputed };
  }
  function usesDispersion(strength, chroma, blur, quality, mode = "auto") {
    if (chroma <= 0.01 || quality === "low") return false;
    return mode === "exact" || 0.24 * chroma * strength >= 0.2 * blur;
  }
  function filterPadding(blur) {
    return Math.ceil((2.5 * blur + 2) / 8) * 8;
  }
  var DARK_TINT = "20, 24, 34";
  var LUMA_LIGHT = 0.8;
  var LUMA_DARK = 0.1;
  var uid = 0;
  var mapCache = /* @__PURE__ */ new Map();
  var cacheHits = 0;
  var mapsGenerated = 0;
  function releaseMap(key) {
    const entry = mapCache.get(key);
    if (!entry) return;
    entry.refs--;
    if (entry.refs === 0 && entry.map) {
      URL.revokeObjectURL(entry.map.url);
      mapCache.delete(key);
    }
  }
  function acquireLensMap(w, h, radius, bezel, thickness, ior, resCap, blur) {
    const rho = Math.min(1, resCap / Math.max(w, h));
    const mw = Math.max(4, Math.round(w * rho)), mh = Math.max(4, Math.round(h * rho));
    const padding = filterPadding(blur);
    const key = [w, h, mw, mh, radius, bezel, thickness, ior, padding].join("|");
    let entry = mapCache.get(key);
    if (entry) {
      entry.refs++;
      cacheHits++;
    } else {
      const t0 = performance.now();
      const raster = rasterizeLens({ width: w, height: h, radius, bezel, thickness, ior, mapWidth: mw, mapHeight: mh, padding });
      const canvas = document.createElement("canvas");
      canvas.width = raster.width;
      canvas.height = raster.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return Promise.reject(new Error("Canvas 2D unavailable"));
      ctx.putImageData(new ImageData(raster.data, raster.width, raster.height), 0, 0);
      const genMs = performance.now() - t0, encodeStart = performance.now();
      mapsGenerated++;
      entry = { refs: 1, promise: new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Unable to encode refraction map"));
            return;
          }
          const { data: _data, ...dimensions } = raster;
          resolve({ ...dimensions, url: URL.createObjectURL(blob), genMs, encodeMs: performance.now() - encodeStart });
        }, "image/png");
      }) };
      const owned = entry;
      entry.promise = entry.promise.then((map) => {
        owned.map = map;
        return map;
      }, (error) => {
        if (mapCache.get(key) === owned) mapCache.delete(key);
        throw error;
      });
      mapCache.set(key, entry);
    }
    return entry.promise.then((map) => ({ map, key }));
  }
  var _LiquidGlassEngine = class _LiquidGlassEngine2 {
    constructor(element, config = {}) {
      this.ownedContent = null;
      this.rimDisk = null;
      this.sheenDisk = null;
      this.motionQuery = null;
      this.transparencyQuery = null;
      this.animations = /* @__PURE__ */ new Set();
      this.animationTimers = /* @__PURE__ */ new Set();
      this.lastLightTick = 0;
      this._lightBakes = 0;
      this._filterBuilds = 0;
      this._mapError = null;
      this.lensLayer = null;
      this.tintLayer = null;
      this.sheenLayer = null;
      this.rimLayer = null;
      this.noiseLayer = null;
      this.svgEl = null;
      this.dispNodes = [];
      this.mapRefKey = null;
      this.lensMap = null;
      this.resizeObs = null;
      this.resizeRaf = null;
      this.lastW = 0;
      this.lastH = 0;
      this.destroyed = false;
      this.rafId = null;
      this.animatingLight = false;
      this.lensBuildVersion = 0;
      this.angleVelocity = 0;
      this.currentParallaxX = 0;
      this.targetParallaxX = 0;
      this.parallaxXVelocity = 0;
      this.currentParallaxY = 0;
      this.targetParallaxY = 0;
      this.parallaxYVelocity = 0;
      this.currentHoverGlow = 0;
      this.targetHoverGlow = 0;
      this.hoverGlowVelocity = 0;
      this._frameCount = 0;
      this._totalTime = 0;
      this._lastTime = 0;
      this._mapGenMs = 0;
      this._mapPixels = 0;
      this.pressHandlers = null;
      this.schemeQuery = null;
      this.schemeListener = null;
      this.onVisibility = () => {
        if (document.hidden) this.stopLight();
      };
      this.onPreferences = () => {
        if (this.destroyed) return;
        if (this.reduceMotion()) {
          this.stopLight();
          this.cancelAnimations();
          this.currentAngle = this.targetAngle = this.cfg.lightAngle;
          this.currentHoverGlow = this.targetHoverGlow = 0;
          this.el.style.transform = this.originalStyle.get("transform")[0];
          this.el.style.visibility = this.originalStyle.get("visibility")[0];
        }
        this.syncPointerListeners();
        this.queueRebuild();
        this.updateTint();
        this.bakeLight();
        this.updateRings();
      };
      this.lensFilterRef = null;
      this.el = element;
      this.overrides = { ...config };
      this.cfg = resolveGlassConfig(this.overrides);
      this.originalStyle = new Map(["position", "border-radius", "overflow", "box-shadow", "transform", "opacity", "animation", "transition", "visibility"].map((key) => [key, [element.style.getPropertyValue(key), element.style.getPropertyPriority(key)]]));
      this.id = `ql${++uid}`;
      this.currentAngle = this.cfg.lightAngle;
      this.targetAngle = this.cfg.lightAngle;
      _LiquidGlassEngine2._registry.add(this);
      if (typeof globalThis !== "undefined" && !globalThis.__QUICK_LIQUID__) {
        globalThis.__QUICK_LIQUID__ = { metrics: () => _LiquidGlassEngine2.collectMetrics() };
      }
      this.mount();
    }
    /** Aggregate metrics across all live engines (also exposed on
        globalThis.__QUICK_LIQUID__ for tooling/debugging). */
    static collectMetrics() {
      const engines = [..._LiquidGlassEngine2._registry].map((e) => ({
        id: e.id,
        size: `${e.lastW}x${e.lastH}`,
        mapGenMs: e._mapGenMs,
        mapPixelsComputed: e._mapPixels,
        mapKey: e.mapRefKey,
        quality: e.cfg.quality,
        dispTaps: e.dispNodes.length,
        mapEncodeMs: e.lensMap?.encodeMs ?? 0,
        mapBytes: e.lensMap ? e.lensMap.width * e.lensMap.height * 4 : 0,
        lightBakes: e._lightBakes,
        filterBuilds: e._filterBuilds,
        mapError: e._mapError
      }));
      return {
        engineCount: engines.length,
        uniqueMaps: mapCache.size,
        cacheHits,
        mapsGenerated,
        engines
      };
    }
    /* ─────────────────────────── MOUNT ─────────────────────────── */
    mount() {
      const el = this.el;
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      el.style.borderRadius = `${this.cfg.borderRadius}px`;
      el.style.overflow = "hidden";
      this.lastW = el.offsetWidth;
      this.lastH = el.offsetHeight;
      if (!this._contentEl()) {
        this.ownedContent = document.createElement("div");
        this.ownedContent.className = "ql-content";
        this.ownedContent.style.cssText = "position:relative;z-index:10";
        this.ownedContent.append(...Array.from(el.childNodes));
        el.append(this.ownedContent);
      }
      this.motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
      this.transparencyQuery = matchMedia("(prefers-reduced-transparency: reduce)");
      this.motionQuery.addEventListener("change", this.onPreferences);
      this.transparencyQuery.addEventListener("change", this.onPreferences);
      this.createLayers();
      this.applyDepth();
      this.queueRebuild();
      this.resizeObs = new ResizeObserver(() => this.onResize());
      this.resizeObs.observe(el);
      document.addEventListener("visibilitychange", this.onVisibility);
      this.syncPointerListeners();
      this.syncSchemeListener();
    }
    /* ─────────────────── APPEARANCE (dark mode) ─────────────────── */
    isDark() {
      const a = this.cfg.appearance ?? "auto";
      if (a === "dark") return true;
      if (a === "light") return false;
      if (this.schemeQuery) return this.schemeQuery.matches;
      return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches;
    }
    /** Backdrop luminance 0..1 — explicit config wins, else implied by appearance. */
    backdropLuma() {
      const L = this.cfg.backdropLuminance;
      if (L !== void 0 && Number.isFinite(L)) return Math.min(1, Math.max(0, L));
      return this.isDark() ? LUMA_DARK : LUMA_LIGHT;
    }
    syncSchemeListener() {
      const wanted = (this.cfg.appearance ?? "auto") === "auto" && typeof matchMedia === "function";
      if (wanted && !this.schemeQuery) {
        this.schemeQuery = matchMedia("(prefers-color-scheme: dark)");
        this.schemeListener = () => {
          if (this.destroyed) return;
          this.updateTint();
          this.bakeLight();
          this.updateRings();
          this.applyDepth();
        };
        this.schemeQuery.addEventListener("change", this.schemeListener);
      } else if (!wanted && this.schemeQuery) {
        if (this.schemeListener) this.schemeQuery.removeEventListener("change", this.schemeListener);
        this.schemeQuery = null;
        this.schemeListener = null;
      }
    }
    reduceMotion() {
      return this.cfg.respectPreferences !== false && !!this.motionQuery?.matches;
    }
    reduceTransparency() {
      return this.cfg.respectPreferences !== false && !!this.transparencyQuery?.matches;
    }
    stopLight() {
      if (this.rafId !== null) cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.animatingLight = false;
      this.lastLightTick = 0;
      this.angleVelocity = this.parallaxXVelocity = this.parallaxYVelocity = this.hoverGlowVelocity = 0;
    }
    queueRebuild() {
      ++this.lensBuildVersion;
      if (this.resizeRaf !== null || this.destroyed) return;
      this.resizeRaf = requestAnimationFrame(() => {
        this.resizeRaf = null;
        if (this.destroyed) return;
        this.sizeLight();
        this.bakeLight();
        this.updateRings();
        void this.rebuildLensFilter().catch((error) => {
          if (this.destroyed) return;
          this._mapError = String(error);
          this.teardownFilter();
          this.updateLensStyle();
        });
      });
    }
    onResize() {
      if (this.destroyed) return;
      const w = this.el.offsetWidth, h = this.el.offsetHeight;
      if (w === this.lastW && h === this.lastH) return;
      this.lastW = w;
      this.lastH = h;
      this.queueRebuild();
    }
    createLayers() {
      [this.lensLayer, this.tintLayer, this.sheenLayer, this.rimLayer, this.noiseLayer].forEach((l) => l?.remove());
      const mk = (cls) => {
        const div = document.createElement("div");
        div.className = cls;
        div.setAttribute("aria-hidden", "true");
        Object.assign(div.style, {
          position: "absolute",
          inset: "0",
          borderRadius: "inherit",
          pointerEvents: "none"
        });
        return div;
      };
      this.lensLayer = mk("ql-lens");
      this.tintLayer = mk("ql-tint");
      this.sheenLayer = mk("ql-sheen");
      this.rimLayer = mk("ql-rim");
      this.noiseLayer = null;
      this.rimDisk = document.createElement("div");
      this.sheenDisk = document.createElement("div");
      this.rimLayer.append(this.rimDisk);
      this.sheenLayer.append(this.sheenDisk);
      const content = this._contentEl();
      for (const layer of [this.lensLayer, this.tintLayer, this.sheenLayer, this.rimLayer, this.noiseLayer]) {
        if (layer) this.el.insertBefore(layer, content);
      }
      this.updateLensStyle();
      this.updateTint();
      this.sizeLight();
      this.bakeLight();
      this.updateRings();
      this.updateNoise();
    }
    _contentEl() {
      return this.el.querySelector(":scope > .ql-content");
    }
    lensFilterString() {
      const cfg = this.cfg;
      if (this.reduceTransparency()) return "none";
      const parts = [];
      if (this.svgEl) parts.push(`url(#${this.id})`);
      if (cfg.saturation !== 1) parts.push(`saturate(${cfg.saturation})`);
      if (cfg.blur > 0) parts.push(`blur(${cfg.blur}px)`);
      return parts.join(" ") || "none";
    }
    /**
     * CHROMIUM QUIRK: if backdrop-filter is first applied WITHOUT a url()
     * reference and the url() is added later on the same element, the SVG
     * filter part stays permanently inert (blur/saturate still apply). The
     * url() must be present the moment the element first gets composited.
     * Therefore: whenever the url() reference part changes, we swap in a
     * brand-new lens node with the final filter string already set.
     */
    updateLensStyle() {
      if (!this.lensLayer) return;
      const bdf = this.lensFilterString();
      const ref = this.svgEl && !this.reduceTransparency() ? this.id : null;
      if (ref !== this.lensFilterRef) {
        const fresh = document.createElement("div");
        fresh.className = "ql-lens";
        fresh.setAttribute("aria-hidden", "true");
        Object.assign(fresh.style, {
          position: "absolute",
          inset: "0",
          borderRadius: "inherit",
          pointerEvents: "none"
        });
        fresh.style.backdropFilter = bdf;
        fresh.style.WebkitBackdropFilter = bdf;
        this.lensLayer.replaceWith(fresh);
        this.lensLayer = fresh;
        this.lensFilterRef = ref;
      } else {
        this.lensLayer.style.backdropFilter = bdf;
        this.lensLayer.style.WebkitBackdropFilter = bdf;
      }
    }
    /* ─────────────────── LAYER 1: TINT ─────────────────── */
    updateTint() {
      if (!this.tintLayer) return;
      const cfg = this.cfg;
      const autoDark = this.isDark() && cfg.tint.replace(/\s/g, "") === DEFAULT_CONFIG.tint.replace(/\s/g, "");
      const tint = autoDark ? DARK_TINT : cfg.tint;
      const op = this.reduceTransparency() ? 1 : cfg.tintOpacity * (cfg.tintStrength ?? 1) * (autoDark ? 1.75 : 1);
      if (op <= 0) {
        this.tintLayer.style.background = "none";
        return;
      }
      this.tintLayer.style.background = [
        `linear-gradient(180deg,
        rgba(${tint}, ${(this.reduceTransparency() ? 1 : op * 1.2).toFixed(4)}) 0%,
        rgba(${tint}, ${(this.reduceTransparency() ? 1 : op * 0.85).toFixed(4)}) 100%)`
      ].join(", ");
      this.tintLayer.style.mixBlendMode = cfg.adaptiveTint && !this.reduceTransparency() ? "overlay" : "normal";
    }
    /* ─────────────── LAYERS 2+3: CONIC LIGHT RINGS ───────────────
       The Apple signature: the rim catches light in TWO lobes — at
       the light angle and its mirror (glass reflects on the near and
       far bezel). Implemented as conic gradients masked to rings:
         .ql-rim   — crisp ~1.3px ring, strong lobes
         .ql-sheen — bezel-band-wide ring, soft lobes + dark flanks   */
    ringMask(padPx) {
      return {
        boxSizing: "border-box",
        padding: `${padPx}px`,
        maskImage: "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
        maskClip: "content-box, border-box",
        maskComposite: "exclude"
      };
    }
    conicStops(angleDeg, power, peakA, baseA, darkA) {
      const stops = [];
      const STEP = 4;
      for (let a = 0; a <= 360; a += STEP) {
        const rel = (a - angleDeg) * Math.PI / 180;
        const c = Math.abs(Math.cos(rel));
        const sn = Math.abs(Math.sin(rel));
        const white = baseA + peakA * Math.pow(c, power);
        const dark = darkA * sn * sn;
        const net = white - dark;
        const col = net >= 0 ? `rgba(255,255,255,${net.toFixed(4)})` : `rgba(10,14,22,${(-net).toFixed(4)})`;
        stops.push(`${col} ${a}deg`);
      }
      return `conic-gradient(from 0deg at 50% 50%, ${stops.join(", ")})`;
    }
    sizeLight() {
      const diameter = Math.ceil(Math.hypot(this.lastW, this.lastH)) + 4;
      const bezel = Math.min(this.cfg.bezelWidth, this.lastW / 2, this.lastH / 2);
      if (this.rimLayer) Object.assign(this.rimLayer.style, this.ringMask(1), { overflow: "hidden" });
      if (this.sheenLayer) Object.assign(this.sheenLayer.style, this.ringMask(Math.max(2, bezel * 0.45)), { overflow: "hidden", filter: "none" });
      for (const disk of [this.rimDisk, this.sheenDisk]) if (disk) {
        Object.assign(disk.style, { position: "absolute", width: diameter + "px", height: diameter + "px", left: "50%", top: "50%" });
      }
    }
    /** Rotation-equivariant lighting: bake gradients only when the material changes. */
    bakeLight() {
      this._lightBakes++;
      const cfg = this.cfg, L = this.backdropLuma();
      const p = cfg.fresnelPower ?? 2.2;
      if (this.rimDisk) {
        const hi = cfg.edgeHighlight * (0.65 + 0.44 * L);
        this.rimDisk.style.background = this.conicStops(0, p, hi * 0.86, hi * 0.075, hi * 0.035);
      }
      if (this.sheenDisk) {
        const sp = cfg.specularStrength * (0.4 + 0.65 * L);
        this.sheenDisk.style.background = this.conicStops(0, p, sp * 0.23, 0, sp * 0.16);
      }
    }
    updateRings() {
      const rot = `translate(-50%,-50%) rotate(${this.currentAngle}deg)`;
      for (const disk of [this.rimDisk, this.sheenDisk]) if (disk) disk.style.transform = rot;
      const opacity = String(this.reduceTransparency() ? 0 : 0.82 + 0.18 * this.currentHoverGlow);
      if (this.rimLayer) this.rimLayer.style.opacity = opacity;
      if (this.sheenLayer) this.sheenLayer.style.opacity = opacity;
    }
    /* ─────────────────── NOISE ─────────────────── */
    updateNoise() {
      const cfg = this.cfg;
      if (cfg.noiseOpacity <= 0) {
        this.noiseLayer?.remove();
        this.noiseLayer = null;
        return;
      }
      if (!this.noiseLayer) {
        this.noiseLayer = document.createElement("div");
        this.noiseLayer.className = "ql-noise";
        this.noiseLayer.setAttribute("aria-hidden", "true");
        Object.assign(this.noiseLayer.style, { position: "absolute", inset: "0", borderRadius: "inherit", pointerEvents: "none" });
        this.el.insertBefore(this.noiseLayer, this._contentEl());
      }
      const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`;
      Object.assign(this.noiseLayer.style, {
        backgroundImage: `url("${noiseSvg}")`,
        opacity: String(cfg.noiseOpacity),
        backgroundSize: `${100 * cfg.noiseScale}px ${100 * cfg.noiseScale}px`,
        mixBlendMode: "overlay"
      });
    }
    /* ─────────────────── SHADOW ─────────────────── */
    applyDepth() {
      const e = this.cfg.elevation;
      if (e <= 0) {
        this.el.style.boxShadow = "none";
        return;
      }
      const t = Math.max(1, this.cfg.thickness / 8);
      if (this.isDark()) {
        this.el.style.boxShadow = [
          `0 0 ${(26 * t * e).toFixed(0)}px rgba(148,176,224,${(0.1 * e).toFixed(3)})`,
          `0 ${(6 * t * e).toFixed(0)}px ${(24 * t * e).toFixed(0)}px rgba(0,0,0,${(0.36 * e).toFixed(3)})`,
          `0 ${(1.5 * e).toFixed(1)}px ${(5 * e).toFixed(0)}px rgba(0,0,0,${(0.24 * e).toFixed(3)})`
        ].join(", ");
        return;
      }
      this.el.style.boxShadow = [
        `0 ${(6 * t * e).toFixed(0)}px ${(22 * t * e).toFixed(0)}px rgba(16,22,34,${(0.13 * e).toFixed(3)})`,
        `0 ${(1.5 * e).toFixed(1)}px ${(5 * e).toFixed(0)}px rgba(16,22,34,${(0.08 * e).toFixed(3)})`
      ].join(", ");
    }
    /* ─────────────────── SVG LENS FILTER ─────────────────── */
    shouldUseSVG() {
      const mode = this.cfg.refractionMode;
      if (mode === "svg") return true;
      if (mode === "css") return false;
      if (_LiquidGlassEngine2._svgOk === null) {
        _LiquidGlassEngine2._svgOk = this.detectSVGSupport();
      }
      return _LiquidGlassEngine2._svgOk;
    }
    detectSVGSupport() {
      if (typeof document === "undefined") return false;
      try {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "0");
        svg.setAttribute("height", "0");
        svg.style.cssText = "position:absolute;overflow:hidden;pointer-events:none;";
        const defs = document.createElementNS(svgNS, "defs");
        const filter = document.createElementNS(svgNS, "filter");
        filter.id = "__ql_probe__";
        defs.appendChild(filter);
        svg.appendChild(defs);
        document.body.appendChild(svg);
        const probe = document.createElement("div");
        probe.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;backdrop-filter:url(#__ql_probe__);-webkit-backdrop-filter:url(#__ql_probe__);pointer-events:none;";
        document.body.appendChild(probe);
        const cs = getComputedStyle(probe);
        const bf = cs.backdropFilter || cs.webkitBackdropFilter || "";
        const ok = bf.includes("url(");
        probe.remove();
        svg.remove();
        return ok;
      } catch {
        return false;
      }
    }
    /** Per-channel dispersion scales. Blue refracts more than red in real
        glass; sampling is inward so blue gets the LARGER scale. */
    channelScales() {
      const M = this.cfg.ior > 1 ? 1 : 0;
      const base = 2 * this.cfg.refractionStrength * (M > 0 ? 1 : 0);
      const ca = this.cfg.chromaticAberration;
      return {
        base,
        r: base * (1 - ca * 0.1),
        g: base,
        b: base * (1 + ca * 0.14)
      };
    }
    async rebuildLensFilter() {
      const buildVersion = ++this.lensBuildVersion;
      const cfg = this.cfg;
      if (!this.shouldUseSVG() || cfg.refractionStrength <= 0 || cfg.ior <= 1 || this.reduceTransparency()) {
        this.teardownFilter();
        this.updateLensStyle();
        return;
      }
      const w = this.el.offsetWidth;
      const h = this.el.offsetHeight;
      if (w < 8 || h < 8) return;
      const resCap = cfg.quality === "low" ? 128 : cfg.quality === "medium" ? 384 : 1024;
      const radius = Math.min(cfg.borderRadius, Math.min(w, h) / 2);
      const { map, key } = await acquireLensMap(w, h, radius, cfg.bezelWidth, cfg.thickness, cfg.ior, resCap, cfg.blur);
      if (this.destroyed || buildVersion !== this.lensBuildVersion) {
        releaseMap(key);
        return;
      }
      if (this.mapRefKey === key) {
        releaseMap(key);
      } else {
        if (this.mapRefKey) releaseMap(this.mapRefKey);
        this.mapRefKey = key;
      }
      this.lensMap = map;
      this._mapGenMs = map.genMs;
      this._mapPixels = map.pixelsComputed;
      this._mapError = null;
      this.buildFilterDOM(w, h, map);
      this.lensFilterRef = "__stale__";
      this.updateLensStyle();
    }
    teardownFilter() {
      if (this.svgEl) {
        this.svgEl.remove();
        this.svgEl = null;
      }
      this.dispNodes = [];
      if (this.mapRefKey) {
        releaseMap(this.mapRefKey);
        this.mapRefKey = null;
      }
      this.lensMap = null;
    }
    buildFilterDOM(w, h, map) {
      this._filterBuilds++;
      if (this.svgEl) {
        this.svgEl.remove();
        this.svgEl = null;
      }
      this.dispNodes = [];
      const { r, g, b } = this.channelScales();
      const useCA = usesDispersion(this.cfg.refractionStrength, this.cfg.chromaticAberration, this.cfg.blur, this.cfg.quality, this.cfg.dispersionMode);
      const pad = filterPadding(this.cfg.blur);
      const px = map.padX * w / map.mapWidth, py = map.padY * h / map.mapHeight;
      const mapImage = `<feImage href="${map.url}" result="encoded" preserveAspectRatio="none" x="${-px}" y="${-py}" width="${w + 2 * px}" height="${h + 2 * py}"/>
      <feComponentTransfer in="encoded" result="map">
        <feFuncR type="linear" slope="${255 / 254}" intercept="${-1 / 254}"/>
        <feFuncG type="linear" slope="${255 / 254}" intercept="${-1 / 254}"/>
      </feComponentTransfer>`;
      let content;
      if (useCA) {
        content = `
        ${mapImage}
        <feDisplacementMap in="SourceGraphic" in2="map" scale="${r.toFixed(2)}" xChannelSelector="R" yChannelSelector="G" result="dR"/>
        <feDisplacementMap in="SourceGraphic" in2="map" scale="${g.toFixed(2)}" xChannelSelector="R" yChannelSelector="G" result="dG"/>
        <feDisplacementMap in="SourceGraphic" in2="map" scale="${b.toFixed(2)}" xChannelSelector="R" yChannelSelector="G" result="dB"/>
        <feComponentTransfer in="dR" result="cR">
          <feFuncG type="discrete" tableValues="0"/><feFuncB type="discrete" tableValues="0"/>
        </feComponentTransfer>
        <feComponentTransfer in="dG" result="cG">
          <feFuncR type="discrete" tableValues="0"/><feFuncB type="discrete" tableValues="0"/>
        </feComponentTransfer>
        <feComponentTransfer in="dB" result="cB">
          <feFuncR type="discrete" tableValues="0"/><feFuncG type="discrete" tableValues="0"/>
        </feComponentTransfer>
        <feBlend in="cR" in2="cG" mode="screen" result="rg"/>
        <feBlend in="rg" in2="cB" mode="screen"/>`;
      } else {
        content = `
        ${mapImage}
        <feDisplacementMap in="SourceGraphic" in2="map" scale="${g.toFixed(2)}" xChannelSelector="R" yChannelSelector="G"/>`;
      }
      const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute;overflow:hidden;pointer-events:none">
      <defs>
        <filter id="${this.id}" filterUnits="userSpaceOnUse"
          x="${-pad}" y="${-pad}" width="${w + 2 * pad}" height="${h + 2 * pad}"
          color-interpolation-filters="sRGB">${content}</filter>
      </defs>
    </svg>`;
      const div = document.createElement("div");
      div.innerHTML = svgStr.trim();
      this.svgEl = div.querySelector("svg");
      document.body.appendChild(this.svgEl);
      this.dispNodes = Array.from(this.svgEl.querySelectorAll("feDisplacementMap"));
    }
    /** Surgical update: strength/CA changes only rewrite `scale` attributes. */
    updateFilterScales() {
      if (!this.svgEl || this.dispNodes.length === 0) return;
      const { r, g, b } = this.channelScales();
      if (this.dispNodes.length === 3) {
        this.dispNodes[0].setAttribute("scale", r.toFixed(2));
        this.dispNodes[1].setAttribute("scale", g.toFixed(2));
        this.dispNodes[2].setAttribute("scale", b.toFixed(2));
      } else {
        this.dispNodes[0].setAttribute("scale", g.toFixed(2));
      }
    }
    setupPointer() {
      if (this._pointerMoveHandler) return;
      this._pointerEnterHandler = () => {
        if (this.cfg.hoverLighting) {
          this.targetHoverGlow = 1;
          this.kickLight();
        }
      };
      this._pointerMoveHandler = (e) => {
        const rect = this.el.getBoundingClientRect();
        if (!rect.width || !rect.height || e.pointerType === "touch") return;
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        if (this.cfg.cursorTracking) {
          this.targetAngle = Math.atan2(px - 0.5, -(py - 0.5)) * (180 / Math.PI);
        }
        if (this.cfg.parallax) {
          this.targetParallaxX = (px - 0.5) * 2;
          this.targetParallaxY = (py - 0.5) * 2;
        }
        this.kickLight();
      };
      this._pointerLeaveHandler = () => {
        this.targetAngle = this.cfg.lightAngle;
        this.targetParallaxX = 0;
        this.targetParallaxY = 0;
        this.targetHoverGlow = 0;
        this.kickLight();
      };
      this.el.addEventListener("mouseenter", this._pointerEnterHandler, { passive: true });
      this.el.addEventListener("pointermove", this._pointerMoveHandler, { passive: true });
      this.el.addEventListener("pointerleave", this._pointerLeaveHandler, { passive: true });
    }
    teardownPointer() {
      if (this._pointerEnterHandler) {
        this.el.removeEventListener("mouseenter", this._pointerEnterHandler);
        this._pointerEnterHandler = void 0;
      }
      if (this._pointerMoveHandler) {
        this.el.removeEventListener("pointermove", this._pointerMoveHandler);
        this._pointerMoveHandler = void 0;
      }
      if (this._pointerLeaveHandler) {
        this.el.removeEventListener("pointerleave", this._pointerLeaveHandler);
        this._pointerLeaveHandler = void 0;
      }
    }
    kickLight() {
      if (this.animatingLight || this.destroyed || this.reduceMotion() || document.hidden) return;
      this.animatingLight = true;
      this.lastLightTick = performance.now();
      this.rafId = requestAnimationFrame(() => this.tickLight());
    }
    tickLight() {
      if (this.destroyed || this.reduceMotion() || document.hidden) {
        this.stopLight();
        return;
      }
      const t0 = performance.now();
      const dt = Math.min(0.05, Math.max(1e-3, (t0 - this.lastLightTick) / 1e3));
      this.lastLightTick = t0;
      let moving = false;
      const step = (value, target, velocity, threshold) => {
        if (Math.abs(target - value) < threshold && Math.abs(velocity) < threshold * 10) return [target, 0];
        moving = true;
        if (!this.cfg.inertia) return [target, 0];
        const omega = 22, offset = value - target;
        const c = velocity + omega * offset, decay = Math.exp(-omega * dt);
        return [target + (offset + c * dt) * decay, (velocity - omega * c * dt) * decay];
      };
      const diff = ((this.targetAngle - this.currentAngle + 180) % 360 + 360) % 360 - 180;
      [this.currentAngle, this.angleVelocity] = step(this.currentAngle, this.currentAngle + diff, this.angleVelocity, 0.08);
      [this.currentHoverGlow, this.hoverGlowVelocity] = step(this.currentHoverGlow, this.targetHoverGlow, this.hoverGlowVelocity, 2e-3);
      if (this.cfg.parallax) {
        [this.currentParallaxX, this.parallaxXVelocity] = step(this.currentParallaxX, this.targetParallaxX, this.parallaxXVelocity, 1e-3);
        [this.currentParallaxY, this.parallaxYVelocity] = step(this.currentParallaxY, this.targetParallaxY, this.parallaxYVelocity, 1e-3);
        this.el.style.transform = this.currentParallaxX || this.currentParallaxY ? `perspective(1000px) rotateY(${this.currentParallaxX * 5}deg) rotateX(${-this.currentParallaxY * 5}deg)` : this.originalStyle.get("transform")[0];
      }
      this.updateRings();
      this._lastTime = performance.now() - t0;
      this._totalTime += this._lastTime;
      this._frameCount++;
      if (moving) this.rafId = requestAnimationFrame(() => this.tickLight());
      else this.stopLight();
    }
    /* ─────────────────── ANIMATIONS (public) ─────────────────── */
    cancelAnimations() {
      for (const timer of this.animationTimers) clearTimeout(timer);
      this.animationTimers.clear();
      for (const animation of this.animations) animation.cancel();
      this.animations.clear();
    }
    async play(keyframes, duration) {
      if (this.destroyed || this.reduceMotion()) return false;
      this.cancelAnimations();
      const animation = this.el.animate(keyframes, { duration, easing: "cubic-bezier(.2,.8,.2,1)" });
      this.animations.add(animation);
      try {
        await animation.finished;
        return true;
      } catch {
        return false;
      } finally {
        this.animations.delete(animation);
      }
    }
    enableLiquidPress(config) {
      this.disableLiquidPress();
      const scale = config?.scale ?? 0.96, squish = config?.squish ?? 0.018;
      let pressed = false;
      const onDown = (event) => {
        if (event.button !== 0 || this.destroyed || this.reduceMotion()) return;
        pressed = true;
        this.cancelAnimations();
        this.el.style.transform = `scale(${1 + squish}, ${scale})`;
      };
      const onUp = () => {
        if (!pressed || this.destroyed) return;
        pressed = false;
        const from = this.el.style.transform;
        this.el.style.transform = this.originalStyle.get("transform")[0];
        void this.play([{ transform: from }, { transform: "scale(.99,1.015)", offset: 0.5 }, { transform: "scale(1)" }], 380);
      };
      this.pressHandlers = { down: onDown, up: onUp, leave: onUp, reset: () => {
        if (pressed) this.el.style.transform = this.originalStyle.get("transform")[0];
        pressed = false;
      } };
      this.el.addEventListener("pointerdown", onDown, { passive: true });
      this.el.addEventListener("pointerup", onUp, { passive: true });
      this.el.addEventListener("pointerleave", onUp, { passive: true });
      this.el.addEventListener("pointercancel", onUp, { passive: true });
    }
    disableLiquidPress() {
      if (!this.pressHandlers) return;
      this.pressHandlers.reset();
      this.el.removeEventListener("pointerdown", this.pressHandlers.down);
      this.el.removeEventListener("pointerup", this.pressHandlers.up);
      this.el.removeEventListener("pointerleave", this.pressHandlers.leave);
      this.el.removeEventListener("pointercancel", this.pressHandlers.up);
      this.pressHandlers = null;
    }
    animateIn(delay = 0) {
      if (this.destroyed) return;
      this.cancelAnimations();
      this.el.style.visibility = this.originalStyle.get("visibility")[0];
      if (this.reduceMotion()) return;
      const start = () => {
        if (this.destroyed) return;
        void this.play([{ transform: "scale(.94)" }, { transform: "scale(1.012)", offset: 0.65 }, { transform: "scale(1)" }], 420);
      };
      if (delay > 0) {
        const timer = setTimeout(() => {
          this.animationTimers.delete(timer);
          start();
        }, delay);
        this.animationTimers.add(timer);
      } else start();
    }
    async animateOut() {
      if (this.destroyed) return;
      const completed = this.reduceMotion() || await this.play([{ transform: "scale(1)" }, { transform: "scale(.94)" }], 180);
      if (completed && !this.destroyed) this.el.style.visibility = "hidden";
    }
    jiggle(intensity = 1) {
      const i = Math.max(0, Math.min(3, intensity));
      void this.play([
        { transform: "scale(1)" },
        { transform: `scale(${1 + 0.025 * i},${1 - 0.018 * i})`, offset: 0.2 },
        { transform: `scale(${1 - 0.016 * i},${1 + 0.012 * i})`, offset: 0.5 },
        { transform: "scale(1)" }
      ], 480);
    }
    getElement() {
      return this.el;
    }
    /* ─────────────────── PUBLIC API ─────────────────── */
    getPerformanceMetrics() {
      return {
        avgFrameTime: this._frameCount > 0 ? this._totalTime / this._frameCount : 0,
        lastFrameTime: this._lastTime,
        frameCount: this._frameCount,
        quality: this.cfg.quality,
        mapGenMs: this._mapGenMs,
        mapPixelsComputed: this._mapPixels,
        mapEncodeMs: this.lensMap?.encodeMs ?? 0,
        displacementTaps: this.dispNodes.length,
        lightBakes: this._lightBakes,
        filterBuilds: this._filterBuilds,
        mapError: this._mapError
      };
    }
    /** Patch explicit overrides. Pass undefined to remove an override. */
    updateConfig(config) {
      this.setConfig({ ...this.overrides, ...config });
    }
    /** Replace the declaration (used by React); omitted keys revert to the preset/default. */
    setConfig(config) {
      if (this.destroyed) return;
      const oldCfg = this.cfg;
      this.overrides = { ...config };
      const cfg = this.cfg = resolveGlassConfig(this.overrides);
      const changed = (...keys) => keys.some((k) => oldCfg[k] !== cfg[k]);
      if (!Object.keys({ ...oldCfg, ...cfg }).some((k) => oldCfg[k] !== cfg[k])) return;
      const graph = (c) => usesDispersion(c.refractionStrength, c.chromaticAberration, c.blur, c.quality, c.dispersionMode);
      const geometryChanged = changed("borderRadius", "bezelWidth", "thickness", "ior", "quality", "refractionMode", "respectPreferences") || oldCfg.refractionStrength <= 0 !== cfg.refractionStrength <= 0 || filterPadding(oldCfg.blur) !== filterPadding(cfg.blur) || graph(oldCfg) !== graph(cfg);
      if (changed("borderRadius")) this.el.style.borderRadius = cfg.borderRadius + "px";
      if (geometryChanged) this.queueRebuild();
      else if (changed("refractionStrength", "chromaticAberration")) this.updateFilterScales();
      if (changed("lightAngle")) {
        this.targetAngle = cfg.lightAngle;
        this.currentAngle = cfg.lightAngle;
        this.angleVelocity = 0;
        this.updateRings();
      }
      if (changed("blur", "saturation", "respectPreferences")) this.updateLensStyle();
      if (changed("tint", "tintOpacity", "tintStrength", "adaptiveTint", "appearance", "respectPreferences")) this.updateTint();
      if (changed("edgeHighlight", "specularStrength", "fresnelPower", "appearance", "backdropLuminance", "hoverLighting", "respectPreferences")) {
        this.bakeLight();
        this.updateRings();
      }
      if (changed("noiseOpacity", "noiseScale")) this.updateNoise();
      if (changed("elevation", "thickness", "appearance")) this.applyDepth();
      if (changed("cursorTracking", "parallax", "hoverLighting", "respectPreferences")) {
        this.targetHoverGlow = 0;
        if (!cfg.parallax) this.el.style.transform = this.originalStyle.get("transform")[0];
        this.syncPointerListeners();
      }
      if (changed("appearance")) this.syncSchemeListener();
      if (changed("respectPreferences")) this.onPreferences();
    }
    getConfig() {
      return { ...this.cfg };
    }
    syncPointerListeners() {
      if (!this.reduceMotion() && (this.cfg.cursorTracking || this.cfg.hoverLighting || this.cfg.parallax)) {
        this.setupPointer();
      } else {
        this.teardownPointer();
        this.stopLight();
      }
    }
    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      this.cancelAnimations();
      this.disableLiquidPress();
      document.removeEventListener("visibilitychange", this.onVisibility);
      this.motionQuery?.removeEventListener("change", this.onPreferences);
      this.transparencyQuery?.removeEventListener("change", this.onPreferences);
      _LiquidGlassEngine2._registry.delete(this);
      this.lensBuildVersion++;
      if (this.rafId) cancelAnimationFrame(this.rafId);
      if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
      this.resizeObs?.disconnect();
      this.teardownFilter();
      [this.lensLayer, this.tintLayer, this.sheenLayer, this.rimLayer, this.noiseLayer].forEach((l) => l?.remove());
      this.lensLayer = this.tintLayer = this.sheenLayer = this.rimLayer = this.noiseLayer = null;
      this.teardownPointer();
      if (this.schemeQuery && this.schemeListener) {
        this.schemeQuery.removeEventListener("change", this.schemeListener);
      }
      this.schemeQuery = null;
      this.schemeListener = null;
      if (this.ownedContent) {
        this.ownedContent.replaceWith(...Array.from(this.ownedContent.childNodes));
        this.ownedContent = null;
      }
      for (const [property, [value, priority]] of this.originalStyle) {
        if (value) this.el.style.setProperty(property, value, priority);
        else this.el.style.removeProperty(property);
      }
    }
  };
  _LiquidGlassEngine._svgOk = null;
  _LiquidGlassEngine._registry = /* @__PURE__ */ new Set();
  var LiquidGlassEngine = _LiquidGlassEngine;

  // node_modules/quick-liquid/dist/index.mjs
  var SPRING_PRESETS = {
    /** iOS default spring — slightly bouncy, smooth (sheet presentations) */
    default: { stiffness: 300, damping: 26, mass: 1, restThreshold: 0.01, restDisplacementThreshold: 0.01, clampOnRest: true },
    /** Snappy response — button presses, tab switches */
    snappy: { stiffness: 400, damping: 30, mass: 1, restThreshold: 0.01, restDisplacementThreshold: 0.01, clampOnRest: true },
    /** Bouncy — playful elements, notification badges */
    bouncy: { stiffness: 250, damping: 15, mass: 1, restThreshold: 0.01, restDisplacementThreshold: 0.01, clampOnRest: true },
    /** Gentle — large UI panels, background elements */
    gentle: { stiffness: 150, damping: 20, mass: 1, restThreshold: 0.01, restDisplacementThreshold: 0.01, clampOnRest: true },
    /** Stiff — micro-interactions, haptic-like feedback */
    stiff: { stiffness: 600, damping: 35, mass: 1, restThreshold: 0.01, restDisplacementThreshold: 0.01, clampOnRest: true },
    /** Liquid merge — slow, gooey, for blob merging animations */
    liquidMerge: { stiffness: 120, damping: 14, mass: 1.2, restThreshold: 5e-3, restDisplacementThreshold: 5e-3, clampOnRest: true },
    /** Liquid split — faster separation with slight overshoot */
    liquidSplit: { stiffness: 280, damping: 18, mass: 0.8, restThreshold: 0.01, restDisplacementThreshold: 0.01, clampOnRest: true }
  };
  var Spring = class {
    // Damped frequency
    constructor(initialValue = 0, config = "default") {
      this._startTime = 0;
      this._startValue = 0;
      this._startVelocity = 0;
      this._atRest = true;
      this._omega0 = 0;
      this._zeta = 0;
      this._omegaD = 0;
      this.cfg = typeof config === "string" ? { ...SPRING_PRESETS[config] } : { ...SPRING_PRESETS.default, ...config };
      this._value = initialValue;
      this._target = initialValue;
      this._velocity = 0;
      this.computeDerivedConstants();
    }
    computeDerivedConstants() {
      const { stiffness, damping, mass } = this.cfg;
      this._omega0 = Math.sqrt(stiffness / mass);
      this._zeta = damping / (2 * Math.sqrt(stiffness * mass));
      if (this._zeta < 1) {
        this._omegaD = this._omega0 * Math.sqrt(1 - this._zeta * this._zeta);
      } else {
        this._omegaD = 0;
      }
    }
    /** Set new target — starts or continues animation */
    setTarget(target) {
      if (target === this._target && this._atRest) return;
      this._startValue = this._value;
      this._startVelocity = this._velocity;
      this._startTime = -1;
      this._target = target;
      this._atRest = false;
    }
    /** Interrupt with new value (e.g., during gesture) */
    setValue(value, velocity = 0) {
      this._value = value;
      this._velocity = velocity;
      this._startValue = value;
      this._startVelocity = velocity;
      this._startTime = -1;
      this._atRest = false;
    }
    /** Add velocity impulse (e.g., flick gesture) */
    addVelocity(v) {
      this._velocity += v;
      this._startValue = this._value;
      this._startVelocity = this._velocity;
      this._startTime = -1;
      this._atRest = false;
    }
    /**
     * Advance spring to time `now` (ms timestamp from performance.now()).
     * Returns true if still animating, false if at rest.
     */
    tick(now) {
      if (this._atRest) return false;
      if (this._startTime < 0) {
        this._startTime = now;
      }
      const t = (now - this._startTime) / 1e3;
      const x0 = this._startValue - this._target;
      const v0 = this._startVelocity;
      let x;
      let v;
      if (this._zeta < 1) {
        const env = Math.exp(-this._zeta * this._omega0 * t);
        const cos = Math.cos(this._omegaD * t);
        const sin = Math.sin(this._omegaD * t);
        const A = x0;
        const B = (v0 + this._zeta * this._omega0 * x0) / this._omegaD;
        x = env * (A * cos + B * sin);
        v = env * ((B * this._omegaD - A * this._zeta * this._omega0) * cos - (A * this._omegaD + B * this._zeta * this._omega0) * sin);
      } else if (this._zeta === 1) {
        const env = Math.exp(-this._omega0 * t);
        x = env * (x0 + (v0 + this._omega0 * x0) * t);
        v = env * (v0 * (1 - this._omega0 * t) - x0 * this._omega0 * this._omega0 * t);
      } else {
        const s1 = -this._omega0 * (this._zeta - Math.sqrt(this._zeta * this._zeta - 1));
        const s2 = -this._omega0 * (this._zeta + Math.sqrt(this._zeta * this._zeta - 1));
        const A = (v0 - s2 * x0) / (s1 - s2);
        const B = x0 - A;
        x = A * Math.exp(s1 * t) + B * Math.exp(s2 * t);
        v = A * s1 * Math.exp(s1 * t) + B * s2 * Math.exp(s2 * t);
      }
      this._value = this._target + x;
      this._velocity = v;
      if (Math.abs(x) < this.cfg.restDisplacementThreshold && Math.abs(v) < this.cfg.restThreshold) {
        if (this.cfg.clampOnRest) {
          this._value = this._target;
          this._velocity = 0;
        }
        this._atRest = true;
        return false;
      }
      return true;
    }
    // ─── Accessors ────────────────────────────────────────────────
    get value() {
      return this._value;
    }
    get target() {
      return this._target;
    }
    get velocity() {
      return this._velocity;
    }
    get atRest() {
      return this._atRest;
    }
    /** Damping ratio — <1 bouncy, =1 critical, >1 overdamped */
    get dampingRatio() {
      return this._zeta;
    }
    /** Update spring config on the fly */
    updateConfig(config) {
      this._startValue = this._value;
      this._startVelocity = this._velocity;
      this._startTime = -1;
      this.cfg = { ...this.cfg, ...config };
      this.computeDerivedConstants();
    }
  };
  var SpringVector = class {
    constructor(initialValues, config = "default") {
      this.springs = initialValues.map((v) => new Spring(v, config));
    }
    setTarget(targets) {
      for (let i = 0; i < this.springs.length; i++) {
        this.springs[i].setTarget(targets[i]);
      }
    }
    setValue(values, velocities) {
      for (let i = 0; i < this.springs.length; i++) {
        this.springs[i].setValue(values[i], velocities?.[i] ?? 0);
      }
    }
    addVelocity(velocities) {
      for (let i = 0; i < this.springs.length; i++) {
        this.springs[i].addVelocity(velocities[i]);
      }
    }
    tick(now) {
      let anyActive = false;
      for (const s of this.springs) {
        if (s.tick(now)) anyActive = true;
      }
      return anyActive;
    }
    get values() {
      return this.springs.map((s) => s.value);
    }
    get atRest() {
      return this.springs.every((s) => s.atRest);
    }
    get velocities() {
      return this.springs.map((s) => s.velocity);
    }
  };
  var _instance = null;
  var _AnimationScheduler = class _AnimationScheduler2 {
    constructor() {
      this.animations = /* @__PURE__ */ new Map();
      this.nextId = 0;
      this.rafId = null;
      this.running = false;
      this._frameTime = 0;
      this._frameCount = 0;
      this._droppedFrames = 0;
      this._lastTimestamp = 0;
    }
    /** Whether the OS requests reduced motion. Result is cached and kept live
     *  via a matchMedia change listener. Safe in non-DOM/SSR (returns false). */
    static prefersReducedMotion() {
      if (_AnimationScheduler2._reduceMotion !== null) return _AnimationScheduler2._reduceMotion;
      if (typeof matchMedia !== "function") {
        return _AnimationScheduler2._reduceMotion = false;
      }
      const q = matchMedia("(prefers-reduced-motion: reduce)");
      _AnimationScheduler2._reduceMotion = q.matches;
      const onChange = () => {
        _AnimationScheduler2._reduceMotion = q.matches;
      };
      if (typeof q.addEventListener === "function") q.addEventListener("change", onChange);
      else if (typeof q.addListener === "function") q.addListener(onChange);
      return _AnimationScheduler2._reduceMotion;
    }
    /** Get singleton scheduler (all liquid elements share one loop) */
    static shared() {
      if (!_instance) {
        _instance = new _AnimationScheduler2();
      }
      return _instance;
    }
    /**
     * Schedule an animation callback.
     * Callback is called every frame until it returns false.
     * Returns an ID that can be used to cancel.
     */
    schedule(callback, priority = 0) {
      const id = ++this.nextId;
      if (_AnimationScheduler2.prefersReducedMotion()) {
        this.settleImmediately(callback);
        return id;
      }
      this.animations.set(id, { id, callback, priority });
      this.wake();
      return id;
    }
    /**
     * Fast-forward an animation to rest synchronously (no rAF, no paint between
     * steps → no visible motion). Used only under prefers-reduced-motion.
     * Springs are analytic in `now`, so they settle in a few steps; the step cap
     * bounds continuous/non-settling callbacks so this can never hang.
     */
    settleImmediately(callback) {
      const STEP = 1e3 / 60;
      const MAX_STEPS = 600;
      let now = typeof performance !== "undefined" ? performance.now() : 0;
      for (let i = 0; i < MAX_STEPS; i++) {
        if (!callback(now)) return;
        now += STEP;
      }
    }
    /** Cancel a scheduled animation */
    cancel(id) {
      this.animations.delete(id);
      if (this.animations.size === 0) {
        this.sleep();
      }
    }
    /** Cancel all animations */
    cancelAll() {
      this.animations.clear();
      this.sleep();
    }
    /** Number of active animations */
    get activeCount() {
      return this.animations.size;
    }
    /** Performance metrics */
    get metrics() {
      return {
        avgFrameTime: this._frameCount > 0 ? this._frameTime / this._frameCount : 0,
        frameCount: this._frameCount,
        droppedFrames: this._droppedFrames,
        activeAnimations: this.animations.size
      };
    }
    // ─── Internal ─────────────────────────────────────────────────
    wake() {
      if (this.running) return;
      this.running = true;
      this._lastTimestamp = 0;
      this.rafId = requestAnimationFrame((t) => this.tick(t));
    }
    sleep() {
      this.running = false;
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
    tick(now) {
      if (!this.running) return;
      const t0 = performance.now();
      if (this._lastTimestamp > 0) {
        const gap = now - this._lastTimestamp;
        if (gap > 20) this._droppedFrames++;
      }
      this._lastTimestamp = now;
      const completed = [];
      const sorted = [...this.animations.values()].sort((a, b) => a.priority - b.priority);
      for (const anim of sorted) {
        const stillActive = anim.callback(now);
        if (!stillActive) {
          completed.push(anim.id);
        }
      }
      for (const id of completed) {
        this.animations.delete(id);
      }
      const dt = performance.now() - t0;
      this._frameTime += dt;
      this._frameCount++;
      if (this.animations.size > 0) {
        this.rafId = requestAnimationFrame((t) => this.tick(t));
      } else {
        this.sleep();
      }
    }
    /** Destroy the scheduler (cleanup) */
    destroy() {
      this.cancelAll();
      if (_instance === this) _instance = null;
    }
  };
  _AnimationScheduler._reduceMotion = null;
  var AnimationScheduler = _AnimationScheduler;
  var DEFAULT_MORPH_CONFIG = {
    spring: "liquidMerge",
    blendRadius: 20,
    useClipPath: true,
    attractDistance: 80,
    attractStrength: 0.6
  };
  var _LiquidMorph = class _LiquidMorph2 {
    constructor(element, config = {}) {
      this.svgClip = null;
      this.animId = null;
      this.el = element;
      this.cfg = { ...DEFAULT_MORPH_CONFIG, ...config };
      this.scheduler = AnimationScheduler.shared();
      this.clipId = `ql-morph-${++_LiquidMorph2._uid}`;
      const springCfg = this.cfg.spring;
      const rect = element.getBoundingClientRect();
      const radius = parseFloat(getComputedStyle(element).borderRadius) || 0;
      this.xSpring = new Spring(rect.left, springCfg);
      this.ySpring = new Spring(rect.top, springCfg);
      this.wSpring = new Spring(rect.width, springCfg);
      this.hSpring = new Spring(rect.height, springCfg);
      this.rSpring = new Spring(radius, springCfg);
      if (this.cfg.useClipPath) {
        this.setupClipPath();
      }
    }
    /**
     * Morph to a new shape with liquid animation.
     * The element will spring-animate to the target dimensions.
     */
    morphTo(target) {
      this.xSpring.setTarget(target.x);
      this.ySpring.setTarget(target.y);
      this.wSpring.setTarget(target.width);
      this.hSpring.setTarget(target.height);
      this.rSpring.setTarget(target.borderRadius);
      this.startAnimation();
    }
    /**
     * Morph to match another element's bounds.
     */
    morphToElement(target) {
      const rect = target.getBoundingClientRect();
      const radius = parseFloat(getComputedStyle(target).borderRadius) || 0;
      this.morphTo({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        borderRadius: radius
      });
    }
    /**
     * Animate a "liquid stretch" — element expands then snaps back.
     * Used for press feedback, notifications, etc.
     */
    liquidPulse(scaleX = 1.05, scaleY = 0.95) {
      const rect = this.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const newW = rect.width * scaleX;
      const newH = rect.height * scaleY;
      this.wSpring.setValue(newW, 0);
      this.hSpring.setValue(newH, 0);
      this.xSpring.setValue(cx - newW / 2, 0);
      this.ySpring.setValue(cy - newH / 2, 0);
      this.wSpring.setTarget(rect.width);
      this.hSpring.setTarget(rect.height);
      this.xSpring.setTarget(rect.left);
      this.ySpring.setTarget(rect.top);
      this.startAnimation();
    }
    /**
     * Liquid "jiggle" — like tapping a water droplet.
     * Applies velocity impulse for organic wobble.
     */
    jiggle(intensity = 200) {
      this.wSpring.addVelocity(intensity);
      this.hSpring.addVelocity(-intensity * 0.7);
      this.rSpring.addVelocity(intensity * 0.3);
      this.startAnimation();
    }
    /** Get current progress (useful for blending animations) */
    get progress() {
      return 0;
    }
    // ─── Internal ─────────────────────────────────────────────────
    startAnimation() {
      if (this.animId !== null) return;
      this.animId = this.scheduler.schedule((now) => {
        const xActive = this.xSpring.tick(now);
        const yActive = this.ySpring.tick(now);
        const wActive = this.wSpring.tick(now);
        const hActive = this.hSpring.tick(now);
        const rActive = this.rSpring.tick(now);
        this.applyTransform();
        const active = xActive || yActive || wActive || hActive || rActive;
        if (!active) {
          this.animId = null;
        }
        return active;
      });
    }
    applyTransform() {
      const w = this.wSpring.value;
      const h = this.hSpring.value;
      const r = this.rSpring.value;
      const rect = this.el.getBoundingClientRect();
      const scaleX = w / (rect.width || 1);
      const scaleY = h / (rect.height || 1);
      this.el.style.transform = `scale(${scaleX}, ${scaleY})`;
      this.el.style.borderRadius = `${r}px`;
      if (this.cfg.useClipPath) {
        this.updateClipPath(w, h, r);
      }
    }
    setupClipPath() {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "0");
      svg.setAttribute("height", "0");
      svg.style.position = "absolute";
      svg.style.pointerEvents = "none";
      svg.innerHTML = `
      <defs>
        <clipPath id="${this.clipId}" clipPathUnits="objectBoundingBox">
          <path d=""/>
        </clipPath>
      </defs>
    `;
      document.body.appendChild(svg);
      this.svgClip = svg;
      this.el.style.clipPath = `url(#${this.clipId})`;
    }
    updateClipPath(w, h, r) {
      if (!this.svgClip) return;
      const path = this.svgClip.querySelector("path");
      if (!path) return;
      const rx = Math.min(r / w, 0.5);
      const ry = Math.min(r / h, 0.5);
      path.setAttribute("d", roundedRectPath(rx, ry));
    }
    destroy() {
      if (this.animId !== null) {
        this.scheduler.cancel(this.animId);
      }
      if (this.svgClip) {
        this.svgClip.remove();
      }
      this.el.style.clipPath = "";
      this.el.style.transform = "";
    }
  };
  _LiquidMorph._uid = 0;
  var LiquidMorph = _LiquidMorph;
  function generateMergeBlob(shape1, shape2, blendRadius, resolution = 64) {
    const points = [];
    for (let i = 0; i < resolution; i++) {
      const angle = i / resolution * Math.PI * 2;
      const px = Math.cos(angle);
      const py = Math.sin(angle);
      let bestDist = Infinity;
      for (let t = 0; t < 200; t++) {
        const step = t * 0.01;
        const sx = px * step;
        const sy = py * step;
        const d1 = Math.sqrt((sx - shape1.cx) ** 2 + (sy - shape1.cy) ** 2) - shape1.r;
        const d2 = Math.sqrt((sx - shape2.cx) ** 2 + (sy - shape2.cy) ** 2) - shape2.r;
        const k = blendRadius;
        const h = Math.max(k - Math.abs(d1 - d2), 0) / k;
        const d = Math.min(d1, d2) - h * h * h * k * (1 / 6);
        if (Math.abs(d) < Math.abs(bestDist)) {
          bestDist = d;
          if (Math.abs(d) < 0.01) {
            points.push([sx, sy]);
            break;
          }
        }
        if (d > 0 && bestDist < 0) {
          points.push([sx, sy]);
          break;
        }
      }
    }
    if (points.length < 3) return "";
    return pointsToSmoothPath(points);
  }
  var LiquidMetaball = class {
    // pixel skip for performance
    constructor(container, blendRadius = 20) {
      this.blobs = [];
      this.animId = null;
      this.resolution = 2;
      this.container = container;
      this.blendRadius = blendRadius;
      this.scheduler = AnimationScheduler.shared();
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      Object.assign(this.canvas.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "10"
      });
      container.style.position = container.style.position || "relative";
      container.appendChild(this.canvas);
      this.resize();
    }
    addBlob(element) {
      const rect = element.getBoundingClientRect();
      const radius = Math.min(rect.width, rect.height) / 2;
      this.blobs.push({ el: element, radius });
      this.startRendering();
    }
    removeBlob(element) {
      this.blobs = this.blobs.filter((b) => b.el !== element);
      if (this.blobs.length === 0) this.stopRendering();
    }
    /** Update blend smoothness */
    setBlendRadius(r) {
      this.blendRadius = r;
    }
    resize() {
      const rect = this.container.getBoundingClientRect();
      this.canvas.width = rect.width / this.resolution;
      this.canvas.height = rect.height / this.resolution;
    }
    startRendering() {
      if (this.animId !== null) return;
      this.animId = this.scheduler.schedule(() => {
        this.render();
        return this.blobs.length > 1;
      });
    }
    stopRendering() {
      if (this.animId !== null) {
        this.scheduler.cancel(this.animId);
        this.animId = null;
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    render() {
      const w = this.canvas.width;
      const h = this.canvas.height;
      const img = this.ctx.createImageData(w, h);
      const data = img.data;
      const containerRect = this.container.getBoundingClientRect();
      const positions = this.blobs.map((b) => {
        const r = b.el.getBoundingClientRect();
        return {
          cx: (r.left + r.width / 2 - containerRect.left) / this.resolution,
          cy: (r.top + r.height / 2 - containerRect.top) / this.resolution,
          r: b.radius / this.resolution
        };
      });
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let minDist = Infinity;
          for (const blob of positions) {
            const dx = x - blob.cx;
            const dy = y - blob.cy;
            const d = Math.sqrt(dx * dx + dy * dy) - blob.r;
            const k = this.blendRadius / this.resolution;
            const hh = Math.max(k - Math.abs(minDist - d), 0) / k;
            minDist = Math.min(minDist, d) - hh * hh * hh * k * (1 / 6);
          }
          const i = (y * w + x) * 4;
          if (minDist < 0) {
            const edge = 1 - smoothstep(-3, 0, minDist);
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = Math.round(edge * 40);
          } else if (minDist < 1.5) {
            const rim = 1 - minDist / 1.5;
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = Math.round(rim * 180);
          }
        }
      }
      this.ctx.putImageData(img, 0, 0);
    }
    destroy() {
      this.stopRendering();
      this.canvas.remove();
    }
  };
  function roundedRectPath(rx, ry) {
    const x = rx;
    const y = ry;
    const w = 1 - 2 * rx;
    const h = 1 - 2 * ry;
    return `M ${x} 0 L ${x + w} 0 Q 1 0 1 ${y} L 1 ${y + h} Q 1 1 ${x + w} 1 L ${x} 1 Q 0 1 0 ${y + h} L 0 ${y} Q 0 0 ${x} 0 Z`;
  }
  function pointsToSmoothPath(points) {
    if (points.length < 3) return "";
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 0; i < points.length; i++) {
      const curr = points[i];
      const next = points[(i + 1) % points.length];
      const nextNext = points[(i + 2) % points.length];
      const cp1x = curr[0] + (next[0] - points[(i - 1 + points.length) % points.length][0]) / 6;
      const cp1y = curr[1] + (next[1] - points[(i - 1 + points.length) % points.length][1]) / 6;
      const cp2x = next[0] - (nextNext[0] - curr[0]) / 6;
      const cp2y = next[1] - (nextNext[1] - curr[1]) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next[0]} ${next[1]}`;
    }
    return d + " Z";
  }
  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }
  var DEFAULT_TRANSITION_CONFIG = {
    spring: "default",
    propertySprings: {},
    autoApply: true
  };
  var LiquidTransition = class {
    constructor(element, config = {}) {
      this.springs = /* @__PURE__ */ new Map();
      this.animId = null;
      this.el = element;
      this.cfg = { ...DEFAULT_TRANSITION_CONFIG, ...config };
      this.scheduler = AnimationScheduler.shared();
      this._initialState = this.readCurrentState();
      this.state = { ...this._initialState };
    }
    /**
     * Animate to target state with spring physics.
     * Only specified properties are animated — others stay put.
     */
    to(target, spring) {
      for (const [key, value] of Object.entries(target)) {
        if (value === void 0) continue;
        let s = this.springs.get(key);
        if (!s) {
          const cfg = this.cfg.propertySprings[key] || spring || this.cfg.spring;
          s = new Spring(this.state[key], cfg);
          this.springs.set(key, s);
        } else if (spring) {
          const resolved = typeof spring === "string" ? SPRING_PRESETS[spring] : spring;
          s.updateConfig(resolved);
        }
        s.setTarget(value);
      }
      this.startAnimation();
      return this;
    }
    /**
     * Instantly set values (no animation) — useful during gestures.
     */
    set(values) {
      for (const [key, value] of Object.entries(values)) {
        if (value === void 0) continue;
        this.state[key] = value;
        const s = this.springs.get(key);
        if (s) s.setValue(value);
      }
      if (this.cfg.autoApply) this.applyState();
      return this;
    }
    /**
     * Add velocity to properties — used after gesture release (flick).
     * The element will continue moving with momentum then spring back.
     */
    release(velocities, target) {
      for (const [key, velocity] of Object.entries(velocities)) {
        if (velocity === void 0) continue;
        let s = this.springs.get(key);
        if (!s) {
          const cfg = this.cfg.propertySprings[key] || this.cfg.spring;
          s = new Spring(this.state[key], cfg);
          this.springs.set(key, s);
        }
        s.addVelocity(velocity);
        if (target && target[key] !== void 0) {
          s.setTarget(target[key]);
        }
      }
      this.startAnimation();
      return this;
    }
    /**
     * Spring back to initial state (e.g., after hover/press ends).
     */
    reset(spring) {
      return this.to(this._initialState, spring || "snappy");
    }
    /**
     * Get current animated state.
     */
    getState() {
      return this.state;
    }
    /** Whether any spring is still animating */
    get isAnimating() {
      return this.animId !== null;
    }
    // ─── Internal ─────────────────────────────────────────────────
    startAnimation() {
      if (this.animId !== null) return;
      this.animId = this.scheduler.schedule((now) => {
        let anyActive = false;
        for (const [key, spring] of this.springs) {
          if (spring.tick(now)) {
            anyActive = true;
          }
          this.state[key] = spring.value;
        }
        if (this.cfg.autoApply) this.applyState();
        if (this.cfg.onUpdate) this.cfg.onUpdate(this.state);
        if (!anyActive) {
          this.animId = null;
          if (this.cfg.onComplete) this.cfg.onComplete();
        }
        return anyActive;
      });
    }
    applyState() {
      const s = this.state;
      const transforms = [];
      if (s.x !== 0 || s.y !== 0) transforms.push(`translate3d(${s.x}px, ${s.y}px, 0)`);
      if (s.scale !== 1) transforms.push(`scale(${s.scale})`);
      else if (s.scaleX !== 1 || s.scaleY !== 1) transforms.push(`scale(${s.scaleX}, ${s.scaleY})`);
      if (s.rotate !== 0) transforms.push(`rotate(${s.rotate}deg)`);
      this.el.style.transform = transforms.join(" ") || "none";
      if (s.opacity !== 1) {
        this.el.style.opacity = String(s.opacity);
      } else {
        this.el.style.opacity = "";
      }
      if (s.borderRadius > 0) {
        this.el.style.borderRadius = `${s.borderRadius}px`;
      }
    }
    readCurrentState() {
      const computed = getComputedStyle(this.el);
      const matrix = new DOMMatrix(computed.transform);
      return {
        x: matrix.e || 0,
        y: matrix.f || 0,
        scale: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b) || 1,
        scaleX: matrix.a || 1,
        scaleY: matrix.d || 1,
        rotate: Math.atan2(matrix.b, matrix.a) * (180 / Math.PI) || 0,
        opacity: parseFloat(computed.opacity) || 1,
        borderRadius: parseFloat(computed.borderRadius) || 0,
        blur: 0,
        rimIntensity: 0
      };
    }
    destroy() {
      if (this.animId !== null) {
        this.scheduler.cancel(this.animId);
        this.animId = null;
      }
      this.springs.clear();
      this.el.style.transform = "";
      this.el.style.opacity = "";
    }
  };
  var LiquidLayoutAnimation = class {
    constructor() {
      this.animations = /* @__PURE__ */ new Map();
    }
    /**
     * Capture current positions of elements before a layout change.
     * Call this BEFORE modifying the DOM/layout.
     */
    capturePositions(elements) {
      const positions = /* @__PURE__ */ new Map();
      for (const el of elements) {
        positions.set(el, el.getBoundingClientRect());
      }
      return positions;
    }
    /**
     * Animate from captured positions to current positions.
     * Call this AFTER the DOM/layout change.
     * 
     * Uses FLIP (First, Last, Invert, Play) technique:
     * - Elements instantly appear at final position
     * - Transform offsets are applied to "fake" the old position
     * - Springs animate the offset back to zero
     */
    animateFromPositions(elements, previousPositions, spring = "default") {
      for (const el of elements) {
        const prev = previousPositions.get(el);
        if (!prev) continue;
        const curr = el.getBoundingClientRect();
        const dx = prev.left - curr.left;
        const dy = prev.top - curr.top;
        const sx = prev.width / curr.width;
        const sy = prev.height / curr.height;
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) {
          continue;
        }
        let lt = this.animations.get(el);
        if (!lt) {
          lt = new LiquidTransition(el);
          this.animations.set(el, lt);
        }
        lt.set({ x: dx, y: dy, scaleX: sx, scaleY: sy });
        lt.to({ x: 0, y: 0, scaleX: 1, scaleY: 1 }, spring);
      }
    }
    /**
     * Convenience: wrap a callback that changes layout.
     * Automatically captures before and animates after.
     */
    animate(elements, layoutChange, spring) {
      const positions = this.capturePositions(elements);
      layoutChange();
      requestAnimationFrame(() => {
        this.animateFromPositions(elements, positions, spring);
      });
    }
    destroy() {
      for (const lt of this.animations.values()) {
        lt.destroy();
      }
      this.animations.clear();
    }
  };
  var DEFAULT_GESTURE_CONFIG = {
    dragSpring: "snappy",
    releaseSpring: "bouncy",
    pressScale: 0.95,
    pressSquish: 0.02,
    flickMultiplier: 1.2,
    maxDragDistance: Infinity,
    rubberBandFactor: 0.3,
    wobbleOnPress: true,
    scaleOnPress: true,
    velocityWindow: 100
  };
  var LiquidGesture = class {
    constructor(element, config = {}) {
      this.pressed = false;
      this.dragging = false;
      this.startX = 0;
      this.startY = 0;
      this.velocityHistory = [];
      this.pointerId = null;
      this.pressTimer = null;
      this.handlePointerDown = (e) => {
        if (this.pointerId !== null) return;
        this.pointerId = e.pointerId;
        this.el.setPointerCapture(e.pointerId);
        this.pressed = true;
        this.dragging = false;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.velocityHistory = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
        if (this.cfg.scaleOnPress) {
          this.transition.to({
            scale: this.cfg.pressScale,
            scaleX: 1 + this.cfg.pressSquish,
            scaleY: 1 - this.cfg.pressSquish
          }, "stiff");
        }
        if (this.cfg.wobbleOnPress) {
          this.pressTimer = window.setTimeout(() => {
            if (this.pressed && !this.dragging) {
              this.transition.to({
                scaleX: 1 - this.cfg.pressSquish * 0.5,
                scaleY: 1 + this.cfg.pressSquish * 0.5
              }, "gentle");
            }
          }, 150);
        }
        this._onPress?.();
      };
      this.handlePointerMove = (e) => {
        if (e.pointerId !== this.pointerId) return;
        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;
        if (!this.dragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
          this.dragging = true;
          this.transition.to({ scale: 1, scaleX: 1, scaleY: 1 }, "snappy");
          this._onDragStart?.(this.startX, this.startY);
        }
        if (this.dragging) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          let effectiveX = dx;
          let effectiveY = dy;
          if (dist > this.cfg.maxDragDistance) {
            const excess = dist - this.cfg.maxDragDistance;
            const dampedExcess = excess * this.cfg.rubberBandFactor;
            const ratio = (this.cfg.maxDragDistance + dampedExcess) / dist;
            effectiveX = dx * ratio;
            effectiveY = dy * ratio;
          }
          const now = performance.now();
          this.velocityHistory.push({ x: e.clientX, y: e.clientY, t: now });
          while (this.velocityHistory.length > 0 && now - this.velocityHistory[0].t > this.cfg.velocityWindow) {
            this.velocityHistory.shift();
          }
          this.transition.set({ x: effectiveX, y: effectiveY });
          const [vx, vy] = this.computeVelocity();
          this._onDrag?.(effectiveX, effectiveY, vx, vy);
        }
      };
      this.handlePointerUp = (e) => {
        if (e.pointerId !== this.pointerId) return;
        this.el.releasePointerCapture(e.pointerId);
        this.pointerId = null;
        if (this.pressTimer) {
          clearTimeout(this.pressTimer);
          this.pressTimer = null;
        }
        const wasDragging = this.dragging;
        const [vx, vy] = this.computeVelocity();
        this.pressed = false;
        this.dragging = false;
        if (wasDragging) {
          this.transition.release(
            { x: vx * this.cfg.flickMultiplier, y: vy * this.cfg.flickMultiplier },
            { x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1 }
          );
          this._onDragEnd?.(vx, vy);
        } else {
          this.transition.to(
            { scale: 1, scaleX: 1, scaleY: 1 },
            "bouncy"
          );
          this._onTap?.();
        }
        this._onRelease?.();
      };
      this.el = element;
      this.cfg = { ...DEFAULT_GESTURE_CONFIG, ...config };
      this.transition = new LiquidTransition(element, {
        spring: this.cfg.dragSpring,
        propertySprings: {
          scale: this.cfg.releaseSpring,
          scaleX: this.cfg.releaseSpring,
          scaleY: this.cfg.releaseSpring
        }
      });
      this.bindEvents();
    }
    // ─── Event Callbacks ──────────────────────────────────────────
    onDragStart(cb) {
      this._onDragStart = cb;
      return this;
    }
    onDrag(cb) {
      this._onDrag = cb;
      return this;
    }
    onDragEnd(cb) {
      this._onDragEnd = cb;
      return this;
    }
    onPress(cb) {
      this._onPress = cb;
      return this;
    }
    onRelease(cb) {
      this._onRelease = cb;
      return this;
    }
    onTap(cb) {
      this._onTap = cb;
      return this;
    }
    // ─── Internal ─────────────────────────────────────────────────
    bindEvents() {
      const el = this.el;
      el.style.touchAction = "none";
      el.style.userSelect = "none";
      el.style.webkitUserSelect = "none";
      el.addEventListener("pointerdown", this.handlePointerDown, { passive: false });
      el.addEventListener("pointermove", this.handlePointerMove, { passive: true });
      el.addEventListener("pointerup", this.handlePointerUp, { passive: true });
      el.addEventListener("pointercancel", this.handlePointerUp, { passive: true });
    }
    computeVelocity() {
      if (this.velocityHistory.length < 2) return [0, 0];
      const recent = this.velocityHistory;
      const first = recent[0];
      const last = recent[recent.length - 1];
      const dt = (last.t - first.t) / 1e3;
      if (dt < 1e-3) return [0, 0];
      return [
        (last.x - first.x) / dt,
        (last.y - first.y) / dt
      ];
    }
    /** Get the underlying transition (for custom animation control) */
    getTransition() {
      return this.transition;
    }
    destroy() {
      this.el.removeEventListener("pointerdown", this.handlePointerDown);
      this.el.removeEventListener("pointermove", this.handlePointerMove);
      this.el.removeEventListener("pointerup", this.handlePointerUp);
      this.el.removeEventListener("pointercancel", this.handlePointerUp);
      if (this.pressTimer) clearTimeout(this.pressTimer);
      if (this.pointerId !== null) {
        this.el.releasePointerCapture(this.pointerId);
      }
      this.transition.destroy();
    }
  };
  var LiquidButton = class {
    constructor(element, config) {
      this.gesture = new LiquidGesture(element, {
        pressScale: 0.92,
        pressSquish: 0.03,
        scaleOnPress: true,
        wobbleOnPress: true,
        maxDragDistance: 30,
        rubberBandFactor: 0.1,
        releaseSpring: "bouncy",
        ...config
      });
    }
    onTap(cb) {
      this.gesture.onTap(cb);
      return this;
    }
    destroy() {
      this.gesture.destroy();
    }
  };
  var LiquidDrag = class {
    constructor(element, config) {
      this.gesture = new LiquidGesture(element, {
        pressScale: 1.03,
        // Slightly enlarge when grabbed
        pressSquish: 0,
        scaleOnPress: true,
        wobbleOnPress: false,
        maxDragDistance: Infinity,
        rubberBandFactor: 1,
        flickMultiplier: 0.8,
        releaseSpring: "default",
        ...config
      });
    }
    /** Set snap points — element springs to nearest on release */
    setSnapTargets(_targets) {
      return this;
    }
    onSnap(_cb) {
      return this;
    }
    onDrag(cb) {
      this.gesture.onDrag(cb);
      return this;
    }
    destroy() {
      this.gesture.destroy();
    }
  };
  var DEFAULT_GROUP_CONFIG = {
    mergeDistance: 60,
    blendRadius: 24,
    spring: "liquidMerge",
    resolution: 3,
    renderBlob: true,
    bridgeOpacity: 0.15,
    bridgeColor: "rgba(255, 255, 255, 0.08)",
    bridgeRimColor: "rgba(255, 255, 255, 0.5)",
    bridgeRimWidth: 1.5,
    onMerge: void 0,
    onSplit: void 0
  };
  var LiquidGroup = class {
    constructor(container, config = {}) {
      this.members = /* @__PURE__ */ new Map();
      this.animId = null;
      this.needsUpdate = false;
      this.observer = null;
      this.resizeObserver = null;
      this.mergedPairs = /* @__PURE__ */ new Set();
      this.container = container;
      this.cfg = { ...DEFAULT_GROUP_CONFIG, ...config };
      this.scheduler = AnimationScheduler.shared();
      this.blendSpring = new Spring(0, this.cfg.spring);
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.rimCanvas = document.createElement("canvas");
      this.rimCtx = this.rimCanvas.getContext("2d");
      if (this.cfg.renderBlob) {
        this.setupRenderLayer();
      }
      this.setupObservers();
    }
    /**
     * Add an element to the liquid group.
     * It will now participate in merge/split animations with other members.
     */
    add(element) {
      const rect = element.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      const radius = parseFloat(getComputedStyle(element).borderRadius) || 0;
      this.members.set(element, {
        el: element,
        cx: rect.left + rect.width / 2 - containerRect.left,
        cy: rect.top + rect.height / 2 - containerRect.top,
        rx: rect.width / 2,
        ry: rect.height / 2,
        radius: Math.min(radius, rect.width / 2, rect.height / 2),
        merged: /* @__PURE__ */ new Set()
      });
      this.needsUpdate = true;
      this.startAnimation();
    }
    /**
     * Remove an element from the group.
     */
    remove(element) {
      this.members.delete(element);
      this.needsUpdate = true;
      for (const key of this.mergedPairs) {
        if (key.includes(String(element))) {
          this.mergedPairs.delete(key);
        }
      }
    }
    /**
     * Force update positions (call after layout changes).
     */
    updatePositions() {
      const containerRect = this.container.getBoundingClientRect();
      for (const [el, info] of this.members) {
        const rect = el.getBoundingClientRect();
        info.cx = rect.left + rect.width / 2 - containerRect.left;
        info.cy = rect.top + rect.height / 2 - containerRect.top;
        info.rx = rect.width / 2;
        info.ry = rect.height / 2;
        info.radius = Math.min(
          parseFloat(getComputedStyle(el).borderRadius) || 0,
          rect.width / 2,
          rect.height / 2
        );
      }
      this.needsUpdate = true;
      this.startAnimation();
    }
    /**
     * Manually trigger a merge animation between specific elements.
     */
    merge(_elements, spring) {
      this.blendSpring = new Spring(0, spring || this.cfg.spring);
      this.blendSpring.setTarget(1);
      this.needsUpdate = true;
      this.startAnimation();
    }
    /**
     * Manually trigger a split animation.
     */
    split(spring) {
      this.blendSpring = new Spring(1, spring || "liquidSplit");
      this.blendSpring.setTarget(0);
      this.needsUpdate = true;
      this.startAnimation();
    }
    // ─── Internal ─────────────────────────────────────────────────
    setupRenderLayer() {
      Object.assign(this.canvas.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "5",
        opacity: String(this.cfg.bridgeOpacity),
        mixBlendMode: "screen"
      });
      Object.assign(this.rimCanvas.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "6"
      });
      this.container.style.position = this.container.style.position || "relative";
      this.container.appendChild(this.canvas);
      this.container.appendChild(this.rimCanvas);
      this.resizeCanvas();
    }
    resizeCanvas() {
      const rect = this.container.getBoundingClientRect();
      const res = this.cfg.resolution;
      this.canvas.width = Math.ceil(rect.width / res);
      this.canvas.height = Math.ceil(rect.height / res);
      this.rimCanvas.width = Math.ceil(rect.width / res);
      this.rimCanvas.height = Math.ceil(rect.height / res);
    }
    setupObservers() {
      this.observer = new MutationObserver(() => {
        this.updatePositions();
      });
      this.observer.observe(this.container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"]
      });
      this.resizeObserver = new ResizeObserver(() => {
        this.resizeCanvas();
        this.updatePositions();
      });
      this.resizeObserver.observe(this.container);
    }
    startAnimation() {
      if (this.animId !== null) return;
      this.animId = this.scheduler.schedule((now) => {
        this.updatePositions();
        const springActive = this.blendSpring.tick(now);
        if (this.cfg.renderBlob) {
          this.renderMergeField();
        }
        this.detectMerges();
        const hasActivity = springActive || this.needsUpdate;
        this.needsUpdate = false;
        if (!hasActivity) {
          this.animId = null;
        }
        return hasActivity;
      });
    }
    renderMergeField() {
      const w = this.canvas.width;
      const h = this.canvas.height;
      const res = this.cfg.resolution;
      const members = [...this.members.values()];
      if (members.length < 2) {
        this.ctx.clearRect(0, 0, w, h);
        this.rimCtx.clearRect(0, 0, w, h);
        return;
      }
      const img = this.ctx.createImageData(w, h);
      const data = img.data;
      const rimImg = this.rimCtx.createImageData(w, h);
      const rimData = rimImg.data;
      const blendK = this.cfg.blendRadius / res;
      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          let mergedDist = Infinity;
          for (const member of members) {
            const cx = member.cx / res;
            const cy = member.cy / res;
            const rx = member.rx / res;
            const ry = member.ry / res;
            const r = member.radius / res;
            const dx = Math.abs(px - cx) - (rx - r);
            const dy = Math.abs(py - cy) - (ry - r);
            const outsideDist = Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2) - r;
            const d = Math.min(Math.max(dx, dy), outsideDist);
            if (mergedDist === Infinity) {
              mergedDist = d;
            } else {
              const hh = Math.max(blendK - Math.abs(mergedDist - d), 0) / blendK;
              mergedDist = Math.min(mergedDist, d) - hh * hh * hh * blendK * (1 / 6);
            }
          }
          const i = (py * w + px) * 4;
          let insideSingle = false;
          for (const member of members) {
            const cx = member.cx / res;
            const cy = member.cy / res;
            const rx = member.rx / res;
            const ry = member.ry / res;
            const r = member.radius / res;
            const dx = Math.abs(px - cx) - (rx - r);
            const dy = Math.abs(py - cy) - (ry - r);
            const outsideDist = Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2) - r;
            const d = Math.min(Math.max(dx, dy), outsideDist);
            if (d < -2) {
              insideSingle = true;
              break;
            }
          }
          if (insideSingle) continue;
          if (mergedDist < 0) {
            const intensity = Math.min(1, -mergedDist / 3);
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = Math.round(intensity * 60);
          }
          if (Math.abs(mergedDist) < this.cfg.bridgeRimWidth) {
            const rimIntensity = 1 - Math.abs(mergedDist) / this.cfg.bridgeRimWidth;
            rimData[i] = 255;
            rimData[i + 1] = 255;
            rimData[i + 2] = 255;
            rimData[i + 3] = Math.round(rimIntensity * 200);
          }
        }
      }
      this.ctx.putImageData(img, 0, 0);
      this.rimCtx.putImageData(rimImg, 0, 0);
    }
    detectMerges() {
      const members = [...this.members.values()];
      for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
          const a = members[i];
          const b = members[j];
          const dx = a.cx - b.cx;
          const dy = a.cy - b.cy;
          const centerDist = Math.sqrt(dx * dx + dy * dy);
          const edgeDist = centerDist - a.rx - b.rx;
          const pairKey = `${i}-${j}`;
          const wasMerged = this.mergedPairs.has(pairKey);
          const shouldMerge = edgeDist < this.cfg.mergeDistance;
          if (shouldMerge && !wasMerged) {
            this.mergedPairs.add(pairKey);
            a.merged.add(b.el);
            b.merged.add(a.el);
            this.cfg.onMerge?.([a.el, b.el]);
          } else if (!shouldMerge && wasMerged) {
            this.mergedPairs.delete(pairKey);
            a.merged.delete(b.el);
            b.merged.delete(a.el);
            this.cfg.onSplit?.([a.el, b.el]);
          }
        }
      }
    }
    /** Get elements currently merged with a given element */
    getMergedWith(element) {
      const info = this.members.get(element);
      return info ? [...info.merged] : [];
    }
    /** Check if two elements are currently merged */
    areMerged(a, b) {
      const info = this.members.get(a);
      return info?.merged.has(b) ?? false;
    }
    destroy() {
      if (this.animId !== null) {
        this.scheduler.cancel(this.animId);
      }
      if (this.observer) this.observer.disconnect();
      if (this.resizeObserver) this.resizeObserver.disconnect();
      this.canvas.remove();
      this.rimCanvas.remove();
      this.members.clear();
      this.mergedPairs.clear();
    }
  };
  var LiquidTabBar = class {
    constructor(container, items, config) {
      this.currentIndex = 0;
      this.animId = null;
      this.container = container;
      this.items = items;
      this.scheduler = AnimationScheduler.shared();
      this.spring = new Spring(0, config?.spring || "default");
      this.widthSpring = new Spring(0, config?.spring || "snappy");
      this.indicator = document.createElement("div");
      this.indicator.className = "ql-tab-indicator";
      Object.assign(this.indicator.style, {
        position: "absolute",
        top: "0",
        height: "100%",
        borderRadius: "inherit",
        pointerEvents: "none",
        transition: "none"
        // We handle animation
      });
      container.style.position = container.style.position || "relative";
      container.insertBefore(this.indicator, container.firstChild);
      if (items.length > 0) {
        this.selectImmediate(0);
      }
    }
    /**
     * Select a tab — the indicator morphs to it with liquid animation.
     * 
     * The stretch effect: indicator first expands to cover the gap
     * between old and new position, then contracts to the new tab.
     */
    select(index) {
      if (index === this.currentIndex) return;
      if (index < 0 || index >= this.items.length) return;
      const prevRect = this.items[this.currentIndex].getBoundingClientRect();
      const nextRect = this.items[index].getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      const prevX = prevRect.left - containerRect.left;
      const nextX = nextRect.left - containerRect.left;
      const stretchLeft = Math.min(prevX, nextX);
      const stretchRight = Math.max(prevX + prevRect.width, nextX + nextRect.width);
      const stretchWidth = stretchRight - stretchLeft;
      this.currentIndex = index;
      this.spring.setTarget(nextX);
      this.widthSpring.setValue(stretchWidth, 0);
      this.widthSpring.setTarget(nextRect.width);
      this.startAnimation();
    }
    /** Set tab without animation */
    selectImmediate(index) {
      this.currentIndex = index;
      const rect = this.items[index].getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      const x = rect.left - containerRect.left;
      this.spring.setValue(x);
      this.spring.setTarget(x);
      this.widthSpring.setValue(rect.width);
      this.widthSpring.setTarget(rect.width);
      this.indicator.style.transform = `translateX(${x}px)`;
      this.indicator.style.width = `${rect.width}px`;
    }
    /** Get indicator element (to apply liquid glass effect to it) */
    getIndicator() {
      return this.indicator;
    }
    startAnimation() {
      if (this.animId !== null) return;
      this.animId = this.scheduler.schedule((now) => {
        const posActive = this.spring.tick(now);
        const widthActive = this.widthSpring.tick(now);
        this.indicator.style.transform = `translateX(${this.spring.value}px)`;
        this.indicator.style.width = `${this.widthSpring.value}px`;
        const active = posActive || widthActive;
        if (!active) this.animId = null;
        return active;
      });
    }
    destroy() {
      if (this.animId !== null) {
        this.scheduler.cancel(this.animId);
      }
      this.indicator.remove();
    }
  };
  return __toCommonJS(index_exports);
})();
