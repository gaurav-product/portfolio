/* ============================================================================
   GAURAV.OS — APPLICATION LAYER
   ----------------------------------------------------------------------------
   Presentation only. Every string a visitor reads comes from content.js.
   Adding a Lab Note, a project or a credential never requires editing this file.
   ========================================================================== */
(function () {
  "use strict";

  var C = window.GOS_CONTENT;
  if (!C) { console.error("GAURAV.OS: content layer missing"); return; }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* ------------------------------------------------------------- helpers */
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* analytics: names only, no personal data, no third-party beacons */
  var GOS = window.GOS = {
    el: function (t, c, h) { return el(t, c, h); },
    esc: function (x) { return esc(x); },
    reduce: reduce,
    track: function (event, payload) {
      /* the canonical event names; legacy call sites map onto them */
      var ALIAS = { project_open: "project_opened", lab_note_open: "lab_note_opened",
                    recruiter_mode_open: "recruiter_mode_opened",
                    ask_gaurav_question: "copilot_question", ask_gaurav_unanswered: "copilot_question",
                    constellation_interaction: "corpus_opened", search_query: "corpus_opened",
                    case_study_open: "study_opened" };
      if (ALIAS[event]) event = ALIAS[event];
      var rec = { event: event, at: Date.now() };
      if (payload) rec.detail = payload;
      (window.dataLayer = window.dataLayer || []).push(rec);
    }
  };

  /* ------------------------------------------- open to product opportunities */
  /* One record in the content layer, three deliberate placements: the hero
     (as the compact seeking row), the contact channel and Recruiter Mode.
     Stated positioning only — no claim about outcomes or availability.    */
  function openBlock(where) {
    var O = (C.site_config || {}).opportunity;
    if (!O || !O.enabled) return "";
    var href = where === "recruiter" ? (O.cta_href_recruiter || O.cta_href) : O.cta_href;
    return '<div class="open' + (where === "recruiter" ? " rec-open" : " contact-open") + '">' +
      '<div class="open-k"><span class="pulse"></span>' + esc(O.label) + '</div>' +
      '<p class="open-b">' + esc(O.line + " " + O.detail) + '</p>' +
      '<div class="open-r">' + (O.roles || []).map(function (r) {
        return '<span>' + esc(r) + '</span>'; }).join("") + '</div>' +
      (where === "contact" ? "" :
        '<div class="open-cta"><a class="btn btn-secondary" data-ev="contact_click" href="' +
        esc(href) + '">' + esc(O.cta_label) + ' →</a></div>') +
    '</div>';
  }
  function seekRow() {
    var O = (C.site_config || {}).opportunity;
    if (!O || !O.enabled) return "";
    return '<div class="seek" aria-label="' + esc(O.line) + '">' +
      '<span class="seek-k"><span class="pulse" aria-hidden="true"></span>' + esc(O.label) + '</span>' +
      (O.roles || []).map(function (r) { return '<span class="role">' + esc(r) + '</span>'; }).join("") +
    '</div>';
  }

  /* The CV: one record, rendered wherever a download is offered. Nothing is
     rendered while no file is named, so there is never a 404 button.        */
  function cvLink(cls, text) {
    var R = (C.site_config.contact || {}).resume;
    if (!R || !R.file) return "";
    return '<a class="' + cls + '" data-ev="resume_clicked" href="' + esc(R.file) + '" download="' +
      esc(R.filename) + '" type="application/pdf">' + (text || esc(R.label) + " ↓") + '</a>';
  }
  function projById(id) { return C.projects.filter(function (p) { return p.id === id; })[0]; }
  function byOrder(a, b) { return a.order - b.order; }
  function evLabel(t) {
    return t ? '<span class="ev-label' + (/NOT IN PRODUCTION/.test(t) ? " warn" : "") + '">' + esc(t) + '</span>' : "";
  }

  /* --------------------------------------------------------- ambient field */
  (function () {
    var c = document.getElementById("field");
    /* decoration only: skipped under reduced motion and on narrow screens,
       where CSS hides it anyway and the animation loop would be wasted     */
    if (!c || reduce || window.matchMedia("(max-width: 1000px)").matches) { if (c) c.style.display = "none"; return; }
    var ctx = c.getContext("2d"), dots = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() {
      w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(34, Math.round(w * h / 34000)); dots = [];
      for (var i = 0; i < n; i++) dots.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1 + .35, vx: (Math.random() - .5) * .07, vy: (Math.random() - .5) * .07, a: Math.random() * .3 + .1 });
    }
    function frame() {
      if (!document.hidden && root.getAttribute("data-mode") !== "recruiter") {
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < dots.length; i++) {
          var d = dots[i]; d.x += d.vx; d.y += d.vy;
          if (d.x < 0) d.x = w; if (d.x > w) d.x = 0; if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
          ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.284); ctx.fillStyle = "rgba(210,166,60," + d.a + ")"; ctx.fill();
        }
      }
      requestAnimationFrame(frame);
    }
    size(); window.addEventListener("resize", size); requestAnimationFrame(frame);
  })();

  /* ------------------------------------------------------------ navigation */
  (function () {
    var mount = document.getElementById("lab-nav"), group = null;
    C.navigation.forEach(function (n) {
      if (n.group !== group) { group = n.group; mount.appendChild(el("div", "rail-group", group)); }
      var a = el("a", "navlink", '<span class="idx">' + n.idx + "</span>" + esc(n.label));
      a.href = "#" + n.id;
      mount.appendChild(a);
    });
    var rn = document.getElementById("rec-nav");
    rn.appendChild(el("div", "rail-group", "Résumé view"));
    [["rec-work", "Selected work"], ["rec-exp", "Experience"], ["rec-skills", "Skills"], ["rec-edu", "Education"], ["rec-cred", "Credentials"], ["rec-contact", "Contact"]]
      .forEach(function (r, i) {
        var a = el("a", "navlink", '<span class="idx">' + String(i + 1).padStart(2, "0") + "</span>" + r[1]);
        a.href = "#" + r[0]; rn.appendChild(a);
      });
    document.getElementById("rail-sub").textContent = C.site_config.discipline;
    /* the rail's CV link is static markup for no-JS; the content layer decides */
    var rc = document.getElementById("rail-cv"), R = C.site_config.contact.resume || {};
    if (rc) { if (R.file) { rc.href = R.file; rc.setAttribute("download", R.filename); } else rc.remove(); }
  })();

  /* ------------------------------------------------------------------ home */
  /* The first screen answers, in order: who Gaurav is, which roles he is
     seeking, and the three verified proof points behind that — then the
     actions a recruiter takes next. Everything else lives further down.   */
  (function () {
    var s = C.site_config, ct = s.contact;
    var m = document.getElementById("home-mount");
    var cards = (s.proof_points || []).map(function (pp) {
      var p = projById(pp.project);
      return '<a class="proof-card" href="#case-' + esc(pp.project) + '" data-ev="proof_opened">' +
        '<span class="pk">' + esc(pp.label) + '</span>' +
        '<span class="pc">' + esc(pp.claim) + '</span>' +
        '<span class="pf"><span class="pl">' + esc(p ? p.period : "") + '</span>' + evLabel(pp.evidence) + '</span>' +
      '</a>';
    }).join("");

    m.innerHTML =
      '<p class="kicker">' + esc(s.discipline) + '</p>' +
      '<h1 class="hero-name" id="hero-name">' + esc(s.owner) + '</h1>' +
      '<p class="hero-title">' + esc(s.role) + '</p>' +
      '<p class="hero-intro">' + esc(s.intro) + '</p>' +
      seekRow() +
      '<div class="cta-row">' +
        cvLink("btn btn-primary", "DOWNLOAD CV ↓") +
        '<a class="btn btn-secondary" data-ev="contact_click" href="mailto:' + esc(ct.email) + '">EMAIL ME</a>' +
        '<button class="btn btn-secondary" id="hero-recruiter" aria-pressed="false" title="A one-page résumé view of this portfolio">RECRUITER MODE</button>' +
        '<a class="btn btn-secondary" href="#work">CASE STUDIES ↓</a>' +
      '</div>' +
      '<p class="hero-meta">' + esc(s.location) + ' · <a href="mailto:' + esc(ct.email) + '" data-ev="contact_click">' + esc(ct.email) + '</a>' +
        ' · <a href="https://' + esc(ct.linkedin) + '" target="_blank" rel="noopener" data-ev="linkedin_click">LinkedIn<span class="sr"> (opens in a new tab)</span></a></p>' +
      '<h2 class="sr">Proof</h2>' +
      '<div class="proof">' + cards + '</div>' +
      '<p class="proof-note">Every figure on this site comes from my CV or my own product documentation. Unvalidated work carries its status — draft, concept, in progress, not in production.</p>';
  })();

  /* ------------------------------------------------------------------ work */
  /* Three primary case studies, in full. The other builds follow as a
     collapsed list — every record is still rendered, just not leading.    */
  function accordion(items, render, openFirst) {
    var wrapEl = el("div", null);
    items.forEach(function (s, i) {
      var a = el("div", "acc");
      var bid = "acc-" + Math.random().toString(36).slice(2, 9);
      var btn = el("button", "acc-btn", render.head(s, i));
      btn.type = "button";
      var body = el("div", "acc-body");
      body.id = bid; btn.setAttribute("aria-controls", bid);
      body.innerHTML = render.body(s, i);
      var open = openFirst && i === 0;
      body.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.addEventListener("click", function () {
        body.hidden = !body.hidden;
        btn.setAttribute("aria-expanded", body.hidden ? "false" : "true");
      });
      a.appendChild(btn); a.appendChild(body); wrapEl.appendChild(a);
    });
    return wrapEl;
  }

  function renderCase(p, primary) {
    var w = el("article", "case" + (primary ? " primary" : ""));
    w.id = "case-" + p.id;
    w.setAttribute("aria-labelledby", "case-t-" + p.id);
    var pp = (C.site_config.proof_points || []).filter(function (x) { return x.project === p.id; })[0];
    var h = '<div class="case-head">' +
      '<h3 class="case-title" id="case-t-' + p.id + '">' + esc(p.name) + '</h3>' +
      '<div class="case-sub">' + esc(p.subtitle) + '</div>' +
      '<div class="case-meta"><span class="chip gold">' + esc(p.role) + '</span>' +
      (p.org ? '<span class="chip">' + esc(p.org) + '</span>' : "") +
      '<span class="chip">' + esc(p.period) + '</span>' +
      '<span class="chip ' + p.status_tone + '">' + esc(p.status) + '</span>' +
      (p.link ? '<a class="chip" href="' + esc(p.link.url) + '" target="_blank" rel="noopener">' + esc(p.link.label) + ' →<span class="sr"> (opens in a new tab)</span></a>' : '') +
      '</div></div>';
    if (pp) h += '<p class="case-proof">' + esc(pp.claim) + evLabel(pp.evidence) + '</p>';
    if (p.production_note) h += '<p class="prod-flag"><b>NOT IN PRODUCTION</b><span>' + esc(p.production_note) + '</span></p>';
    if (p.headline) h += '<p class="case-headline">' + esc(p.headline) + '</p>';
    if (p.metrics) {
      h += '<div class="metrics">' + p.metrics.map(function (x) {
        return '<div class="metric"><div class="n">' + esc(x.n) + '</div><div class="l">' + esc(x.l) + '</div></div>';
      }).join("") + '</div>';
    }
    if (p.exec) {
      h += '<span class="step-label" style="margin-top:var(--s3)">Summary</span><div class="exec">' +
        p.exec.map(function (c) {
          return '<div class="exec-cell' + (c.alert ? " alert" : "") + '"><div class="k">' + esc(c.k) + '</div><div class="t">' + esc(c.t) + '</div></div>';
        }).join("") + '</div>';
    }
    if (p.chain) {
      h += '<div class="flow">' + p.chain.map(function (n, i) {
        return '<span class="node' + (i === p.chain.length - 1 ? " now" : "") + '">' + esc(n) + '</span>' + (i < p.chain.length - 1 ? '<span class="arr">→</span>' : '');
      }).join("") + '</div>';
    }
    if (p.pivot) {
      h += '<div class="pivot">' + p.pivot.map(function (s) {
        return '<div class="pv ' + (s.tone || "") + '"><div class="k">' + esc(s.k) + '</div><div class="t">' + esc(s.t) + '</div></div>';
      }).join("") + '</div>';
    }
    if (p.funnel) {
      h += '<span class="step-label" style="margin-top:var(--s4)">Pilot funnel</span><div class="funnel">' +
        p.funnel.map(function (f) {
          return '<div class="fbar"><span class="lab">' + esc(f.label) + '</span><span class="track">' +
            '<span class="fill" style="width:' + f.width + '%"></span>' +
            '<span class="val' + (f.outside ? " out" : "") + '">' + esc(f.value) + '</span></span></div>';
        }).join("") + '</div>' +
        (p.funnel_note ? '<p class="note">' + esc(p.funnel_note) + '</p>' : "");
    }
    w.innerHTML = h;

    if (p.sections && p.sections.length) {
      var accWrap = el("div", null);
      accWrap.style.marginTop = "var(--s3)";
      accWrap.appendChild(el("span", "step-label", "The record"));
      accWrap.appendChild(accordion(p.sections, {
        head: function (s) { return '<span>' + esc(s.label) + (s.tag ? ' <span class="chip dim" style="margin-left:8px">' + esc(s.tag) + '</span>' : "") + '</span><span class="caret" aria-hidden="true">›</span>'; },
        body: function (s) {
          var inner = s.body;
          if (s.chips) inner += '<div class="chips" style="margin-top:11px">' + s.chips.map(function (c) { return '<span class="chip gold">' + esc(c) + '</span>'; }).join("") + '</div>';
          if (s.flow) inner = '<div class="flow">' + s.flow.map(function (n, ix) { return '<span class="node' + (ix === s.flow.length - 1 ? " now" : "") + '">' + esc(n) + '</span>' + (ix < s.flow.length - 1 ? '<span class="arr">→</span>' : ''); }).join("") + '</div>' + inner;
          return inner;
        }
      }, true));
      w.appendChild(accWrap);
    }

    if (p.decision_log) {
      var lw = el("div", null);
      lw.style.marginTop = "var(--s4)";
      lw.appendChild(el("span", "sect-label", "Decision log"));
      lw.appendChild(el("p", "small", "The decisions that cost me something. Each records why, what it traded away, and the hypothesis it left open."));
      var log = el("div", "log");
      p.decision_log.forEach(function (d, i) {
        var row = el("div", "log-row");
        var btn = el("button", "log-btn", '<span class="id">D' + (i + 1) + '</span><span class="d">' + esc(d.decision) + '</span>');
        btn.type = "button";
        var body = el("div", "log-body");
        body.id = "log-" + p.id + "-" + i; btn.setAttribute("aria-controls", body.id);
        var dl = el("dl", "kv");
        [["Why", d.why], ["Evidence", d.evidence], ["Trade-off", d.tradeoff], ["What changed", d.changed], ["Next hypothesis", d.next]].forEach(function (pair) {
          dl.appendChild(el("dt", null, pair[0])); dl.appendChild(el("dd", null, pair[1]));
        });
        body.appendChild(dl); body.hidden = i !== 0;
        btn.setAttribute("aria-expanded", i === 0 ? "true" : "false");
        btn.addEventListener("click", function () {
          body.hidden = !body.hidden;
          btn.setAttribute("aria-expanded", body.hidden ? "false" : "true");
        });
        row.appendChild(btn); row.appendChild(body); log.appendChild(row);
      });
      lw.appendChild(log); w.appendChild(lw);
    }
    return w;
  }

  (function () {
    var m = document.getElementById("work-mount");
    var all = C.projects.slice().sort(byOrder);
    var primary = all.filter(function (p) { return p.tier === "primary"; });
    var rest = all.filter(function (p) { return p.tier !== "primary"; });
    m.innerHTML = '<div class="eyebrow"><span class="num">02</span> Selected work</div>' +
      '<h2 class="title" id="work-title">Three case studies, <em>in full</em></h2>' +
      '<p class="dek">A shipped product I owned, two years of user research that changed a roadmap, and a self-directed build where discovery overturned my own brief. Each carries its evidence label.</p>' +
      '<div class="work-index">' + primary.map(function (p, i) {
        return '<a class="wi" href="#case-' + p.id + '">' +
          '<span class="n">0' + (i + 1) + '</span>' +
          '<span><span class="t">' + esc(p.name) + '</span><span class="s">' + esc(p.subtitle) + ' · ' + esc(p.role) + '</span></span>' +
          '<span class="st"><span class="chip ' + p.status_tone + '">' + esc(p.status) + '</span></span></a>';
      }).join("") + '</div>';
    primary.forEach(function (p) { m.appendChild(renderCase(p, true)); });

    if (rest.length) {
      var mw = el("div", "more-work");
      mw.innerHTML = '<span class="sect-label">More product work</span>' +
        '<p class="small" style="margin-top:8px;max-width:62ch">Earlier and in-progress builds. Open any one for the full record — status labels are unchanged.</p>';
      var list = el("div", null); list.style.marginTop = "var(--s2)";
      rest.forEach(function (p) {
        var d = el("details", "mw");
        d.id = "more-" + p.id;
        d.innerHTML = '<summary><span><span class="t">' + esc(p.name) + '</span><span class="s">' + esc(p.subtitle) + ' · ' + esc(p.period) + '</span></span>' +
          '<span class="x"><span class="chip ' + p.status_tone + '">' + esc(p.status) + '</span></span></summary>';
        var body = el("div", "mw-body");
        body.appendChild(renderCase(p, false));
        d.appendChild(body);
        list.appendChild(d);
      });
      mw.appendChild(list);
      m.appendChild(mw);
    }

    /* project_open analytics */
    m.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest(".wi") : null;
      if (!a) return;
      var id = (a.getAttribute("href") || "").replace("#case-", "");
      GOS.track("project_open", id);
    });
    m.addEventListener("toggle", function (e) {
      if (e.target.open) GOS.track("project_open", e.target.id.replace("more-", ""));
    }, true);
  })();

  /* A link to a case inside a collapsed <details> opens it first, so every
     #case-* anchor on the page — search, copilot sources, proof cards —
     lands on visible content.                                             */
  function revealHash() {
    var id = (location.hash || "").slice(1);
    if (!id) return;
    var t = null;
    try { t = document.getElementById(decodeURIComponent(id)); } catch (e) { return; }
    var d = t && t.closest ? t.closest("details") : null;
    if (d && !d.open) { d.open = true; t.scrollIntoView(); }
  }
  window.addEventListener("hashchange", revealHash);

  /* ------------------------------------------------------------- how i think */
  (function () {
    var m = document.getElementById("thinking-mount");
    var ob = C.site_config.orbit || {}, pq = C.site_config.product_question;
    m.innerHTML = '<div class="eyebrow"><span class="num">R4</span> Operating model</div>' +
      '<h2 class="title">How I <em>Think</em></h2>' +
      '<p class="dek">One operating model, run over and over. Every stage carries evidence of two kinds: what I did in my own products, and how many of the 90 case studies contain that stage.</p>' +
      '<div class="orbit-block">' +
        '<span class="step-label">The domains I work across, and the loop I work in</span>' +
        '<div class="orbit" id="orbit" role="group" aria-label="Product orbit: the domains I work across and the loop I work in">' +
          '<div class="orbit-plane"><div class="ring r2"></div><div class="ring r1"></div></div>' +
          '<div class="spin" id="ring-inner"></div>' +
          '<div class="orbit-core"><div class="om">' + esc((ob.core || "GAURAV.OS").replace(".", "\u0000")).replace("\u0000", '<span class="dot">.</span>') +
            '</div><div class="ol">' + esc(ob.core_label || "") + '</div></div>' +
        '</div>' +
        '<div class="orbit-loop" id="orbit-loop"></div>' +
        '<div class="orbit-cap" id="orbit-cap" aria-live="polite" data-rest="' + esc(ob.caption || "") + '">' + esc(ob.caption || "") + '</div>' +
      '</div>' +
      '<span class="sect-label" style="margin-top:var(--s6)">Principles</span><div class="principles" id="principles" style="margin-top:var(--s2)"></div>' +
      '<div class="card" style="margin-top:var(--s5);border-left:2px solid var(--gold)">' +
        '<div class="mono" style="font-size:10.5px;letter-spacing:.17em;color:var(--gold)">CURRENT PRODUCT QUESTION · ' + esc(pq.status) + '</div>' +
        '<p style="font-family:\'Instrument Serif\',Georgia,serif;font-size:23px;color:var(--bone);margin-top:11px;line-height:1.28">“' + esc(pq.text) + '”</p>' +
        '<p class="small" style="margin-top:11px">' + esc(pq.note) + '</p>' +
      '</div>';

    var pw = document.getElementById("principles");
    C.principles.forEach(function (p, i) {
      var r = el("div", "principle");
      r.appendChild(el("div", "i", String(i + 1).padStart(2, "0")));
      r.appendChild(el("div", null, '<div class="t">' + esc(p[0]) + '</div><div class="s">' + esc(p[1]) + '</div>'));
      pw.appendChild(r);
    });
  })();

  /* ----------------------------------------------------------- product orbit */
  (function () {
    var orbitEl = document.getElementById("orbit");
    var inner = document.getElementById("ring-inner");
    var core = document.querySelector(".orbit-core");
    if (!inner || !orbitEl) return;
    var OB = (C.site_config.orbit) || {};
    var cap = document.getElementById("orbit-cap");
    var FLAT = 0.58, nodes = [];

    /* A node explains itself. Hover or focus swaps the caption line for that
       node's meaning; leaving restores it. The caption is the one place the
       text appears, so it never collides with the diagram.                 */
    function explain(txt) { if (cap) cap.textContent = txt || cap.getAttribute("data-rest") || ""; }

    function ring(mount, items, speed, phase, lead) {
      (items || []).forEach(function (it, i) {
        var n = el("button", "onode" + (lead ? " lead" : ""));
        n.type = "button";
        n.appendChild(el("span", null, it.label));
        if (it.blurb) {
          n.setAttribute("aria-label", it.label + " — " + it.blurb);
          n.title = it.blurb;
          n.addEventListener("mouseenter", function () { explain(it.blurb); });
          n.addEventListener("mouseleave", function () { explain(null); });
          n.addEventListener("focus", function () { explain(it.blurb); });
          n.addEventListener("blur", function () { explain(null); });
          n.addEventListener("click", function () { explain(it.blurb); });
        }
        mount.appendChild(n);
        nodes.push({ el: n, base: (2 * Math.PI / (items.length || 1)) * i + phase,
                     speed: speed, ring: lead ? "in" : "out" });
      });
    }
    ring(inner, OB.inner, 0.052, Math.PI / 4, true);

    /* The operating loop sits beneath the diagram rather than on a second
       ring. Two concentric rings of ~90px labels cannot pass each other in
       this space without colliding, and a collision reads as a bug.       */
    (function () {
      var mount = document.getElementById("orbit-loop");
      if (!mount) return;
      (OB.outer || []).forEach(function (it, i) {
        if (i) mount.appendChild(el("span", "loop-arr", "\u2192"));
        var b = el("button", "loopchip"); b.type = "button";
        b.appendChild(document.createTextNode(it.label));
        if (it.blurb) {
          b.setAttribute("aria-label", it.label + " \u2014 " + it.blurb);
          b.title = it.blurb;
          b.addEventListener("mouseenter", function () { explain(it.blurb); });
          b.addEventListener("mouseleave", function () { explain(null); });
          b.addEventListener("focus", function () { explain(it.blurb); });
          b.addEventListener("blur", function () { explain(null); });
        }
        mount.appendChild(b);
      });
    })();

    /* Below this width the labels cannot orbit without colliding, so the
       diagram stops spinning and squares up instead of shrinking until it is
       unreadable: inner domains at the four cardinal points, operating loop
       listed beneath as text.                                              */
    /* Whether there is room for labels to orbit without colliding. A label is
       ~90px wide; below this box width they cannot pass each other, so the
       diagram squares up instead of shrinking until it is unreadable.      */
    var COMPACT_AT = 350;
    function compact() { return orbitEl.clientWidth < COMPACT_AT; }

    /* The core carries a wordmark; it has to stay legible and on one line as
       the circle shrinks, and the sublabel is dropped once it no longer fits. */
    function sizeCore(px) {
      var om = core.querySelector(".om"), ol = core.querySelector(".ol");
      if (om) { om.style.fontSize = Math.max(10, Math.min(12, px * 0.135)).toFixed(1) + "px";   /* 10px floor: legibility */
                om.style.whiteSpace = "nowrap"; om.style.letterSpacing = px < 80 ? "0" : ".1em"; }
      if (ol) ol.style.display = px < 86 ? "none" : "";
    }

    var innerR = 100, outerR = 150;
    function layout() {
      var w = orbitEl.clientWidth; if (!w) return;
      orbitEl.classList.toggle("compact", compact());
      if (compact()) {
        innerR = Math.max(62, (w / 2) - 58);
        var cs = Math.max(64, Math.min(92, w * 0.28));
        core.style.width = cs + "px"; core.style.height = cs + "px";
        sizeCore(cs);
        var r1c = orbitEl.querySelector(".ring.r1"), r2c = orbitEl.querySelector(".ring.r2");
        if (r1c) { r1c.style.width = (innerR * 200 / w) + "%"; r1c.style.height = r1c.style.width; }
        if (r2c) { r2c.style.width = r1c ? r1c.style.width : "0%"; r2c.style.height = r2c.style.width; }
        /* Evenly spaced around the full circle, starting at the top, however many
           domains the content layer carries — four sit on the cardinal points,
           five form a pentagon. Never a fixed quarter-turn, which would stack
           the fifth node on top of the first. */
        var inCount = nodes.filter(function (x) { return x.ring === "in"; }).length || 1;
        var step = (Math.PI * 2) / inCount, k = 0;
        nodes.forEach(function (n) {
          if (n.ring === "out") { n.el.style.transform = ""; n.el.style.opacity = ""; return; }
          var a = -Math.PI / 2 + step * (k++);
          n.el.style.transform = "translate(" + (Math.cos(a) * innerR) + "px," +
                                 (Math.sin(a) * innerR * 0.78) + "px)";
          n.el.style.opacity = "1"; n.el.style.zIndex = 4;
        });
        return;
      }
      /* One label ring now, so it takes the full radius. The core is sized to
         clear it: a label is ~26px tall and the ring is flattened by FLAT, so
         the vertical reach is R*FLAT and the core must stay inside that.    */
      var pad = w < 330 ? 46 : 56;
      outerR = Math.max(74, (w / 2) - pad);
      innerR = outerR;
      /* the tight case is a label on the diagonal: its inner corner sits at
         (R*cos45, R*FLAT*sin45) minus half the label, so the core stays well
         inside that. */
      var coreSize = Math.max(58, Math.min(72, Math.min(w * 0.2, (innerR * FLAT * 0.707 - 15) * 2)));
      core.style.width = coreSize + "px"; core.style.height = coreSize + "px";
      sizeCore(coreSize);
      var r1 = orbitEl.querySelector(".ring.r1"), r2 = orbitEl.querySelector(".ring.r2");
      if (r1) { r1.style.width = (innerR * 200 / w) + "%"; r1.style.height = r1.style.width; }
      if (r2) { r2.style.width = (coreSize * 1.7 * 100 / w) + "%"; r2.style.height = r2.style.width; }
      place(0);
    }
    function place(t) {
      nodes.forEach(function (n) {
        var R = n.ring === "in" ? innerR : outerR;
        var a = n.base + t * n.speed;
        var x = Math.cos(a) * R, y = Math.sin(a) * R * FLAT;
        var depth = (Math.sin(a) + 1) / 2;
        n.el.style.transform = "translate(" + x + "px," + y + "px) scale(" + (0.93 + depth * 0.12) + ")";
        n.el.style.opacity = (0.62 + depth * 0.38).toFixed(3);
        n.el.style.zIndex = depth > 0.5 ? 4 : 1;
      });
    }
    layout();
    window.addEventListener("resize", layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    if (!reduce) {
      var running = true, t0 = null;
      if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { running = e[0].isIntersecting; }).observe(orbitEl);
      (function tick(ts) {
        if (t0 === null) t0 = ts;
        if (running && !compact()) place((ts - t0) / 1000);   /* compact is static */
        requestAnimationFrame(tick);
      })(0);
    }
  })();
  /* ------------------------------------------------------------- ask gaurav */
  var askBusy = false;
  (function () {
    var cfg = C.copilot_config;
    var m = document.getElementById("ask-mount");
    m.innerHTML = '<div class="eyebrow"><span class="num">06</span> Portfolio copilot</div>' +
      '<h2 class="title">Ask <em>Gaurav</em></h2>' +
      '<p class="dek">' + esc(cfg.subtitle) + ' The retrieval index is my own portfolio — nothing else.</p>' +
      '<div class="copilot" style="margin-top:var(--s3)">' +
        '<div class="copilot-head"><div class="trace" id="trace" aria-hidden="true">' +
          cfg.trace.map(function (t, i) { return '<span class="step">' + esc(t) + '</span>' + (i < cfg.trace.length - 1 ? "<span>→</span>" : ""); }).join("") +
        '</div><span class="chip dim">' + esc(cfg.badge) + '</span></div>' +
        '<div class="thread" id="thread" role="log" aria-live="polite" aria-label="Copilot conversation"></div>' +
        '<form class="ask-form" id="ask-form">' +
          '<label class="sr" for="ask-input">Ask about Gaurav\'s product work</label>' +
          '<input class="ask-input" id="ask-input" type="text" autocomplete="off" placeholder="' + esc(cfg.placeholder) + '">' +
          '<button class="ask-send" type="submit">ASK →</button>' +
        '</form>' +
        '<div class="prompt-bar"><span class="step-label" style="margin:0">Suggested questions</span><div class="prompt-list" id="prompts"></div></div>' +
      '</div>' +
      '<p class="small" style="margin-top:var(--s2)"><b style="color:var(--bone);font-weight:500">How this actually works.</b> ' + esc(cfg.explainer) + '</p>';

    var thread = document.getElementById("thread");
    var steps = Array.prototype.slice.call(document.querySelectorAll("#trace .step"));

    function trace(i) {
      steps.forEach(function (s, ix) { s.classList.toggle("on", ix === i); s.classList.toggle("done", i >= 0 && ix < i); });
    }
    function addMsg(who, html) {
      var msg = el("div", "msg" + (who === "you" ? " user" : ""));
      msg.appendChild(el("div", "who", who === "you" ? "YOU" : "GAURAV"));
      msg.appendChild(el("div", "body", html));
      thread.appendChild(msg); thread.scrollTop = thread.scrollHeight;
      return msg;
    }
    function sources(list) {
      var row = el("div", "src-row");
      row.appendChild(el("span", "lbl", "SOURCE:"));
      var MAP = { journey: "journey-details", research: "case-live-your-best-life" };
      list.forEach(function (s) {
        var id = projById(s[1]) ? "case-" + s[1] : (MAP[s[1]] || s[1]);
        var a = el("a", "chip gold", s[0]); a.href = "#" + id; row.appendChild(a);
      });
      return row;
    }

    /* Corpus figures inside copilot answers are written as {{token}} and resolved
       from the generated corpus at render time. Hand-typed numbers go stale the
       moment the repository changes; these cannot. */
    function corpusFigures(html) {
      var K = (window.GOS_CORPUS || {}).counts || {};
      var n = function (v) { return typeof v === "number" ? v.toLocaleString("en-US") : "NOT DOCUMENTED"; };
      var map = {
        written: n(K.written), directories: n(K.directories), empty: n(K.empty),
        sources: n(K.sources), assumption_files: n(K.assumption_files), verified: n(K.verified),
        words_m: typeof K.words === "number" ? (K.words / 1e6).toFixed(2).replace(/0$/, "") : "NOT DOCUMENTED"
      };
      return String(html).replace(/\{\{(\w+)\}\}/g, function (m, k) {
        return Object.prototype.hasOwnProperty.call(map, k) ? map[k] : m;
      });
    }

    function answer(q, entry) {
      if (askBusy) return; askBusy = true;
      addMsg("you", "<p>" + esc(q) + "</p>");
      var t = addMsg("gaurav", '<span class="typing"><i></i><i></i><i></i></span>');
      var body = t.querySelector(".body"), d = reduce ? 0 : 1;
      trace(0);
      [[1, 300], [2, 640], [3, 980]].forEach(function (st) { setTimeout(function () { trace(st[0]); }, st[1] * d); });
      setTimeout(function () {
        if (entry === "no-evidence") {
          body.innerHTML = cfg.no_evidence_reply;
          body.appendChild(el("div", "grounded", "◆ NO FIGURE EXISTS — NOTHING INVENTED"));
          trace(-1);
          GOS.track("ask_gaurav_unanswered", "no_evidence_figure");
        } else if (entry) {
          body.innerHTML = corpusFigures(entry.a);
          body.appendChild(el("div", "grounded", "◆ GROUNDED IN PORTFOLIO EVIDENCE"));
          body.appendChild(sources(entry.sources));
          trace(4);
          GOS.track("ask_gaurav_question", entry.id);
        } else {
          body.innerHTML = cfg.refusal;
          body.appendChild(el("div", "grounded", "◆ NO MATCHING EVIDENCE — NOTHING INVENTED"));
          trace(-1);
          GOS.track("ask_gaurav_unanswered");
        }
        thread.scrollTop = thread.scrollHeight; askBusy = false;
        setTimeout(function () { trace(-1); }, 1600 * d);
      }, 1100 * d);
    }
    function match(q) {
      var s = q.toLowerCase(), best = null, score = 0;
      /* honesty guard first: a request for a figure we don't have refuses,
         even when the question also names a project we do cover */
      var blocked = (cfg.no_evidence_terms || []).some(function (t) { return s.indexOf(t) > -1; });
      if (blocked) return "no-evidence";
      C.copilot_kb.forEach(function (e) {
        var n = 0;
        e.keys.forEach(function (k) { if (s.indexOf(k) > -1) n += k.length; });
        if (s.indexOf(e.q.toLowerCase().slice(0, 14)) > -1) n += 40;
        if (n > score) { score = n; best = e; }
      });
      return score >= 3 ? best : null;
    }
    var pl = document.getElementById("prompts");
    C.copilot_kb.forEach(function (e) {
      var b = el("button", "prompt-btn", "→  " + e.q);
      b.addEventListener("click", function () { answer(e.q, e); });
      pl.appendChild(b);
    });
    document.getElementById("ask-form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var inp = document.getElementById("ask-input"), q = inp.value.trim();
      if (!q || askBusy) return;
      inp.value = "";
      answer(q, match(q));
    });
    addMsg("gaurav", cfg.greeting);
  })();

  /* -------------------------------------------------------------- challenge */
  (function () {
    var m = document.getElementById("challenge-mount");
    m.innerHTML = '<div class="eyebrow"><span class="num">07</span> Product thinking, live</div>' +
      '<h2 class="title">Challenge <em>Gaurav</em></h2>' +
      '<p class="dek">Three problems close to ones I have actually faced. Choose what you would decide first, add why if you want to, then see my documented approach.</p>' +
      '<div class="chips" style="margin-top:var(--s2)"><span class="chip dim">NO SCORE · NO CORRECT ANSWER</span><span class="chip dim">DEMONSTRATION, NOT ASSESSMENT</span></div>' +
      '<div id="challenges" style="margin-top:var(--s3)"></div>';

    var wrap = document.getElementById("challenges");
    C.challenges.forEach(function (ch) {
      var box = el("div", "challenge");
      var head = el("div", "challenge-head");
      head.appendChild(el("div", "chips", '<span class="chip gold">CHALLENGE ' + ch.num + '</span><span class="chip">' + esc(ch.tag) + '</span>'));
      head.appendChild(el("div", "challenge-sc", esc(ch.scenario)));
      head.appendChild(el("div", "challenge-ask", esc(ch.ask)));
      box.appendChild(head);

      var opts = el("div", "opts");
      opts.appendChild(el("span", "step-label", "Step 1 · Choose an approach"));
      var why = el("div", "why-box"); why.hidden = true;
      why.appendChild(el("span", "step-label", "Step 2 · Why? (optional — nothing is sent anywhere)"));
      var ta = document.createElement("textarea");
      ta.placeholder = "Your reasoning…"; ta.id = "why-" + ch.id;
      why.appendChild(ta);
      var showBtn = el("button", "ghost-btn", "STEP 3 · REVEAL GAURAV'S APPROACH →");
      showBtn.style.marginTop = "10px";
      why.appendChild(showBtn);

      var reveal = null;
      showBtn.addEventListener("click", function () {
        if (reveal) reveal.remove();
        reveal = el("div", "reveal");
        reveal.appendChild(el("div", "chips",
          '<span class="chip dim">NO SCORE · NO CORRECT ANSWER</span><span class="chip">YOU CHOSE: ' + (showBtn.dataset.choice || "—") + '</span>'));
        reveal.appendChild(el("div", null, '<div class="sect-label" style="margin-top:16px">Gaurav\'s documented approach</div>'));
        var dl = el("dl", "approach");
        ch.approach.forEach(function (st) {
          var row = el("div", "step");
          row.appendChild(el("dt", null, st[0]));
          row.appendChild(el("dd", null, st[1]));
          dl.appendChild(row);
        });
        reveal.appendChild(dl);
        box.appendChild(reveal);
        GOS.track("challenge_completed", ch.id);
      });

      ch.options.forEach(function (o, oi) {
        var b = el("button", "opt", '<span class="letter">' + String.fromCharCode(65 + oi) + '</span><span>' + esc(o) + '</span>');
        b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", function () {
          Array.prototype.forEach.call(opts.querySelectorAll(".opt"), function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
          why.hidden = false;
          showBtn.dataset.choice = String.fromCharCode(65 + oi);
          GOS.track("challenge_started", ch.id);
        });
        opts.appendChild(b);
      });
      box.appendChild(opts); box.appendChild(why); wrap.appendChild(box);
    });
  })();

  /* -------------------------------------------------------------------- lab */
  var openReader;
  (function () {
    var cfg = C.lab_config;
    var m = document.getElementById("lab-mount");
    var published = C.lab_notes.filter(function (n) { return n.published; });
    m.innerHTML = '<div class="eyebrow"><span class="num">08</span> Writing engine &amp; lab bench</div>' +
      '<h2 class="title">Lab <em>Notes</em></h2>' +
      '<p class="dek">' + esc(cfg.subtitle) + '</p>' +
      '<span class="step-label" style="margin-top:var(--s3)">Publishing queue · order set, no dates committed</span>' +
      '<div class="timeline" id="timeline"></div>' +
      '<div class="card" style="margin-top:var(--s2);border-color:rgba(210,166,60,.3);background:var(--gold-soft)">' +
        '<div class="mono" style="font-size:10.5px;letter-spacing:.17em;color:var(--gold)">PUBLISHED: ' + published.length + ' · DRAFT: ' + (C.lab_notes.length - published.length) + '</div>' +
        '<p class="small" style="margin-top:7px;color:var(--text)">' + esc(cfg.publishing_note) + '</p>' +
      '</div>' +
      '<span class="step-label" style="margin-top:var(--s4)">Featured</span><div class="stack" id="featured-notes"></div>' +
      '<span class="step-label" style="margin-top:var(--s4)">Archive</span>' +
      '<div class="filters" id="note-filters"></div><div class="stack" id="note-list"></div>' +
      '<div class="eyebrow" style="margin-top:var(--s6)"><span class="num">·</span> Lab bench</div>' +
      '<h2 class="title">AI <em>Experiments</em></h2>' +
      '<p class="dek">What I am testing about how AI products should behave. Status is honest: one is running, one is in progress, three are concepts with no results to report.</p>' +
      '<div class="chips" style="margin-top:var(--s2)">' +
        '<span class="chip jade"><span class="st-dot st-jade"></span>RUNNING</span>' +
        '<span class="chip gold"><span class="st-dot st-gold"></span>IN PROGRESS</span>' +
        '<span class="chip dim"><span class="st-dot st-dim"></span>CONCEPT</span></div>' +
      '<div style="margin-top:var(--s3)" id="xp-list"></div>';

    /* timeline */
    var tl = document.getElementById("timeline");
    C.lab_notes.forEach(function (n) {
      var b = el("button", "tl", '<div class="w">' + esc(n.week) + '</div><div class="c">' + esc(n.category) + '</div><div class="s">' + esc(n.status) + '</div>');
      b.addEventListener("click", function () { openReader(n); });
      tl.appendChild(b);
    });
    cfg.open_slots.forEach(function (s) {
      tl.appendChild(el("div", "tl", '<div class="w" style="color:var(--dim)">' + esc(s.week) + '</div><div class="c" style="color:var(--muted)">' + esc(s.label) + '</div><div class="s">UNWRITTEN</div>'));
    });

    function noteCard(n) {
      var b = el("button", "note-card");
      b.innerHTML = '<div class="note-meta"><span>' + esc(n.id.toUpperCase()) + '</span><span>' + esc(n.week) + '</span><span>' + esc(n.date) + '</span>' +
        '<span style="color:var(--gold)">' + esc(n.category) + '</span><span>' + esc(n.reading_time) + ' read</span>' +
        '<span class="chip dim" style="padding:1px 6px">' + esc(n.status) + '</span></div>' +
        '<div class="note-title">' + esc(n.title) + '</div><div class="note-dek">' + esc(n.excerpt) + '</div>' +
        '<div class="chips" style="margin-top:11px">' + n.tags.map(function (t) { return '<span class="chip dim">' + esc(t) + '</span>'; }).join("") + '</div>';
      b.addEventListener("click", function () { openReader(n); });
      return b;
    }

    var fn = document.getElementById("featured-notes");
    C.lab_notes.filter(function (n) { return n.featured; }).forEach(function (n) { fn.appendChild(noteCard(n)); });

    var list = document.getElementById("note-list"), filters = document.getElementById("note-filters");
    var used = C.lab_notes.map(function (n) { return n.category; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    var cats = ["All"].concat(used);
    var active = "All";
    function render() {
      list.innerHTML = "";
      var rows = C.lab_notes.filter(function (n) { return active === "All" || n.category === active; });
      if (!rows.length) { list.appendChild(el("div", "card", '<p class="small">No notes in this category yet.</p>')); return; }
      rows.forEach(function (n) { list.appendChild(noteCard(n)); });
    }
    cats.forEach(function (c) {
      var b = el("button", "chip" + (c === active ? " gold" : ""), c.toUpperCase());
      b.addEventListener("click", function () {
        active = c;
        Array.prototype.forEach.call(filters.children, function (x) { x.className = "chip"; });
        b.className = "chip gold"; render();
      });
      filters.appendChild(b);
    });
    render();

    /* experiments */
    var xw = document.getElementById("xp-list");
    C.experiments.forEach(function (x, i) {
      var box = el("div", "xp");
      var btn = el("button", "xp-head",
        '<span class="id">EXP ' + esc(x.num) + '</span><span class="nm">' + esc(x.name) + '</span>' +
        '<span class="chip ' + x.tone + '"><span class="st-dot st-' + x.tone + '"></span>' + esc(x.status) + '</span>');
      var body = el("div", "xp-body");
      var dl = el("dl", "kv");
      [["Question", x.question], ["Method", x.method], ["Evidence", x.evidence], ["Next step", x.next]].forEach(function (p) {
        dl.appendChild(el("dt", null, p[0])); dl.appendChild(el("dd", null, p[1]));
      });
      body.appendChild(dl); body.hidden = i !== 0;
      btn.setAttribute("aria-expanded", i === 0 ? "true" : "false");
      btn.addEventListener("click", function () {
        body.hidden = !body.hidden;
        btn.setAttribute("aria-expanded", body.hidden ? "false" : "true");
      });
      box.appendChild(btn); box.appendChild(body); xw.appendChild(box);
    });

    /* reader */
    var readerEl = null, lastFocus = null;
    openReader = function (n) {
      lastFocus = document.activeElement;
      readerEl = el("div", "reader");
      readerEl.setAttribute("role", "dialog");
      readerEl.setAttribute("aria-modal", "true");
      readerEl.setAttribute("aria-label", n.title);
      var inner = el("div", "reader-inner");
      var close = el("button", "ghost-btn reader-close", "CLOSE ✕");
      close.addEventListener("click", closeReader);
      inner.appendChild(close);
      inner.appendChild(el("div", "note-meta",
        '<span>' + esc(n.id.toUpperCase()) + '</span><span>' + esc(n.week) + '</span><span>' + esc(n.date) + '</span>' +
        '<span style="color:var(--gold)">' + esc(n.category) + '</span><span>' + esc(n.reading_time) + ' read</span>'));
      inner.appendChild(el("h3", "note-title", esc(n.title)));
      inner.appendChild(el("div", "chips", '<span class="chip gold">' + esc(n.status) + ' · NOT PUBLISHED</span>' +
        n.tags.map(function (t) { return '<span class="chip dim">' + esc(t) + '</span>'; }).join("")));
      inner.appendChild(el("div", "reader-body", n.content));

      /* sources and the project a note belongs to — rendered only when the
         record carries them, never invented to fill the shape.            */
      if (n.sources && n.sources.length) {
        inner.appendChild(el("h4", "rd-h", "SOURCES"));
        inner.appendChild(el("ul", "rd-src", n.sources.map(function (sr) {
          return sr.url ? '<li><a href="' + esc(sr.url) + '" target="_blank" rel="noopener">' + esc(sr.title || sr.url) + '</a></li>'
                        : '<li>' + esc(sr.title || sr) + '</li>';
        }).join("")));
      }
      var rel = n.related_project && C.projects.filter(function (p) { return p.id === n.related_project; })[0];
      if (rel) {
        var rl = el("a", "chip gold", "RELATED: " + esc((rel.name || rel.title || rel.id).toUpperCase()));
        rl.href = "#work"; rl.addEventListener("click", closeReader);
        var rw = el("div", "chips"); rw.style.marginTop = "18px"; rw.appendChild(rl);
        inner.appendChild(rw);
      }

      /* previous / next through the notes, in the order the archive shows   */
      var all = C.lab_notes, idx = all.indexOf(n);
      var nav = el("div", "cs-nav");
      var prev = el("button", "ghost-btn", "← PREVIOUS NOTE");
      var next = el("button", "ghost-btn", "NEXT NOTE →");
      if (idx <= 0) prev.disabled = true;
      if (idx < 0 || idx >= all.length - 1) next.disabled = true;
      prev.addEventListener("click", function () { if (idx > 0) { closeReader(); openReader(all[idx - 1]); } });
      next.addEventListener("click", function () { if (idx < all.length - 1) { closeReader(); openReader(all[idx + 1]); } });
      var copy = el("button", "ghost-btn", "COPY LINK");
      copy.addEventListener("click", function () {
        var url = location.origin + location.pathname + "#note-" + (n.slug || n.id);
        try { location.hash = "note-" + (n.slug || n.id); } catch (e) {}
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () { copy.textContent = "LINK COPIED"; },
                                                  function () { copy.textContent = url; });
        } else { copy.textContent = url; }
      });
      nav.appendChild(prev); nav.appendChild(copy); nav.appendChild(next);
      inner.appendChild(nav);
      readerEl.__nav = { prev: prev, next: next };
      readerEl.appendChild(inner);
      readerEl.addEventListener("click", function (e) { if (e.target === readerEl) closeReader(); });
      readerEl.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft" && !prev.disabled) { e.preventDefault(); prev.click(); }
        if (e.key === "ArrowRight" && !next.disabled) { e.preventDefault(); next.click(); }
      });
      readerEl.tabIndex = -1;
      document.body.appendChild(readerEl);
      close.focus();
      GOS.track("lab_note_open", n.id);
    };
    window.__gosCloseReader = closeReader;
    function closeReader() {
      if (!readerEl) return;
      readerEl.remove(); readerEl = null;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
  })();

  /* ------------------------------------------------------------------ about */
  /* Experience and education first — the record a recruiter checks. The
     longer journey sits behind one disclosure; nothing in it is dropped.  */
  function expItem(e) {
    return '<div class="rec-item"><div class="h"><h3 class="r">' + esc(e.role) + ' — ' + esc(e.org) + '</h3><div class="d">' + esc(e.period) + '</div></div>' +
      '<div class="o">' + esc(e.where) + '</div><ul>' + e.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + '</ul></div>';
  }
  function eduItem(e) {
    return '<div class="rec-item"><div class="h"><h3 class="r">' + esc(e.what) + ' — ' + esc(e.org) + '</h3><div class="d">' + esc(e.period) + '</div></div></div>';
  }
  var CRED_GROUPS = ["Professional certifications", "Courses & learning paths"];

  (function () {
    var m = document.getElementById("about-mount");
    var j = C.journey, r = C.research;
    var h = '<div class="eyebrow"><span class="num">03</span> The record</div>' +
      '<h2 class="title" id="about-title">Experience &amp; <em>education</em></h2>' +

      '<span class="sect-label" style="margin-top:var(--s4)">Experience</span><div style="margin-top:var(--s2)">' +
      C.experience.map(expItem).join("") + '</div>' +

      '<span class="sect-label" style="margin-top:var(--s5)">Education</span><div style="margin-top:var(--s2)">' +
      C.education.map(eduItem).join("") + '</div>' +

      '<span class="sect-label" style="margin-top:var(--s5)">Credentials</span>' +
      '<p class="small" style="margin-top:8px">Separated by what the source actually calls them — a learning path is listed as a learning path, not upgraded to a certification.</p>' +
      '<div class="stack" style="margin-top:var(--s2)">' +
      CRED_GROUPS.map(function (g) {
        var rows = C.credentials.filter(function (c) { return c.group === g; });
        if (!rows.length) return "";
        return '<div class="card"><div class="mono" style="font-size:10.5px;letter-spacing:.17em;color:var(--gold)">' + esc(g.toUpperCase()) + '</div>' +
          rows.map(function (c) {
            return '<div style="margin-top:11px"><div class="small" style="color:var(--dim)">' + esc(c.issuer) + '</div>' +
              '<div class="chips" style="margin-top:7px">' + c.items.map(function (i) { return '<span class="chip">' + esc(i) + '</span>'; }).join("") + '</div></div>';
          }).join("") + '</div>';
      }).join("") + '</div>' +

      '<span class="sect-label" style="margin-top:var(--s5)">Toolkit</span>' +
      '<p class="small" style="margin-top:8px">Exactly what is on my CV — no aspirational tools.</p><div id="toolkit"></div>' +

      '<details class="mw" style="margin-top:var(--s5)" id="journey-details"><summary><span><span class="t">The full journey, 2017 to now</span>' +
        '<span class="s">' + esc(j.arc.join(" → ")) + ' — ' + esc(j.note) + '</span></span><span class="x">OPEN</span></summary>' +
        '<div class="mw-body"><div class="journey" id="journey"></div>' +
        '<div class="card" id="research-record" style="margin-top:var(--s3)">' +
          '<div class="mono" style="font-size:10.5px;letter-spacing:.17em;color:var(--gold)">RESEARCH RECORD · ' + esc(r.org.toUpperCase()) + '</div>' +
          '<p style="margin-top:9px">' + esc(r.produced) + '</p><p class="note">' + esc(r.note) + '</p>' +
        '</div></div>' +
      '</details>' +

      '<div class="cta-band"><p>Hiring for a healthcare product, APM or product analyst role? The CV has all of this on one page.</p>' +
        '<div class="cta-row">' + cvLink("btn btn-primary", "DOWNLOAD CV ↓") +
        '<a class="btn btn-secondary" href="#contact">CONTACT →</a></div></div>';
    m.innerHTML = h;

    var jw = document.getElementById("journey");
    j.stops.forEach(function (s, i) {
      var last = i === j.stops.length - 1;
      var st = el("button", "stop");
      st.type = "button";
      st.setAttribute("data-open", last ? "true" : "false");
      st.setAttribute("aria-expanded", last ? "true" : "false");
      st.innerHTML = '<div class="stop-when">' + esc(s.when) + ' <span class="stop-phase">' + esc(s.phase) + '</span></div>' +
        '<div class="stop-what">' + esc(s.what) + '</div><div class="stop-where">' + esc(s.where) + '</div>';
      var det = el("div", "stop-detail", esc(s.detail));
      det.hidden = !last;
      st.addEventListener("click", function () {
        var open = det.hidden; det.hidden = !open;
        st.setAttribute("data-open", open ? "true" : "false");
        st.setAttribute("aria-expanded", open ? "true" : "false");
      });
      st.appendChild(det); jw.appendChild(st);
    });

    var tw = document.getElementById("toolkit");
    C.skills.forEach(function (g) {
      var sec = el("div", "tool-group");
      sec.appendChild(el("h3", null, g.group));
      var chips = el("div", "chips");
      g.items.forEach(function (t) { chips.appendChild(el("span", "chip", t)); });
      sec.appendChild(chips); tw.appendChild(sec);
    });
  })();

  /* ---------------------------------------------------------------- contact */
  (function () {
    var ct = C.site_config.contact;
    document.getElementById("contact-mount").innerHTML =
      '<div class="eyebrow"><span class="num">04</span> Contact</div>' +
      '<h2 class="contact-line" id="contact-title">Let\'s talk about your<br>healthcare product role.</h2>' +
      '<a class="mail-big" data-ev="contact_click" href="mailto:' + esc(ct.email) + '">' + esc(ct.email) + '</a>' +
      '<div class="cta-row">' +
        cvLink("btn btn-primary", "DOWNLOAD CV (PDF) ↓") +
        '<a class="btn btn-secondary" data-ev="contact_click" href="mailto:' + esc(ct.email) + '">EMAIL ME</a>' +
        '<a class="btn btn-secondary" data-ev="linkedin_click" href="https://' + esc(ct.linkedin) + '" target="_blank" rel="noopener">LINKEDIN<span class="sr"> (opens in a new tab)</span></a>' +
        (ct.resume && ct.resume.page ? '<a class="btn btn-secondary" data-ev="resume_page" href="' + esc(ct.resume.page) + '">CV AS A WEB PAGE</a>' : "") +
      '</div>' +
      openBlock("contact") +
      '<div class="links">' +
        '<a class="link" data-ev="linkedin_click" href="https://' + esc(ct.linkedin) + '" target="_blank" rel="noopener"><span class="k">LinkedIn</span><span class="v">' + esc(ct.linkedin) + '</span></a>' +
        '<a class="link" data-ev="github_click" href="https://' + esc(ct.github) + '" target="_blank" rel="noopener"><span class="k">GitHub</span><span class="v">' + esc(ct.github) + '</span></a>' +
        '<a class="link" data-ev="contact_click" href="mailto:' + esc(ct.email) + '"><span class="k">Email</span><span class="v">' + esc(ct.email) + '</span></a>' +
        '<a class="link" data-ev="contact_click" href="tel:' + esc(ct.phone.replace(/\s/g, "")) + '"><span class="k">Phone</span><span class="v">' + esc(ct.phone) + '</span></a>' +
        cvLink("link", '<span class="k">CV</span><span class="v">' + esc((ct.resume || {}).label || "") + ' ↓</span>') +
      '</div>';

    document.getElementById("site-footer").innerHTML =
      esc(C.site_config.owner) + ' · ' + esc(C.site_config.role) + ' · ' + esc(C.site_config.location) +
      ' · <a href="mailto:' + esc(ct.email) + '">' + esc(ct.email) + '</a><br>' +
      '<span>' + esc(C.site_config.version) + ' · content updated ' + esc(C.site_config.updated) + '</span>';
  })();

  /* ------------------------------------------------- research & experiments */
  /* The secondary area. Everything here is real and kept, but none of it
     is needed to judge the product work above — so it says so up front.  */
  (function () {
    var m = document.getElementById("research-mount");
    var s = C.site_config, f = s.current_focus, I = C.intro || {};
    var K = (window.GOS_CORPUS || { counts: {} }).counts;
    var links = [
      ["R1", "constellation", "90-day case-study corpus", K.written + " written studies across " + K.directories + " day directories, read from the repository"],
      ["R2", "atlas", "Product Atlas", "All 90 studies, searchable and filterable"],
      ["R3", "evolution", "Evolution", "How the method changed over the 90 days"],
      ["R4", "thinking", "How I think", "The operating model, principles and product orbit"],
      ["R5", "ask", "AI portfolio copilot", "Ask questions; answers come only from a fixed index"],
      ["R6", "challenge", "Product challenges", "Three scenarios with my documented approach"],
      ["R7", "lab", "Lab Notes & AI experiments", "Five drafts and five experiments, each with its status"]
    ];
    m.innerHTML =
      '<span class="re-tag">SECONDARY · FOR DEPTH</span>' +
      '<div class="eyebrow"><span class="num">R0</span> Research &amp; Experiments</div>' +
      '<h2 class="title" id="research-title">Research &amp; <em>Experiments</em></h2>' +
      '<p class="dek">For anyone who wants to go deeper: a 90-day product case-study corpus, a grounded portfolio copilot, product challenges, lab notes and a short intro film. None of it is needed to evaluate the work above.</p>' +
      '<div class="re-grid">' + links.map(function (l) {
        return '<a class="re-link" href="#' + l[1] + '"><span class="k">' + l[0] + '</span><span class="t">' + esc(l[2]) + '</span><span class="d">' + esc(l[3]) + '</span></a>';
      }).join("") + '</div>' +
      (I.enabled && I.video ?
        '<div class="film-card">' +
          (I.poster ? '<img src="' + esc(I.poster) + '" alt="" width="168" height="95" loading="lazy" decoding="async">' : "") +
          '<div class="fc"><div class="mono" style="font-size:10.5px;letter-spacing:.16em;color:var(--gold)">INTRO FILM · ' + esc(I.duration_note || "") + '</div>' +
          '<p class="small" style="margin-top:6px">A short film made for this portfolio. It only plays when you ask it to.</p></div>' +
          '<button class="btn btn-secondary" id="film-btn" type="button">▶ WATCH INTRO · ' + esc(I.duration_note || "") + '</button>' +
        '</div>' : "") +
      '<div class="panels">' +
        [f.building, f.completed, f.exploring, f.writing].map(function (p) {
          return '<div class="panel"><div class="k">' + esc(p.label) + '</div><div class="v">' + esc(p.value) + '</div><div class="m">' + esc(p.note) + '</div></div>';
        }).join("") +
      '</div>';
  })();

  /* -------------------------------------------------------- recruiter view */
  (function () {
    var s = C.site_config, ct = s.contact;
    var all = C.projects.slice().sort(byOrder);
    document.getElementById("recruiter").innerHTML =
      '<header class="rec-head">' +
        '<h1 class="rec-name">' + esc(s.owner) + '</h1>' +
        '<div class="rec-role">' + esc(s.role) + ' · ' + esc(s.discipline) + '</div>' +
        '<div class="rec-sum">' + (s.proof_points || []).map(function (pp, i) {
          return '<div><b>' + String(i + 1).padStart(2, "0") + '</b><span>' + esc(pp.claim) + ' ' + evLabel(pp.evidence) + '</span></div>';
        }).join("") + '</div>' +
        openBlock("recruiter") +
        '<div class="chips" style="margin-top:var(--s3)">' +
          cvLink("chip gold", esc((ct.resume || {}).label || "") + " ↓") +
          '<span class="chip">' + esc(s.location) + '</span><span class="chip gold">SEEKING: ' + esc(s.seeking.toUpperCase()) + '</span>' +
          '<a class="chip" data-ev="contact_click" href="mailto:' + esc(ct.email) + '">EMAIL →</a>' +
          '<a class="chip" data-ev="linkedin_click" href="https://' + esc(ct.linkedin) + '" target="_blank" rel="noopener">LINKEDIN →</a>' +
          '<a class="chip" data-ev="github_click" href="https://' + esc(ct.github) + '" target="_blank" rel="noopener">GITHUB →</a>' +
        '</div>' +
        '<div class="rec-sum" style="margin-top:var(--s3)">' + s.summary.map(function (l) {
          return '<div><b>•</b><span>' + esc(l) + '</span></div>';
        }).join("") + '</div>' +
      '</header>' +

      '<section class="rec-sec" id="rec-work"><h2 class="rec-h">Selected work</h2>' +
        all.map(function (p) {
          return '<div class="rec-item"><div class="h"><h3 class="r">' + esc(p.name) + ' — ' + esc(p.subtitle) + '</h3><div class="d">' + esc(p.period) + '</div></div>' +
            '<div class="o">' + esc(p.role) + ' · ' + esc(p.status) + '</div><ul>' + (p.recruiter || []).map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + '</ul></div>';
        }).join("") +
      '</section>' +

      '<section class="rec-sec" id="rec-exp"><h2 class="rec-h">Experience</h2>' + C.experience.map(expItem).join("") + '</section>' +

      '<section class="rec-sec" id="rec-skills"><h2 class="rec-h">Skills</h2>' +
        C.skills.map(function (g) {
          return '<div class="rec-item"><div class="o" style="color:var(--text)"><b style="color:var(--bone);font-weight:500">' + esc(g.group) + '</b> — ' + esc(g.items.join(", ")) + '</div></div>';
        }).join("") +
      '</section>' +

      '<section class="rec-sec" id="rec-edu"><h2 class="rec-h">Education</h2>' + C.education.map(eduItem).join("") + '</section>' +

      '<section class="rec-sec" id="rec-cred"><h2 class="rec-h">Credentials</h2>' +
        CRED_GROUPS.map(function (g) {
          var rows = C.credentials.filter(function (c) { return c.group === g; });
          if (!rows.length) return "";
          return '<div class="rec-item"><div class="o" style="color:var(--text)"><b style="color:var(--bone);font-weight:500">' + esc(g) + '</b> — ' +
            rows.map(function (c) { return esc(c.issuer) + ": " + esc(c.items.join(" · ")); }).join(" | ") + '</div></div>';
        }).join("") +
      '</section>' +

      '<section class="rec-sec" id="rec-contact" style="padding-bottom:56px"><h2 class="rec-h">Contact</h2>' +
        '<div class="links">' +
          '<a class="link" href="mailto:' + esc(ct.email) + '"><span class="k">Email</span><span class="v">' + esc(ct.email) + '</span></a>' +
          '<a class="link" href="https://' + esc(ct.linkedin) + '" target="_blank" rel="noopener"><span class="k">LinkedIn</span><span class="v">' + esc(ct.linkedin) + '</span></a>' +
          '<a class="link" href="https://' + esc(ct.github) + '" target="_blank" rel="noopener"><span class="k">GitHub</span><span class="v">' + esc(ct.github) + '</span></a>' +
          '<a class="link" href="tel:' + esc(ct.phone.replace(/\s/g, "")) + '"><span class="k">Phone</span><span class="v">' + esc(ct.phone) + '</span></a>' +
          cvLink("link", '<span class="k">CV</span><span class="v">' + esc((ct.resume || {}).label || "") + ' ↓</span>') +
        '</div>' +
        '<p class="small" style="margin-top:var(--s2)">Recruiter Mode is the one-page view. Switch back for the full case studies, decision logs and the Research &amp; Experiments area.</p>' +
      '</section>';
  })();

  /* ------------------------------------------------------- recruiter toggle */
  var toggles = ["rail-recruiter", "top-recruiter", "hero-recruiter"].map(function (id) { return document.getElementById(id); }).filter(Boolean);
  function setMode(on) {
    root.setAttribute("data-mode", on ? "recruiter" : "lab");
    toggles.forEach(function (b) {
      b.setAttribute("aria-pressed", on ? "true" : "false");
      if (b.id === "hero-recruiter") b.textContent = on ? "EXIT RECRUITER MODE" : "RECRUITER MODE";
    });
    store("gos-mode", on ? "recruiter" : "lab");
    if (on) GOS.track("recruiter_mode_open");
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }
  toggles.forEach(function (b) { b.addEventListener("click", function () { setMode(root.getAttribute("data-mode") !== "recruiter"); }); });
  /* ?view=recruiter is a shareable link straight into the one-page view */
  var askedRecruiter = /[?&]view=recruiter\b/.test(location.search);
  if (askedRecruiter || store("gos-mode") === "recruiter") setMode(true); else root.setAttribute("data-mode", "lab");

  /* --------------------------------------------------------------- mobile nav */
  var rail = document.getElementById("rail"), menuBtn = document.getElementById("menu-btn"), scrim = null;
  function closeRail() { rail.setAttribute("data-open", "false"); menuBtn.setAttribute("aria-expanded", "false"); if (scrim) { scrim.remove(); scrim = null; } }
  menuBtn.addEventListener("click", function () {
    if (rail.getAttribute("data-open") === "true") { closeRail(); return; }
    rail.setAttribute("data-open", "true"); menuBtn.setAttribute("aria-expanded", "true");
    scrim = document.createElement("button"); scrim.className = "scrim"; scrim.setAttribute("aria-label", "Close menu");
    scrim.addEventListener("click", closeRail); document.body.appendChild(scrim);
  });
  rail.addEventListener("click", function (e) { if (e.target.closest && e.target.closest(".navlink")) closeRail(); });

  /* ------------------------------------------------------------------ search */
  var searchEl = null;
  function strip(html) { return String(html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " "); }
  function buildIndex() {
    var ix = [];
    C.projects.forEach(function (p) {
      /* full text so a search for "claim register" or "invariant" lands */
      var text = [p.name, p.subtitle, p.domain, p.role, p.status, p.headline].join(" ") +
        " " + (p.sections || []).map(function (s) { return s.label + " " + strip(s.body); }).join(" ") +
        " " + (p.exec || []).map(function (c) { return c.k + " " + c.t; }).join(" ") +
        " " + (p.pivot || []).map(function (c) { return c.k + " " + c.t; }).join(" ") +
        " " + (p.decision_log || []).map(function (d) { return [d.decision, d.why, d.evidence, d.tradeoff, d.changed, d.next].join(" "); }).join(" ");
      ix.push({ type: "PROJECT", title: p.name, excerpt: p.subtitle + " · " + p.status, href: "#case-" + p.id, text: text });
    });
    C.lab_notes.forEach(function (n) {
      ix.push({ type: "LAB NOTE", title: n.title, excerpt: n.excerpt, href: "#lab", note: n,
        text: [n.title, n.excerpt, n.category, n.tags.join(" "), n.week, strip(n.content)].join(" ") });
    });
    C.experiments.forEach(function (x) { ix.push({ type: "EXPERIMENT", title: x.name, excerpt: x.question + " (" + x.status + ")", href: "#lab" }); });
    C.experience.forEach(function (e) { ix.push({ type: "EXPERIENCE", title: e.role + " — " + e.org, excerpt: e.period, href: "#about" }); });
    C.skills.forEach(function (g) { g.items.forEach(function (s) { ix.push({ type: "SKILL", title: s, excerpt: g.group, href: "#about" }); }); });
    C.education.forEach(function (e) { ix.push({ type: "EDUCATION", title: e.what, excerpt: e.org + " · " + e.period, href: "#about" }); });
    ((window.GOS_CORPUS || {}).studies || []).forEach(function (cs) {
      ix.push({ type: "CASE STUDY", title: "Day " + cs.day + " — " + cs.company,
        excerpt: cs.summary === "NOT DOCUMENTED" ? cs.category + " · not documented" : cs.summary.slice(0, 120),
        href: "#atlas", study: cs,
        text: [cs.company, cs.title, cs.category, cs.summary, cs.evidence_level].join(" ") });
    });
    return ix;
  }
  var INDEX = buildIndex();
  function openSearch() {
    if (searchEl) return;
    searchEl = el("div", "search-overlay");
    searchEl.setAttribute("role", "dialog");
    searchEl.setAttribute("aria-modal", "true");
    searchEl.setAttribute("aria-label", "Search the portfolio");
    var box = el("div", "search-box");
    box.innerHTML = '<div class="search-field"><span class="mono" style="color:var(--dim);font-size:13px">⌕</span>' +
      '<label class="sr" for="s-input">Search projects, lab notes, experiments, skills</label>' +
      '<input id="s-input" type="text" autocomplete="off" placeholder="Search projects, notes, experiments, skills…">' +
      '<button class="ghost-btn" id="s-close">ESC</button></div><div class="search-results" id="s-results"></div>';
    searchEl.appendChild(box);
    searchEl.addEventListener("click", function (e) { if (e.target === searchEl) closeSearch(); });
    document.body.appendChild(searchEl);
    var input = document.getElementById("s-input"), out = document.getElementById("s-results");
    document.getElementById("s-close").addEventListener("click", closeSearch);
    function run() {
      var q = input.value.trim().toLowerCase();
      out.innerHTML = "";
      if (!q) { out.appendChild(el("div", "search-empty", "Type to search across projects, lab notes, experiments, experience, education and skills.")); return; }
      var hits = INDEX.filter(function (r) {
        return (r.title + " " + r.excerpt + " " + r.type + " " + (r.text || "")).toLowerCase().indexOf(q) > -1;
      }).slice(0, 12);
      if (!hits.length) { out.appendChild(el("div", "search-empty", 'Nothing in the portfolio matches “' + esc(q) + '”.')); return; }
      hits.forEach(function (r) {
        var b = el("button", "sr-item", '<span class="ty">' + r.type + '</span><span><span class="ti">' + esc(r.title) + '</span><span class="ex">' + esc(r.excerpt) + '</span></span>');
        b.addEventListener("click", function () {
          closeSearch();
          if (r.note) { openReader(r.note); return; }
          if (r.study && window.GOS.openStudy) { window.GOS.openStudy(r.study); return; }
          location.hash = r.href;
        });
        out.appendChild(b);
      });
      GOS.track("search_query");
    }
    input.addEventListener("input", run);
    run(); input.focus();
  }
  function closeSearch() { if (searchEl) { searchEl.remove(); searchEl = null; } }
  document.getElementById("search-btn").addEventListener("click", openSearch);
  document.getElementById("search-btn-m").addEventListener("click", openSearch);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeRail(); closeSearch(); if (window.__gosCloseReader) window.__gosCloseReader(); if (typeof endIntro === "function") endIntro("skip"); }
    if (e.key === "/" && !searchEl && ["INPUT", "TEXTAREA"].indexOf(document.activeElement.tagName) < 0) { e.preventDefault(); openSearch(); }
  });

  /* ------------------------------------------------- analytics delegation */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("[data-ev]") : null;
    if (a) GOS.track(a.getAttribute("data-ev"));
  });

  /* -------------------------------------------------- scrollspy + reveal */
  (function () {
    if (!("IntersectionObserver" in window)) return;
    var links = Array.prototype.slice.call(document.querySelectorAll(".navlink"));
    var secs = links.map(function (l) { return document.getElementById(l.getAttribute("href").slice(1)); }).filter(Boolean);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) { l.setAttribute("aria-current", l.getAttribute("href") === "#" + en.target.id ? "true" : "false"); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(function (s) { io.observe(s); });

    if (!reduce) {
      var rvs = Array.prototype.slice.call(document.querySelectorAll(".rv"));
      rvs.forEach(function (s) { s.classList.add("pre"); });
      var ro = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove("pre"); ro.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -12% 0px" });
      rvs.forEach(function (s) { ro.observe(s); });
    }
  })();

  /* ------------------------------------------------------------------ intro */
  /* The intro film. A real MP4 — never a CSS re-creation. It plays only when
     a visitor asks for it from Research & Experiments: a recruiter's first
     screen is never a 65-second film, and the 12 MB file is never fetched
     unless someone chooses to watch. Skippable at any moment.              */
  var introEl = null, introVideo = null, introDone = false;

  /* Sound preference. Stored, never assumed: the browser, not this file,
     decides whether an unmuted start is allowed, and the control always
     shows the state the <video> element is actually in.                   */
  function soundPref() {
    try { return localStorage.getItem("gos-intro-sound") === "1"; } catch (e) { return false; }
  }
  function setSoundPref(on) {
    try { localStorage.setItem("gos-intro-sound", on ? "1" : "0"); } catch (e) {}
  }

  function endIntro(how) {
    if (!introEl) return;
    var node = introEl, v = introVideo;
    introEl = null; introVideo = null; introDone = true;
    if (v) { try { v.pause(); } catch (e) {} }
    node.classList.add("out");                 /* interface activation, not a wipe */
    document.body.style.overflow = "";
    setTimeout(function () { if (node.parentNode) node.remove(); }, reduce ? 0 : 620);
    GOS.track(how === "skip" ? "intro_skipped" : how === "error" ? "intro_failed" : "intro_completed");
    /* the film is opened from a button; focus goes back to it */
    var opener = document.getElementById("film-btn");
    if (opener) { try { opener.focus({ preventScroll: true }); } catch (e) { opener.focus(); } }
  }

  function buildIntro(opts) {
    var C_i = C.intro || {};
    introEl = el("div", "intro");
    introEl.setAttribute("role", "dialog");
    introEl.setAttribute("aria-modal", "true");
    introEl.setAttribute("aria-label", "GAURAV.OS system initialization film");

    var stage = el("div", "film-stage");
    var v = document.createElement("video");
    introVideo = v;
    v.className = "film";
    v.src = C_i.video;
    if (C_i.poster) v.poster = C_i.poster;
    v.muted = true; v.defaultMuted = true;      /* policy: muted autoplay */
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.setAttribute("disablepictureinpicture", "");
    v.preload = "auto";
    v.controls = false;
    stage.appendChild(v);

    /* cover on wide viewports, contain on narrow ones — the face is left of
       centre and cover on a tall phone would cut it */
    function fit() {
      var r = window.innerWidth / window.innerHeight;
      v.style.objectFit = r >= 1.2 ? "cover" : "contain";
    }
    fit(); window.addEventListener("resize", fit);

    var vign = el("div", "film-vignette");
    var load = el("div", "film-load", "<span></span><span></span><span></span>");

    var ovTL = el("div", "ov tl",
      '<div class="ov-mark">GAURAV<i>.</i>OS</div><div class="ov-sub">SYSTEM INITIALIZATION</div>');
    var ovBL = el("div", "ov bl",
      '<div class="ov-name">' + esc(C.site_config.owner) + '</div><div class="ov-sub">' +
      esc(C.site_config.role.toUpperCase()) + '</div>');

    /* no .ov/.br here: the cluster below owns the positioning, so SKIP stays
       in the flex flow instead of being absolutely placed on top of SOUND */
    var skip = el("button", "ov-skip", (C_i.skip_label || "SKIP INTRO") + " →");
    skip.type = "button";
    skip.addEventListener("click", function () { endIntro("skip"); });

    /* A labelled toggle: stable accessible name, aria-pressed carries the
       state, and the visible text and dot report what the element is
       really doing — never what we hoped it would do.                      */
    var sound = el("button", "ov-sound", '<i class="sdot" aria-hidden="true"></i><span class="slab">SOUND OFF</span>');
    sound.type = "button";
    sound.setAttribute("aria-label", "Intro film sound");
    var slab = sound.querySelector(".slab");
    function syncSound() {
      var on = !v.muted;
      sound.setAttribute("aria-pressed", on ? "true" : "false");
      slab.textContent = on ? "SOUND ON" : "SOUND OFF";
      sound.title = on ? "Turn intro sound off" : "Turn intro sound on";
    }
    syncSound();
    sound.addEventListener("click", function () {
      var wantOn = v.muted;
      v.muted = !wantOn;
      setSoundPref(wantOn);
      /* A click is a user gesture, so this is the moment a blocked film can
         legitimately start — and the moment sound can legitimately begin. */
      if (v.paused) {
        var pc = v.play();
        if (pc && pc.catch) pc.catch(function () { v.muted = true; syncSound(); });
      }
      syncSound();
      GOS.track(wantOn ? "intro_sound_on" : "intro_sound_off");
    });
    v.addEventListener("volumechange", syncSound);

    var bar = el("div", "film-bar", "<i></i>");
    var fill = bar.querySelector("i");
    v.addEventListener("timeupdate", function () {
      if (v.duration) fill.style.width = ((v.currentTime / v.duration) * 100) + "%";
    });
    v.addEventListener("playing", function () {
      introEl && introEl.classList.add("ready");
      if (load.parentNode) load.remove();
    });
    v.addEventListener("ended", function () {
      /* hold the final frame, then activate the interface */
      introEl && introEl.classList.add("hold");
      setTimeout(function () { endIntro("end"); }, 900);
    });
    v.addEventListener("error", function () { endIntro("error"); });

    introEl.appendChild(stage);
    introEl.appendChild(vign);
    introEl.appendChild(load);
    var actions = el("div", "ov br ov-actions");
    actions.appendChild(sound); actions.appendChild(skip);
    [ovTL, ovBL, actions, bar].forEach(function (n) { introEl.appendChild(n); });
    document.body.appendChild(introEl);
    document.body.style.overflow = "hidden";
    skip.focus();

    introEl.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); endIntro("skip"); return; }
      /* aria-modal means modal: Tab stays on the film's own controls instead
         of walking the hundreds of focusable elements rendered beneath it */
      if (e.key !== "Tab") return;
      var f = [].slice.call(introEl.querySelectorAll("button:not([disabled])"))
                .filter(function (n) { return n.getClientRects().length > 0; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1], a = document.activeElement;
      if (!introEl.contains(a)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
      else if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
    });

    /* never block: if nothing is playing within 6s, step aside */
    setTimeout(function () {
      if (!introEl) return;
      if (v.error) { endIntro("error"); return; }          /* genuinely broken */
      if (v.paused && v.currentTime === 0) offerGesture();  /* waiting on a gesture */
    }, 6000);

    /* Autoplay refused (policy, or a data-saver profile) is not a failure:
       hold the poster and offer the gesture the browser is waiting for. */
    function offerGesture() {
      if (!introEl || introEl.querySelector(".ov-play")) return;
      if (load.parentNode) load.remove();
      var play = el("button", "ov ov-play", "▶ PLAY INTRO");
      play.addEventListener("click", function () {
        play.remove();
        /* a real gesture: honour the stored sound choice here */
        if (soundPref()) { v.muted = false; }
        syncSound();
        var p2 = v.play();
        if (p2 && p2.catch) p2.catch(function () {
          v.muted = true; syncSound();
          var p3 = v.play();
          if (p3 && p3.catch) p3.catch(function () { endIntro("error"); });
        });
      });
      introEl.appendChild(play);
      introEl.classList.add("ready");
    }

    /* Start policy: at most one attempt with sound (only if the viewer chose
       it before), at most one muted fallback, then the gesture button.
       A blocked autoplay is never retried in a loop and never throws.     */
    var started = false;
    (function start() {
      if (started) return; started = true;
      var wantSound = soundPref();
      v.muted = !wantSound; v.defaultMuted = !wantSound;
      syncSound();
      var p1 = v.play();
      if (!p1 || !p1.catch) return;
      p1.catch(function () {
        if (!introEl) return;
        if (!wantSound) { offerGesture(); return; }
        v.muted = true; v.defaultMuted = true; syncSound();
        var p2 = v.play();
        if (p2 && p2.catch) p2.catch(offerGesture);
      });
    })();
    GOS.track(opts && opts.replay ? "intro_replayed" : "intro_started");
  }

  /* reduced motion: the still, his name, and a way in. Never the film. */
  function buildStill() {
    var C_i = C.intro || {};
    introEl = el("div", "intro still");
    introEl.setAttribute("role", "dialog");
    introEl.setAttribute("aria-label", "GAURAV.OS");
    var stage = el("div", "film-stage");
    if (C_i.poster) {
      var img = document.createElement("img");
      img.src = C_i.poster; img.alt = ""; img.className = "film";
      stage.appendChild(img);
    }
    introEl.appendChild(stage);
    introEl.appendChild(el("div", "film-vignette"));
    introEl.appendChild(el("div", "ov tl",
      '<div class="ov-mark">GAURAV<i>.</i>OS</div><div class="ov-sub">' +
      esc(C.site_config.role.toUpperCase()) + '</div>'));
    var enter = el("button", "ov br ov-skip", "CLOSE →");
    enter.addEventListener("click", function () { endIntro("skip"); });
    introEl.appendChild(enter);
    document.body.appendChild(introEl);
    document.body.style.overflow = "hidden";
    enter.focus();
  }

  function hasFilm() { return !!(C.intro && C.intro.enabled && C.intro.video); }

  (function wireIntro() {
    var btn = document.getElementById("film-btn");
    if (!btn || !hasFilm()) return;
    btn.addEventListener("click", function () {
      if (introEl) return;
      if (reduce) { buildStill(); return; }
      buildIntro({ replay: false });
    });
  })();

  revealHash();

  GOS.track("portfolio_view");
})();
