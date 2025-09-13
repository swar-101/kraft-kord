# Kraft Kord

*A smart AI-assisted chord picker for producers — no piano-roll pencil required.*

> Quick pitch: Give producers feel-first chord suggestions, let them tweak, preview with realistic sounds, then export MIDI or rendered audio. Think: your chillest co-producer who loves voice-leading and never steals your credits.

---

# Table of contents

1. ✨ Vision
2. 🚀 Quick start
3. 🧱 Features
4. 🏗️ Architecture & data model
5. 🎛️ Frontend: Tone.js + Sampler notes
6. 🧾 MIDI export
7. 🤖 AI Suggestion API (prompt + schema)
8. 🎚️ UX patterns & controls
9. 🎼 Voicing & voice-leading (algorithm notes)
10. ♻️ Humanize, render, and export
11. 🧪 Testing & dev workflow (Copilot tips)
12. 🛣️ Roadmap
13. 🧾 License & contribution

---

# ✨ Vision

Kraft Kord is a tiny orchestra in your browser: AI suggests idiomatic chord progressions tailored to key, vibe, and complexity. You audition with realistic piano samples, tweak the voicing, and export a MIDI (or WAV) the whole world can use.

Why it matters

Producers waste time drawing notes. Kraft Kord accelerates composition while teaching good voice-leading. It is built for speed, clarity, and musicality.

Little science nugget

MIDI represents note events (pitch, velocity, timing). For realistic previews we use sampling: playing back recorded piano samples mapped across octaves. PolySynths are cheap and synthetic; Samplers give more organic tone because they replay real recordings.

Historical nugget

MIDI was invented in 1983 to let instruments speak a common language. We stand on the shoulders of that very practical giant.

---

# 🚀 Quick start (Dev)

Minimal dev steps to get a local Kraft Kord up and previewing sounds.

Prereqs

* Node 18+ and npm or pnpm
* WebStorm (or your editor of choice)
* Samples served from `/public/samples/piano/` (small set for demo)

Install

```bash
git clone <repo>
cd kraft-kord
npm install
```

Run dev server

```bash
npm start
# or
npm run dev
```

Open `http://localhost:3000` and trigger at least one user gesture (click) to allow Tone.js audio context (call `await Tone.start()`).

---

# 🧱 Features

* AI chord suggestions (key, vibe, complexity)
* Manual editor: drag, reorder, edit voicings
* Real-time audition with Tone.js (PolySynth / Sampler)
* MIDI export (midi-writer-js) and optional WAV render (Tone.Offline)
* Voice-leading smoothing and inversion control
* Humanize toggle for groove and human feel
* Undo / version snapshots for AI edits

---

# 🏗️ Architecture & data model

High-level

Frontend (React) handles UI, Tone.js previews, sample loading, and MIDI export. Backend (serverless or express) wraps the AI model and returns structured chord suggestions.

Chord object (canonical)

```js
{
  id: string,
  root: 'C4',
  quality: 'maj7' | 'min' | '7' | 'dim' | 'sus2' | 'sus4' | ...,
  notes: ['C3','E3','G3','B3'],
  duration: '4n' | '2n' | '1n' | '8n',
  velocity: 0.8,
  inversion?: 0 // 0=root, 1=first, etc.
}
```

Bar / progression model

* `progression: Chord[]` — each chord is placed sequentially. Timing is relative to tempo and `duration`.

---

# 🎛️ Frontend: Tone.js + Sampler notes

Use Tone.PolySynth for ultra-low-latency preview and Tone.Sampler for realism. Minimal rules:

* Call `await Tone.start()` inside a user gesture to unlock audio.
* Preload Sampler sample files and show a loading indicator.
* Use a small set of velocity-layered samples for C2..C5 for a demo.

Example Sampler mapping (suggestion)

```
Sampler({
  urls: { 'C3': 'C3.mp3', 'E3': 'E3.mp3', 'G3': 'G3.mp3' },
  baseUrl: '/samples/piano/'
})
```

Performance tip

Keep sample set small for demo. For production, consider streaming samples or using a hosted CDN.

---

# 🧾 MIDI export

Use `midi-writer-js` or `@tonejs/midi` to convert `progression` to a .mid file. Map Tone durations to MIDI durations with a helper.

Important: For shareable MIDI use quarter-note grid quantized data by default. Offer a humanize option that slightly offsets timing and velocity only for preview.

Example mapping table (simple)

| Tone | midi-writer |
| ---- | ----------- |
| 4n   | '4'         |
| 2n   | '2'         |
| 1n   | '1'         |

---

# 🤖 AI Suggestion API (prompt + schema)

Endpoint

`POST /api/suggest-chords`

Request body

```json
{
  "key": "C",
  "scale": "major",
  "tempo": 90,
  "vibe": "lo-fi chill",
  "complexity": 0.4,
  "contextProgression": [/* Chord objects, optional */]
}
```

Response body

```json
{
  "suggestions": [ /* Chord objects */ ]
}
```

Copilot / model prompt (backend)

```
You are a music-theory-savvy assistant. Given key {key} and scale {scale}, tempo {tempo}, and vibe "{vibe}", return 6 candidate chords in JSON. Each candidate MUST include root, quality, notes (voiced between C3 and C5), duration, and a short reason for the choice. Use conventional voice-leading and avoid huge leaps. Prefer JSON only.
```

Prompt tips

* Enforce strict JSON in the prompt to make parsing reliable.
* Use temperature to control creativity. Lower temperature for safer, functional suggestions.

---

# 🎚️ UX patterns & controls

Core UI blocks

* Left: key/scale picker, tempo, vibe, complexity slider
* Middle: progression strip (drag to reorder, click to edit)
* Right: suggestion panel (chips with play buttons)
* Bottom: piano roll preview + play/stop/export controls

Suggested interactions

* Click a suggestion chip to audition with Sampler
* Drag a chip into the progression to insert
* Accept button: insert into progression with undo snapshot
* Variation button: replace selected bar with AI variation

Accessibility

* Keyboard shortcuts: space to preview selected chord, arrow keys for navigation

---

# 🎼 Voicing & voice-leading (algorithm notes)

Goal

Minimize pitch movement between consecutive chords and keep bass choices musical.

Simple algorithm

1. Represent notes as MIDI numbers.
2. For each note in target voicing, try octave shifts so sum(|target - prev|) is minimized.
3. Respect bass preference: if user selected `root` as bass, keep root in lowest voice; otherwise allow 3rd or 5th.

Pseudo

```js
function smoothVoicing(prevNotes, targetNotes) {
  // shift each target note up/down octaves to minimize total distance
}
```

This simple approach works well for short progressions; for extended pieces consider dynamic programming for global minima.

---

# ♻️ Humanize, render, and export

Humanize options

* timing jitter (ms)
* velocity variance (±X)
* swing percentage (for groove)

Render to WAV

Use `Tone.Offline` to render the progression into an AudioBuffer and encode it to WAV for download. This costs CPU but is great for sharing quick MP3/WAV stems.

---

# 🧪 Testing & dev workflow (Copilot tips)

Testing

* Unit test voicing algorithm and duration mapping.
* Integration test the `/api/suggest-chords` contract with mocked AI responses.

Copilot prompt for WebStorm (paste into Copilot to scaffold a component)

```
Create a React component `KraftKordDemo` that includes: a small progression state array, a Sampler that preloads 4 piano sample files from /public/samples/piano/, a PolySynth fallback, a suggestion panel that displays a mocked array of chords, play buttons to audition chords, and an `exportMIDI` function using midi-writer-js. Keep code concise and add comments. Assume Tone and midi-writer-js are installed.
```

---

# 🛣️ Roadmap (minimal milestones)

1. MVP: local-only AI mock, Sampler preview, MIDI export
2. AI backend: production prompts, JSON enforcement, auth
3. Expanded sample library + instrument selector
4. WAV render and cloud-render option
5. Presets, user profiles, collaborative ideas

---

# 🧾 License & contribution

Open-source friendly. Use MIT unless you want more protection. Contributions welcome. Keep PRs small and focused.

---

If you want, I can:

* Produce a single-file React component ready for Copilot to paste into WebStorm
* Generate a set of 8 demo piano samples (filenames + suggested sources)
* Create a test suite for the voice-leading algorithm

Tell me which of these to drop next and I will produce it.
