/**
 * Offline renderer for the OS interaction sounds.
 *
 * Run with `npm run sounds`. Writes 16-bit mono WAVs into `public/sounds/`.
 *
 * Why offline rather than oscillators at runtime: the target aesthetic is
 * minimalist cyberpunk — Mr. Robot, Hacknet, Tron Legacy — which is built from
 * *noise* shaped by filters, not from notes. A relay click is a burst of
 * bandpassed noise decaying in 8ms; a boot hum is filtered rumble with a slow
 * swell. Those need multi-stage filtering, saturation and a reverb tail, none of
 * which is worth rebuilding in the browser on every play. Rendering here keeps
 * the runtime path to "decode a buffer, connect a gain node".
 *
 * Everything is deliberately dark and quiet. Peaks land well below full scale
 * and the brightest content sits under ~5kHz, because the failure mode for this
 * kind of UI audio is sounding like a 90s arcade cabinet.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const RATE = 44100;
const OUT_DIR = join(process.cwd(), 'public', 'sounds');

/* -------------------------------------------------------------------------- */
/*  Deterministic noise                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Mulberry32. Seeded so re-running the script produces byte-identical files —
 * otherwise every render would show up as a binary diff in git.
 */
function rng(seed) {
  let a = seed >>> 0;

  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                */
/* -------------------------------------------------------------------------- */

const seconds = (n) => Math.max(1, Math.round(n * RATE));

/** Silent buffer of `duration` seconds; every generator layers onto one. */
const buffer = (duration) => new Float32Array(seconds(duration));

/** White noise in [-1, 1]. */
function noise(duration, seed) {
  const out = buffer(duration);
  const rand = rng(seed);

  for (let i = 0; i < out.length; i++) out[i] = rand() * 2 - 1;

  return out;
}

/**
 * Sine with an exponential glide from `from` to `to` Hz. Phase is integrated
 * per sample rather than computed from `t` directly, so a sweeping frequency
 * cannot produce a phase discontinuity (which would click).
 */
function sine(duration, from, to = from) {
  const out = buffer(duration);
  const n = out.length;
  let phase = 0;

  for (let i = 0; i < n; i++) {
    const freq = from * Math.pow(to / from, i / n);
    phase += (2 * Math.PI * freq) / RATE;
    out[i] = Math.sin(phase);
  }

  return out;
}

/**
 * Percussive envelope: linear attack, exponential decay. `curve` above 1 makes
 * the tail drop away faster — the difference between a relay click and a thud.
 */
function envelope(signal, attack, decay, curve = 3) {
  const a = Math.max(1, seconds(attack));
  const total = signal.length;

  for (let i = 0; i < total; i++) {
    let gain;

    if (i < a) {
      gain = i / a;
    } else {
      const past = (i - a) / RATE;
      gain = Math.exp((-past / Math.max(decay, 1e-4)) * curve);
    }

    signal[i] *= gain;
  }

  return signal;
}

/** Fade in and out at the edges. Cheap insurance against boundary clicks. */
function edges(signal, fadeIn = 0.004, fadeOut = 0.02) {
  const inN = Math.min(seconds(fadeIn), signal.length);
  const outN = Math.min(seconds(fadeOut), signal.length);

  for (let i = 0; i < inN; i++) signal[i] *= i / inN;

  for (let i = 0; i < outN; i++) {
    signal[signal.length - 1 - i] *= i / outN;
  }

  return signal;
}

/** Sum `src` into `dst` at `offset` seconds, scaled by `gain`. */
function mix(dst, src, gain = 1, offset = 0) {
  const start = seconds(offset) - 1;

  for (let i = 0; i < src.length; i++) {
    const j = start + i;
    if (j >= 0 && j < dst.length) dst[j] += src[i] * gain;
  }

  return dst;
}

/* -------------------------------------------------------------------------- */
/*  Filters                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Chamberlin state-variable filter. Chosen over a biquad because the cutoff is
 * modulated per sample in most of these sounds (the swishes are entirely a
 * moving filter), and an SVF stays stable under modulation where a biquad with
 * recomputed coefficients can blow up.
 *
 * `cutoffAt` receives progress in [0, 1] and returns Hz. `q` is resonance —
 * higher is more resonant, so damping is its reciprocal. The second bound is
 * the standard stability limit for this topology: without it a high `q` drives
 * the damping term negative, the filter self-oscillates to Infinity, and the
 * result reaches the encoder as NaN (which writes out as pure silence).
 */
function svf(signal, cutoffAt, q = 0.7, mode = 'low') {
  const out = new Float32Array(signal.length);
  const n = signal.length;

  let low = 0;
  let band = 0;

  for (let i = 0; i < n; i++) {
    const hz = Math.min(Math.max(cutoffAt(i / n), 20), RATE * 0.24);
    const f = 2 * Math.sin((Math.PI * hz) / RATE);
    const damp = Math.min(1 / Math.max(q, 0.05), 2 / f - f * 0.5, 2);

    const high = signal[i] - low - damp * band;
    band += f * high;
    low += f * band;

    out[i] = mode === 'low' ? low : mode === 'band' ? band : high;
  }

  return out;
}

const lowpass = (signal, hz, q) =>
  svf(signal, typeof hz === 'function' ? hz : () => hz, q, 'low');

const bandpass = (signal, hz, q = 3) =>
  svf(signal, typeof hz === 'function' ? hz : () => hz, q, 'band');

const highpass = (signal, hz, q) =>
  svf(signal, typeof hz === 'function' ? hz : () => hz, q, 'high');

/* -------------------------------------------------------------------------- */
/*  Space and glue                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Small Schroeder reverb — four combs into two allpasses. Not a convincing
 * room, and not trying to be: it exists to put a short tail behind the
 * confirmation sounds so they read as "inside a machine" rather than pasted on
 * top of silence.
 */
function reverb(signal, amount = 0.25, decay = 0.42) {
  if (amount <= 0) return signal;

  const combs = [1116, 1188, 1277, 1356];
  const allpasses = [556, 441];

  const wet = new Float32Array(signal.length);

  for (const size of combs) {
    const line = new Float32Array(size);
    let idx = 0;

    for (let i = 0; i < signal.length; i++) {
      const delayed = line[idx];
      line[idx] = signal[i] + delayed * decay;
      wet[i] += delayed * 0.25;
      idx = (idx + 1) % size;
    }
  }

  for (const size of allpasses) {
    const line = new Float32Array(size);
    let idx = 0;

    for (let i = 0; i < wet.length; i++) {
      const delayed = line[idx];
      const input = wet[i];
      line[idx] = input + delayed * 0.5;
      wet[i] = delayed - input * 0.5;
      idx = (idx + 1) % size;
    }
  }

  const out = new Float32Array(signal.length);

  for (let i = 0; i < signal.length; i++) {
    out[i] = signal[i] + wet[i] * amount;
  }

  return out;
}

/** Soft clip. Rounds off transient peaks so clicks read as dull, not spiky. */
function saturate(signal, drive = 1.4) {
  for (let i = 0; i < signal.length; i++) {
    signal[i] = Math.tanh(signal[i] * drive) / Math.tanh(drive);
  }

  return signal;
}

/** Scale to an absolute peak. This is where the "quiet" in the brief lives. */
function normalize(signal, peak = 0.7) {
  let max = 0;

  for (let i = 0; i < signal.length; i++) {
    const abs = Math.abs(signal[i]);
    if (abs > max) max = abs;
  }

  if (max < 1e-6) return signal;

  const scale = peak / max;

  for (let i = 0; i < signal.length; i++) signal[i] *= scale;

  return signal;
}

/* -------------------------------------------------------------------------- */
/*  WAV encoding                                                              */
/* -------------------------------------------------------------------------- */

/** 16-bit PCM mono. No ffmpeg in the toolchain, and these are short enough. */
function wav(signal) {
  const data = Buffer.alloc(signal.length * 2);

  for (let i = 0; i < signal.length; i++) {
    const clamped = Math.max(-1, Math.min(1, signal[i]));
    data.writeInt16LE(Math.round(clamped * 32767), i * 2);
  }

  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);

  return Buffer.concat([header, data]);
}

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */

/**
 * The signature sound of the whole set: a relay contact closing. Bandpassed
 * noise with a near-instant attack and an 8ms decay, saturated so the peak is
 * blunt. Two of these a few milliseconds apart read as a physical switch,
 * because a real contact bounces.
 */
function relayClick(seed, { hz = 2100, decay = 0.008, q = 2.4 } = {}) {
  const click = envelope(
    bandpass(noise(0.05, seed), hz, q),
    0.0003,
    decay,
    4.5,
  );

  // Low thump under the click — the body of the switch, not the contact.
  const body = envelope(sine(0.05, 180, 120), 0.001, 0.012, 4);

  const out = buffer(0.05);
  mix(out, click, 1);
  mix(out, body, 0.35);

  return saturate(out, 1.8);
}

/**
 * Filtered noise sweep. `from`/`to` are the bandpass corner in Hz, so a
 * downward sweep is a "close" and an upward one is an "open". This is the
 * digital swish — no pitched content at all, which is what keeps it from
 * sounding like a musical note.
 */
function swish(duration, seed, from, to, { q = 1.5, peak = 0.55 } = {}) {
  const swept = svf(
    noise(duration, seed),
    (t) => from * Math.pow(to / from, t),
    q,
    'band',
  );

  // Bell-ish curve: fades in and out so there is no edge at either end.
  const n = swept.length;

  for (let i = 0; i < n; i++) {
    const t = i / n;
    swept[i] *= Math.sin(Math.PI * t) ** 1.4;
  }

  return normalize(lowpass(swept, 4800, 0.6), peak);
}

/* -------------------------------------------------------------------------- */
/*  The sounds                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Power-on. A machine coming up under load: sub rumble swelling from 32Hz,
 * filtered noise "air" opening up behind it, and a relay clunk at the front.
 * No melody, no arpeggio — just mass arriving.
 */
function bootHum() {
  const length = 2.6;
  const out = buffer(length);

  // Contactor closing, right at the start.
  mix(out, relayClick(0x1a2b, { hz: 1500, decay: 0.014 }), 0.5, 0);

  // Sub swell. Two detuned layers so it beats slowly instead of sitting still.
  const sub = sine(length, 32, 46);
  const subB = sine(length, 32.7, 46.9);

  for (let i = 0; i < sub.length; i++) {
    const t = i / sub.length;
    // Slow rise, long plateau, fall away at the end.
    const swell = Math.min(t / 0.45, 1) * (1 - Math.max(0, (t - 0.7) / 0.3));
    sub[i] = (sub[i] + subB[i] * 0.8) * swell;
  }

  mix(out, sub, 0.85);

  // Transformer harmonic — quiet, keeps the sub from sounding like a test tone.
  const harmonic = sine(length, 96, 138);

  for (let i = 0; i < harmonic.length; i++) {
    const t = i / harmonic.length;
    harmonic[i] *= Math.min(t / 0.5, 1) * (1 - Math.max(0, (t - 0.75) / 0.25));
  }

  mix(out, harmonic, 0.12);

  // Air: noise through a filter that opens as the system spins up.
  const air = lowpass(noise(length, 0x5c3d), (t) => 180 + 1500 * t, 0.5);

  for (let i = 0; i < air.length; i++) {
    const t = i / air.length;
    air[i] *= Math.min(t / 0.6, 1) * (1 - Math.max(0, (t - 0.72) / 0.28));
  }

  mix(out, air, 0.2);

  return normalize(edges(saturate(out, 1.2), 0.01, 0.35), 0.62);
}

/**
 * Access granted. Deliberately restrained: two relay clicks, then a sub drop
 * and one soft filtered bloom. The old version was a rising three-note square
 * fanfare, which is exactly the arcade register the brief rules out.
 */
function accessGranted() {
  const length = 1.5;
  const out = buffer(length);

  mix(out, relayClick(0x2f81, { hz: 2400, decay: 0.007 }), 0.62, 0);
  mix(out, relayClick(0x3c19, { hz: 1750, decay: 0.011 }), 0.44, 0.055);

  // Authoritative downward sub — the "lock disengaging" gesture.
  const drop = envelope(sine(0.9, 130, 42), 0.004, 0.3, 2.2);
  mix(out, drop, 0.55, 0.05);

  // Single soft bloom of filtered noise. Confirmation without a melody.
  const bloom = envelope(
    lowpass(noise(0.85, 0x4411), (t) => 900 + 1400 * (1 - t), 0.8),
    0.05,
    0.28,
    2,
  );
  mix(out, bloom, 0.3, 0.06);

  // Faint high shimmer, well under the rest — a hint of "digital", no more.
  const shimmer = envelope(bandpass(noise(0.6, 0x77a2), 4200, 4), 0.03, 0.2, 3);
  mix(out, shimmer, 0.09, 0.07);

  return normalize(edges(reverb(out, 0.22, 0.4), 0.002, 0.2), 0.66);
}

/** Window open: short upward filtered swish with a soft click at the front. */
function windowOpen() {
  const length = 0.34;
  const out = buffer(length);

  mix(out, swish(0.3, 0x6d2a, 400, 2600, { q: 1.2, peak: 0.5 }), 0.75, 0.008);
  mix(out, relayClick(0x1f44, { hz: 2800, decay: 0.004 }), 0.22, 0);

  // Quiet rising body so it has weight rather than being pure hiss.
  const body = envelope(sine(0.26, 220, 380), 0.02, 0.1, 2.5);
  mix(out, body, 0.16, 0.01);

  return normalize(edges(out, 0.002, 0.05), 0.5);
}

/** Window close: the same gesture inverted and quieter. Closing is not news. */
function windowClose() {
  const length = 0.3;
  const out = buffer(length);

  mix(out, swish(0.26, 0x9e31, 2400, 380, { q: 1.2, peak: 0.44 }), 0.72, 0);

  const body = envelope(sine(0.22, 340, 170), 0.015, 0.09, 2.5);
  mix(out, body, 0.15, 0.005);

  // Soft detent at the end — the window seating shut.
  mix(out, relayClick(0x2c76, { hz: 1400, decay: 0.005 }), 0.2, 0.2);

  return normalize(edges(out, 0.002, 0.05), 0.42);
}

/**
 * Per-line tick for the developer intro. Fires many times in a row, so it is
 * the driest and quietest thing here — anything with a tail would smear.
 */
function introTick() {
  const out = buffer(0.045);

  mix(out, relayClick(0x51c8, { hz: 3100, decay: 0.0035, q: 3.2 }), 0.75, 0);

  return normalize(edges(out, 0.0004, 0.012), 0.34);
}

/**
 * Desktop login. Replaces a literal C-E-G major chord. Now: a low sub arrival,
 * a filtered noise rise, and two soft relays — the OS settling, not a jingle.
 */
function login() {
  const length = 1.9;
  const out = buffer(length);

  // Sub arrival, slightly rising then settling.
  const sub = sine(1.6, 54, 41);

  for (let i = 0; i < sub.length; i++) {
    const t = i / sub.length;
    sub[i] *= Math.min(t / 0.12, 1) * Math.exp(-t * 1.5);
  }

  mix(out, sub, 0.7, 0.02);

  // Noise rise that opens then closes — the "swish up into place".
  const rise = svf(
    noise(1.1, 0x8a2f),
    (t) => 300 + 2200 * Math.sin(Math.PI * Math.min(t * 1.15, 1)),
    1.1,
    'band',
  );

  for (let i = 0; i < rise.length; i++) {
    const t = i / rise.length;
    rise[i] *= Math.sin(Math.PI * Math.min(t * 1.05, 1)) ** 1.3;
  }

  mix(out, rise, 0.26, 0.0);

  // Two quiet relays bracketing the gesture.
  mix(out, relayClick(0x3311, { hz: 2000, decay: 0.006 }), 0.3, 0.015);
  mix(out, relayClick(0x44f2, { hz: 1600, decay: 0.009 }), 0.22, 0.42);

  // Barely-there air above it all, rolled off hard.
  const air = envelope(
    lowpass(highpass(noise(1.4, 0x66bd), 1800, 0.5), 5200, 0.6),
    0.12,
    0.5,
    1.8,
  );
  mix(out, air, 0.1, 0.05);

  return normalize(edges(reverb(out, 0.18, 0.44), 0.004, 0.3), 0.58);
}

/**
 * Restrained confirmation chime. The one sound allowed any pitched content at
 * all — a single soft partial, heavily rolled off, under a relay and a bloom of
 * noise. Deliberately not the two-note rising lift it replaces: one note cannot
 * imply a key, and a lift of a major third can.
 */
function notify() {
  const length = 0.85;
  const out = buffer(length);

  mix(out, relayClick(0x7d13, { hz: 2600, decay: 0.005 }), 0.34, 0);

  // Single partial plus its fifth at low level — reads as "tone", not "tune".
  const body = envelope(sine(0.55, 660, 640), 0.012, 0.16, 2.4);
  mix(out, body, 0.24, 0.012);

  const fifth = envelope(sine(0.45, 990, 970), 0.02, 0.12, 2.8);
  mix(out, fifth, 0.09, 0.014);

  const bloom = envelope(
    lowpass(noise(0.5, 0x2ea7), (t) => 1600 + 900 * (1 - t), 0.7),
    0.02,
    0.14,
    2.5,
  );
  mix(out, bloom, 0.18, 0.01);

  return normalize(edges(reverb(out, 0.2, 0.36), 0.002, 0.14), 0.46);
}

/**
 * Screen-transition swish. A wide downward filter sweep with a sub drop under
 * it — the "moving between contexts" gesture, used when the countdown hits zero.
 */
function transition() {
  const length = 0.6;
  const out = buffer(length);

  const sweep = svf(
    noise(0.5, 0xb42c),
    (t) => 3400 * Math.pow(180 / 3400, t),
    0.9,
    'low',
  );

  for (let i = 0; i < sweep.length; i++) {
    const t = i / sweep.length;
    sweep[i] *= Math.sin(Math.PI * Math.min(t * 1.08, 1)) ** 1.2;
  }

  mix(out, sweep, 0.6, 0);

  // Sub falling away underneath, giving the sweep somewhere to land.
  const drop = envelope(sine(0.5, 120, 38), 0.02, 0.18, 2.2);
  mix(out, drop, 0.42, 0.02);

  return normalize(edges(reverb(out, 0.14, 0.34), 0.004, 0.12), 0.54);
}

/* -------------------------------------------------------------------------- */
/*  Entry point                                                               */
/* -------------------------------------------------------------------------- */

const SOUNDS = {
  'boot-hum': bootHum,
  'access-granted': accessGranted,
  'window-open': windowOpen,
  'window-close': windowClose,
  'intro-tick': introTick,
  login,
  notify,
  transition,
};

mkdirSync(OUT_DIR, { recursive: true });

for (const [name, render] of Object.entries(SOUNDS)) {
  const signal = render();

  // An unstable filter produces NaN, which the encoder would happily write out
  // as a silent file. Fail loudly instead — a silent WAV looks like a working
  // build right up until nobody can hear it.
  let peak = 0;

  for (let i = 0; i < signal.length; i++) {
    if (!Number.isFinite(signal[i])) {
      throw new Error(`${name}: non-finite sample at ${i} (filter blew up)`);
    }

    const abs = Math.abs(signal[i]);
    if (abs > peak) peak = abs;
  }

  if (peak < 0.01) {
    throw new Error(`${name}: rendered effectively silent (peak ${peak})`);
  }

  const bytes = wav(signal);
  const path = join(OUT_DIR, `${name}.wav`);

  writeFileSync(path, bytes);

  const kb = (bytes.length / 1024).toFixed(1);
  const secs = (signal.length / RATE).toFixed(2);
  const db = (20 * Math.log10(peak)).toFixed(1);

  console.log(`  ${name}.wav — ${secs}s, ${kb} KB, peak ${db} dBFS`);
}

console.log(`\n${Object.keys(SOUNDS).length} files written to public/sounds/`);

