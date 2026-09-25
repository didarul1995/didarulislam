(function () {
  "use strict";
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- theme ---------------- */
  var tt = document.querySelector(".theme-toggle");
  function isDark() {
    var s = root.getAttribute("data-theme");
    if (s) return s === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function labelTheme() { if (tt) tt.querySelector(".tt-label").textContent = isDark() ? "Light theme" : "Dark theme"; }
  labelTheme();
  if (tt) tt.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("di-theme", next); } catch (e) {}
    labelTheme(); draw();
  });

  var yEl = document.getElementById("year");
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---------------- scrollspy ---------------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  function spy() {
    var y = window.scrollY + 140, cur = secs[0];
    secs.forEach(function (s) { if (s.offsetTop <= y) cur = s; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) cur = secs[secs.length - 1];
    links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + cur.id); });
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();

  /* ---------------- publications ---------------- */
  var THEMES = [
    ["growth", "Urban growth and sprawl"], ["informatics", "Urban informatics"], ["heat", "Urban heat and climate zones"],
    ["climate", "Climate impacts and hazards"], ["migration", "Migration and displacement"], ["green", "Green equity"],
    ["carbon", "Forests, wildfire, and blue carbon"], ["agri", "Agriculture and food security"], ["geoai", "Explainable GeoAI"]
  ];
  var TN = {}; THEMES.forEach(function (t) { TN[t[0]] = t[1]; });
  var TYPE = { journal: "Journal article", review: "Under review", proc: "Conference paper", chapter: "Book chapter", talk: "Presentation" };
  var ORDER = { journal: 0, review: 1, chapter: 2, proc: 3, talk: 4 };

  var PUBS = [
    { y: 2026, type: "journal", t: ["carbon", "climate"], a: "Islam, M.D.*, Johnson, A.S., Miesel, J., Dickinson, M., Stevens, J.", title: "High-Resolution Multi-Temporal Forest Canopy Height Mapping in California Using GEDI LiDAR and Multi-Sensor Remote Sensing", v: "Science of Remote Sensing, 14, 100488", doi: "10.1016/j.srs.2026.100488" },
    { y: 2026, type: "journal", t: ["heat", "geoai"], a: "Islam, M.D.*, Di, L., Zhang, C.", title: "A Scalable Automated Framework for Local Climate Zone Mapping Using Multisource Remote Sensing and Hierarchical Machine Learning", v: "Urban Climate", doi: "10.1016/j.uclim.2026.103032" },
    { y: 2026, type: "journal", t: ["carbon", "climate"], a: "Islam, M.D.*, Sultana, M., Aboulola, O.I.", title: "Blue-Carbon Monitoring in the Sundarbans: 10 m Canopy Height and Biomass from GEDI LiDAR and Multi-Sensor Fusion, 2016–2024", v: "Remote Sensing Applications: Society and Environment", doi: "10.1016/j.rsase.2026.102099" },
    { y: 2026, type: "review", t: ["agri"], a: "Zhang, C., Di, L., Sesmero, J.P., He, C., Du, Q., Yang, H., Lin, X., Heo, G., Yu, E.G., Islam, M.D., Yang, Z., Gao, F.", title: "Operationalizing Crop Condition Monitoring for the Conterminous United States with CropSmart Digital Twin Decision-Ready Information Service", v: "Geoscience Data Journal" },
    { y: 2026, type: "talk", t: ["carbon"], a: "Islam, M.D., Miesel, J., Dickinson, M., Stevens, J.", title: "Above-Ground Biomass Mapping in California Using GEDI LiDAR and Multi-Sensor Fusion", v: "AGU Annual Meeting (abstract accepted)" },
    { y: 2026, type: "talk", t: ["carbon"], a: "Islam, M.D., Miesel, J., Dickinson, M., Stevens, J.", title: "Multi-Temporal Canopy Height Mapping in California Using GEDI LiDAR and Multi-Sensor Remote Sensing", v: "Association for Fire Ecology (abstract accepted)" },
    { y: 2025, type: "review", t: ["green", "heat", "migration"], a: "Sultana, M., Islam, M.D.", title: "Triple Burden: A Composite Spatial Index Integrating Heat Vulnerability, Tree Canopy Deficit, and Green Displacement Risk Across Ten Major U.S. Cities", v: "Manuscript under review" },
    
    { y: 2025, type: "journal", t: ["heat", "informatics", "geoai"], a: "Sultana, M., Islam, M.D.*, Johnson, B.", title: "Understanding Urban Heat Patterns in Dhaka City Using Explainable GeoAI and Satellite-Derived LST", v: "Urban Informatics", doi: "10.1007/s44212-026-00110-5" },
    { y: 2025, type: "talk", t: ["geoai"], a: "Islam, M.D., Sultana, M.", title: "Hierarchical Spatial Machine Learning: A Two-Stage Framework for Balancing Spatial Generalizability and Spatial Dependency for Large-Scale Mapping", v: "AAG Annual Meeting" },
    { y: 2024, type: "journal", t: ["heat", "geoai"], a: "Islam, M.D.*, Di, L., Zhang, C., Yang, R., Qu, J., Tong, D., Guo, L., Lin, L., Pandey, A.", title: "A Decision Rule and Machine Learning-Based Hybrid Approach for Automated Land-Cover Type Local Climate Zones (LCZs) Mapping Using Multi-Source Remote Sensing Data", v: "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing", doi: "10.1109/JSTARS.2024.3386389" },
    { y: 2024, type: "journal", t: ["growth"], a: "Lin, L., Di, L., Zhang, C., Guo, L., Zhao, H., Islam, M.D., Li, H.J., Liu, Z.A., Middleton, G.", title: "Modeling Urban Redevelopment: A Novel Approach Using Time-Series Remote Sensing Data and Machine Learning", v: "Geography and Sustainability", doi: "10.1016/j.geosus.2024.02.001" },
    { y: 2024, type: "talk", t: ["agri"], a: "Di, L., Sesmero, J., Yang, H., Lin, X., He, C., Du, J., Yang, Z., Gao, F., Zhang, C., Heo, G., Yu, E., Liu, Z., Islam, M.D.", title: "CropSmart: An Operational Digital Twin for Enabling Data-Driven Smart Cropping Decision-Making Nationwide", v: "AGU Annual Meeting" },
    { y: 2023, type: "journal", t: ["agri", "climate"], a: "Islam, M.D.*, Di, L., Qamer, F.M., Shrestha, S., Guo, L., Lin, L., Mayer, T.J., Phalke, A.R.", title: "Rapid Rice Yield Estimation Using Integrated Remote Sensing and Meteorological Data and Machine Learning", v: "Remote Sensing, 15(9), 2374", doi: "10.3390/rs15092374" },
    { y: 2023, type: "chapter", t: ["climate", "geoai"], a: "Alnuaim, A., Sun, Z., Islam, M.D.", title: "AI for Improving Ozone Forecasting", v: "Artificial Intelligence in Earth Science, Elsevier, 247–269", doi: "10.1016/b978-0-323-91737-7.00002-5" },
    { y: 2023, type: "proc", t: ["agri", "geoai"], a: "Zhang, C., Marfatia, P., Farhan, H., Di, L., Lin, L., Zhao, H., Islam, M.D., Yang, Z.", title: "Enhancing USDA NASS Cropland Data Layer with Segment-Anything Model", v: "11th International Conference on Agro-Geoinformatics" },
    { y: 2022, type: "journal", t: ["geoai"], a: "Islam, M.D.*, Li, B., Lee, C., Wang, X.", title: "Incorporating Spatial Information in Machine Learning: The Moran Eigenvector Spatial Filter Approach", v: "Transactions in GIS, 26(2), 902–922", doi: "10.1111/tgis.12894" },
    { y: 2022, type: "journal", t: ["informatics", "geoai"], a: "Islam, M.D.*, Li, B., Islam, K., Ahasan, R., Mia, M., Haque, M.", title: "Airbnb Rental Price Modeling Based on Latent Dirichlet Allocation and MESF-XGBoost Composite Model", v: "Machine Learning with Applications, 7, 100208", doi: "10.1016/j.mlwa.2021.100208" },
    { y: 2022, type: "journal", t: ["migration", "heat", "growth"], a: "Bappa, S., Malaker, T., Mia, M., Islam, M.D.*", title: "Spatio-Temporal Variation of Land Use and Land Cover Changes and Their Impact on Land Surface Temperature: A Case of Kutupalong Refugee Camp, Bangladesh", v: "Heliyon, 8(9)", doi: "10.1016/j.heliyon.2022.e10449" },
    { y: 2022, type: "proc", t: ["carbon", "climate"], a: "Islam, M.D., Di, L., Mia, M., Sithi, M.", title: "Deforestation Mapping of Sundarbans Using Multi-Temporal Sentinel-2 Data and Transfer Learning", v: "10th International Conference on Agro-Geoinformatics" },
    { y: 2021, type: "journal", t: ["growth", "geoai"], a: "Islam, M.D.*, Islam, K., Ahasan, R., Mia, M., Haque, M.", title: "A Data-Driven Machine Learning-Based Approach for Urban Land Cover Change Modeling: A Case of Khulna City Corporation Area", v: "Remote Sensing Applications: Society and Environment, 24, 100634", doi: "10.1016/j.rsase.2021.100634" },
    { y: 2021, type: "journal", t: ["informatics", "growth"], a: "Mia, M.R., Islam, K.S., Islam, M.D.", title: "Automatic Building Footprint Extraction from High-Resolution Stereo Satellite Image", v: "Plan Plus, 11(1)", doi: "10.54470/planplus.v11i1.2" },
    { y: 2019, type: "proc", t: ["heat"], a: "Islam, M.D., Islam, K.S., Chakraborti, T., Alam, M.S.", title: "Urban Heat Island Effect Analysis Using Integrated Geospatial Techniques: A Case Study of Khulna City, Bangladesh", v: "International Conference on Climate Change (ICCC 2019)" },
    { y: 2019, type: "proc", t: ["climate"], a: "Chakraborty, T., Alam, M.S., Islam, M.D.", title: "Landslide Susceptibility Mapping Using XGBoost Model in Chittagong District, Bangladesh", v: "International Conference on Disaster Risk Management, Dhaka" },
    { y: 2019, type: "proc", t: ["growth", "geoai"], a: "Chakraborty, T., Alam, M.S., Islam, M.D.", title: "Land Cover Classification from Multispectral Remote Sensing Image Using KNN, DNN, Random Forest and SVM Algorithms", v: "International Conference on Urban and Regional Planning" },
    { y: 2019, type: "proc", t: ["climate"], a: "Alam, M.S., Chakraborty, T., Islam, M.D.", title: "Assessment of Social Vulnerability to Flood Hazard Using NFVI Framework in Satkhira District, Bangladesh", v: "International Conference on Disaster Risk Management, Dhaka" },
    { y: 2019, type: "proc", t: ["climate", "green", "migration"], a: "Alam, M.S., Chakraborty, T., Islam, M.D.", title: "Community Resilience of Urban Slums to Climate Change-Induced Events: A Case Study of Five Major Slums in Khulna City, Bangladesh", v: "International Conference on Climate Change (ICCC 2019)" }
  ];

  var state = { theme: "", type: "all", all: false };
  var sel = document.querySelector(".theme-select");
  var listEl = document.querySelector(".pub-list");
  var countEl = document.querySelector(".pub-count");
  var typeBtns = document.querySelectorAll(".type-filter button");

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function countTheme(k) { return PUBS.filter(function (p) { return p.t.indexOf(k) > -1 && p.type !== "talk"; }).length; }

  if (sel) {
    sel.innerHTML = '<option value="">All themes</option>' + THEMES.map(function (t) {
      return '<option value="' + t[0] + '">' + t[1] + " (" + countTheme(t[0]) + ")</option>";
    }).join("");
    sel.addEventListener("change", function () { state.theme = sel.value; render(); });
  }
  typeBtns.forEach(function (b) {
    b.addEventListener("click", function () { state.type = b.getAttribute("data-type"); render(); });
  });

  function render() {
    if (!listEl) return;
    if (sel) sel.value = state.theme;
    typeBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-type") === state.type ? "true" : "false"); });
    var items = PUBS.filter(function (p) {
      return (state.type === "all" || p.type === state.type) && (!state.theme || p.t.indexOf(state.theme) > -1);
    }).sort(function (a, b) { return b.y - a.y || ORDER[a.type] - ORDER[b.type]; });
    var total = items.length, collapsed = !state.theme && state.type === "all" && !state.all;
    if (collapsed) items = items.slice(0, 8);
    var html = "", lastY = null;
    items.forEach(function (p) {
      if (p.y !== lastY) { if (lastY !== null) html += "</ol>"; html += '<h4 class="pub-year-h">' + p.y + "</h4><ol>"; lastY = p.y; }
      var badge = p.type === "review" ? '<span class="badge">Under review</span>' : "";
      var doi = p.doi ? '<a href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">DOI</a>' : "";
      html += '<li class="pub"><p class="t">' + esc(p.title) + "</p>" +
        '<p class="a">' + esc(p.a).replace(/Islam, M\.D\.\*?/, function (m) { return "<b>" + m + "</b>"; }) + "</p>" +
        '<p class="v"><i>' + esc(p.v) + "</i></p>" +
        '<p class="m">' + badge + (p.type === "review" ? "" : TYPE[p.type]) + doi + "</p></li>";
    });
    if (lastY !== null) html += "</ol>";
    if (collapsed) html += '<button type="button" class="more">Show all ' + total + ' works</button>';
    listEl.innerHTML = html || '<p class="fine">No works match these filters.</p>';
    var more = listEl.querySelector(".more");
    if (more) more.addEventListener("click", function () { state.all = true; render(); });
    var filtered = state.theme || state.type !== "all";
    countEl.innerHTML = (collapsed ? "Most recent " + items.length + " of " + total + " works" : "Showing " + items.length + (items.length === 1 ? " work" : " works")) +
      (state.theme ? " in " + TN[state.theme].toLowerCase() : "") + "." +
      (filtered ? '<button type="button" class="clear">Show all</button>' : "");
    var c = countEl.querySelector(".clear");
    if (c) c.addEventListener("click", function () { state.theme = ""; state.type = "all"; state.all = true; render(); });
  }
  render();

  document.querySelectorAll(".tl").forEach(function (b) {
    var k = b.getAttribute("data-k"), n = countTheme(k);
    var s = document.createElement("span"); s.className = "n"; s.textContent = "(" + n + ")";
    b.appendChild(s);
    b.setAttribute("aria-label", TN[k] + ", show " + n + " papers");
    b.addEventListener("click", function () {
      state.theme = k; state.type = "all"; render();
      var target = document.querySelector(".all-head");
      if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  (function chart() {
    var el = document.querySelector(".year-chart"); if (!el) return;
    var c = {}, yrs = [];
    PUBS.forEach(function (p) { if (p.type !== "review" && p.type !== "talk") c[p.y] = (c[p.y] || 0) + 1; });
    for (var y = 2019; y <= 2026; y++) yrs.push(y);
    var max = Math.max.apply(null, yrs.map(function (y) { return c[y] || 0; }));
    el.innerHTML = yrs.map(function (y) {
      var n = c[y] || 0;
      return '<div class="bar" title="' + y + ": " + n + ' published"><i style="height:' + (n / max * 30) + 'px"></i><span>' + String(y).slice(2) + "</span></div>";
    }).join("");
  })();

  /* ---------------- lightbox ---------------- */
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img"), last = null;
    document.querySelectorAll(".zoom").forEach(function (btn) {
      var img = btn.querySelector("img");
      btn.setAttribute("aria-label", "Enlarge figure: " + img.alt);
      btn.addEventListener("click", function () { last = btn; lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false; lb.querySelector("button").focus(); });
    });
    function close() { lb.hidden = true; lbImg.removeAttribute("src"); if (last) last.focus(); }
    lb.addEventListener("click", function (e) { if (e.target !== lbImg) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) close(); });
  }

  function draw() {}
})();
