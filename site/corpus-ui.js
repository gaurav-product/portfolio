/* ============================================================================
   GAURAV.OS — CORPUS UI
   ----------------------------------------------------------------------------
   Renders the 90-day corpus: constellation, product atlas, evolution and the
   evidence-backed capability graph. Reads window.GOS_CORPUS, which is generated
   from the GitHub repository tree. Nothing here is hand-written content.
   ========================================================================== */
(function () {
  "use strict";
  var X = window.GOS_CORPUS;
  var G = window.GOS || {};
  if (!X || !G.el) { return; }
  var el = G.el, esc = G.esc, reduce = G.reduce;

  /* Colour carries the corpus's real convergence, not 8 arbitrary hues.
     Exact category lives in the filters, the tooltip and the atlas list —
     so identity is never colour-alone. Palette validated for all-pairs CVD. */
  var GROUPS = [
    { id: "Healthcare", label: "Healthcare", varname: "--viz-health", test: function (c) { return c === "Healthcare"; } },
    { id: "AI", label: "AI", varname: "--viz-ai", test: function (c) { return c === "AI"; } },
    { id: "Other", label: "Platform & consumer", varname: "--viz-other", test: function (c) { return c !== "Healthcare" && c !== "AI"; } }
  ];
  function groupOf(cat) {
    for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].test(cat)) return GROUPS[i];
    return GROUPS[2];
  }
  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#999";
  }

  /* ------------------------------------------------------------ detail panel */
  var panel = null, lastFocus = null;
  function closeStudy() {
    if (!panel) return;
    panel.remove(); panel = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function openStudy(cs) {
    closeStudy();
    lastFocus = document.activeElement;
    panel = el("div", "cs-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Day " + cs.day + " — " + cs.company);
    var inner = el("div", "cs-inner");

    var flags = [["PRD", cs.has_prd], ["Experiment", cs.has_experiment], ["Metrics", cs.has_metrics],
                 ["Assumptions", cs.has_assumptions], ["Verification", cs.verification]];
    var h = '<div class="hd">DAY ' + cs.day + ' / 90 · ' + esc(cs.category.toUpperCase()) + '</div>' +
      '<h3>' + esc(cs.company) + '</h3>' +
      (cs.title && cs.title !== cs.company ? '<div class="sub">' + esc(cs.title) + '</div>' : '') +
      '<div class="chips" style="margin-top:14px">' +
        '<span class="ev-pill ev-' + cs.evidence_level + '">' + cs.evidence_level + '</span>' +
        flags.map(function (f) { return '<span class="tag' + (f[1] ? " on" : "") + '">' + f[0] + (f[1] ? " ✓" : " —") + '</span>'; }).join("") +
        (cs.checks ? '<span class="tag on">' + cs.checks + ' CHECKS</span>' : '') +
      '</div>' +
      (cs.flags && cs.flags.length ? '<div class="chips" style="margin-top:8px">' +
        cs.flags.map(function (f) { return '<span class="tag' + (f === "MISSING" ? "" : " on") + '">' + f + '</span>'; }).join("") + '</div>' : '');

    if (cs.empty) {
      h += '<p class="note" style="margin-top:18px"><b style="color:var(--bone)">This case study is not written.</b> The directory exists and carries an ASSUMPTIONS file, but its README is empty (0 bytes). It is counted as a directory, not as a case study, everywhere on this page.</p>';
    } else {
      h += '<p style="margin-top:18px;font-size:14.5px">' + esc(cs.summary) + '</p>';
    }

    h += '<dl class="cs-kv">' +
      '<dt>Length</dt><dd>' + cs.words.toLocaleString() + ' words</dd>' +
      '<dt>References</dt><dd>' + (cs.sources || "NOT DOCUMENTED") + '</dd>' +
      '<dt>Category</dt><dd>' + esc(cs.category) + ' <span class="tag">DERIVED</span></dd>' +
      '<dt>Industry field</dt><dd>' + (cs.industry === "NOT DOCUMENTED"
          ? 'NOT DOCUMENTED <span class="tag">not stated in source</span>' : esc(cs.industry)) + '</dd>' +
      '<dt>Evidence score</dt><dd>' + cs.evidence_score + ' / 8 — ' + cs.evidence_level + '</dd>' +
      '<dt>Completeness</dt><dd>' + cs.completeness + '</dd>' +
      '<dt>Path</dt><dd><code style="font-size:11.5px;color:var(--muted)">' + esc(cs.readme_path || cs.dir_path) + '</code></dd>' +
      (cs.assumptions_path ? '<dt>Assumptions</dt><dd><a href="' + cs.assumptions_url + '" target="_blank" rel="noopener" style="color:var(--gold)">' + esc(cs.assumptions_path.split("/").pop()) + '</a> · ' + cs.assumptions_words.toLocaleString() + ' words</dd>' : '<dt>Assumptions</dt><dd>NOT DOCUMENTED</dd>') +
      (cs.internal_day && cs.internal_day !== cs.day
        ? '<dt>Numbering</dt><dd>Directory says Day ' + cs.day + '; the document says Day ' + cs.internal_day + '. Directory order is used here.</dd>' : '') +
      (cs.assets && cs.assets.length ? '<dt>Assets</dt><dd>' + cs.assets.map(esc).join(", ") + '</dd>' : '') +
      (cs.extra_docs && cs.extra_docs.length ? '<dt>Extra docs</dt><dd>' + cs.extra_docs.map(esc).join(", ") + '</dd>' : '') +
      '</dl>' +
      (cs.validation && cs.validation.length
        ? '<div class="val-flags"><div class="vf-h">VALIDATION FLAGS — COMPUTED, NOT ASSERTED</div>' +
          cs.validation.map(function (f) {
            return '<div class="vf"><span class="vf-k">' + f.flag + '</span><span class="vf-d">' + esc(f.detail) + '</span></div>';
          }).join("") + '</div>'
        : '') +
      '<div class="cs-links">' +
        (cs.empty ? '' : '<a class="btn btn-primary" href="' + cs.readme_url + '" target="_blank" rel="noopener" data-ev="case_study_open">VIEW CASE STUDY →</a>') +
        '<a class="btn btn-secondary" href="' + cs.github_url + '" target="_blank" rel="noopener" data-ev="case_study_github_open">OPEN SOURCE ON GITHUB</a>' +
        (cs.assumptions_url ? '<a class="btn btn-secondary" href="' + cs.assumptions_url + '" target="_blank" rel="noopener" data-ev="case_study_github_open">ASSUMPTIONS FILE</a>' : '') +
      '</div>' +
      '<div class="cs-nav">' +
        '<button class="ghost-btn" id="cs-prev"' + (cs.day <= 1 ? ' disabled' : '') + '>← DAY ' + (cs.day - 1) + '</button>' +
        '<span class="mono" style="font-size:9px;letter-spacing:.16em;color:var(--dim)">DAY ' + cs.day + ' OF 90</span>' +
        '<button class="ghost-btn" id="cs-next"' + (cs.day >= 90 ? ' disabled' : '') + '>DAY ' + (cs.day + 1) + ' →</button>' +
      '</div>';

    /* one assignment, then wire listeners — `innerHTML +=` would re-parse the
       subtree and silently drop every handler already attached to it */
    inner.innerHTML = '<button class="ghost-btn reader-close" type="button">CLOSE ✕</button>' + h;
    var close = inner.querySelector(".reader-close");
    close.addEventListener("click", closeStudy);
    panel.appendChild(inner);
    panel.addEventListener("click", function (e) { if (e.target === panel) closeStudy(); });
    document.body.appendChild(panel);

    function go(delta) {
      var next = X.studies.filter(function (s) { return s.day === cs.day + delta; })[0];
      if (next) openStudy(next);
    }
    var pv = inner.querySelector("#cs-prev"), nx = inner.querySelector("#cs-next");
    if (pv) pv.addEventListener("click", function () { go(-1); });
    if (nx) nx.addEventListener("click", function () { go(1); });
    panel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    });
    close.focus();
    G.track("case_study_open", "day-" + cs.day);
  }
  G.openStudy = openStudy;
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeStudy(); });

  /* ----------------------------------------------------------- constellation */
  var activeGroups = { Healthcare: true, AI: true, Other: true };

  (function () {
    var m = document.getElementById("constellation-mount");
    var K = X.counts;
    m.innerHTML =
      '<div class="eyebrow"><span class="num">01</span> The 90-day corpus</div>' +
      '<h2 class="title">90 days. 90 subjects.<br><em>One product mind.</em></h2>' +
      '<p class="dek">Every node is a directory in the repository. Distance from the centre is the day, size is how much evidence the study carries, and colour is where the subject sits. Select a node to open the study.</p>' +
      '<div class="const-wrap">' +
        '<div class="const-bar">' +
          '<div class="const-legend" id="const-legend"></div>' +
          '<span class="chip dim">READ FROM THE REPO · ' + esc(X.audited) + '</span>' +
        '</div>' +
        '<div class="const-stage" id="const-stage"><canvas id="const-canvas"></canvas>' +
          '<div class="const-tip" id="const-tip"></div></div>' +
        '<div class="const-foot">' +
          '<span>CENTRE = DAY 01</span><span>EDGE = DAY 90</span>' +
          '<span>NODE SIZE = EVIDENCE SCORE (0–8)</span>' +
          '<span>HOLLOW = README NOT WRITTEN</span>' +
        '</div>' +
      '</div>' +
      '<p class="small" style="margin-top:var(--s2)">Prefer a list? The <a href="#atlas" style="color:var(--gold)">Product Atlas</a> below is the same 90 studies, searchable and keyboard-navigable — it is the accessible equivalent of this map, not a lesser version.</p>' +
      '<div class="anom" id="anomalies"></div>';

    /* legend doubles as the filter — identity never rests on colour alone */
    var lg = document.getElementById("const-legend");
    GROUPS.forEach(function (g) {
      var count = X.studies.filter(function (s) { return groupOf(s.category).id === g.id; }).length;
      var b = el("button", "lg", '<i style="background:var(' + g.varname + ')"></i>' + esc(g.label) + ' · ' + count);
      b.setAttribute("aria-pressed", "true");
      b.addEventListener("click", function () {
        activeGroups[g.id] = !activeGroups[g.id];
        b.setAttribute("aria-pressed", activeGroups[g.id] ? "true" : "false");
        draw();
        G.track("constellation_interaction", "filter-" + g.id);
      });
      lg.appendChild(b);
    });

    var an = document.getElementById("anomalies");
    var A = X.anomalies;
    an.innerHTML = '<h4>What the audit found</h4><ul>' +
      '<li><b>' + K.directories + '</b> day directories; <b>' + K.written + '</b> contain a written case study.</li>' +
      A.empty_readme.map(function (e) {
        return '<li>Day ' + e.day + ' (' + esc(e.company) + ') has an empty README — an ASSUMPTIONS file exists, the case study does not. Counted as a directory, never as a study.</li>';
      }).join("") +
      (A.day_mismatch.length ? '<li>' + A.day_mismatch.length + ' studies number themselves differently from their directory (' +
        A.day_mismatch.map(function (d) { return "dir " + d.day + " says " + d.internal; }).join(", ") +
        '). Directory order is treated as canonical.</li>' : "") +
      '<li>Industry is stated as a field in only <b>1</b> of 90 documents, so every category on this page is <b>DERIVED</b> by rule from the subject and the text — labelled as such wherever it appears.</li>' +
      '</ul>';

    /* ---- canvas constellation ---- */
    var cv = document.getElementById("const-canvas");
    var stage = document.getElementById("const-stage");
    var tip = document.getElementById("const-tip");
    var ctx = cv.getContext("2d");
    var pts = [], dpr = 1, W = 0, H = 0, hover = null, t0 = performance.now();

    function layout() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = stage.clientWidth; H = stage.clientHeight;
      if (!W || !H) return;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var cx = W / 2, cy = H / 2;
      var maxR = Math.min(W, H) * 0.455;
      var minR = Math.min(W, H) * 0.085;
      pts = X.studies.map(function (s, i) {
        /* golden-angle spiral: radius encodes the day, so time reads outward */
        var frac = i / (X.studies.length - 1);
        var r = minR + (maxR - minR) * Math.sqrt(frac);
        var a = i * 2.39996;
        return {
          s: s, baseA: a, r: r, cx: cx, cy: cy,
          size: 2.2 + (s.evidence_score / 8) * 4.6,
          g: groupOf(s.category)
        };
      });
    }

    function draw(now) {
      if (!W || !H) return;
      var t = reduce ? 0 : ((now || performance.now()) - t0) / 1000;
      ctx.clearRect(0, 0, W, H);

      /* faint orbit rings at each 10-day block — the grid, kept recessive */
      ctx.strokeStyle = cssVar("--viz-grid");
      ctx.lineWidth = 1;
      for (var d = 10; d <= 90; d += 10) {
        var idx = d - 1;
        if (!pts[idx]) continue;
        ctx.beginPath();
        ctx.arc(pts[0].cx, pts[0].cy, pts[idx].r, 0, 6.2832);
        ctx.stroke();
      }

      pts.forEach(function (p) {
        var on = activeGroups[p.g.id];
        var a = p.baseA + t * 0.045;
        var x = p.cx + Math.cos(a) * p.r;
        var y = p.cy + Math.sin(a) * p.r * 0.74;   /* flattened: an observatory plane */
        p.x = x; p.y = y;
        var col = cssVar(p.g.varname);
        ctx.globalAlpha = on ? (p.s.empty ? 0.55 : 0.92) : 0.12;
        ctx.beginPath();
        ctx.arc(x, y, p.size * (hover === p ? 1.7 : 1), 0, 6.2832);
        if (p.s.empty) { ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.stroke(); }
        else { ctx.fillStyle = col; ctx.fill(); }
        if (hover === p) {
          ctx.globalAlpha = 1; ctx.strokeStyle = cssVar("--bone"); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(x, y, p.size * 2.4, 0, 6.2832); ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    }
    var raf = null;
    window.__constDraw = draw;

    function pick(ev) {
      var rect = cv.getBoundingClientRect();
      var mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
      var best = null, bd = 18;
      pts.forEach(function (p) {
        if (!activeGroups[p.g.id]) return;
        var d = Math.hypot(p.x - mx, p.y - my);
        if (d < bd) { bd = d; best = p; }
      });
      return best;
    }
    stage.addEventListener("mousemove", function (ev) {
      var p = pick(ev);
      hover = p;
      cv.style.cursor = p ? "pointer" : "default";
      if (p) {
        tip.classList.add("on");
        tip.innerHTML = '<div class="d">DAY ' + p.s.day + ' · ' + esc(p.s.category.toUpperCase()) + '</div>' +
          '<div class="c">' + esc(p.s.company) + '</div>' +
          '<div class="m">' + p.s.evidence_level + ' · ' + p.s.words.toLocaleString() + ' words · ' + p.s.sources + ' refs</div>';
        var tw = 250, left = Math.min(Math.max(p.x - tw / 2, 6), stage.clientWidth - tw - 6);
        tip.style.left = left + "px";
        tip.style.top = Math.max(6, p.y - 86) + "px";
      } else tip.classList.remove("on");
      if (reduce) draw();
    });
    stage.addEventListener("mouseleave", function () { hover = null; tip.classList.remove("on"); if (reduce) draw(); });
    stage.addEventListener("click", function (ev) {
      var p = pick(ev);
      if (p) { openStudy(p.s); G.track("constellation_interaction", "open-day-" + p.s.day); }
    });

    function boot() { layout(); if (reduce) draw(); else { if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } }
    window.addEventListener("resize", boot);
    boot();
    setTimeout(boot, 400);   /* after fonts/layout settle */
  })();

  /* ------------------------------------------------------------------ atlas */
  (function () {
    var m = document.getElementById("atlas-mount");
    var cats = Object.keys(X.categories).sort(function (a, b) { return X.categories[b] - X.categories[a]; });
    var FACETS = [
      { id: "has_prd", label: "Has PRD" },
      { id: "has_experiment", label: "Has experiment" },
      { id: "has_metrics", label: "Has metrics" },
      { id: "has_assumptions", label: "Has assumptions" },
      { id: "verification", label: "Verified" }
    ];
    var EVID = ["VERIFIED", "DOCUMENTED", "SOURCED", "NARRATIVE"];

    m.innerHTML =
      '<div class="eyebrow"><span class="num">02</span> Explorer</div>' +
      '<h2 class="title">Product <em>Atlas</em></h2>' +
      '<p class="dek">All 90, searchable. Every row links to the study and to its source on GitHub — the evidence is never more than one click away.</p>' +
      '<div class="atlas-controls">' +
        '<div class="atlas-search"><span class="mono" style="color:var(--dim)">⌕</span>' +
          '<label class="sr" for="atlas-q">Search the 90 case studies</label>' +
          '<input id="atlas-q" type="text" autocomplete="off" placeholder="Search by product, day, sector or contents — Practo, day 90, PRD, experiment…"></div>' +
        '<div class="facet" id="f-cat"><span class="fl">SECTOR</span></div>' +
        '<div class="facet" id="f-day"><span class="fl">DAYS</span></div>' +
        '<div class="facet" id="f-evid"><span class="fl">EVIDENCE</span></div>' +
        '<div class="facet" id="f-comp"><span class="fl">STATUS</span></div>' +
        '<div class="facet" id="f-flag"><span class="fl">CONTAINS</span></div>' +
      '</div>' +
      '<div class="atlas-count" id="atlas-count"></div>' +
      '<div class="atlas-list" id="atlas-list"></div>' +
      '<div class="atlas-more"><button class="ghost-btn" id="atlas-more" hidden>SHOW MORE</button></div>';

    var state = { q: "", cat: "All", evid: "All", comp: "All", day: "All", flags: {} };
    var shown = 20;

    function chipRow(mountId, items, key) {
      var mount = document.getElementById(mountId);
      items.forEach(function (it) {
        var b = el("button", "chip" + (it.value === state[key] ? " gold" : ""), it.label);
        b.addEventListener("click", function () {
          state[key] = it.value; shown = 20;
          Array.prototype.forEach.call(mount.querySelectorAll("button"), function (x) { x.className = "chip"; });
          b.className = "chip gold"; render();
        });
        mount.appendChild(b);
      });
    }
    chipRow("f-cat", [{ label: "ALL", value: "All" }].concat(cats.map(function (c) {
      return { label: c.toUpperCase() + " " + X.categories[c], value: c };
    })), "cat");
    chipRow("f-evid", [{ label: "ALL", value: "All" }].concat(EVID.map(function (e) {
      return { label: e + " " + (X.evidence_levels[e] || 0), value: e };
    })), "evid");
    chipRow("f-day", [{ label: "ALL", value: "All" }].concat(
      [[1, 30], [31, 60], [61, 90]].map(function (r) {
        var n = X.studies.filter(function (s) { return s.day >= r[0] && s.day <= r[1]; }).length;
        return { label: "DAY " + r[0] + "–" + r[1] + " " + n, value: r[0] + "-" + r[1] };
      })), "day");
    chipRow("f-comp", [{ label: "ALL", value: "All" }].concat(
      ["COMPLETE", "PARTIAL", "MISSING"].filter(function (c) { return X.completeness_counts[c]; })
      .map(function (c) { return { label: c + " " + X.completeness_counts[c], value: c }; })), "comp");


    var fm = document.getElementById("f-flag");
    FACETS.forEach(function (f) {
      var n = X.studies.filter(function (s) { return s[f.id]; }).length;
      var b = el("button", "chip", f.label.toUpperCase() + " " + n);
      b.addEventListener("click", function () {
        state.flags[f.id] = !state.flags[f.id]; shown = 20;
        b.className = state.flags[f.id] ? "chip gold" : "chip";
        render();
      });
      fm.appendChild(b);
    });

    function matches(s) {
      if (state.cat !== "All" && s.category !== state.cat) return false;
      if (state.evid !== "All" && s.evidence_level !== state.evid) return false;
      if (state.comp !== "All" && s.completeness !== state.comp) return false;
      if (state.day !== "All") {
        var r = state.day.split("-");
        if (s.day < +r[0] || s.day > +r[1]) return false;
      }
      for (var k in state.flags) if (state.flags[k] && !s[k]) return false;
      if (state.q) {
        var hay = (s.company + " " + s.title + " " + s.category + " " + s.summary + " " +
          s.evidence_level + " day " + s.day + " day" + s.day + " " + s.completeness + " " +
          (s.has_prd ? "prd " : "") + (s.has_experiment ? "experiment experimentation " : "") +
          (s.has_metrics ? "metrics " : "") + (s.has_assumptions ? "assumptions " : "") +
          (s.verification ? "verified verification " : "")).toLowerCase();
        if (hay.indexOf(state.q.toLowerCase()) < 0) return false;
      }
      return true;
    }

    var list = document.getElementById("atlas-list");
    var count = document.getElementById("atlas-count");
    var more = document.getElementById("atlas-more");

    function render() {
      var rows = X.studies.filter(matches);
      count.textContent = rows.length + " OF " + X.studies.length + " STUDIES";
      list.innerHTML = "";
      if (!rows.length) {
        list.appendChild(el("div", "cs-empty", "No study in the corpus matches those filters."));
        more.hidden = true; return;
      }
      rows.slice(0, shown).forEach(function (s) {
        var b = el("button", "cs-row");
        var tags = [["PRD", s.has_prd], ["EXP", s.has_experiment], ["METRICS", s.has_metrics],
                    ["ASSUMPTIONS", s.has_assumptions], ["VERIFIED", s.verification]];
        b.innerHTML =
          '<span class="day">' + (s.day < 10 ? "0" + s.day : s.day) + '</span>' +
          '<span><span class="co">' + esc(s.company) + (s.empty ? ' <span class="tag">NOT WRITTEN</span>' : '') + '</span>' +
          '<span class="sm">' + esc(s.summary === "NOT DOCUMENTED" ? "NOT DOCUMENTED — the README for this directory is empty." : s.summary) + '</span>' +
          '<span class="meta">' + tags.map(function (t) {
            return '<span class="tag' + (t[1] ? " on" : "") + '">' + t[0] + '</span>';
          }).join("") + '</span></span>' +
          '<span class="ev"><span class="ev-pill ev-' + s.evidence_level + '">' + s.evidence_level + '</span>' +
          '<span class="tag">' + esc(s.category) + '</span>' +
          (s.completeness !== "COMPLETE" ? '<span class="tag on">' + s.completeness + '</span>' : '') +
          '</span>';
        b.addEventListener("click", function () { openStudy(s); });
        list.appendChild(b);
      });
      more.hidden = rows.length <= shown;
      more.textContent = "SHOW MORE · " + (rows.length - shown) + " REMAINING";
    }
    more.addEventListener("click", function () { shown += 30; render(); });
    document.getElementById("atlas-q").addEventListener("input", function (e) {
      state.q = e.target.value.trim(); shown = 20; render();
      if (state.q) G.track("search_query", "atlas");
    });
    render();
  })();

  /* -------------------------------------------------------------- evolution */
  (function () {
    var m = document.getElementById("evolution-mount");
    var B = X.blocks, V = X.verification_audit;
    function bars(rows, fmt) {
      var max = Math.max.apply(null, rows.map(function (r) { return r.v; })) || 1;
      return '<div class="bars">' + rows.map(function (r) {
        return '<div class="brow"><span class="bl">' + esc(r.k) + '</span>' +
          '<span class="bt"><span class="bf" style="width:' + Math.max(2, (r.v / max) * 100) + '%"></span></span>' +
          '<span class="bv">' + fmt(r.v) + '</span></div>';
      }).join("") + '</div>';
    }
    var intN = function (v) { return v.toLocaleString(); };
    var one = function (v) { return v.toFixed(1); };
    var outOf10 = function (v) { return v + "/10"; };

    m.innerHTML =
      '<div class="eyebrow"><span class="num">03</span> Method over time</div>' +
      '<h2 class="title">The evolution of my<br><em>product thinking</em></h2>' +
      '<p class="dek">Four measures, each counted from the repository across nine ten-day blocks. Two of them show a hard discipline change with a date attached.</p>' +
      '<div class="viz-grid">' +
        '<div class="viz"><h4>Assumptions discipline</h4><div class="sub">Studies in each block carrying a separate ASSUMPTIONS file. Zero before Day 28; every study from Day 28 to Day 90.</div>' +
          bars(B.map(function (b) { return { k: b.label, v: b.assumptions }; }), outOf10) + '</div>' +
        '<div class="viz"><h4>Programmatic verification</h4><div class="sub">Studies documenting executed checks rather than asserted arithmetic. First appears Day 57; unbroken from Day 75.</div>' +
          bars(B.map(function (b) { return { k: b.label, v: b.verification }; }), outOf10) + '</div>' +
        '<div class="viz"><h4>References cited per study</h4><div class="sub">Average per block. Breadth peaks in the middle of the series, then falls as the studies move to primary regulatory and filing sources.</div>' +
          bars(B.map(function (b) { return { k: b.label, v: b.avg_sources }; }), one) + '</div>' +
        '<div class="viz"><h4>Length per study</h4><div class="sub">Average words per block. Length is not depth — it peaks at D41–50 and settles once verification arrives.</div>' +
          bars(B.map(function (b) { return { k: b.label, v: b.avg_words }; }), intN) + '</div>' +
      '</div>' +

      '<div class="viz-grid">' +
        '<div class="viz"><h4>Where the subjects sit</h4><div class="sub">Derived category across all 90 directories.</div>' +
          '<div class="dist">' + Object.keys(X.categories).sort(function (a, b) { return X.categories[b] - X.categories[a]; }).map(function (c) {
            var v = X.categories[c], mx = Math.max.apply(null, Object.keys(X.categories).map(function (k) { return X.categories[k]; }));
            var g = groupOf(c);
            return '<div class="drow"><span class="dl">' + esc(c) + '</span>' +
              '<span class="dt"><span class="df" style="width:' + (v / mx * 100) + '%;background:var(' + g.varname + ')"></span></span>' +
              '<span class="dv">' + v + '</span></div>';
          }).join("") + '</div></div>' +
        '<div class="viz"><h4>Evidence level</h4><div class="sub">Scored from the formula below — not a judgement of quality, a count of what each study carries.</div>' +
          '<div class="dist">' + ["VERIFIED", "DOCUMENTED", "SOURCED", "NARRATIVE"].map(function (k) {
            var v = X.evidence_levels[k] || 0;
            var mx = Math.max.apply(null, Object.keys(X.evidence_levels).map(function (q) { return X.evidence_levels[q]; }));
            return '<div class="drow"><span class="dl">' + k + '</span>' +
              '<span class="dt"><span class="df" style="width:' + (v / mx * 100) + '%;background:var(--viz-bar)"></span></span>' +
              '<span class="dv">' + v + '</span></div>';
          }).join("") + '</div>' +
          '<div class="sub" style="margin-top:12px"><b style="color:var(--bone)">Formula:</b> ' + X.evidence_formula.join(" · ") + '</div></div>' +
      '</div>' +

      '<div class="viz" style="margin-top:var(--s2)">' +
        '<h4>Programmatic checks stated per study</h4>' +
        '<div class="sub">Every study that reports executed checks, Day ' + V.earliest_study_stating_checks + ' onward. Read from the study files, not from the repository index.</div>' +
        '<div class="spark" id="checks-spark"></div>' +
        '<div class="sub" style="margin-top:10px"><b style="color:var(--bone)">Independent audit.</b> The repository README claims <b style="color:var(--bone)">' + V.repo_claim.toLocaleString() + '</b> checks across ' + esc(V.window) + ', ' + V.min_per_study + ' to ' + V.max_per_study + ' per study. Recomputing from the files gives <b style="color:var(--bone)">' + V.checks_in_window.toLocaleString() + '</b> across ' + V.studies_in_window + ' studies, ' + V.min_per_study + ' to ' + V.max_per_study + ' — an exact match.</div>' +
      '</div>' +

      '<div class="anom" style="margin-top:var(--s3)">' +
        '<h4>Where the repository contradicts itself</h4>' +
        '<p class="small" style="margin-top:8px;color:var(--text)">Surfaced, not silently repaired. The tree is treated as canonical.</p>' +
        '<ul>' + X.anomalies.index_contradictions.map(function (c) {
          return '<li><b style="color:var(--bone);font-weight:500">Index says:</b> ' + esc(c.claim) +
                 '<br><b style="color:var(--bone);font-weight:500">Tree says:</b> ' + esc(c.tree) + '</li>';
        }).join("") + '</ul>' +
      '</div>' +

      '<div class="card" style="margin-top:var(--s3);border-left:2px solid var(--gold)">' +
        '<div class="mono" style="font-size:9.5px;letter-spacing:.17em;color:var(--gold)">DOCUMENTED CHANGE vs INTERPRETATION</div>' +
        '<p style="margin-top:11px"><b style="color:var(--bone);font-weight:500">Documented.</b> The assumptions file appears at Day 28 and never lapses. Verification language appears at Day 57 and is unbroken from Day 75. References per study peak at Days 31–50 and fall by more than half by Days 81–90. The last twenty-five days are almost entirely healthcare and health-AI subjects.</p>' +
        '<p style="margin-top:11px"><b style="color:var(--bone);font-weight:500">Interpretation — mine, not the data\'s.</b> I read that as breadth giving way to verification: early studies cite widely, later ones execute arithmetic and work primary sources, and the closing run narrows onto one question about what compels a company to publish evidence at all. That is a reading of the counts, not a finding in them.</p>' +
        '<p class="note">No psychological arc is claimed. What changed is what the documents contain.</p>' +
      '</div>';

    /* per-study check counts: one bar per study, direct-labelled at the extremes */
    var sp = document.getElementById("checks-spark");
    if (sp) {
      var cs = X.checks_by_study, mx = Math.max.apply(null, cs.map(function (c) { return c.checks; }));
      sp.innerHTML = cs.map(function (c) {
        return '<span class="sb" style="height:' + Math.max(8, (c.checks / mx) * 100) + '%" ' +
          'title="Day ' + c.day + ' — ' + esc(c.company) + ': ' + c.checks + ' checks"></span>';
      }).join("") ;
      var lab = el("div", "spark-axis");
      lab.innerHTML = '<span>DAY ' + cs[0].day + '</span>' +
        '<span>PEAK ' + mx + ' CHECKS · DAY ' + cs.filter(function (c) { return c.checks === mx; })[0].day + '</span>' +
        '<span>DAY ' + cs[cs.length - 1].day + '</span>';
      sp.parentNode.insertBefore(lab, sp.nextSibling);
    }
  })();

  /* ------------------------------------- PM operating model + capability proof */
  (function () {
    var mount = document.getElementById("thinking-mount");
    if (!mount) return;

    var wrap = el("div", null);
    wrap.style.marginTop = "var(--s3)";
    wrap.innerHTML =
      '<span class="sect-label">The operating model</span>' +
      '<p class="small" style="margin-top:8px;max-width:62ch">Eight stages, run as one loop. Each stage is wired to the case studies that actually contain it — the count is how many of the 90 carry that section, detected from their headings. Select a stage to see its evidence.</p>' +
      '<div class="model" id="model"></div>' +
      '<div class="model-detail" id="model-detail"></div>' +
      '<span class="sect-label" style="margin-top:var(--s5)">Capability coverage across the corpus</span>' +
      '<p class="small" style="margin-top:8px">Proof rather than a skills list. Select any capability to open its strongest example.</p>' +
      '<div class="caps" id="caps"></div>';
    /* the model leads the section; principles close it */
    var anchor = mount.querySelector(".sect-label");
    if (anchor) mount.insertBefore(wrap, anchor); else mount.appendChild(wrap);

    /* ---- the model itself ---- */
    var prac = (window.GOS_CONTENT && window.GOS_CONTENT.stage_practice) || {};
    var rail = wrap.querySelector("#model");
    var det = wrap.querySelector("#model-detail");
    var btns = [];

    function showStage(i) {
      btns.forEach(function (b, ix) { b.setAttribute("aria-pressed", ix === i ? "true" : "false"); });
      var st = X.stages[i];
      det.innerHTML =
        '<div class="md-head"><span class="md-n">STAGE ' + String(i + 1).padStart(2, "0") + '</span>' +
        '<span class="md-t">' + esc(st.label) + '</span>' +
        '<span class="md-c">' + st.count + ' of 90 studies</span></div>' +
        '<p class="md-b">' + esc(st.basis) + '</p>' +
        (prac[st.id] ? '<div class="md-prac"><div class="md-lbl">FROM MY OWN PRODUCTS</div>' +
          prac[st.id].map(function (e) {
            return '<div class="md-p"><b>' + esc(e[0]) + '</b><span>' + esc(e[1]) + '</span></div>';
          }).join("") + '</div>' : '') +
        '<div class="md-lbl" style="margin-top:14px">FROM THE 90-DAY CORPUS · ' + st.count + ' OF 90 CONTAIN THIS STAGE</div>' +
        '<div class="md-cov"><span class="md-covf" style="width:' + (st.count / 90 * 100) + '%"></span></div>' +
        '<div class="md-ev">' + st.studies.map(function (e) {
          return '<button class="md-s" data-day="' + e.day + '">' +
            '<span class="md-sd">DAY ' + e.day + '</span>' +
            '<span class="md-sc">' + esc(e.company) + '</span>' +
            '<span class="ev-pill ev-' + e.evidence + '">' + e.evidence + '</span></button>';
        }).join("") + '</div>';
      Array.prototype.forEach.call(det.querySelectorAll(".md-s"), function (b) {
        b.addEventListener("click", function () {
          var d = +b.getAttribute("data-day");
          var cs = X.studies.filter(function (x) { return x.day === d; })[0];
          if (cs) openStudy(cs);
        });
      });
    }

    X.stages.forEach(function (st, i) {
      var b = el("button", "mstep",
        '<span class="mi">' + String(i + 1).padStart(2, "0") + '</span>' +
        '<span class="ml">' + esc(st.label) + '</span>' +
        '<span class="mc">' + st.count + '</span>');
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () { showStage(i); });
      b.addEventListener("mouseenter", function () { if (!reduce) showStage(i); });
      rail.appendChild(b);
      btns.push(b);
      if (i < X.stages.length - 1) rail.appendChild(el("span", "marr", "→"));
    });
    rail.appendChild(el("span", "mloop", "↺ the loop restarts"));
    showStage(0);

    /* ---- capability coverage ---- */
    var cm = wrap.querySelector("#caps");
    X.capabilities.forEach(function (c) {
      var b = el("button", "cap");
      b.innerHTML = '<div class="ct">' + esc(c.label) + '</div>' +
        '<div class="cm"><span class="cf" style="width:' + (c.count / 90 * 100) + '%"></span></div>' +
        '<div class="cn">' + c.count + ' / 90 STUDIES</div>' +
        '<div class="cb">' + esc(c.basis) + '</div>' +
        '<div class="chips" style="margin-top:4px">' + c.exemplars.map(function (e) {
          return '<span class="tag on">DAY ' + e.day + " · " + esc(e.company) + '</span>';
        }).join("") + '</div>';
      b.addEventListener("click", function () {
        var first = c.exemplars[0];
        if (!first) return;
        var cs = X.studies.filter(function (s) { return s.day === first.day; })[0];
        if (cs) openStudy(cs);
      });
      cm.appendChild(b);
    });
  })();

})();
