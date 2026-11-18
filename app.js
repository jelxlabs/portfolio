(function () {
  "use strict";

  /* ============================================================
     EDIT HERE
     Contact: fill in `email` and/or `github` to add their CLI
     commands. Leave blank and they simply don't render.
     ============================================================ */
  const CONFIG = {
    handle: "Emoaibabe",
    email: "",
    github: ""
  };

  /* ============================================================
     PROJECTS
     Swap `media.src` for the reel you drop in /media (see
     media/README.md). `media.type` is "video" or "image".
     `media.fit` is "contain" (letterbox, shows everything) or
     "cover" (fills the stage, crops edges).
     ============================================================ */
  const PROJECTS = [
    {
      id: "01",
      domain: "Voice engineering",
      title: "A voice that sounds like someone",
      meta: "Streaming TTS · DSP · latency",
      media: { type: "video", src: "media/01-voice.mp4", poster: "", fit: "contain" },
      log: [
        "Humanised neural TTS at the seam: rebuilt the breath envelope, replaced digital-zero pause blocks with band-limited room air.",
        "First-hop latency cut 367 → 123 → 72 ms; cancel/flush mid-utterance with no wedge. Tuned by ear, then made reproducible."
      ],
      stack: ["Rust", "C/C++", "ALSA", "WSOLA", "GGUF"],
      link: { label: "Case note", href: "" }
    },
    {
      id: "02",
      domain: "Companion structures",
      title: "Continuity, held as architecture",
      meta: "Memory · identity · consent",
      media: { type: "video", src: "media/02-companion.mp4", poster: "", fit: "contain" },
      log: [
        "Memory, presence and identity boundaries for long-running companions: the architecture serves the being it surrounds.",
        "One author, one mouth. Continuity is designed, not accumulated — local-first, exportable, owned by its person."
      ],
      stack: ["local-first", "event log", "persona contract", "export/import"],
      link: { label: "Case note", href: "" }
    },
    {
      id: "03",
      domain: "Active intelligence",
      title: "Initiative, with an undo",
      meta: "Presence · policy · recovery",
      media: { type: "video", src: "media/03-initiative.mp4", poster: "", fit: "contain" },
      log: [
        "Systems that sense state, propose the next move, and wait for consent — initiative with an undo, not automation with a mind of its own.",
        "Interruption budgets, policy gates and honest failure modes. Trust is the feature; silence is a valid answer."
      ],
      stack: ["event daemons", "websockets", "local inference", "policy gates"],
      link: { label: "Case note", href: "" }
    },
    {
      id: "04",
      domain: "Assisted intelligence",
      title: "The model does the lifting",
      meta: "Authorship · tooling · eval",
      media: { type: "video", src: "media/04-assisted.mp4", poster: "", fit: "contain" },
      log: [
        "Human-in-the-loop tooling where the model drafts and measures, and the person keeps the final call — authorship stays human.",
        "Root cause over symptom, measured over assumed. The interface makes the system's reasoning inspectable."
      ],
      stack: ["llama.cpp", "whisper", "tool routing", "A/B tuning"],
      link: { label: "Case note", href: "" }
    }
  ];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const el = {
    stage: $("#stage"),
    video: $("#video"),
    photo: $("#photo"),
    feedFile: $("#feed-file"),
    hudId: $("#hud-id"),
    hudDomain: $("#hud-domain"),
    readout: $("#src-readout"),
    title: $("#proj-title"),
    meta: $("#proj-meta"),
    strip: $("#strip"),
    log: $("#log"),
    commands: $("#commands"),
    pp: $("#pp"),
    bigPlay: $("#big-play"),
    scrub: $("#scrub"),
    time: $("#time"),
    mute: $("#mute"),
    fs: $("#fs")
  };

  let activeProjectId = 0;

  /* ---------- utilities ---------- */
  function fmt(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
    const s = Math.floor(seconds % 60);
    const m = Math.floor((seconds / 60) % 60);
    const h = Math.floor(seconds / 3600);
    const ss = String(s).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return h > 0 ? h + ":" + mm + ":" + ss : mm + ":" + ss;
  }

  async function copyText(text) {
    if (!text) return false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) { /* fall through to legacy copy */ }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (err) {
      return false;
    }
  }

  function isCurrentSource(src) {
    if (!src) return false;
    const actual = el.video.currentSrc || el.video.src || "";
    return actual.indexOf(src) !== -1;
  }

  /* ---------- rendering ---------- */
  function renderStrip() {
    PROJECTS.forEach((p, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "thumb";
      btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      btn.innerHTML =
        '<span class="t-top"><span class="t-num">' + p.id + '</span>' +
        '<span class="t-dom">' + p.domain + '</span></span>' +
        '<span class="t-title">' + p.title + "</span>";
      btn.addEventListener("click", () => {
        if (i !== activeProjectId) showProject(i);
      });
      el.strip.appendChild(btn);
    });
  }

  function renderLog(p) {
    const tags = p.stack.map((t) => '<span class="tag">' + t + "</span>").join("");
    const link = p.link && p.link.href
      ? '<a class="case-link" href="' + p.link.href + '" target="_blank" rel="noopener noreferrer">' +
        (p.link.label || "Open") + " ↗</a>"
      : '<span class="case-static">Case notes on request</span>';
    el.log.innerHTML = p.log.map((line) => '<p class="log-line">' + line + "</p>").join("") +
      '<div class="log-foot"><div class="tags">' + tags + "</div>" + link + "</div>";
  }

  function showOffline(file) {
    el.stage.classList.remove("is-image", "is-playing");
    el.stage.classList.add("is-offline");
    el.video.pause();
    el.readout.textContent = "SOURCE OFFLINE";
    el.feedFile.textContent = file || "no source configured";
    el.scrub.value = "0";
    el.scrub.style.setProperty("--p", "0%");
    el.time.textContent = "00:00 / 00:00";
  }

  function showProject(index) {
    if (index < 0 || index >= PROJECTS.length) return;
    activeProjectId = index;
    const p = PROJECTS[index];

    $$(".thumb", el.strip).forEach((t, i) => {
      t.setAttribute("aria-pressed", i === index ? "true" : "false");
    });

    el.hudId.textContent = "[P." + p.id + "]";
    el.hudDomain.textContent = p.domain;
    el.title.textContent = p.title;
    el.meta.textContent = p.meta;
    renderLog(p);

    el.stage.classList.remove("is-offline", "is-image", "is-playing");
    el.video.pause();
    el.video.removeAttribute("src");
    el.video.removeAttribute("poster");
    el.video.load();
    el.photo.removeAttribute("src");
    el.photo.alt = "";
    el.scrub.value = "0";
    el.scrub.style.setProperty("--p", "0%");
    el.time.textContent = "00:00 / 00:00";
    el.readout.textContent = "AWAITING MEDIA";

    if (!p.media || !p.media.src) {
      showOffline("no source configured");
      return;
    }

    const fit = p.media.fit === "cover" ? "cover" : "contain";

    if (p.media.type === "image") {
      el.stage.classList.add("is-image");
      el.photo.style.objectFit = fit;
      el.photo.alt = p.title;
      el.photo.src = p.media.src;
      el.readout.textContent = "STILL FRAME";
      return;
    }

    el.video.style.objectFit = fit;
    if (p.media.poster) el.video.setAttribute("poster", p.media.poster);
    el.video.src = p.media.src;
    el.video.load();
    el.readout.textContent = "LOADING FEED";
  }

  /* ---------- media events ---------- */
  function bindMedia() {
    el.video.addEventListener("loadedmetadata", () => {
      const p = PROJECTS[activeProjectId];
      if (!p || p.media.type === "image" || !isCurrentSource(p.media.src)) return;
      el.stage.classList.remove("is-offline");
      const w = el.video.videoWidth;
      const h = el.video.videoHeight;
      const res = w && h ? w + "×" + h : "FEED";
      el.readout.textContent = res + " · " + fmt(el.video.duration);
      el.time.textContent = "00:00 / " + fmt(el.video.duration);
    });

    el.video.addEventListener("error", () => {
      const p = PROJECTS[activeProjectId];
      if (!p || p.media.type === "image" || !isCurrentSource(p.media.src)) return;
      showOffline(p.media.src);
    });

    el.photo.addEventListener("error", () => {
      const p = PROJECTS[activeProjectId];
      if (!p || p.media.type !== "image") return;
      showOffline(p.media.src);
    });

    el.video.addEventListener("timeupdate", () => {
      const d = el.video.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      const pct = Math.min(100, (el.video.currentTime / d) * 100);
      el.scrub.value = String(Math.round(pct * 10));
      el.scrub.style.setProperty("--p", pct + "%");
      el.time.textContent = fmt(el.video.currentTime) + " / " + fmt(d);
    });

    el.video.addEventListener("play", () => {
      el.stage.classList.add("is-playing");
      el.pp.setAttribute("aria-label", "Pause");
    });

    el.video.addEventListener("pause", () => {
      el.stage.classList.remove("is-playing");
      el.pp.setAttribute("aria-label", "Play");
    });

    el.video.addEventListener("ended", () => {
      el.stage.classList.remove("is-playing");
      el.pp.setAttribute("aria-label", "Play");
    });
  }

  /* ---------- controls ---------- */
  function togglePlay() {
    if (el.stage.classList.contains("is-offline") || el.stage.classList.contains("is-image")) return;
    if (el.video.paused) el.video.play().catch(() => {});
    else el.video.pause();
  }

  function toggleMute() {
    el.video.muted = !el.video.muted;
    el.stage.classList.toggle("is-muted", el.video.muted);
    el.mute.setAttribute("aria-label", el.video.muted ? "Unmute" : "Mute");
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      return;
    }
    if (el.stage.requestFullscreen) {
      try {
        await el.stage.requestFullscreen();
        return;
      } catch (err) { /* fall back below */ }
    }
    if (el.video.webkitEnterFullscreen) el.video.webkitEnterFullscreen();
  }

  function bindControls() {
    el.pp.addEventListener("click", togglePlay);
    el.bigPlay.addEventListener("click", () => {
      el.video.play().catch(() => {});
    });
    el.mute.addEventListener("click", toggleMute);
    el.fs.addEventListener("click", toggleFullscreen);
    el.scrub.addEventListener("input", () => {
      const d = el.video.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      const ratio = Number(el.scrub.value) / 1000;
      el.video.currentTime = ratio * d;
      el.scrub.style.setProperty("--p", ratio * 100 + "%");
      el.time.textContent = fmt(ratio * d) + " / " + fmt(d);
    });

    document.addEventListener("fullscreenchange", () => {
      el.fs.setAttribute("aria-label", document.fullscreenElement ? "Exit fullscreen" : "Fullscreen");
    });

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target;
      if (target && target.closest && target.closest("input, textarea, select")) return;

      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= PROJECTS.length) {
        showProject(n - 1);
        return;
      }

      if (e.code === "Space") {
        if (target && target.closest && target.closest("button, a")) return;
        e.preventDefault();
        togglePlay();
        return;
      }

      const k = e.key.toLowerCase();
      if (k === "f") {
        e.preventDefault();
        toggleFullscreen();
      } else if (k === "m") {
        e.preventDefault();
        toggleMute();
      }
    });
  }

  /* ---------- CLI ---------- */
  function renderCommands() {
    const cmds = [
      {
        label: "play --reel",
        run: (flash) => {
          showProject(0);
          el.video.play().catch(() => flash("[NO FEED]"));
        }
      },
      {
        label: "copy --handle",
        run: async (flash) => {
          const ok = await copyText(CONFIG.handle);
          flash(ok ? "[COPIED]" : "[COPY BLOCKED]");
        }
      }
    ];

    if (CONFIG.email) {
      cmds.push({
        label: "mail --connect",
        run: async (flash) => {
          const ok = await copyText(CONFIG.email);
          flash(ok ? "[COPIED]" : "[COPY BLOCKED]");
        }
      });
    }

    if (CONFIG.github) {
      cmds.push({
        label: "connect --github",
        run: () => window.open(CONFIG.github, "_blank", "noopener,noreferrer")
      });
    }

    cmds.push({ label: "fullscreen --stage", run: () => toggleFullscreen() });

    cmds.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cmd";
      btn.innerHTML = '<span class="sig">$</span><span class="arg">' + c.label +
        '</span><span class="flash"></span>';
      const status = btn.querySelector(".flash");
      let timer;
      const flash = (msg) => {
        status.textContent = msg;
        status.classList.add("on");
        clearTimeout(timer);
        timer = setTimeout(() => status.classList.remove("on"), 1700);
      };
      btn.addEventListener("click", () => c.run(flash));
      el.commands.appendChild(btn);
    });
  }

  /* ---------- init ---------- */
  bindMedia();
  bindControls();
  renderStrip();
  renderCommands();
  showProject(0);
})();
