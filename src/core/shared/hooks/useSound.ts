'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

export type SoundType =
  // Sampled — the major interactions.
  | 'boot'
  | 'access'
  | 'windowOpen'
  | 'windowClose'
  | 'login'
  | 'blip'
  | 'notify'
  | 'transition'
  | 'kernelScan'
  | 'click'
  // Synthesized — tiny UI feedback only.
  | 'type'
  | 'beep'
  | 'error';

export type SoundCategory =
  | 'ambience'
  | 'system'
  | 'transition'
  | 'interface'
  | 'terminal'
  | 'feedback';

interface SoundProfile {
  category: SoundCategory;
  gain: number;
  cooldown: number;
  maxVoices: number;
}

const PROFILES: Record<SoundType, SoundProfile> = {
  boot: { category: 'ambience', gain: 0.72, cooldown: 1000, maxVoices: 1 },
  access: { category: 'system', gain: 0.78, cooldown: 500, maxVoices: 1 },
  windowOpen: { category: 'transition', gain: 0.7, cooldown: 90, maxVoices: 2 },
  windowClose: { category: 'transition', gain: 0.62, cooldown: 90, maxVoices: 2 },
  login: { category: 'system', gain: 0.72, cooldown: 800, maxVoices: 1 },
  blip: { category: 'interface', gain: 0.42, cooldown: 35, maxVoices: 2 },
  notify: { category: 'feedback', gain: 0.68, cooldown: 160, maxVoices: 2 },
  transition: { category: 'transition', gain: 0.72, cooldown: 180, maxVoices: 1 },
  kernelScan: { category: 'ambience', gain: 0.58, cooldown: 1200, maxVoices: 1 },
  click: { category: 'interface', gain: 0.5, cooldown: 35, maxVoices: 2 },
  type: { category: 'terminal', gain: 0.34, cooldown: 22, maxVoices: 2 },
  beep: { category: 'feedback', gain: 0.55, cooldown: 80, maxVoices: 2 },
  error: { category: 'feedback', gain: 0.58, cooldown: 180, maxVoices: 1 },
};

const CATEGORY_GAIN: Record<SoundCategory, number> = {
  ambience: 0.7,
  system: 0.82,
  transition: 0.72,
  interface: 0.58,
  terminal: 0.5,
  feedback: 0.76,
};

const soundGainOverrides = new Map<SoundType, number>();
const categoryGainOverrides = new Map<SoundCategory, number>();

/* -------------------------------------------------------------------------- */
/*  Samples                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Every sound with any weight to it is a pre-rendered file. They are built by
 * `npm run sounds` (see `scripts/render-sounds.mjs`) from noise, filters and
 * saturation rather than oscillators, because the target — Mr. Robot, Hacknet,
 * Tron Legacy — is relay clicks and low hums, and an oscillator playing a note
 * always reads as a musical tone no matter how it is enveloped.
 *
 * Swapping in licensed audio later means replacing the file and nothing else;
 * no component knows where a sound comes from.
 */
const SAMPLES: Partial<Record<SoundType, string>> = {
  boot: '/sounds/boot-hum.wav',
  access: '/sounds/access-granted.wav',
  windowOpen: '/sounds/window-open.wav',
  windowClose: '/sounds/window-close.wav',
  login: '/sounds/login.wav',
  blip: '/sounds/intro-tick.wav',
  notify: '/sounds/notify.wav',
  transition: '/sounds/transition.wav',
  kernelScan: '/sounds/kernel-scan.wav',
  click: '/sounds/ui-click.wav',
};

/**
 * Held back for the power-on gesture: these are the sounds that fire in the
 * first moments after unlock, so a cold fetch would make them miss their cue.
 * The rest stream in behind them.
 */
const CRITICAL: SoundType[] = ['boot', 'blip'];

/* -------------------------------------------------------------------------- */
/*  Synthesized UI feedback                                                   */
/* -------------------------------------------------------------------------- */

interface Tone {
  wave: OscillatorType;
  from: number;
  to: number;
  duration: number;
  gain: number;
  /** Fade-in. Starting at full gain puts a step in the waveform, which every
   *  speaker reproduces as a click on top of the note. */
  attack: number;
  release: number;
  /** Lowpass corner. Square waves carry harmonics well past anything musical;
   *  rolling them off is what keeps a tone warm rather than buzzy. */
  cutoff?: number;
}

/**
 * Only the three sounds that need to be instant and weightless stay
 * synthesized: keystrokes, the error buzz, and a single confirmation blip.
 * These fire constantly and carry no drama, so the cost of a buffer — and the
 * risk of it not having loaded — buys nothing.
 *
 * Note there are no sequences here any more. A tone list per sound was how the
 * old three-note "access granted" fanfare and the C-E-G login chord were built;
 * both are now samples, and nothing that remains is a melody.
 */
const TONES: Record<'type' | 'beep' | 'error', Tone> = {
  // Dull keystroke. Attack stays tiny so typing feels immediate.
  type: {
    wave: 'square',
    from: 1400,
    to: 900,
    duration: 0.025,
    gain: 0.14,
    attack: 0.002,
    release: 0.015,
    cutoff: 2400,
  },

  // Single confirmation blip. Short and dry — no second note.
  beep: {
    wave: 'triangle',
    from: 840,
    to: 840,
    duration: 0.07,
    gain: 0.22,
    attack: 0.008,
    release: 0.05,
    cutoff: 2200,
  },

  // Falling buzz. The one place a sawtooth still earns its keep.
  error: {
    wave: 'sawtooth',
    from: 280,
    to: 110,
    duration: 0.26,
    gain: 0.3,
    attack: 0.012,
    release: 0.15,
    cutoff: 900,
  },
};

/** Exponential ramps cannot reach 0, so silence is approximated. */
const SILENT = 0.0001;

const DEFAULT_CUTOFF = 4000;

const isDev = process.env.NODE_ENV !== 'production';

function warn(message: string) {
  if (isDev) console.warn(`[useSound] ${message}`);
}

/* -------------------------------------------------------------------------- */
/*  Mute state                                                                */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = 'devos:audio';
const LEGACY_STORAGE_KEY = 'devos:muted';
const DEFAULT_VOLUME = 0.42;

let muted = false;
let volume = DEFAULT_VOLUME;
let hydrated = false;

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

interface AudioSnapshot {
  muted: boolean;
  volume: number;
}

let snapshot: AudioSnapshot = { muted, volume };
const serverSnapshot: AudioSnapshot = { muted: false, volume: DEFAULT_VOLUME };

function updateSnapshot() {
  snapshot = { muted, volume };
}

function getSnapshot() {
  return snapshot;
}

/**
 * Server and first-client snapshots must agree, so the stored preference is
 * read after mount (or on the first `play`) rather than at module scope.
 */
function getServerSnapshot() {
  return serverSnapshot;
}

function hydrateSettings() {
  if (hydrated || typeof window === 'undefined') return;

  hydrated = true;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const legacyMuted = window.localStorage.getItem(LEGACY_STORAGE_KEY) === '1';
    const settings = stored
      ? (JSON.parse(stored) as Partial<AudioSnapshot>)
      : { muted: legacyMuted };

    muted = settings.muted ?? false;
    volume = clampVolume(settings.volume ?? DEFAULT_VOLUME);
    updateSnapshot();
    applyMasterGain();
    emit();
  } catch {
    // Private-mode Safari throws on localStorage access; unmuted is a fine
    // default and the toggle still works for the session.
  }
}

export function useMuted() {
  useEffect(() => {
    hydrateSettings();
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot).muted;
}

export function useAudioSettings() {
  useEffect(() => {
    hydrateSettings();
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : DEFAULT_VOLUME));
}

function persistSettings() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ muted, volume }));
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Session-only settings are still useful when storage is unavailable.
  }
}

export function toggleMuted() {
  hydrateSettings();

  muted = !muted;
  updateSnapshot();
  persistSettings();
  applyMasterGain();
  emit();

  return muted;
}

export function setMasterVolume(nextVolume: number) {
  hydrateSettings();
  volume = clampVolume(nextVolume);
  if (volume > 0 && muted) muted = false;
  updateSnapshot();
  persistSettings();
  applyMasterGain();
  emit();
}

/** Runtime mix controls for future screens or an expanded settings panel. */
export function setSoundVolume(type: SoundType, nextVolume: number) {
  soundGainOverrides.set(type, clampVolume(nextVolume));
}

export function setCategoryVolume(category: SoundCategory, nextVolume: number) {
  categoryGainOverrides.set(category, clampVolume(nextVolume));
}

/* -------------------------------------------------------------------------- */
/*  Audio graph                                                               */
/* -------------------------------------------------------------------------- */

/**
 * One context shared by every caller. Browsers cap live AudioContexts per page
 * (Safari allows only a handful), and the boot sequence alone mounts a dozen
 * sound-playing components at once — a context per hook instance runs out fast.
 * Never closed: it lives as long as the page does.
 */
let sharedContext: AudioContext | null = null;

/** Every sound routes through here so mute can duck audio already in flight. */
let masterGain: GainNode | null = null;

let unlockBound = false;
let detachUnlockListeners: (() => void) | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioCtx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioCtx) return null;

  // Created lazily so we never construct a context before a user gesture.
  sharedContext ??= new AudioCtx();

  return sharedContext;
}

function getMaster(ctx: AudioContext): GainNode {
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : volume;
    masterGain.connect(ctx.destination);
  }

  return masterGain;
}

function applyMasterGain() {
  if (!masterGain || !sharedContext) return;

  const now = sharedContext.currentTime;

  // Short ramp rather than a jump: setting gain instantly clicks just like a
  // missing envelope does.
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(muted ? 0 : volume, now + 0.05);
}

const lastPlayed = new Map<SoundType, number>();
const activeVoices = new Map<SoundType, number>();

function claimVoice(type: SoundType) {
  const profile = PROFILES[type];
  const now = performance.now();

  if (now - (lastPlayed.get(type) ?? -Infinity) < profile.cooldown) return false;
  if ((activeVoices.get(type) ?? 0) >= profile.maxVoices) return false;

  lastPlayed.set(type, now);
  activeVoices.set(type, (activeVoices.get(type) ?? 0) + 1);
  return true;
}

function releaseVoice(type: SoundType) {
  activeVoices.set(type, Math.max(0, (activeVoices.get(type) ?? 1) - 1));
}

function resolvedGain(type: SoundType, requested: number) {
  const profile = PROFILES[type];
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const accessibilityGain = reduced && profile.category === 'ambience' ? 0.5 : 1;
  const soundGain = soundGainOverrides.get(type) ?? 1;
  const categoryGain =
    categoryGainOverrides.get(profile.category) ?? CATEGORY_GAIN[profile.category];

  return requested * profile.gain * soundGain * categoryGain * accessibilityGain;
}

/* -------------------------------------------------------------------------- */
/*  Sample loading                                                            */
/* -------------------------------------------------------------------------- */

const buffers = new Map<SoundType, AudioBuffer>();
const loading = new Map<SoundType, Promise<AudioBuffer | null>>();

/**
 * Resolves null rather than rejecting. A missing or undecodable file should
 * cost that one sound and nothing else — a portfolio that throws an audio error
 * into the console reads worse than one that is quiet.
 */
function loadSample(type: SoundType): Promise<AudioBuffer | null> {
  const cached = buffers.get(type);

  if (cached) return Promise.resolve(cached);

  const inFlight = loading.get(type);

  if (inFlight) return inFlight;

  const url = SAMPLES[type];
  const ctx = getContext();

  if (!url || !ctx) return Promise.resolve(null);

  const task = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response.arrayBuffer();
    })
    // Callback form rather than the promise form: Safari still ships the old
    // signature, and the promise overload rejects there.
    .then(
      (bytes) =>
        new Promise<AudioBuffer>((resolve, reject) => {
          ctx.decodeAudioData(bytes, resolve, reject);
        }),
    )
    .then((decoded) => {
      buffers.set(type, decoded);
      return decoded;
    })
    .catch((error: unknown) => {
      warn(`failed to load ${url} — ${String(error)}`);
      return null;
    })
    .finally(() => {
      loading.delete(type);
    });

  loading.set(type, task);

  return task;
}

function preloadAll() {
  for (const type of Object.keys(SAMPLES) as SoundType[]) {
    void loadSample(type);
  }
}

/**
 * Autoplay policies leave the context suspended until the page has been
 * interacted with. Rather than gating the OS behind a "press any key" screen,
 * the first interaction anywhere resumes the context — so at worst the very
 * first power-on sound is missed and everything after it plays.
 */
function bindUnlock(ctx: AudioContext) {
  if (unlockBound || typeof window === 'undefined') return;

  unlockBound = true;

  const events = ['pointerdown', 'keydown', 'touchstart'] as const;

  const detach = () => {
    for (const event of events) {
      window.removeEventListener(event, resume);
    }

    detachUnlockListeners = null;
  };

  detachUnlockListeners = detach;

  function resume() {
    void ctx
      .resume()
      .then(() => {
        if (ctx.state === 'running') detach();
      })
      .catch(() => {});
  }

  for (const event of events) {
    window.addEventListener(event, resume, { passive: true });
  }
}

/**
 * Resolves once the shared context is genuinely running, so a caller can hold a
 * phase transition open until sound is actually available rather than hoping.
 *
 * Must be called from inside a real user-gesture handler: that gesture is what
 * browsers require before an AudioContext may leave `suspended`. Constructing
 * the context and its master gain synchronously here (not in a later tick)
 * matters on Safari, which ties the unlock to the graph existing at gesture
 * time. Never rejects — a blocked unlock resolves `false` so the caller can
 * carry on silently instead of stalling the OS behind an audio failure.
 *
 * Also waits, briefly, for the sounds that fire immediately after power-on.
 * The wait is capped: a slow network should delay the boot hum, never the boot.
 */
export async function unlockAudio(timeout = 1200): Promise<boolean> {
  const ctx = getContext();

  if (!ctx) return false;

  getMaster(ctx);
  bindUnlock(ctx);

  if (ctx.state !== 'running') {
    try {
      await ctx.resume();
    } catch {
      // Autoplay policy refused; nothing further to try.
    }
  }

  preloadAll();

  await Promise.race([
    Promise.all(CRITICAL.map(loadSample)),
    new Promise((resolve) => setTimeout(resolve, timeout)),
  ]);

  return ctx.state === 'running';
}

/* -------------------------------------------------------------------------- */
/*  Playback                                                                  */
/* -------------------------------------------------------------------------- */

function playSample(ctx: AudioContext, type: SoundType, volume: number) {
  const buffer = buffers.get(type);

  if (!buffer) {
    // Kick off the load so a later trigger lands, but drop this one. Deferring
    // it would fire the sound after the moment it was meant to mark, and a
    // sound that missed its cue is noise.
    void loadSample(type);
    warn(`${type} not loaded yet — skipped`);
    return;
  }

  const source = ctx.createBufferSource();
  const gain = ctx.createGain();

  source.buffer = buffer;
  gain.gain.value = volume;

  source.connect(gain);
  gain.connect(getMaster(ctx));

  source.start();

  // Buffer sources are single-use; releasing keeps a long session from
  // accumulating dead nodes on the master bus.
  source.onended = () => {
    releaseVoice(type);
    source.disconnect();
    gain.disconnect();
  };
}

function playTone(ctx: AudioContext, type: SoundType, tone: Tone, volume: number) {
  const peak = tone.gain * volume;

  // Exponential ramps toward an inaudible peak are pointless and, at 0, invalid.
  if (peak <= SILENT) {
    releaseVoice(type);
    return;
  }

  const at = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  oscillator.type = tone.wave;
  oscillator.frequency.setValueAtTime(tone.from, at);

  if (tone.to !== tone.from) {
    oscillator.frequency.exponentialRampToValueAtTime(
      tone.to,
      at + tone.duration,
    );
  }

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(tone.cutoff ?? DEFAULT_CUTOFF, at);

  // Clamped so a long envelope on a short tone cannot invert the ramps.
  const attack = Math.min(tone.attack, tone.duration * 0.5);
  const release = Math.min(tone.release, tone.duration - attack);
  const sustainUntil = at + tone.duration - release;

  gain.gain.setValueAtTime(SILENT, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + attack);

  if (sustainUntil > at + attack) {
    gain.gain.setValueAtTime(peak, sustainUntil);
  }

  gain.gain.exponentialRampToValueAtTime(SILENT, at + tone.duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(getMaster(ctx));

  oscillator.start(at);

  // Small pad so the filter can ring out past the gain envelope.
  oscillator.stop(at + tone.duration + 0.02);

  oscillator.onended = () => {
    releaseVoice(type);
    oscillator.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}

export function useSound() {
  const play = useCallback((type: SoundType, volume = 0.3) => {
    hydrateSettings();

    if (muted) return;

    const ctx = getContext();

    if (!ctx) return;

    bindUnlock(ctx);

    /**
     * `currentTime` does not advance while the context is suspended, so every
     * sound scheduled during that window lands on the same frozen timestamp and
     * they all fire together the moment the context unlocks.
     */
    if (ctx.state !== 'running') {
      void ctx.resume().catch(() => {});
      return;
    }

    if (!claimVoice(type)) return;

    const gain = resolvedGain(type, clampVolume(volume));

    if (type in SAMPLES) {
      if (!buffers.has(type)) {
        releaseVoice(type);
        void loadSample(type);
        return;
      }
      playSample(ctx, type, gain);
      return;
    }

    playTone(ctx, type, TONES[type as keyof typeof TONES], gain);
  }, []);

  return { play };
}

export function disposeAudio() {
  detachUnlockListeners?.();
  buffers.clear();
  loading.clear();
  lastPlayed.clear();
  activeVoices.clear();
  soundGainOverrides.clear();
  categoryGainOverrides.clear();
  masterGain?.disconnect();
  masterGain = null;

  const context = sharedContext;
  sharedContext = null;
  unlockBound = false;
  if (context && context.state !== 'closed') void context.close().catch(() => {});
}
