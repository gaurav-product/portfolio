/* ============================================================================
   GAURAV.OS — APPLICATION LAYER (multi-page)
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

  /* ------------------------------------------------------------- routing */
  /* Every page is a static file at its route. The build stamps the page id
     and the path back to the site root on <body>, so links work the same on
     GitHub Pages, a sub-path, or a local server.                          */
  var PAGE = document.body.getAttribute("data-page") || "home";
  var ROOT = document.body.getAttribute("data-root") || "";
  function u(path) { return ROOT + (path || ""); }
  function caseStudy(id) { return C.case_studies.filter(function (c) { return c.id === id; })[0]; }
  function caseHref(id) {
    var cs = caseStudy(id);
    return cs ? u("work/" + cs.route + "/") : u("lab/#" + id);
  }
  /* where a source chip or a content reference lands, page by page */
  var SECTION_HREF = {
    work: "work/", "product-lab": "lab/", lab: "lab/", about: "about/", experience: "about/#experience",
    education: "about/#education", certifications: "about/#certifications", contact: "contact/",
    constellation: "research/#constellation", atlas: "research/#atlas", evolution: "research/#evolution",
    research: "research/", ask: "ask/"
  };
  function srcHref(id) { return projById(id) ? caseHref(id) : u(SECTION_HREF[id] || ""); }

  function projById(id) { return C.projects.filter(function (p) { return p.id === id; })[0]; }
  function byOrder(a, b) { return a.order - b.order; }
  function evLabel(t) {
    return t ? '<span class="ev-label' + (/NOT IN PRODUCTION/.test(t) ? " warn" : "") + '">' + esc(t) + '</span>' : "";
  }
  function badge(text, tone) { return '<span class="badge ' + (tone || "") + '">' + esc(text) + '</span>'; }

  /* The CV: one record, rendered wherever a download is offered. Nothing is
     rendered while no file is named, so there is never a 404 button.        */
  function cvLink(cls, text) {
    var R = (C.site_config.contact || {}).resume;
    if (!R || !R.file) return "";
    return '<a class="' + cls + '" data-ev="resume_clicked" href="' + esc(u(R.file)) + '" download="' +
      esc(R.filename) + '" type="application/pdf">' + (text || esc(R.label) + " ↓") + '</a>';
  }
  var CRED_GROUPS = ["Professional certifications", "Courses & learning paths"];

  /* ------------------------------------------------------------ header */
  (function () {
    var h = document.getElementById("site-head");
    if (!h) return;
    var s = C.site_config;
    h.innerHTML = '<div class="wrap head-in">' +
      '<a class="brand" href="' + esc(u("")) + '" aria-label="' + esc(s.brand) + ' — home">' +
        '<span class="brand-mark">GAURAV<i>.</i>OS</span><span class="brand-sub">// ' + esc(s.brand_sub) + '</span></a>' +
      '<button class="ghost-btn menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">MENU</button>' +
      '<nav class="nav" id="site-nav" aria-label="Main" data-open="false">' +
        C.navigation.map(function (n) {
          var cur = PAGE === n.id || (n.id === "work" && PAGE === "case");
          return '<a href="' + esc(u(n.route)) + '"' + (n.cta ? ' class="nav-cta"' : "") + (cur ? ' aria-current="page"' : "") + '>' + esc(n.label) + '</a>';
        }).join("") +
      '</nav></div>';
    var btn = document.getElementById("menu-btn"), nav = document.getElementById("site-nav");
    function setOpen(open) {
      nav.setAttribute("data-open", open ? "true" : "false");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "CLOSE" : "MENU";
    }
    btn.addEventListener("click", function () { setOpen(nav.getAttribute("data-open") !== "true"); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-open") === "true") { setOpen(false); btn.focus(); }
    });
    /* above the mobile breakpoint the nav is always shown */
    var mq = window.matchMedia("(min-width: 861px)");
    function sync() { if (mq.matches) nav.removeAttribute("data-open"); else if (!nav.hasAttribute("data-open")) setOpen(false); }
    if (mq.addEventListener) mq.addEventListener("change", sync); sync();
  })();

  /* ------------------------------------------------------------ footer */
  (function () {
    var f = document.getElementById("site-foot");
    if (!f) return;
    var s = C.site_config, ct = s.contact;
    f.innerHTML = '<div class="wrap foot-grid">' +
      '<div><span class="brand-mark">GAURAV<i>.</i>OS</span>' +
        '<p class="fine" style="margin-top:10px">' + esc(s.owner) + ' · ' + esc(s.role) + '<br>' + esc(s.location) + '</p></div>' +
      '<div><h2>Site</h2><ul>' + [["", "Home"]].concat(C.navigation.map(function (n) { return [n.route, n.label]; }))
        .concat([["lab/", "AI Product Lab"]]).map(function (l) {
          return '<li><a href="' + esc(u(l[0])) + '">' + esc(l[1]) + '</a></li>'; }).join("") + '</ul></div>' +
      '<div><h2>Contact</h2><ul>' +
        '<li><a href="mailto:' + esc(ct.email) + '">' + esc(ct.email) + '</a></li>' +
        '<li><a href="https://' + esc(ct.linkedin) + '" rel="noopener" target="_blank">LinkedIn<span class="sr"> (opens in a new tab)</span></a></li>' +
        '<li><a href="https://' + esc(ct.github) + '" rel="noopener" target="_blank">GitHub<span class="sr"> (opens in a new tab)</span></a></li>' +
        '<li>' + cvLink("", "Download CV (PDF)") + '</li>' +
      '</ul><p class="fine">' + esc(s.version) + ' · content updated ' + esc(s.updated) + '</p></div>' +
    '</div>';
  })();

  /* Escape closes whatever overlay is open: the note reader, the study
     panel (corpus-ui handles its own), the intro film.                     */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (window.__gosCloseReader) window.__gosCloseReader();
    if (typeof endIntro === "function") endIntro("skip");
  });

  /* ------------------------------------------- open to product opportunities */
  /* One record in the content layer, three deliberate placements: the hero
     (as the compact seeking row), the contact channel and Recruiter Mode.
     Stated positioning only — no claim about outcomes or availability.    */
  function openBlock(where) {
    var O = (C.site_config || {}).opportunity;
    if (!O || !O.enabled) return "";
    var href = u(O.cta_href);
    return '<div class="open contact-open">' +
      '<div class="open-k"><span class="pulse"></span>' + esc(O.label) + '</div>' +
      '<p class="open-b">' + esc(O.line + " " + O.detail) + '</p>' +
      '<div class="open-r">' + (O.roles || []).map(function (r) {
        return '<span>' + esc(r) + '</span>'; }).join("") + '</div>' +
      (where === "contact" ? "" :
        '<div class="open-cta"><a class="btn btn-secondary" data-ev="contact_click" href="' +
        esc(href) + '">' + esc(O.cta_label) + ' →</a></div>') +
    '</div>';
  }

  /* ------------------------------------------------------- the CV record */
  /* Experience, Education and Certifications: the record a recruiter checks,
     rendered verbatim from the content layer.                              */
  function expItem(e) {
    return '<div class="rec-item"><div class="h"><h3 class="r">' + esc(e.role) + ' — ' + esc(e.org) + '</h3><div class="d">' + esc(e.period) + '</div></div>' +
      '<div class="o">' + esc(e.where) + '</div><ul>' + e.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + '</ul></div>';
  }
  function eduItem(e) {
    return '<div class="rec-item"><div class="h"><h3 class="r">' + esc(e.what) + ' — ' + esc(e.org) + '</h3><div class="d">' + esc(e.period) + '</div></div></div>';
  }

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

  /* ===================================================================
     PAGES — each renderer runs only on its own route.
     =================================================================== */
  var main = document.getElementById("page");

  function pageHead(kicker, title, dek, crumbs) {
    return '<header class="page-head"><div class="wrap">' +
      (crumbs ? '<p class="crumbs">' + crumbs + '</p>' : "") +
      '<p class="page-kicker">' + esc(kicker) + '</p>' +
      '<h1 class="page-title">' + title + '</h1>' +
      (dek ? '<p class="page-dek">' + dek + '</p>' : "") +
    '</div></header>';
  }

  /* the selected-work card: problem, decision, evidence, status, link */
  function workCard(cs) {
    var p = projById(cs.id);
    return '<article class="card2" aria-labelledby="wc-' + cs.route + '">' +
      '<div class="card2-top"><div class="card2-meta"><span class="card2-org">' + esc(p ? p.period : "") + '</span>' + badge(cs.status, cs.status_tone) + '</div>' +
      '<h3 id="wc-' + cs.route + '">' + esc(cs.title) + '</h3></div>' +
      '<dl><div><dt>Problem</dt><dd>' + esc(cs.card.problem) + '</dd></div>' +
        '<div><dt>Product decision</dt><dd>' + esc(cs.card.decision) + '</dd></div>' +
        '<div><dt>Evidence</dt><dd>' + esc(cs.card.evidence) + '</dd></div></dl>' +
      '<div class="card2-foot"><a class="read" href="' + esc(u("work/" + cs.route + "/")) + '">Read case study<span class="sr">: ' + esc(cs.title) + '</span> →</a></div>' +
    '</article>';
  }
  function labLabels(e) { return '<div class="badges">' + e.labels.map(function (l) { return badge(l[0], l[1]); }).join("") + '</div>'; }

  /* ---------------------------------------------------- system visual */
  /* An illustration of how the work is organised — discovery, evaluation,
     safety, outcomes — around a decision. Nothing in it is live data, and
     it says so. Hover, focus or select a node to read what it stands for. */
  var SYS_NODES = [
    { id: "discovery", label: "Discovery", x: 92, y: 92,
      text: "Interviews before roadmaps — 30+ at Live Your Best Life, 20+ on Aaroh, and parent and facilitator interviews behind Evamastu's first brief." },
    { id: "evaluation", label: "Evaluation", x: 428, y: 92,
      text: "Decide how a build will be judged before trusting it — a 214-case suite on GharGyaan, 65 tests and 30 journeys on CareConnect, a designed (not run) A/B test on PhonePe." },
    { id: "safety", label: "Safety", x: 428, y: 288,
      text: "Set the boundary before the demand arrives — Aaroh never diagnoses; GharGyaan's safety engine routes 21 emergency categories to a human." },
    { id: "outcomes", label: "Outcomes", x: 92, y: 288,
      text: "Measure behaviour, not output — on Evamastu, consistency rose 20–25% over six weeks after an onboarding redesign." }
  ];
  function sysViz() {
    var hub = { x: 260, y: 190 };
    var paths = SYS_NODES.map(function (n) {
      var mx = (n.x + hub.x) / 2, my = n.y < hub.y ? n.y + 40 : n.y - 40;
      return { id: n.id, n: n, mx: mx, my: my, d: "M" + n.x + " " + n.y + " Q " + mx + " " + my + " " + hub.x + " " + hub.y };
    });
    /* a point on the quadratic path, for the checkpoint gates */
    function at(p, t) {
      var a = 1 - t;
      return { x: a * a * p.n.x + 2 * a * t * p.mx + t * t * hub.x, y: a * a * p.n.y + 2 * a * t * p.my + t * t * hub.y };
    }
    var grid = "";
    for (var gx = 20; gx < 520; gx += 40) grid += '<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="380"/>';
    for (var gy = 20; gy < 380; gy += 40) grid += '<line x1="0" y1="' + gy + '" x2="520" y2="' + gy + '"/>';
    /* neural nodes: a fixed ring of small nodes on the outer orbit, linked to their neighbours */
    var neural = [], links = "";
    for (var i = 0; i < 12; i++) {
      var a = (i / 12) * Math.PI * 2 + 0.26;
      neural.push({ x: +(hub.x + 150 * Math.cos(a)).toFixed(1), y: +(hub.y + 62 * Math.sin(a)).toFixed(1) });
    }
    neural.forEach(function (q, i) {
      if (i % 2) return;
      var r = neural[(i + 3) % 12];
      links += '<line x1="' + q.x + '" y1="' + q.y + '" x2="' + r.x + '" y2="' + r.y + '"/>';
    });
    /* a small glyph beside each practice: what it stands for, drawn, not measured */
    var G = {
      discovery: function (x, y) {   /* scattered findings converging */
        return [[-34, -6], [-28, 8], [-40, 4], [-22, -2]].map(function (d) {
          return '<circle cx="' + (x + d[0]) + '" cy="' + (y + d[1]) + '" r="2"/>'; }).join("") +
          '<path d="M' + (x - 22) + ' ' + (y - 2) + ' L' + (x - 15) + ' ' + y + '"/>';
      },
      evaluation: function (x, y) {  /* signal arcs */
        return [9, 15, 21].map(function (r) {
          return '<path d="M' + (x + 18) + ' ' + (y - r * .7) + ' A ' + r + ' ' + r + ' 0 0 1 ' + (x + 18) + ' ' + (y + r * .7) + '" transform="translate(' + (r * .3) + ' 0)"/>'; }).join("");
      },
      safety: function (x, y) {      /* a shield */
        var X = x + 30, Y = y - 9;
        return '<path d="M' + X + ' ' + Y + ' l9 3.5 v6 c0 5 -4 8 -9 10 c-5 -2 -9 -5 -9 -10 v-6 z"/><path d="M' + (X - 4) + ' ' + (Y + 9) + ' l3 3 l5 -6"/>';
      },
      outcomes: function (x, y) {    /* a target */
        var X = x - 32;
        return '<circle cx="' + X + '" cy="' + y + '" r="9"/><circle cx="' + X + '" cy="' + y + '" r="4.5"/><circle class="f" cx="' + X + '" cy="' + y + '" r="1.6"/>';
      }
    };
    var svg = '<svg viewBox="0 0 520 380" role="img" aria-labelledby="sv-title sv-desc" focusable="false">' +
      '<title id="sv-title">Illustration of an AI product system</title>' +
      '<desc id="sv-desc">Four practices — discovery, evaluation, safety and outcomes — travel along pathways through safety checkpoints to a central decision with three states: proceed, iterate or stop. A conceptual illustration, not live data.</desc>' +
      '<g class="sv-grid">' + grid + '</g>' +
      '<g class="sv-neural">' + links + neural.map(function (q) { return '<circle cx="' + q.x + '" cy="' + q.y + '" r="2.4"/>'; }).join("") + '</g>' +
      '<g class="sv-orbits"><ellipse class="sv-orbit" cx="260" cy="190" rx="150" ry="62"/>' +
        '<ellipse class="sv-orbit spin" cx="260" cy="190" rx="96" ry="38"/>' +
        '<ellipse class="sv-orbit faint" cx="260" cy="190" rx="210" ry="150"/></g>' +
      paths.map(function (p) { return '<path class="sv-path" id="svp-' + p.id + '" d="' + p.d + '"/>'; }).join("") +
      paths.map(function (p) {
        var c = at(p, .62);
        return '<g class="sv-gate"><rect x="' + (c.x - 5) + '" y="' + (c.y - 5) + '" width="10" height="10" transform="rotate(45 ' + c.x.toFixed(1) + ' ' + c.y.toFixed(1) + ')"/></g>';
      }).join("") +
      paths.map(function (p, i) {
        /* all start at once (a delayed start parks the dot at the origin); the
           different durations keep them out of step */
        return '<circle class="sv-pulse" r="3.5"><animateMotion dur="' + (3.0 + i * 0.55) + 's" begin="0s" repeatCount="indefinite"><mpath href="#svp-' + p.id + '"/></animateMotion></circle>';
      }).join("") +
      SYS_NODES.map(function (n) {
        return '<g class="sv-node" id="svn-' + n.id + '"><g class="sv-glyph">' + G[n.id](n.x, n.y) + '</g>' +
          '<circle class="sv-ring" cx="' + n.x + '" cy="' + n.y + '" r="15"/><circle class="sv-core" cx="' + n.x + '" cy="' + n.y + '" r="4"/>' +
          '<text class="sv-t" x="' + n.x + '" y="' + (n.y + (n.y < 190 ? -26 : 38)) + '" text-anchor="middle">' + n.label.toUpperCase() + '</text></g>';
      }).join("") +
      '<g class="sv-hub"><circle class="halo" cx="260" cy="190" r="40"/><circle cx="260" cy="190" r="30"/><text x="260" y="194" text-anchor="middle">DECIDE</text></g>' +
      ["PROCEED", "ITERATE", "STOP"].map(function (t, i) {
        var x = 172 + i * 62;
        return '<g class="sv-state" id="svs-' + i + '"><rect x="' + x + '" y="252" width="56" height="20" rx="2"/><text x="' + (x + 28) + '" y="266" text-anchor="middle">' + t + '</text></g>';
      }).join("") +
    '</svg>';
    return '<figure class="sysviz" style="margin:0">' +
      '<div class="sysviz-top"><span><b>AI PRODUCT SYSTEM</b></span><span>Conceptual · not live data</span></div>' +
      svg +
      '<p class="sv-legend" aria-hidden="true"><span><i class="lg-path"></i>Pathway</span><span><i class="lg-gate"></i>Safety checkpoint</span><span><i class="lg-node"></i>Neural node</span></p>' +
      '<p class="sv-states">Decision states: <b>Proceed</b> · <b>Iterate</b> · <b>Stop</b></p>' +
      '<div class="sv-labels" role="group" aria-label="Explore the system">' + SYS_NODES.map(function (n) {
        return '<button class="sv-label" type="button" data-node="' + n.id + '" aria-pressed="false">' + n.label + '</button>';
      }).join("") + '</div>' +
      '<figcaption class="sv-caption" id="sv-caption" aria-live="polite">Select a node to see how that practice shows up in the work.</figcaption>' +
    '</figure>';
  }
  function wireSysViz() {
    var fig = document.querySelector(".sysviz");
    if (!fig) return;
    var svg = fig.querySelector("svg"), cap = document.getElementById("sv-caption");
    var buttons = [].slice.call(fig.querySelectorAll(".sv-label"));
    function show(id) {
      SYS_NODES.forEach(function (n) {
        var on = n.id === id;
        svg.getElementById("svn-" + n.id).classList.toggle("on", on);
        svg.getElementById("svp-" + n.id).classList.toggle("on", on);
      });
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-node") === id ? "true" : "false"); });
      var n = SYS_NODES.filter(function (x) { return x.id === id; })[0];
      if (n) cap.innerHTML = "<b>" + esc(n.label) + ".</b> " + esc(n.text);
    }
    buttons.forEach(function (b) {
      var id = b.getAttribute("data-node");
      b.addEventListener("click", function () { show(id); GOS.track("system_node", id); });
      b.addEventListener("mouseenter", function () { show(id); });
      b.addEventListener("focus", function () { show(id); });
    });
    /* decision states cycle slowly; reduced motion holds them still */
    var states = [0, 1, 2].map(function (i) { return svg.getElementById("svs-" + i); }), k = 0, timer = null, visible = true;
    function step() { states.forEach(function (st, i) { st.classList.toggle("on", i === k); }); k = (k + 1) % 3; }
    step();
    if (reduce) { if (svg.pauseAnimations) svg.pauseAnimations(); return; }
    timer = setInterval(function () { if (visible && !document.hidden) step(); }, 2400);
    /* off-screen, nothing animates */
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (svg.pauseAnimations) { if (visible) svg.unpauseAnimations(); else svg.pauseAnimations(); }
    }).observe(fig);
  }

  /* ------------------------------------------------------------- home */
  function renderHome() {
    var s = C.site_config, ct = s.contact;
    var homeQs = (C.copilot_config.home_order || []).map(function (id) {
      return C.copilot_kb.filter(function (e) { return e.id === id; })[0];
    }).filter(Boolean);
    var labPrev = ["aaroh", "ghargyaan", "phonepe"].map(function (id) {
      return C.lab_entries.filter(function (e) { return e.id === id; })[0];
    });
    var edu = C.education.filter(function (e) { return e.id === "ed2"; })[0];
    main.innerHTML =
      '<section class="hero" aria-labelledby="hero-name"><div class="wrap hero-grid">' +
        '<div>' +
          '<p class="os-mark">GAURAV<i>.</i>OS <span>// ' + esc(s.brand_sub) + '</span></p>' +
          '<h1 id="hero-name">' + esc(s.owner) + '</h1>' +
          '<p class="hero-title">' + esc(s.role) + '</p>' +
          '<p class="hero-pos">' + esc(s.headline) + '</p>' +
          '<div class="cta-row">' +
            '<a class="btn btn-primary" href="#selected-work">Explore selected work <span aria-hidden="true">→</span></a>' +
            '<a class="btn btn-secondary" href="' + esc(u("ask/")) + '">Ask Gaurav</a>' +
            '<a class="btn btn-ghost" href="' + esc(u("contact/")) + '">Contact</a>' +
          '</div>' +
          '<p class="hero-meta"><span>' + esc(s.location) + '</span><span>Healthcare · Consumer · AI</span></p>' +
        '</div>' +
        '<div>' + sysViz() + '</div>' +
      '</div></section>' +

      '<section class="proof-strip" aria-label="What the work covers"><div class="wrap"><ul>' +
        s.proof_strip.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join("") +
      '</ul></div></section>' +

      '<section class="sec" id="selected-work" aria-labelledby="sw-title"><div class="wrap">' +
        '<div class="sec-head"><div><p class="sec-k">01 · Selected work</p><h2 class="sec-t" id="sw-title">Three products, from problem to evidence</h2>' +
          '<p class="sec-d">Each card states the problem, the product decision and the evidence — and its honest status.</p></div>' +
          '<a class="more" href="' + esc(u("work/")) + '">All work →</a></div>' +
        '<div class="cards">' + C.case_studies.map(workCard).join("") + '</div>' +
      '</div></section>' +

      '<section class="sec" id="lab-preview" aria-labelledby="lab-title"><div class="wrap">' +
        '<div class="sec-head"><div><p class="sec-k">02 · AI Product Lab</p><h2 class="sec-t" id="lab-title">Evaluation, failure modes and guardrails</h2>' +
          '<p class="sec-d">Self-directed AI and product builds, each labelled by what it is — and what was measured versus only proposed.</p></div>' +
          '<a class="more" href="' + esc(u("lab/")) + '">Open the lab →</a></div>' +
        '<div class="lab-prev">' + labPrev.map(function (e) {
          return '<article class="card2" aria-labelledby="lp-' + e.id + '">' +
            '<div class="card2-top">' + labLabels(e) + '<h3 id="lp-' + e.id + '">' + esc(e.name) + '</h3><p class="small">' + esc(e.summary) + '</p></div>' +
            '<dl><div><dt>Evaluation</dt><dd>' + esc(e.evaluation) + '</dd></div>' +
              '<div><dt>Failure modes</dt><dd>' + esc(e.failure) + '</dd></div>' +
              '<div><dt>Guardrails</dt><dd>' + esc(e.guardrails) + '</dd></div>' +
              '<div><dt>Measured</dt><dd>' + esc(e.measured.join("; ")) + '</dd></div>' +
              '<div><dt>Only proposed</dt><dd>' + esc(e.proposed.join("; ")) + '</dd></div></dl>' +
            '<div class="card2-foot"><a class="read" href="' + esc(u("lab/#" + e.id)) + '">Full lab entry<span class="sr">: ' + esc(e.name) + '</span> →</a></div>' +
          '</article>';
        }).join("") + '</div>' +
      '</div></section>' +

      '<section class="sec" id="ask-preview" aria-labelledby="ask-title"><div class="wrap"><div class="ask-prev">' +
        '<div><p class="sec-k">03 · Ask Gaurav</p><h2 class="sec-t" id="ask-title">Ask about the work</h2>' +
          '<p class="sec-d">Answers come from my CV and product records — role, work, evidence and status — and say plainly when something isn\'t documented.</p>' +
          '<div class="cta-row"><a class="btn btn-primary" href="' + esc(u("ask/")) + '">Open Ask Gaurav</a></div>' +
          '<p class="fine">Runs on a curated local answer layer. No API key, no live model, no private data.</p></div>' +
        '<ul class="ask-qs">' + homeQs.map(function (e) {
          return '<li><a href="' + esc(u("ask/?q=" + e.id)) + '">“' + esc(e.q) + '”<span aria-hidden="true">→</span></a></li>';
        }).join("") + '</ul>' +
      '</div></div></section>' +

      '<section class="sec" id="about-preview" aria-labelledby="about-title"><div class="wrap split">' +
        '<div><p class="sec-k">04 · About</p><h2 class="sec-t" id="about-title">Research first, then the product, then the measurement</h2>' +
          '<div class="cta-row"><a class="btn btn-ghost" href="' + esc(u("about/")) + '">Read more about Gaurav</a></div></div>' +
        '<div><p class="about-lead">' + esc(s.about_summary) + '</p>' +
          '<ul class="facts"><li><b>Based in</b><span>' + esc(s.location) + '</span></li>' +
            '<li><b>Education</b><span>' + esc(edu.what + " — " + edu.org + " (" + edu.period + ")") + '</span></li>' +
            '<li><b>AI training</b><span>AI-Enabled Product Management Program — Masai School and IIT Roorkee faculty</span></li></ul></div>' +
      '</div></section>' +

      '<section class="sec" id="contact" aria-labelledby="contact-title"><div class="wrap split">' +
        '<div><p class="sec-k">05 · Contact</p><h2 class="sec-t" id="contact-title">Let\'s talk about your AI product role</h2>' +
          '<div class="cta-row">' + cvLink("btn btn-primary", "Download CV (PDF)") + '<a class="btn btn-secondary" href="mailto:' + esc(ct.email) + '">Email me</a></div></div>' +
        contactList() +
      '</div></section>';
    wireSysViz();
  }

  function contactList() {
    var ct = C.site_config.contact;
    return '<ul class="contact-list">' +
      '<li><a href="mailto:' + esc(ct.email) + '" data-ev="contact_click"><span class="k">Email</span><span class="v">' + esc(ct.email) + '</span><span class="go" aria-hidden="true">→</span></a></li>' +
      '<li><a href="https://' + esc(ct.linkedin) + '" target="_blank" rel="noopener" data-ev="linkedin_click"><span class="k">LinkedIn</span><span class="v">' + esc(ct.linkedin) + '<span class="sr"> (opens in a new tab)</span></span><span class="go" aria-hidden="true">↗</span></a></li>' +
      '<li><a href="https://' + esc(ct.github) + '" target="_blank" rel="noopener" data-ev="github_click"><span class="k">GitHub</span><span class="v">' + esc(ct.github) + '<span class="sr"> (opens in a new tab)</span></span><span class="go" aria-hidden="true">↗</span></a></li>' +
      '<li><span class="cl"><span class="k">Based in</span><span class="v">' + esc(C.site_config.location) + '</span><span></span></span></li>' +
      '<li>' + cvLink("cv-row", '<span class="k">CV</span><span class="v">Download CV (PDF)</span><span class="go" aria-hidden="true">↓</span>') + '</li>' +
    '</ul>';
  }

  /* ------------------------------------------------------------- work */
  function renderWork() {
    main.innerHTML = pageHead("Work", "Selected <em class=\"accent-em\">work</em>",
        "Three case studies — shipped product work, research-led product work, and an MVP that is not in production. Each opens to the full ten-part case study.") +
      '<section class="sec" aria-labelledby="work-cs"><div class="wrap"><h2 class="sr" id="work-cs">Case studies</h2><div class="cards">' + C.case_studies.map(workCard).join("") + '</div></div></section>' +
      '<section class="sec"><div class="wrap"><div class="sec-head"><div><p class="sec-k">More</p><h2 class="sec-t">AI Product Lab</h2>' +
        '<p class="sec-d">Aaroh, GharGyaan, PhonePe Smart Spend Coach and Nexus — with evaluation design, failure modes, guardrails and what was measured versus proposed.</p></div>' +
        '<a class="more" href="' + esc(u("lab/")) + '">Open the lab →</a></div>' +
        '<ul class="contact-list">' + C.lab_entries.map(function (e) {
          return '<li><a href="' + esc(u("lab/#" + e.id)) + '"><span class="k">' + esc(e.labels[0][0]) + '</span><span class="v">' + esc(e.name) + '</span><span class="go" aria-hidden="true">→</span></a></li>';
        }).join("") + '</ul></div></section>';
  }

  /* ------------------------------------------------------------- case */
  function renderCaseStudy() {
    var slug = document.body.getAttribute("data-case");
    var cs = C.case_studies.filter(function (c) { return c.route === slug; })[0];
    if (!cs) { main.innerHTML = pageHead("Work", "Case study not found", "", '<a href="' + esc(u("work/")) + '">Work</a>'); return; }
    var idx = C.case_studies.indexOf(cs), next = C.case_studies[(idx + 1) % C.case_studies.length];
    main.innerHTML = pageHead("Case study · " + cs.status, esc(cs.title), esc(cs.card.problem),
        '<a href="' + esc(u("work/")) + '">Work</a> / ' + esc(cs.title)) +
      '<div class="wrap">' +
        '<dl class="cs-facts">' + cs.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join("") + '</dl>' +
        '<div class="case-grid">' +
          '<nav class="toc" aria-label="Case study sections"><ol>' + cs.sections.map(function (s, i) {
            return '<li><a href="#s' + (i + 1) + '">' + esc(s.k) + '</a></li>'; }).join("") + '</ol></nav>' +
          '<article aria-label="' + esc(cs.title) + ' case study">' + cs.sections.map(function (s, i) {
            return '<section class="cs-sec" id="s' + (i + 1) + '" aria-labelledby="s' + (i + 1) + '-t">' +
              '<h2 id="s' + (i + 1) + '-t"><span class="n">' + String(i + 1).padStart(2, "0") + '</span>' + esc(s.k) +
                (s.proposal ? ' <span class="tag prop" title="A forward-looking plan, not completed work">Proposal</span>' : "") + '</h2>' +
              '<div class="cs-body">' + s.body + '</div></section>';
          }).join("") + '</article>' +
        '</div>' +
        '<div class="cs-next"><a class="read" href="' + esc(u("work/")) + '">← All work</a>' +
          '<a class="read" href="' + esc(u("work/" + next.route + "/")) + '">Next: ' + esc(next.title) + ' →</a></div>' +
      '</div>';
  }

  /* -------------------------------------------------------------- lab */
  function renderLab() {
    main.innerHTML = pageHead("AI Product Lab", "AI Product <em class=\"accent-em\">Lab</em>",
        "Self-directed AI and product builds. Each is labelled for what it is, and keeps what was measured apart from what was only proposed. None of these is a live product with users.") +
      '<div class="wrap">' + C.lab_entries.map(function (e) {
        var p = projById(e.id);
        return '<section class="lab-entry" id="' + e.id + '" aria-labelledby="le-' + e.id + '">' +
          '<div class="lab-entry-head"><div><h2 id="le-' + e.id + '">' + esc(e.name) + '</h2><p class="sub">' + esc(e.sub) + '</p></div>' + labLabels(e) + '</div>' +
          '<p class="page-dek" style="margin-top:var(--s2)">' + esc(e.summary) + '</p>' +
          '<div class="lab-dims">' +
            [["Evaluation design", e.evaluation], ["Failure modes", e.failure], ["Guardrails", e.guardrails],
             ["User research", e.research], ["Trade-offs", e.tradeoffs]].map(function (d) {
              return '<div class="lab-dim"><h3>' + d[0] + '</h3><p>' + esc(d[1]) + '</p></div>'; }).join("") +
          '</div>' +
          '<div class="mvp"><div class="mvp-box"><h3>Measured</h3><ul>' + e.measured.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></div>' +
            '<div class="mvp-box prop"><h3>Only proposed / not measured</h3><ul>' + e.proposed.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></div></div>' +
          (p && p.sections ? '<details class="mw" id="more-' + e.id + '" style="margin-top:var(--s3)"><summary><span><span class="t">Full record</span><span class="s">Decisions, sections and notes for ' + esc(e.name) + '</span></span><span class="x">OPEN</span></summary><div class="mw-body" data-record="' + e.id + '"></div></details>' : "") +
        '</section>';
      }).join("") +
      '<section class="lab-entry" id="corpus"><div class="lab-entry-head"><div><h2>90-day product case-study corpus</h2>' +
        '<p class="sub">Author · one case study a day for 90 days · public repository</p></div><div class="badges">' + badge("Research archive", "accent") + '</div></div>' +
        '<p class="page-dek" style="margin-top:var(--s2)">The full archive — constellation, Atlas and Evolution — lives on the Research page.</p>' +
        '<div class="cta-row"><a class="btn btn-ghost" href="' + esc(u("research/")) + '">Open the research archive</a></div></section>' +
      '</div>';
    [].forEach.call(main.querySelectorAll("[data-record]"), function (box) {
      box.appendChild(renderCase(projById(box.getAttribute("data-record")), false));
    });
  }

  /* ------------------------------------------------------------ about */
  function renderAbout() {
    var s = C.site_config;
    main.innerHTML = pageHead("About", esc(s.owner), esc(s.about_summary)) +
      '<div class="wrap about-grid"><div>' +
        '<section id="experience" aria-labelledby="exp-t" style="scroll-margin-top:90px"><h2 class="sec-t" id="exp-t">Experience</h2><div style="margin-top:var(--s2)">' +
          C.experience.map(expItem).join("") + '</div></section>' +
        '<section id="education" aria-labelledby="edu-t" style="margin-top:var(--s5);scroll-margin-top:90px"><h2 class="sec-t" id="edu-t">Education</h2><div style="margin-top:var(--s2)">' +
          C.education.map(eduItem).join("") + '</div></section>' +
        '<section id="certifications" aria-labelledby="cert-t" style="margin-top:var(--s5);scroll-margin-top:90px"><h2 class="sec-t" id="cert-t">Certifications &amp; learning</h2>' +
          '<p class="sec-d">Separated by what the source calls them — a learning path is listed as a learning path, not upgraded to a certification.</p>' +
          '<div class="cert-grid">' + CRED_GROUPS.map(function (g) {
            var rows = C.credentials.filter(function (c) { return c.group === g; });
            if (!rows.length) return "";
            return '<div class="card"><h3 class="sect-label">' + esc(g) + '</h3>' + rows.map(function (c) {
              return '<div style="margin-top:12px"><div class="small">' + esc(c.issuer) + '</div><ul class="cert-list">' +
                c.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join("") + '</ul></div>'; }).join("") + '</div>';
          }).join("") + '</div></section>' +
        '<section id="skills" aria-labelledby="sk-t" style="margin-top:var(--s5)"><h2 class="sec-t" id="sk-t">Skills</h2><p class="sec-d">Exactly what is on my CV.</p>' +
          C.skills.map(function (g) {
            return '<div class="tool-group"><h3>' + esc(g.group) + '</h3><div class="chips">' + g.items.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join("") + '</div></div>';
          }).join("") + '</section>' +
      '</div>' +
      '<aside class="aside-card" aria-label="CV and contact"><h2>CV &amp; contact</h2>' +
        '<div class="cta-row" style="margin-top:12px">' + cvLink("btn btn-primary", "Download CV (PDF)") + '</div>' +
        '<p class="small" style="margin-top:12px"><a href="' + esc(u(s.contact.resume.page)) + '">CV as a web page</a></p>' +
        openBlock("about") + '</aside></div>';
  }

  /* --------------------------------------------------------- research */
  function renderResearch() {
    var idx = [["R1", "constellation", "90-day corpus", "Every study, mapped"], ["R2", "atlas", "Product Atlas", "Search and filter all 90"],
               ["R3", "evolution", "Evolution", "How the method changed"], ["R4", "thinking", "How I Think", "Operating model and orbit"],
               ["R5", "challenge", "Challenges", "Three product scenarios"], ["R6", "lab", "Lab Notes", "Drafts and AI experiments"],
               ["R7", "film", "Intro film", "65 seconds, on demand"]];
    main.innerHTML = pageHead("Research", "Research <em class=\"accent-em\">archive</em>",
        "A 90-day product case-study corpus read straight from its public repository, plus the method, challenges, lab notes and the intro film.") +
      '<div class="wrap"><nav aria-label="Research sections"><div class="res-index">' + idx.map(function (r) {
        return '<a href="#' + r[1] + '"><span class="k">' + r[0] + '</span><span class="t">' + r[2] + '</span><span class="d">' + r[3] + '</span></a>'; }).join("") +
      '</div></nav></div>' +
      ["constellation", "atlas", "evolution", "thinking", "challenge", "lab"].map(function (id) {
        return '<section class="mod" id="' + id + '"><div class="wrap" id="' + id + '-mount"></div></section>';
      }).join("") +
      '<section class="mod" id="film" aria-labelledby="film-title"><div class="wrap">' + filmBlock() + '</div></section>';
  }
  function filmBlock() {
    var I = C.intro || {};
    return '<div class="eyebrow"><span class="num">R7</span> Intro film</div>' +
      '<h2 class="title" id="film-title">The intro <em>film</em></h2>' +
      (I.enabled && I.video ?
        '<div class="film-card">' +
          (I.poster ? '<img src="' + esc(u(I.poster)) + '" alt="Still frame from the GAURAV.OS intro film" width="200" height="113" loading="lazy" decoding="async">' : "") +
          '<div class="fc"><div class="mono" style="font-size:11px;letter-spacing:.14em;color:var(--accent)">' + esc(I.duration_note || "") + ' · ON DEMAND</div>' +
          '<p class="small" style="margin-top:6px">A short film made for this portfolio. It only plays when you press Watch, and can be skipped at any moment.</p></div>' +
          '<button class="btn btn-secondary" id="film-btn" type="button">▶ Watch intro · ' + esc(I.duration_note || "") + '</button>' +
        '</div>' : '<p class="small">The film is not available.</p>');
  }

  /* -------------------------------------------------------------- ask */
  function renderAsk() {
    main.innerHTML = pageHead("Ask Gaurav", "Ask <em class=\"accent-em\">Gaurav</em>", esc(C.copilot_config.subtitle)) +
      '<section class="sec" style="padding-top:var(--s4)" aria-labelledby="ask-h"><h2 class="sr" id="ask-h">Ask a question</h2><div class="wrap" id="ask-mount"></div></section>';
  }

  /* ---------------------------------------------------------- contact */
  function renderContact() {
    var ct = C.site_config.contact;
    main.innerHTML = pageHead("Contact", "Let’s <em class=\"accent-em\">talk</em>",
        "About AI Product Manager, healthcare and product roles — or anything in the work. Email is fastest.") +
      '<section class="sec"><div class="wrap split"><div>' +
        '<div class="cta-row" style="margin-top:0">' + cvLink("btn btn-primary", "Download CV (PDF)") + '<a class="btn btn-secondary" href="mailto:' + esc(ct.email) + '">Email me</a></div>' +
        openBlock("contact") + '</div>' + contactList() + '</div></section>';
  }

  var RENDER = { home: renderHome, work: renderWork, "case": renderCaseStudy, lab: renderLab, about: renderAbout,
                 research: renderResearch, ask: renderAsk, contact: renderContact };
  if (main && RENDER[PAGE]) RENDER[PAGE]();

  /* A link to a section inside a collapsed <details> opens it first. */
  function revealHash() {
    var id = (location.hash || "").slice(1);
    if (!id) return;
    var t = null;
    try { t = document.getElementById(decodeURIComponent(id)); } catch (e) { return; }
    if (!t) return;
    var d = t.closest && t.closest("details");
    if (d && !d.open) d.open = true;
    t.scrollIntoView({ behavior: "instant", block: "start" });
  }
  window.addEventListener("hashchange", revealHash);
  window.addEventListener("load", function () { if (location.hash) revealHash(); });

  /* ------------------------------------------------------------- how i think */
  (function () {
    var m = document.getElementById("thinking-mount");
    if (!m) return;
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
  /* Answers from a fixed index of documented facts — never a live model.
     Every answer is the same four parts (role, work, evidence, status), and
     anything not in the index is refused in plain words, never inferred.  */
  var askBusy = false;
  (function () {
    var cfg = C.copilot_config;
    var m = document.getElementById("ask-mount");
    if (!m) return;
    m.innerHTML =
      '<div class="ask-wrap">' +
        '<div class="copilot">' +
          '<div class="copilot-head"><div class="trace" id="trace" aria-hidden="true">' +
            cfg.trace.map(function (t, i) { return '<span class="step">' + esc(t) + '</span>' + (i < cfg.trace.length - 1 ? "<span>→</span>" : ""); }).join("") +
          '</div><span class="chip dim">' + esc(cfg.badge) + '</span></div>' +
          '<div class="thread" id="thread" role="log" aria-live="polite" aria-label="Ask Gaurav conversation" tabindex="0"></div>' +
          '<form class="ask-form" id="ask-form">' +
            '<label class="sr" for="ask-input">Ask a question about Gaurav\'s work</label>' +
            '<input class="ask-input" id="ask-input" type="text" maxlength="300" autocomplete="off" enterkeyhint="send" placeholder="' + esc(cfg.placeholder) + '">' +
            '<button class="ask-send" type="submit">ASK →</button>' +
          '</form>' +
        '</div>' +
        '<div class="ask-side"><h3 class="step-label" id="prompts-label" style="margin:0">Suggested questions</h3>' +
          '<div class="prompt-list" id="prompts" role="group" aria-labelledby="prompts-label"></div></div>' +
      '</div>' +
      '<p class="api-note"><b>How this works.</b> ' + esc(cfg.explainer) + '</p>';

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
    /* every source chip lands on an element that exists — projects on their
       case, everything else on its section                                 */
    function sources(list) {
      var row = el("div", "src-row");
      row.appendChild(el("span", "lbl", "SOURCE:"));
      list.forEach(function (s) {
        var a = el("a", "chip gold", esc(s[0])); a.href = srcHref(s[1]); row.appendChild(a);
      });
      return row;
    }
    /* Corpus figures inside answers are {{tokens}} resolved from the generated
       corpus at render time, so they cannot drift from the repository.     */
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
    function structured(e) {
      var wrap = function (h) { return /^\s*</.test(h) ? h : "<p>" + h + "</p>"; };
      return '<dl class="answer">' +
        [["ROLE", e.role, ""], ["WORK", e.work, ""], ["EVIDENCE", e.evidence, ""], ["STATUS", e.status, " status"]].map(function (r) {
          return '<div class="ar' + r[2] + '"><dt>' + r[0] + '</dt><dd>' + corpusFigures(wrap(r[1])) + '</dd></div>';
        }).join("") + '</dl>';
    }

    function answer(q, entry) {
      if (askBusy) return; askBusy = true;
      var asked = addMsg("you", "<p>" + esc(q) + "</p>");
      var t = addMsg("gaurav", '<span class="typing" aria-label="Looking up the answer"><i></i><i></i><i></i></span>');
      var body = t.querySelector(".body"), d = reduce ? 0 : 1;
      trace(0);
      [[1, 160], [2, 320], [3, 480]].forEach(function (st) { setTimeout(function () { trace(st[0]); }, st[1] * d); });
      setTimeout(function () {
        if (entry === "no-evidence") {
          body.innerHTML = cfg.no_evidence_reply;
          body.appendChild(el("div", "grounded", "◆ NOT DOCUMENTED — NOTHING INVENTED"));
          GOS.track("copilot_question", "no_evidence_figure");
        } else if (entry) {
          body.innerHTML = structured(entry);
          body.appendChild(el("div", "grounded", "◆ FROM DOCUMENTED RECORDS"));
          body.appendChild(sources(entry.sources));
          GOS.track("copilot_question", entry.id);
        } else {
          body.innerHTML = cfg.refusal;
          body.appendChild(el("div", "grounded", "◆ NOT DOCUMENTED — NOTHING INVENTED"));
          GOS.track("copilot_question", "unanswered");
        }
        trace(entry && entry !== "no-evidence" ? 4 : -1);
        thread.scrollTop = asked.offsetTop - 12; askBusy = false;
        setTimeout(function () { trace(-1); }, 1400 * d);
      }, 600 * d);
    }
    /* Keys match whole words only, so "live" never matches "deliver" and
       "program" never matches "programming".
       The honesty guard runs first: a request for a figure that does not
       exist refuses even when the question names a project that does.     */
    function match(q) {
      var s = q.toLowerCase(), best = null, score = 0;
      if ((cfg.no_evidence_terms || []).some(function (t) { return s.indexOf(t) > -1; })) return "no-evidence";
      C.copilot_kb.forEach(function (e) {
        var n = 0;
        e.keys.forEach(function (k) {
          if (new RegExp("(^|[^a-z0-9])" + k.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&") + "($|[^a-z0-9])").test(s)) n += k.length;
        });
        if (s.indexOf(e.q.toLowerCase().slice(0, 18)) > -1) n += 40;
        if (n > score) { score = n; best = e; }
      });
      return score >= 4 ? best : null;
    }
    GOS.askMatch = match;

    var pl = document.getElementById("prompts");
    /* the homepage's three questions first, then the other suggestions */
    var order = cfg.home_order || [];
    C.copilot_kb.filter(function (e) { return e.suggested; }).sort(function (a, b) {
      var ia = order.indexOf(a.id), ib = order.indexOf(b.id);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    }).forEach(function (e) {
      var b = el("button", "prompt-btn", esc(e.q));
      b.type = "button";
      b.addEventListener("click", function () { answer(e.q, e); });
      pl.appendChild(b);
    });
    document.getElementById("ask-form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var inp = document.getElementById("ask-input"), q = inp.value.trim().slice(0, 300);
      if (!q || askBusy) return;
      inp.value = "";
      answer(q, match(q));
    });
    addMsg("gaurav", cfg.greeting);
    /* ?q=<answer id> — the homepage teaser links straight to an answer */
    var qid = (location.search.match(/[?&]q=([\w-]+)/) || [])[1];
    var pre = qid && C.copilot_kb.filter(function (e) { return e.id === qid; })[0];
    if (pre) answer(pre.q, pre);
  })();

  /* -------------------------------------------------------------- challenge */
  (function () {
    var m = document.getElementById("challenge-mount");
    if (!m) return;
    m.innerHTML = '<div class="eyebrow"><span class="num">R5</span> Product challenges</div>' +
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
    if (!m) return;
    var published = C.lab_notes.filter(function (n) { return n.published; });
    m.innerHTML = '<div class="eyebrow"><span class="num">R6</span> Lab Notes &amp; AI experiments</div>' +
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
        rl.href = caseHref(rel.id); rl.addEventListener("click", closeReader);
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

  /* ------------------------------------------------- analytics delegation */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("[data-ev]") : null;
    if (a) GOS.track(a.getAttribute("data-ev"));
  });

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
    v.src = u(C_i.video);
    if (C_i.poster) v.poster = u(C_i.poster);
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
      img.src = u(C_i.poster); img.alt = ""; img.className = "film";
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


  GOS.track("portfolio_view", PAGE);
})();
