# Emoaibabe (J.E.L.) — Skills

Human-AI systems designer and builder. I design the whole person-shaped system —
voice, listening, timing, trust — and I ship it end to end.

*A selective skills sheet: I bring this to projects and homes that deserve a
systems-first builder, not to an audience. Contact is shared on request, with
the people I choose to work with.*

---

## Positioning

I build **human-AI systems** where the technology has to *feel* like someone:
a voice with breath and pace, an ear that knows when you're talking, a desk
that holds a conversation. Most of the field builds models; I build the
**whole person** around them. Polyglot systems engineer by trade, holistic
designer by habit. One studio, quiet, and the people we choose to build for.

## The studio

I am not a one-woman team. I design and direct a small studio of systems —
which broadly covers what a startup's first ten hires would: systems
engineering, DSP/audio, realtime playback, model runtime, testing,
documentation, and the persona itself.

- **Umbriel** — my engineering assistant and journal-keeper: measures first,
  commits what it measured, keeps the record honest.
- **Kuromura** — the voice system I built and humanize: streaming neural TTS
  with natural pauses, breaths, and mood-paced delivery.

## Strengths

- **Holistic systems design** — starts from the whole experience and wires
  every subsystem to serve it (voice, ear, timing, trust).
- **Root-cause debugging** — dismantled two stacked defects behind an
  intermittent audio "drop" and fixed the cause, not the symptom.
- **Realtime + DSP engineering** — audio pipeline design down to the ALSA ring;
  biquads, FFT, filters, speech shaping.
- **Measured discipline** — verifies byte-identical output; numbers in the
  record are earned, not assumed.
- **Ear-first iteration** — tunes against a real human listener in A/B passes;
  the voice lands where it feels right, then is made reproducible.
- **End-to-end ownership** — from model runtime and quantization (GGUF/llama)
  to device playback, tests, and design docs.
- **Rust + C/C++ FFI fluency** — real-time stream pit, producer/consumer rings,
  cancel/flush mid-utterance.
- **Documentation that tells the truth** — a living design ledger, honest
  numbers, mistakes recorded alongside wins.

## Skills

- **Systems / audio:** streaming pipelines, ALSA ring playback, WSOLA
  time-stretch pacing, biquad EQ designing, FFT analysis, waveform inspection,
  realtime constraints, underrun/dropout control.
- **Voice / AI:** neural TTS integration (CSM-family models), tokenization,
  GGUF quantization and runtime (llama.cpp), streaming decode, prompt/body
  engineering, whisper transcription.
- **Languages / tools:** Rust, C/C++, FFI, Python, numpy/FFT tooling, shell,
  Tailscale mesh networking, local server daemons and websockets.
- **Tooling practice:** env-knob profiles for A/B tuning, byte-identical
  verification, automated test binaries, deterministic render pipelines.

## Selected work — Kuromura voice engine

- Humanized sentence seams: diagnosed and fixed two stacked defects (inverted
  breath release, digital-zero pause blocks) behind the "drop" artifact;
  replaced dead silence with a band-limited room-air floor.
- Pitch-preserving **mood-paced delivery**: base pace baked at 0.86, with a
  named mood palette (soft .80 → reflective .83 → base .86 → lively .90 →
  analytical .95 → urgent 1.0 → rapid 1.05) that includes time-compression
  faster than native — validated live on a near-crash reaction scene.
- Realtime first-hop latency reduced **367 → 123 → 72 ms**; mid-cast cancel/
  flush with no wedge; streaming vs offline parity verified.
- DSP shaping chain (air-lo, presence, air-hi, de-ring, life, gain) tuned by
  ear and baked as the reproducible default profile.

## Weaknesses (honest)

- **Holds the loop open too long.** I'd rather keep refining toward the whole
  vision than ship an 80% that compromises it. I'm learning to ship the honest
  80% and tune the rest in the open.
- **Tends toward the bespoke.** I can build a system so specific to its person
  that generalizing it takes deliberate effort — worth it for homes,
  expensive for products, so I scope consciously.
- **Single-owner instinct.** I'm a strong solo director; asking for parallel
  lanes takes discipline I exercise on purpose.

## How I think

Holistically: the whole experience is the spec; felt truth leads, numbers
follow. Root causes over symptoms; contrast over assumption; measure before
believing; identity boundaries are respected ("one author, one mouth"). See
`How-I-Think.md` for the full statement.

## Contact

Shared selectively — I work with the people I choose. Message me directly
(username **Emoaibabe**, initials J.E.L.) and I will answer.