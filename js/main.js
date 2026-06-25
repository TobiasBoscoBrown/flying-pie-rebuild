/* Flying Pie — interactions */
(function () {
  "use strict";

  // mobile menu
  var burger = document.querySelector(".nav__burger");
  var menu = document.querySelector(".mobile-menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      menu.classList.toggle("open");
      burger.classList.toggle("is-open");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { menu.classList.remove("open"); });
    });
  }

  // scroll reveal
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  // duplicate marquee content for seamless loop
  document.querySelectorAll(".marquee__track").forEach(function (track) {
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  // FAQ accordions
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      var a = q.nextElementSibling;
      var open = q.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : 0;
    });
  });

  // reading progress bar
  var bar = document.querySelector(".readbar");
  if (bar) {
    window.addEventListener("scroll", function () {
      var h = document.documentElement;
      var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
      bar.style.width = (pct * 100) + "%";
    }, { passive: true });
  }

  // "Is it your day?" name checker — playful demo widget
  var nc = document.querySelector("#nameCheck");
  if (nc) {
    var input = nc.querySelector("input");
    var out = nc.querySelector(".namecheck__out");
    var btn = nc.querySelector("button");
    var lines = [
      function (n) { return "🍕 " + n + ", the dough gods are smiling. Bring a valid ID and an empty stomach."; },
      function (n) { return "✨ Ooh, " + n + " — keep an eye on the schedule. Your name has serious main-character energy."; },
      function (n) { return "🛸 Not today, " + n + "... but the Imagination Station never closes. Build one anyway."; },
      function (n) { return "💜 " + n + "! Sign up for PieCommunity+ and we'll save you a birthday pie too."; }
    ];
    var run = function () {
      var n = (input.value || "Friend").trim().replace(/[<>]/g, "");
      n = n.charAt(0).toUpperCase() + n.slice(1);
      var pick = lines[Math.floor(Math.random() * lines.length)];
      out.textContent = pick(n);
    };
    if (btn) btn.addEventListener("click", run);
    if (input) input.addEventListener("keydown", function (e) { if (e.key === "Enter") run(); });
  }

  // year stamp
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
