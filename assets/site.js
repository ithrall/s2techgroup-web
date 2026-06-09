/* ====== S2 TECH GROUP — site.js ====== */
/* Lang toggle + Theme (dark/light/auto) + Mobile nav + Contact form */
(function () {
  "use strict";

  /* ─────────────────────────────────────────
   *  THEME
   * ───────────────────────────────────────── */
  var THEME_KEY = "s2-theme";

  function resolveLight(mode) {
    if (mode === "light") return true;
    if (mode === "dark")  return false;
    return window.matchMedia("(prefers-color-scheme: light)").matches;
  }

  var FAB_ICONS = { dark: "🌙", light: "☀", auto: "⬤" };

  function applyTheme(mode) {
    var html = document.documentElement;
    html.setAttribute("data-theme", mode);
    var isLight = resolveLight(mode);
    html.classList.toggle("s2-light", isLight);
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
    document.querySelectorAll("[data-theme-btn]").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-theme-btn") === mode);
    });
    var fabMain = document.querySelector(".theme-fab-main");
    if (fabMain) fabMain.textContent = FAB_ICONS[mode] || "🌙";
  }

  function initTheme() {
    var saved = "auto";
    try { saved = localStorage.getItem(THEME_KEY) || "auto"; } catch (e) {}
    applyTheme(saved);

    document.querySelectorAll("[data-theme-btn]").forEach(function (b) {
      b.addEventListener("click", function () { applyTheme(b.getAttribute("data-theme-btn")); });
    });

    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function () {
      var cur = document.documentElement.getAttribute("data-theme") || "auto";
      if (cur === "auto") applyTheme("auto");
    });
  }

  /* ─────────────────────────────────────────
   *  LANG  (ES is the base text; EN in data-en* attrs)
   * ───────────────────────────────────────── */
  var LANG_KEY = "s2-lang";
  var esText = new WeakMap();
  var esHtml = new WeakMap();
  var esPh   = new WeakMap();

  function applyLang(lang) {
    lang = lang === "en" ? "en" : "es";
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (!esText.has(el)) esText.set(el, el.textContent);
      el.textContent = lang === "en" ? el.getAttribute("data-en") : esText.get(el);
    });
    document.querySelectorAll("[data-en-html]").forEach(function (el) {
      if (!esHtml.has(el)) esHtml.set(el, el.innerHTML);
      el.innerHTML = lang === "en" ? el.getAttribute("data-en-html") : esHtml.get(el);
    });
    document.querySelectorAll("[data-en-ph]").forEach(function (el) {
      if (!esPh.has(el)) esPh.set(el, el.getAttribute("placeholder") || "");
      el.setAttribute("placeholder", lang === "en" ? el.getAttribute("data-en-ph") : esPh.get(el));
    });

    document.querySelectorAll(".lang [data-lang]").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  function initLang() {
    var saved = "es";
    try { saved = localStorage.getItem(LANG_KEY) || "es"; } catch (e) {}
    applyLang(saved);

    document.querySelectorAll(".lang [data-lang]").forEach(function (b) {
      b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
    });
  }

  /* ─────────────────────────────────────────
   *  THEME FAB (floating action button)
   * ───────────────────────────────────────── */
  function initThemeFAB() {
    var fab = document.createElement("div");
    fab.className = "theme-fab";
    fab.id = "theme-fab";
    fab.innerHTML =
      "<div class='theme-fab-opts' id='theme-fab-opts'>" +
        "<button data-theme-btn='light' title='Claro'>☀</button>" +
        "<button data-theme-btn='auto' title='Auto'>⬤</button>" +
        "<button data-theme-btn='dark' title='Oscuro'>🌙</button>" +
      "</div>" +
      "<button class='theme-fab-main' aria-label='Cambiar tema' aria-expanded='false'>🌙</button>";
    document.body.appendChild(fab);

    var main = fab.querySelector(".theme-fab-main");
    var opts = fab.querySelector(".theme-fab-opts");

    main.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = opts.classList.toggle("open");
      main.setAttribute("aria-expanded", open);
    });
    document.addEventListener("click", function () {
      opts.classList.remove("open");
      main.setAttribute("aria-expanded", "false");
    });
    opts.querySelectorAll("[data-theme-btn]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        applyTheme(b.getAttribute("data-theme-btn"));
        opts.classList.remove("open");
        main.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ─────────────────────────────────────────
   *  MOBILE NAV
   * ───────────────────────────────────────── */
  function initMobileNav() {
    var ham   = document.getElementById("ham-btn");
    var links = document.getElementById("navlinks");
    if (!ham || !links) return;

    ham.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = links.classList.toggle("open");
      ham.classList.toggle("open", open);
      ham.setAttribute("aria-expanded", open);
    });

    document.addEventListener("click", function (e) {
      if (!links.contains(e.target) && !ham.contains(e.target)) {
        links.classList.remove("open");
        ham.classList.remove("open");
        ham.setAttribute("aria-expanded", "false");
      }
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        ham.classList.remove("open");
      });
    });
  }

  /* ─────────────────────────────────────────
   *  CONTACT FORM
   * ───────────────────────────────────────── */
  var FORM_ENDPOINT = "";   // <-- pega la URL de Power Automate aquí
  var TARGET_EMAIL  = "rsanchez@s2techgroup.net";

  function initForm() {
    var form    = document.getElementById("quote-form");
    if (!form) return;
    var success = document.getElementById("success");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var data = Object.fromEntries(new FormData(form).entries());
      var btn  = form.querySelector("button[type='submit']");
      if (btn) { btn.disabled = true; btn.style.opacity = "0.6"; }

      function showSuccess() {
        form.style.display = "none";
        if (success) success.classList.add("on");
      }
      function fallbackMailto() {
        var div  = data.division === "deporte" ? "Tecnología & Deporte" : "Consultoría IT";
        var subj = encodeURIComponent("[Web] Solicitud de presupuesto — " + div);
        var body = encodeURIComponent(
          "Nombre: "   + (data.nombre   || "") + "\n" +
          "Empresa: "  + (data.empresa  || "") + "\n" +
          "Email: "    + (data.email    || "") + "\n" +
          "Teléfono: " + (data.telefono || "") + "\n" +
          "División: " + (data.division || "") + "\n\n" +
          "Mensaje:\n" + (data.mensaje  || "")
        );
        window.location.href = "mailto:" + TARGET_EMAIL + "?subject=" + subj + "&body=" + body;
        showSuccess();
      }

      if (!FORM_ENDPOINT) { fallbackMailto(); return; }

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error("bad status");
        showSuccess();
      }).catch(function () { fallbackMailto(); });
    });

    var divInputs = form.querySelectorAll("input[name='division']");
    var submitBtn = form.querySelector("button[type='submit']");

    function syncDivision() {
      var sel = form.querySelector("input[name='division']:checked");
      if (sel && submitBtn) submitBtn.classList.toggle("btn-sport", sel.value === "deporte");
    }
    divInputs.forEach(function (r) { r.addEventListener("change", syncDivision); });

    var params = new URLSearchParams(location.search);
    if (params.get("div") === "deporte") {
      var dep = form.querySelector("input[value='deporte']");
      if (dep) dep.checked = true;
    }
    syncDivision();
  }

  /* ─────────────────────────────────────────
   *  INIT
   * ───────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initThemeFAB();
    initLang();
    initMobileNav();
    initForm();
  });
})();
