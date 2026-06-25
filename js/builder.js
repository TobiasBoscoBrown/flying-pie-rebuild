/* Flying Pie — Build Your Own Pizza engine */
(function () {
  "use strict";

  var SIZES = [
    { id: "p", name: "Personal", sub: '10"', base: 8.99, mult: 0.85 },
    { id: "m", name: "Medium", sub: '14"', base: 13.99, mult: 1 },
    { id: "l", name: "Large", sub: '16"', base: 17.99, mult: 1.15 }
  ];
  var CRUSTS = [
    { id: "orig", name: "Original", sub: "hand-tossed", add: 0 },
    { id: "thin", name: "Thin", sub: "crispy", add: 0 },
    { id: "gf", name: "Gluten-conscious", sub: "+$2.50", add: 2.5 }
  ];
  var SAUCES = [
    { id: "red", name: "Whirled Red", sub: "the classic", add: 0, color: "#cf3a2f" },
    { id: "white", name: "Garlic White", sub: "creamy", add: 0, color: "#f3ead2" },
    { id: "pesto", name: "Basil Pesto", sub: "+$0.75", add: 0.75, color: "#5a7e35" }
  ];

  // topping draw helpers (return SVG string for one piece centered at 0,0)
  function pep(c) { return '<circle r="8" fill="#d6362f" stroke="#7c1a17" stroke-width="2"/><circle cx="-2" cy="-2" r="2.4" fill="#8a201c"/>'; }
  var MEATS = [
    { id: "pepperoni", name: "Pepperoni", price: 1.75, n: 9, draw: function () { return '<circle r="8" fill="#d6362f" stroke="#7c1a17" stroke-width="2"/><circle cx="-2" cy="-2" r="2.2" fill="#8a201c"/>'; } },
    { id: "sausage", name: "Italian Sausage", price: 1.75, n: 11, draw: function () { return '<circle r="6" fill="#7a4a2a" stroke="#4d2c14" stroke-width="1.6"/>'; } },
    { id: "bacon", name: "Bacon", price: 1.75, n: 9, draw: function () { return '<rect x="-9" y="-3" width="18" height="6" rx="2" fill="#c4584f" stroke="#7c1a17" stroke-width="1.4" transform="rotate(25)"/><rect x="-9" y="-1" width="18" height="2" fill="#e8c9b0" transform="rotate(25)"/>'; } },
    { id: "canadian", name: "Canadian Bacon", price: 1.75, n: 7, draw: function () { return '<circle r="9" fill="#e79a93" stroke="#b05a52" stroke-width="2"/>'; } },
    { id: "salami", name: "Salami", price: 1.75, n: 8, draw: function () { return '<circle r="8" fill="#a02f2c" stroke="#5e1715" stroke-width="2"/><circle cx="3" cy="2" r="1.6" fill="#e7c7c0"/><circle cx="-3" cy="1" r="1.4" fill="#e7c7c0"/>'; } }
  ];
  var VEGGIES = [
    { id: "mushroom", name: "Mushroom", price: 1.25, n: 8, draw: function () { return '<path d="M-7 2 a7 6 0 0 1 14 0 z" fill="#e6d3b0" stroke="#9a8460" stroke-width="1.6"/><rect x="-2" y="1" width="4" height="6" fill="#d8c096" stroke="#9a8460" stroke-width="1.2"/>'; } },
    { id: "olive", name: "Black Olive", price: 1.25, n: 11, draw: function () { return '<circle r="6" fill="none" stroke="#2b2330" stroke-width="3.4"/>'; } },
    { id: "greenpepper", name: "Green Pepper", price: 1.25, n: 10, draw: function () { return '<path d="M-9 0 a9 9 0 0 1 18 0" fill="none" stroke="#2f8a3d" stroke-width="4" stroke-linecap="round"/>'; } },
    { id: "onion", name: "Red Onion", price: 1.25, n: 9, draw: function () { return '<path d="M-9 0 a9 9 0 0 1 18 0" fill="none" stroke="#9b4d8e" stroke-width="3" stroke-linecap="round"/>'; } },
    { id: "artichoke", name: "Artichoke", price: 1.25, n: 7, draw: function () { return '<path d="M0 -8 L7 6 L-7 6 Z" fill="#bcd29a" stroke="#5a7e35" stroke-width="1.8"/>'; } },
    { id: "jalapeno", name: "Jalapeño", price: 1.25, n: 10, draw: function () { return '<circle r="6" fill="#3a9a4e" stroke="#1c6b32" stroke-width="2"/><circle r="2.5" fill="#bfe6c6"/>'; } },
    { id: "tomato", name: "Roma Tomato", price: 1.25, n: 8, draw: function () { return '<circle r="7" fill="#e2514a" stroke="#a82420" stroke-width="2"/><circle r="3" fill="#f1948e"/>'; } },
    { id: "basil", name: "Fresh Basil", price: 1.25, n: 7, draw: function () { return '<path d="M0 -8 C6 -4 6 4 0 8 C-6 4 -6 -4 0 -8 Z" fill="#2f8a3d" stroke="#0f4f23" stroke-width="1.6"/>'; } }
  ];

  var state = { size: "m", crust: "orig", sauce: "red", toppings: {} };
  var cart = [];

  var $ = function (id) { return document.getElementById(id); };
  function money(n) { return "$" + n.toFixed(2); }
  function sizeObj() { return SIZES.filter(function (s) { return s.id === state.size; })[0]; }

  // ---- build option buttons ----
  function pill(html, sel, cls, onClick) {
    var b = document.createElement("button");
    b.className = "opt" + (sel ? " sel" : "") + (cls ? " " + cls : "");
    b.innerHTML = html;
    b.addEventListener("click", onClick);
    return b;
  }

  function renderOptions() {
    var sr = $("sizeRow"); sr.innerHTML = "";
    SIZES.forEach(function (s) {
      sr.appendChild(pill(s.name + " <small>" + s.sub + " · " + money(s.base) + "</small>", state.size === s.id, "", function () { state.size = s.id; renderOptions(); update(); }));
    });
    var cr = $("crustRow"); cr.innerHTML = "";
    CRUSTS.forEach(function (c) {
      cr.appendChild(pill(c.name + " <small>" + c.sub + "</small>", state.crust === c.id, "", function () { state.crust = c.id; renderOptions(); update(); }));
    });
    var sa = $("sauceRow"); sa.innerHTML = "";
    SAUCES.forEach(function (c) {
      sa.appendChild(pill(c.name + " <small>" + c.sub + "</small>", state.sauce === c.id, "", function () { state.sauce = c.id; renderOptions(); update(); }));
    });
    var mr = $("meatRow"); mr.innerHTML = "";
    MEATS.forEach(function (t) {
      mr.appendChild(pill(t.name + " <small>+" + money(t.price) + "</small>", !!state.toppings[t.id], "meat", function () { toggle(t.id); }));
    });
    var vr = $("vegRow"); vr.innerHTML = "";
    VEGGIES.forEach(function (t) {
      vr.appendChild(pill(t.name + " <small>+" + money(t.price) + "</small>", !!state.toppings[t.id], "veg", function () { toggle(t.id); }));
    });
  }

  function toggle(id) {
    if (state.toppings[id]) delete state.toppings[id];
    else state.toppings[id] = true;
    renderOptions(); update();
  }

  function allToppings() { return MEATS.concat(VEGGIES); }

  // ---- live price ----
  function price() {
    var s = sizeObj();
    var crust = CRUSTS.filter(function (c) { return c.id === state.crust; })[0];
    var sauce = SAUCES.filter(function (c) { return c.id === state.sauce; })[0];
    var tcost = 0;
    allToppings().forEach(function (t) { if (state.toppings[t.id]) tcost += t.price; });
    return s.base + crust.add + sauce.add + tcost * s.mult;
  }

  // ---- live pizza render ----
  function placeTopping(t) {
    // golden-angle distribution inside radius ~108, seeded per topping
    var g = '<g>';
    var golden = 2.399963;
    var seed = t.id.length * 3 + t.id.charCodeAt(0);
    for (var i = 0; i < t.n; i++) {
      var idx = i + seed;
      var r = 30 + Math.sqrt((i + 0.5) / t.n) * 86;
      var a = idx * golden;
      var x = 200 + r * Math.cos(a);
      var y = 196 + r * Math.sin(a);
      var rot = (idx * 53) % 360;
      g += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + rot + ')">' + t.draw() + '</g>';
    }
    return g + '</g>';
  }

  function update() {
    // sauce color
    var sauce = SAUCES.filter(function (c) { return c.id === state.sauce; })[0];
    $("sauceLayer").setAttribute("fill", sauce.color);
    $("cheeseLayer").style.opacity = state.sauce === "white" ? "0.55" : "1";

    // toppings
    var layer = $("toppingLayer");
    var html = "";
    allToppings().forEach(function (t) { if (state.toppings[t.id]) html += placeTopping(t); });
    layer.innerHTML = html;

    // price + summary
    $("priceTag").textContent = money(price());
    var chosen = allToppings().filter(function (t) { return state.toppings[t.id]; }).map(function (t) { return t.name; });
    var s = sizeObj();
    var crust = CRUSTS.filter(function (c) { return c.id === state.crust; })[0];
    $("buildSummary").textContent = s.name + ' ' + s.sub + ', ' + crust.name.toLowerCase() + ' crust, ' + sauce.name.toLowerCase() +
      (chosen.length ? ' with ' + chosen.join(", ") : ', no toppings yet');
  }

  // ---- cart ----
  function describe() {
    var s = sizeObj();
    var crust = CRUSTS.filter(function (c) { return c.id === state.crust; })[0];
    var sauce = SAUCES.filter(function (c) { return c.id === state.sauce; })[0];
    var chosen = allToppings().filter(function (t) { return state.toppings[t.id]; }).map(function (t) { return t.name; });
    return {
      title: s.name + ' ' + s.sub + ' pizza',
      meta: crust.name + ' crust · ' + sauce.name + (chosen.length ? ' · ' + chosen.join(", ") : ' · cheese'),
      price: price()
    };
  }

  function renderCart() {
    var box = $("cartItems");
    if (!cart.length) { box.innerHTML = '<p class="cart__empty">Your cart\'s empty. Build a pie and hit "Add to order."</p>'; }
    else {
      box.innerHTML = cart.map(function (it, i) {
        return '<div class="cart__item"><div><div class="nm">' + it.title + '</div><div class="meta">' + it.meta + '</div>' +
          '<button class="rm" data-i="' + i + '">Remove</button></div><div>' + money(it.price) + '</div></div>';
      }).join("");
      box.querySelectorAll(".rm").forEach(function (b) {
        b.addEventListener("click", function () { cart.splice(+b.getAttribute("data-i"), 1); renderCart(); });
      });
    }
    var total = cart.reduce(function (a, b) { return a + b.price; }, 0);
    $("cartTotal").textContent = money(total);
  }

  // ---- checkout modal ----
  var LOCATIONS = [
    "Fairview (Boise)", "State Street (Boise)", "Broadway (Boise)", "Overland (Boise)",
    "Meridian", "Eagle", "Nampa"
  ];
  function openCheckout() {
    if (!cart.length) { addCurrentToCart(); }
    var total = cart.reduce(function (a, b) { return a + b.price; }, 0);
    var items = cart.map(function (it) { return '<div class="cart__item"><div><div class="nm">' + it.title + '</div><div class="meta">' + it.meta + '</div></div><div>' + money(it.price) + '</div></div>'; }).join("");
    var locOpts = LOCATIONS.map(function (l) { return '<option>' + l + '</option>'; }).join("");
    $("modalBody").innerHTML =
      '<span class="eyebrow">Almost there</span><h2 style="margin:.1em 0 .5em">Review your order</h2>' +
      '<div style="border:2px solid var(--ink);border-radius:14px;padding:6px 16px;margin-bottom:18px">' + items +
      '<div class="cart__total"><span>Total</span><span>' + money(total) + '</span></div></div>' +
      '<label style="font-family:var(--font-grotesk);font-weight:700;font-size:.9rem">Pick up at</label>' +
      '<select id="locSel" style="width:100%;padding:12px;border:2.5px solid var(--ink);border-radius:12px;margin:6px 0 16px;font-family:var(--font-grotesk)">' + locOpts + '</select>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap"><input id="custName" placeholder="Your name" style="flex:1;min-width:120px;padding:12px;border:2.5px solid var(--ink);border-radius:12px">' +
      '<input id="custPhone" placeholder="Phone" style="flex:1;min-width:120px;padding:12px;border:2.5px solid var(--ink);border-radius:12px"></div>' +
      '<button class="btn btn--green btn--lg" id="confirmBtn" style="width:100%;justify-content:center;margin-top:18px">Send my order <span class="arr">→</span></button>' +
      '<p style="font-size:.8rem;color:var(--ink-soft);margin:12px 0 0">This is a concept demo, so no payment is taken and nothing is charged.</p>';
    $("orderModal").classList.add("open");
    $("confirmBtn").addEventListener("click", confirmOrder);
  }

  function confirmOrder() {
    var name = ($("custName").value || "friend").replace(/[<>]/g, "");
    var loc = $("locSel").value;
    var total = cart.reduce(function (a, b) { return a + b.price; }, 0);
    $("modalBody").innerHTML =
      '<div style="text-align:center"><div style="font-size:3.4rem">🍕</div>' +
      '<h2 style="margin:.2em 0">Order received, ' + name + '!</h2>' +
      '<p class="lead" style="color:var(--ink)">We\'d have your <strong>' + money(total) + '</strong> order firing up at <strong>Flying Pie ' + loc + '</strong> in about 15-20 minutes.</p>' +
      '<p style="font-size:.9rem;color:var(--ink-soft)">In this demo we don\'t process real payments. On a live site this would drop straight into the kitchen\'s ordering system.</p>' +
      '<button class="btn btn--red" id="doneBtn" style="margin-top:8px">Build another <span class="arr">→</span></button></div>';
    cart = [];
    renderCart();
    $("doneBtn").addEventListener("click", function () { $("orderModal").classList.remove("open"); });
  }

  function addCurrentToCart() {
    cart.push(describe());
    renderCart();
  }

  // ---- wire up ----
  document.addEventListener("DOMContentLoaded", function () {
    renderOptions();
    update();
    renderCart();
    $("addBtn").addEventListener("click", function () {
      addCurrentToCart();
      var b = $("addBtn"); var t = b.innerHTML; b.innerHTML = "Added! ✓";
      setTimeout(function () { b.innerHTML = t; }, 1100);
    });
    $("resetBtn").addEventListener("click", function () {
      state = { size: "m", crust: "orig", sauce: "red", toppings: {} };
      renderOptions(); update();
    });
    $("checkoutBtn").addEventListener("click", openCheckout);
    $("modalClose").addEventListener("click", function () { $("orderModal").classList.remove("open"); });
    $("orderModal").addEventListener("click", function (e) { if (e.target.id === "orderModal") $("orderModal").classList.remove("open"); });
  });
})();
