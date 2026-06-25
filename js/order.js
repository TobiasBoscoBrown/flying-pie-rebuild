/* Flying Pie — full ordering engine: menu data, shared cart, pizza builder, checkout */
(function () {
  "use strict";
  var IMG = "https://olo-images-live.imgix.net/";
  function ph(p) { var h = p.split("/")[1].replace(/\.(jpe?g|png)$/, ""); return "assets/food/" + h + ".jpg"; }
  function money(n) { return "$" + n.toFixed(2); }

  /* ---------------- MENU DATA (real items + photos, sample pricing) ---------------- */
  var MENU = [
    { id:"specialty", name:"Whirled-Famous Specialty Pizzas", note:"Medium 14\". Go Large for $4 more at the counter.", items:[
      { n:"Contest Combo", p:18.99, img:"c7/c717dc19bd1c4a53b7072cd13a81356d.jpeg", d:"6 meats + 4 veggies. Our most popular pie, no contest." },
      { n:"Samoan", p:17.99, img:"90/9041b096e27f4f92951b82354c9c50bd.jpeg", d:"Canadian bacon & pineapple. Sweet, salty, divisive." },
      { n:"Denver Pie", p:17.99, img:"56/568aaf280516451a9190871ef9cdd665.jpeg", d:"Inspired by the omelet, not the city." },
      { n:"Pesto Primavera (V)", p:17.99, img:"a9/a9f040e229954c0ea86165e3575755a6.jpeg", d:"Artichoke hearts, mushrooms & Roma tomatoes on pesto." },
      { n:"Phosgo Supreme", p:18.99, img:"0c/0c50972ea90a43b7b99d000a6286f44d.jpeg", d:"The supreme, loaded the Flying Pie way." },
      { n:"Stromboli", p:18.99, img:"4b/4bfe38731ddf48319b8309ad5a86d5aa.jpeg", d:"A hearty, savory crowd favorite." },
      { n:"Fromage-a-Trois (V)", p:16.99, img:"f2/f20a7c4335894b0c80ea279adc8d89ac.jpeg", d:"A three-cheese dream for purists." },
      { n:"No Vegy Pieway", p:18.99, img:"54/54e35415ba2e407ea9ca1460b6eebd07.jpeg", d:"The best all-meat pizza you'll ever meet." },
      { n:"Triple Pie", p:18.99, img:"5e/5e22ac2dc9d041df8352fe6a564d573f.jpeg", d:"Three's the magic number." },
      { n:"Habanero", p:18.99, img:"fd/fd188f29503646159f7cbcb5f861093c.jpg", d:"As seen on Man v. Food. Bring milk." },
      { n:"Garlic Chicken", p:18.99, img:"5b/5b0850722a9b4e29ab59136c0dbca1ee.jpeg", d:"Garlic, chicken, glory." },
      { n:"Mesquite Chicken", p:18.99, img:"4b/4b1b35e6d32a4acfad5782d24eaa4547.jpeg", d:"Smoky mesquite BBQ chicken." },
      { n:"Chile-N-Lime", p:18.99, img:"5c/5cdc09c151e343509209f68ba8cfdf62.jpeg", d:"Zesty chile and bright lime." },
      { n:"Acapulco Verde (V)", p:17.99, img:"91/913eb66687d64b08a3e1ecbb607db973.jpeg", d:"A green-sauce veggie escape." },
      { n:"Zerto Magnifico", p:18.99, img:"e5/e52972937089427c937c856fb15cf11e.jpeg", d:"Magnificent, as the name promises." },
      { n:"Zambini", p:18.99, img:"79/7931f845bbb14cf9878d9f414f58ce0e.jpeg", d:"A house specialty with a twist." },
      { n:"Sam I Am (V)", p:17.99, img:"83/831ef8c99a6044f48511de4fe658d08f.jpeg", d:"Green eggs not included. Veggie-loaded." },
      { n:"Vegetarian (V)", p:17.99, img:"b3/b378ccef44eb42e2b3d4941e21c447dd.jpeg", d:"Garden-fresh and proud of it." }
    ]},
    { id:"sticks", name:"Flying Sticks", note:"Pull-apart, dunk, repeat.", items:[
      { n:"Cheesy Sticks", p:8.99, img:"35/357e8e58a79d4b44b579cf34b69b496e.jpg", d:"The freebie that converts new members for life." },
      { n:"Pepperoni Sticks", p:10.99, img:"79/7928b899338a44c0b4af098e8a72e832.jpg", d:"Cheesy sticks, now with pepperoni." },
      { n:"Bacon Sticks", p:10.99, img:"fc/fc33a017b31e449692cefd0251742dce.jpg", d:"Bacon makes everything better." },
      { n:"Pepperoni-Bacon Sticks", p:11.99, img:"53/53487d5f0e394fc79cb749bbfa1fa9df.jpg", d:"Why choose? Have both." }
    ]},
    { id:"greens", name:"Greens", note:"Lettuce mix with cucumber, tomato & more.", items:[
      { n:"Single House Salad", p:5.99, img:"0f/0f7786d8bf654894a530124b2203bff2.jpg", d:"Enough for 1." },
      { n:"Meal House Salad", p:8.99, img:"6d/6d2b3d019f414e4da2f7b52e8ff8dcfd.jpg", d:"Enough for 2-3." },
      { n:"Group House Salad", p:24.99, img:"bd/bda70aad50b04e2a9ab0832b3d262772.jpg", d:"Enough for 25-30 people. WOW!" }
    ]},
    { id:"sweets", name:"Sweets", note:"Save room.", items:[
      { n:"Cinnamon Sticks", p:7.99, img:"4b/4be54a1ec1b34318b67758f86005f7c5.png", d:"Warm, sweet, cinnamon-sugar finish." }
    ]},
    { id:"dips", name:"Dipping Cups", note:"Dunk responsibly.", items:[
      { n:"Ranch", p:0.75, img:"c7/c7d1bdc7c675471dbe3ee759b8141df6.jpg", d:"House ranch." },
      { n:"Red Sauce", p:0.75, img:"32/32224fcba2d44876ac080c953d1c3731.jpg", d:"Whirled-Famous red." },
      { n:"BBQ Sauce", p:0.75, img:"1c/1c6585e085c24583953de4c010ab56a5.jpg", d:"Smoky and sweet." },
      { n:"Bleu Cheese", p:0.75, img:"bb/bb4071ef6a7e413087d0df24b92a19dc.jpg", d:"Tangy and bold." },
      { n:"Caesar Dressing", p:0.75, img:"61/61ae54a6bc6440c6a81d75b6c20ca91e.jpg", d:"Garlicky classic." },
      { n:"Balsamic Vinaigrette", p:0.75, img:"6a/6aaac14c166c4c628d6dea4a68136502.jpg", d:"Bright and light." },
      { n:"Honey Mustard", p:0.75, img:"0b/0bc20e8ae4304e0d88daf0a17117ee2c.jpg", d:"Sweet meets tang." }
    ]},
    { id:"drinks", name:"Soft Drinks", note:"Ice-cold.", items:[
      { n:"Sprite", p:2.99, img:"37/37f3b7dd3b474f9cacc06c15d2fdb3da.jpg", d:"20oz bottle." },
      { n:"Coca-Cola", p:2.99, img:"c8/c80de1898ef24475985485eda4972312.png", d:"20oz bottle." },
      { n:"Diet Coke", p:2.99, img:"78/781e29f03a534adfab218ca68b2575d2.png", d:"20oz bottle." },
      { n:"Dr Pepper", p:2.99, img:"6e/6e54307301794485a417bb7b15699210.png", d:"20oz bottle." }
    ]},
    { id:"beer", name:"Beer To Go", note:"Cans & bottles, where available.", items:[
      { n:"Sockeye Tripel Pi", p:6.50, img:"70/70e5b36d662e43a7a5c179132b279be6.jpeg", d:"Our exclusive Belgian-style Abbey ale." },
      { n:"Bodhizafa IPA", p:6.00, img:"24/24530e72010c46e88e97fec748b15613.jpeg", d:"Crisp, hoppy West-coast IPA." },
      { n:"12oz Bale Breaker Field 41", p:5.50, img:"c9/c9ef038a7c654c62a6ecdad10d8d38c9.jpeg", d:"Pale ale, easy drinking." },
      { n:"16oz Aventinus", p:7.00, img:"ef/efe3b5e93b9649fea4534eced6e1fb49.jpeg", d:"Wheat doppelbock." },
      { n:"12oz Widmer Hefe", p:5.00, img:"1a/1a5dd8c532b04b0e827d65c57ff58af6.jpg", d:"Classic American hefeweizen." },
      { n:"16oz PBR", p:4.50, img:"43/434a7a65a8f5477c8cd190f95d5d8060.png", d:"The blue ribbon, earned." }
    ]},
    { id:"wine", name:"Wine To Go", note:"By the bottle.", items:[
      { n:"Woodbridge Cabernet Sauvignon", p:8.99, img:"cc/ccbe3270b6114c838c908501a67eda98.jpg", d:"Bold red." },
      { n:"Woodbridge Chardonnay", p:8.99, img:"36/36e59f56fe3d4ef2ae0891d005cc4261.jpg", d:"Buttery white." },
      { n:"Woodbridge Pinot Grigio", p:8.99, img:"c1/c12fc8ff4c014f6b96fcdcc0e8ebba11.jpg", d:"Crisp and light." }
    ]},
    { id:"growlers", name:"64oz Draft Growlers", note:"Commemorative Flying Pie growler.", items:[
      { n:"64oz Sockeye Tripel Pi Growler", p:21.00, img:"70/70e5b36d662e43a7a5c179132b279be6.jpeg", d:"Take the draft home." },
      { n:"64oz Bodhizafa IPA Growler", p:20.00, img:"24/24530e72010c46e88e97fec748b15613.jpeg", d:"Fresh-filled to-go." }
    ]}
  ];

  /* ---------------- SHARED CART ---------------- */
  var cart = [];
  function cartCount() { return cart.reduce(function (a, b) { return a + b.qty; }, 0); }
  function cartTotal() { return cart.reduce(function (a, b) { return a + b.price * b.qty; }, 0); }
  function addToCart(item) {
    // merge identical simple items
    var key = item.title + "|" + item.meta + "|" + item.price.toFixed(2);
    var ex = cart.filter(function (c) { return c.key === key && !c.unique; })[0];
    if (ex) ex.qty += (item.qty || 1);
    else cart.push({ key: key, title: item.title, meta: item.meta, price: item.price, qty: item.qty || 1, unique: !!item.unique });
    renderCart(); pulseCart();
  }
  function pulseCart() {
    var b = document.getElementById("cartBtnCount");
    if (b) { b.textContent = cartCount(); b.parentNode.classList.add("pulse"); setTimeout(function(){b.parentNode.classList.remove("pulse");}, 350); }
  }
  function renderCart() {
    var box = document.getElementById("cartItems");
    if (!box) return;
    if (!cart.length) { box.innerHTML = '<p class="cart__empty">Your cart\'s empty. Build a pie or add something tasty.</p>'; }
    else {
      box.innerHTML = cart.map(function (it, i) {
        return '<div class="cart__item"><div style="flex:1"><div class="nm">' + it.title + '</div>' +
          (it.meta ? '<div class="meta">' + it.meta + '</div>' : '') +
          '<div class="qtyrow"><button class="qtybtn" data-d="-1" data-i="' + i + '">&minus;</button>' +
          '<span class="qn">' + it.qty + '</span>' +
          '<button class="qtybtn" data-d="1" data-i="' + i + '">+</button>' +
          '<button class="rm" data-rm="' + i + '">Remove</button></div></div>' +
          '<div class="lineprice">' + money(it.price * it.qty) + '</div></div>';
      }).join("");
      box.querySelectorAll(".qtybtn").forEach(function (b) {
        b.addEventListener("click", function () { var i = +b.getAttribute("data-i"); cart[i].qty += +b.getAttribute("data-d"); if (cart[i].qty < 1) cart.splice(i, 1); renderCart(); pulseCart(); });
      });
      box.querySelectorAll(".rm").forEach(function (b) {
        b.addEventListener("click", function () { cart.splice(+b.getAttribute("data-rm"), 1); renderCart(); pulseCart(); });
      });
    }
    var t = document.getElementById("cartTotal"); if (t) t.textContent = money(cartTotal());
    var c2 = document.getElementById("cartBtnCount"); if (c2) c2.textContent = cartCount();
    var c3 = document.getElementById("cartBtnCount2"); if (c3) c3.textContent = cartCount();
    var cm = document.getElementById("cartMini"); if (cm) cm.textContent = money(cartTotal());
  }

  /* ---------------- RENDER MENU SECTIONS ---------------- */
  function renderMenu() {
    var host = document.getElementById("menuSections");
    if (!host) return;
    host.innerHTML = MENU.map(function (cat) {
      var cards = cat.items.map(function (it) {
        return '<article class="mitem">' +
          '<div class="mitem__img" style="background-image:url(\'' + ph(it.img) + '\')"></div>' +
          '<div class="mitem__body"><h4>' + it.n + '</h4><p>' + it.d + '</p>' +
          '<div class="mitem__foot"><span class="mitem__price">' + money(it.p) + '</span>' +
          '<button class="btn btn--green mitem__add" data-n="' + esc(it.n) + '" data-p="' + it.p + '" data-c="' + esc(cat.name) + '">Add +</button></div></div></article>';
      }).join("");
      return '<section class="menu-cat" id="cat-' + cat.id + '"><div class="menu-cat__head"><h2>' + cat.name + '</h2>' +
        (cat.note ? '<p>' + cat.note + '</p>' : '') + '</div><div class="mgrid">' + cards + '</div></section>';
    }).join("");
    host.querySelectorAll(".mitem__add").forEach(function (b) {
      b.addEventListener("click", function () {
        addToCart({ title: b.getAttribute("data-n"), meta: b.getAttribute("data-c"), price: +b.getAttribute("data-p") });
        var t = b.textContent; b.textContent = "Added ✓"; b.classList.add("added");
        setTimeout(function () { b.textContent = t; b.classList.remove("added"); }, 900);
      });
    });
    // category chips
    var chips = document.getElementById("catChips");
    if (chips) chips.innerHTML = '<a class="chip" href="#builder">Build Your Own</a>' + MENU.map(function (c) { return '<a class="chip" href="#cat-' + c.id + '">' + c.name.replace(/ \(.*/,'') + '</a>'; }).join("");
    if (chips) chips.querySelectorAll(".chip").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var el = document.getElementById(a.getAttribute("href").slice(1));
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 132, behavior: "smooth" });
      });
    });
  }
  function esc(s){ return (s||"").replace(/"/g,"&quot;"); }

  /* ---------------- PIZZA BUILDER ---------------- */
  var SIZES = [
    { id:"p", name:"Personal", sub:'10"', base:8.99, mult:0.85 },
    { id:"m", name:"Medium", sub:'14"', base:13.99, mult:1 },
    { id:"l", name:"Large", sub:'16"', base:17.99, mult:1.15 }
  ];
  var CRUSTS = [
    { id:"orig", name:"Original", sub:"hand-tossed", add:0 },
    { id:"thin", name:"Thin", sub:"crispy", add:0 },
    { id:"gf", name:"Gluten-conscious", sub:"+$2.50", add:2.5 }
  ];
  var SAUCES = [
    { id:"red", name:"Whirled Red", sub:"the classic", add:0, color:"#cf3a2f" },
    { id:"white", name:"Garlic White", sub:"creamy", add:0, color:"#f3ead2" },
    { id:"pesto", name:"Basil Pesto", sub:"+$0.75", add:0.75, color:"#5a7e35" }
  ];
  var MEATS = [
    { id:"pepperoni", name:"Pepperoni", price:1.75, n:10, draw:function(){return '<circle r="8" fill="#d6362f" stroke="#7c1a17" stroke-width="2"/><circle cx="-2" cy="-2" r="2.2" fill="#8a201c"/>';} },
    { id:"sausage", name:"Italian Sausage", price:1.75, n:13, draw:function(){return '<circle r="6" fill="#7a4a2a" stroke="#4d2c14" stroke-width="1.6"/>';} },
    { id:"bacon", name:"Bacon", price:1.75, n:11, draw:function(){return '<rect x="-9" y="-3" width="18" height="6" rx="2" fill="#c4584f" stroke="#7c1a17" stroke-width="1.4" transform="rotate(25)"/><rect x="-9" y="-1" width="18" height="2" fill="#e8c9b0" transform="rotate(25)"/>';} },
    { id:"canadian", name:"Canadian Bacon", price:1.75, n:9, draw:function(){return '<circle r="9" fill="#e79a93" stroke="#b05a52" stroke-width="2"/>';} },
    { id:"salami", name:"Salami", price:1.75, n:10, draw:function(){return '<circle r="8" fill="#a02f2c" stroke="#5e1715" stroke-width="2"/><circle cx="3" cy="2" r="1.6" fill="#e7c7c0"/><circle cx="-3" cy="1" r="1.4" fill="#e7c7c0"/>';} },
    { id:"chicken", name:"Grilled Chicken", price:1.95, n:11, draw:function(){return '<rect x="-7" y="-5" width="14" height="10" rx="3" fill="#e9d3a8" stroke="#b79a64" stroke-width="1.6"/><line x1="-3" y1="-5" x2="-3" y2="5" stroke="#b79a64" stroke-width="1"/>';} }
  ];
  var VEGGIES = [
    { id:"mushroom", name:"Mushroom", price:1.25, n:10, draw:function(){return '<path d="M-7 2 a7 6 0 0 1 14 0 z" fill="#e6d3b0" stroke="#9a8460" stroke-width="1.6"/><rect x="-2" y="1" width="4" height="6" fill="#d8c096" stroke="#9a8460" stroke-width="1.2"/>';} },
    { id:"olive", name:"Black Olive", price:1.25, n:13, draw:function(){return '<circle r="6" fill="none" stroke="#2b2330" stroke-width="3.4"/>';} },
    { id:"greenpepper", name:"Green Pepper", price:1.25, n:12, draw:function(){return '<path d="M-9 0 a9 9 0 0 1 18 0" fill="none" stroke="#2f8a3d" stroke-width="4" stroke-linecap="round"/>';} },
    { id:"onion", name:"Red Onion", price:1.25, n:11, draw:function(){return '<path d="M-9 0 a9 9 0 0 1 18 0" fill="none" stroke="#9b4d8e" stroke-width="3" stroke-linecap="round"/>';} },
    { id:"artichoke", name:"Artichoke", price:1.25, n:9, draw:function(){return '<path d="M0 -8 L7 6 L-7 6 Z" fill="#bcd29a" stroke="#5a7e35" stroke-width="1.8"/>';} },
    { id:"jalapeno", name:"Jalapeño", price:1.25, n:12, draw:function(){return '<circle r="6" fill="#3a9a4e" stroke="#1c6b32" stroke-width="2"/><circle r="2.5" fill="#bfe6c6"/>';} },
    { id:"habanero", name:"Habanero 🔥", price:1.25, n:11, draw:function(){return '<circle r="6" fill="#e0671f" stroke="#9c3f10" stroke-width="2"/>';} },
    { id:"tomato", name:"Roma Tomato", price:1.25, n:10, draw:function(){return '<circle r="7" fill="#e2514a" stroke="#a82420" stroke-width="2"/><circle r="3" fill="#f1948e"/>';} },
    { id:"pineapple", name:"Pineapple", price:1.25, n:10, draw:function(){return '<path d="M-6 -6 L6 -6 L4 6 L-4 6 Z" fill="#f6cf3f" stroke="#cفa31a" stroke-width="1.6"/>';} },
    { id:"basil", name:"Fresh Basil", price:1.25, n:9, draw:function(){return '<path d="M0 -8 C6 -4 6 4 0 8 C-6 4 -6 -4 0 -8 Z" fill="#2f8a3d" stroke="#0f4f23" stroke-width="1.6"/>';} }
  ];
  MEATS.concat(VEGGIES).forEach(function (t, i) { t.seed = i * 7 + 3; });

  var st = { size:"m", crust:"orig", sauce:"red", region:"whole", toppings:{} };
  function $(id){ return document.getElementById(id); }
  function sizeObj(){ return SIZES.filter(function(s){return s.id===st.size;})[0]; }
  function allTops(){ return MEATS.concat(VEGGIES); }
  function topObj(id){ return allTops().filter(function(t){return t.id===id;})[0]; }

  function pill(html, sel, cls, onClick) {
    var b = document.createElement("button");
    b.className = "opt" + (sel ? " sel" : "") + (cls ? " " + cls : "");
    b.innerHTML = html; b.addEventListener("click", onClick); return b;
  }
  function regionBadge(r){ return r==="left" ? '◐ L' : r==="right" ? '◑ R' : '● whole'; }

  function renderOpts() {
    var sr=$("sizeRow"); sr.innerHTML="";
    SIZES.forEach(function(s){ sr.appendChild(pill(s.name+" <small>"+s.sub+" · "+money(s.base)+"</small>", st.size===s.id, "", function(){ st.size=s.id; renderOpts(); upd(); })); });
    var cr=$("crustRow"); cr.innerHTML="";
    CRUSTS.forEach(function(c){ cr.appendChild(pill(c.name+" <small>"+c.sub+"</small>", st.crust===c.id, "", function(){ st.crust=c.id; renderOpts(); upd(); })); });
    var sa=$("sauceRow"); sa.innerHTML="";
    SAUCES.forEach(function(c){ sa.appendChild(pill(c.name+" <small>"+c.sub+"</small>", st.sauce===c.id, "", function(){ st.sauce=c.id; renderOpts(); upd(); })); });
    var rr=$("regionRow"); rr.innerHTML="";
    [["whole","● Whole pie"],["left","◐ Left half"],["right","◑ Right half"]].forEach(function(o){
      rr.appendChild(pill(o[1], st.region===o[0], "", function(){ st.region=o[0]; renderOpts(); }));
    });
    var mr=$("meatRow"); mr.innerHTML="";
    MEATS.forEach(function(t){ var r=st.toppings[t.id]; mr.appendChild(pill(t.name+" <small>"+(r?regionBadge(r):"+"+money(t.price))+"</small>", !!r, "meat", function(){ toggleTop(t.id); })); });
    var vr=$("vegRow"); vr.innerHTML="";
    VEGGIES.forEach(function(t){ var r=st.toppings[t.id]; vr.appendChild(pill(t.name+" <small>"+(r?regionBadge(r):"+"+money(t.price))+"</small>", !!r, "veg", function(){ toggleTop(t.id); })); });
  }
  function toggleTop(id) {
    var cur = st.toppings[id];
    if (!cur) st.toppings[id] = st.region;          // add in current region
    else if (cur === st.region) delete st.toppings[id]; // tap same region removes
    else st.toppings[id] = st.region;                // move to new region
    renderOpts(); upd();
  }

  function price() {
    var s=sizeObj(), crust=CRUSTS.filter(function(c){return c.id===st.crust;})[0], sauce=SAUCES.filter(function(c){return c.id===st.sauce;})[0];
    var tc=0; allTops().forEach(function(t){ var r=st.toppings[t.id]; if(r) tc += t.price * (r==="whole"?1:0.5); });
    return s.base + crust.add + sauce.add + tc * s.mult;
  }

  function placeTopping(t, region) {
    var golden=2.399963, want = region==="whole"? t.n : Math.max(4, Math.round(t.n*0.62));
    var out="", i=0, placed=0, guard=0;
    while (placed<want && guard<t.n*6) {
      guard++;
      var idx=i+t.seed;
      var rr=8 + Math.sqrt((i+0.4)/t.n)*112;
      var a=idx*golden;
      var x=200+rr*Math.cos(a), y=196+rr*Math.sin(a);
      i++;
      if (region==="left" && x>194) continue;
      if (region==="right" && x<206) continue;
      placed++;
      var rot=(idx*53)%360;
      out += '<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+rot+')">'+t.draw()+'</g>';
    }
    return out;
  }

  function upd() {
    var sauce=SAUCES.filter(function(c){return c.id===st.sauce;})[0];
    $("sauceLayer").setAttribute("fill", sauce.color);
    $("cheeseLayer").style.opacity = st.sauce==="white" ? "0.55" : "1";
    var html="", anyHalf=false;
    allTops().forEach(function(t){ var r=st.toppings[t.id]; if(r){ if(r!=="whole") anyHalf=true; html+=placeTopping(t, r);} });
    $("toppingLayer").innerHTML = html;
    $("dividerLine").style.display = anyHalf ? "block" : "none";

    var pv=money(price());
    $("priceTag").textContent = pv;
    var bp=$("builderPrice"); if(bp) bp.textContent = pv;
    var s=sizeObj(), crust=CRUSTS.filter(function(c){return c.id===st.crust;})[0];
    var L=[], R=[], W=[];
    allTops().forEach(function(t){ var r=st.toppings[t.id]; if(r==="whole")W.push(t.name); else if(r==="left")L.push(t.name); else if(r==="right")R.push(t.name); });
    var parts=[];
    if(W.length) parts.push(W.join(", "));
    if(L.length) parts.push("Left: "+L.join(", "));
    if(R.length) parts.push("Right: "+R.join(", "));
    $("buildSummary").textContent = s.name+" "+s.sub+", "+crust.name.toLowerCase()+" crust, "+sauce.name.toLowerCase()+(parts.length? " · "+parts.join(" · ") : ", just cheese");
  }

  function describePizza() {
    var s=sizeObj(), crust=CRUSTS.filter(function(c){return c.id===st.crust;})[0], sauce=SAUCES.filter(function(c){return c.id===st.sauce;})[0];
    var W=[],L=[],R=[];
    allTops().forEach(function(t){ var r=st.toppings[t.id]; if(r==="whole")W.push(t.name); else if(r==="left")L.push(t.name); else if(r==="right")R.push(t.name); });
    var meta=[crust.name+" crust", sauce.name];
    if(W.length) meta.push(W.join(", "));
    if(L.length) meta.push("L: "+L.join(", "));
    if(R.length) meta.push("R: "+R.join(", "));
    if(!W.length&&!L.length&&!R.length) meta.push("cheese");
    return { title:s.name+' '+s.sub+' build-your-own pizza', meta:meta.join(" · "), price:price(), unique:true, qty:1 };
  }

  /* ---------------- CHECKOUT ---------------- */
  var LOCATIONS = [
    { n:"Fairview (Boise)", a:"6508 W Fairview Ave", t:"2083450000" },
    { n:"State Street (Boise)", a:"4320 W State Street", t:"2083840000" },
    { n:"Broadway (Boise)", a:"1326 S Broadway Ave", t:"2082468900" },
    { n:"Overland (Boise)", a:"10678 W Overland Rd", t:"2083141000" },
    { n:"Meridian", a:"601 S Main St", t:"2088889500" },
    { n:"Eagle", a:"398 S Eagle Rd", t:"2083985300" },
    { n:"Nampa", a:"1021 12th Ave S", t:"2084537400" }
  ];
  var DOORDASH = "https://www.doordash.com/search/store/flying%20pie%20pizzaria/";

  function openCheckout() {
    if (!cart.length) { alert("Add a pizza or item first!"); return; }
    var modal=$("orderModal"), body=$("modalBody");
    drawCheckout("pickup");
    modal.classList.add("open");
    function drawCheckout(mode) {
      var items = cart.map(function(it){ return '<div class="cart__item"><div style="flex:1"><div class="nm">'+it.title+(it.qty>1?' ×'+it.qty:'')+'</div>'+(it.meta?'<div class="meta">'+it.meta+'</div>':'')+'</div><div class="lineprice">'+money(it.price*it.qty)+'</div></div>'; }).join("");
      var locOpts = LOCATIONS.map(function(l){ return '<option value="'+l.n+'">'+l.n+' — '+l.a+'</option>'; }).join("");
      var head = '<span class="eyebrow">Almost there</span><h2 style="margin:.1em 0 .4em">Review your order</h2>'+
        '<div class="ord-review">'+items+'<div class="cart__total"><span>Total</span><span>'+money(cartTotal())+'</span></div></div>'+
        '<div class="seg" id="otSeg"><button class="seg__b'+(mode==="pickup"?" on":"")+'" data-m="pickup">🏬 Pickup</button><button class="seg__b'+(mode==="delivery"?" on":"")+'" data-m="delivery">🚗 Delivery</button></div>';
      var rest;
      if (mode==="pickup") {
        rest = '<label class="fld-label">Pick up at</label><select id="locSel" class="fld">'+locOpts+'</select>'+
          '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px"><input id="custName" class="fld" style="flex:1;min-width:120px" placeholder="Your name"><input id="custPhone" class="fld" style="flex:1;min-width:120px" placeholder="Phone"></div>'+
          '<button class="btn btn--green btn--lg" id="confirmBtn" style="width:100%;justify-content:center;margin-top:18px">Send my order <span class="arr">&rarr;</span></button>'+
          '<p class="demo-note">Concept demo, so no payment is taken and nothing is charged.</p>';
      } else {
        rest = '<div class="dd-box"><img src="https://cdn.doordash.com/media/photos/4d8d4ff1-ab8d-4f9c-9b35-0e8d6a4c2b9f-retina-large.png" alt="" style="display:none">'+
          '<p style="margin:0 0 6px"><strong>Flying Pie delivers through DoorDash.</strong></p>'+
          '<p style="margin:0 0 14px;color:var(--ink-soft);font-size:.95rem">We\'ll hand you off to DoorDash to finish delivery to your address. Your cart is a handy reference for what to order.</p>'+
          '<a class="btn btn--red btn--lg" id="ddBtn" href="'+DOORDASH+'" target="_blank" rel="noopener" style="width:100%;justify-content:center">Continue to DoorDash <span class="arr">&rarr;</span></a>'+
          '<p class="demo-note">Opens DoorDash in a new tab.</p>';
      }
      body.innerHTML = head + rest;
      body.querySelectorAll(".seg__b").forEach(function(b){ b.addEventListener("click", function(){ drawCheckout(b.getAttribute("data-m")); }); });
      if (mode==="pickup") $("confirmBtn").addEventListener("click", confirmPickup);
    }
    function confirmPickup() {
      var name=($("custName").value||"friend").replace(/[<>]/g,"");
      var loc=$("locSel").value, total=cartTotal();
      body.innerHTML = '<div style="text-align:center"><div style="font-size:3.4rem">🍕</div>'+
        '<h2 style="margin:.2em 0">Order received, '+name+'!</h2>'+
        '<p class="lead" style="color:var(--ink)">Your <strong>'+money(total)+'</strong> order will be ready for pickup at <strong>Flying Pie '+loc+'</strong> in about 15-20 minutes.</p>'+
        '<p class="demo-note">In this concept demo no payment is processed. On a live site this drops into the store\'s ordering system.</p>'+
        '<button class="btn btn--red" id="doneBtn" style="margin-top:6px">Keep ordering <span class="arr">&rarr;</span></button></div>';
      cart=[]; renderCart();
      $("doneBtn").addEventListener("click", function(){ $("orderModal").classList.remove("open"); });
    }
  }

  /* ---------------- WIRE UP ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("builder")) return; // only on order page
    renderOpts(); upd(); renderMenu(); renderCart();
    $("addBtn").addEventListener("click", function () {
      addToCart(describePizza());
      var b=$("addBtn"), t=b.innerHTML; b.innerHTML="Added to order! ✓";
      setTimeout(function(){ b.innerHTML=t; }, 1100);
    });
    $("resetBtn").addEventListener("click", function () { st={ size:"m", crust:"orig", sauce:"red", region:"whole", toppings:{} }; renderOpts(); upd(); });
    var cb=$("checkoutBtn"); if(cb) cb.addEventListener("click", openCheckout);
    var cb2=$("cartBtn"); if(cb2) cb2.addEventListener("click", function(){ var c=document.getElementById("cartPanel"); c.scrollIntoView({behavior:"smooth"}); });
    var cb3=$("cartBtn2"); if(cb3) cb3.addEventListener("click", function(){ document.getElementById("cartPanel").scrollIntoView({behavior:"smooth"}); });
    var spy=function(){ var pos=window.scrollY+150, cur=null; [].slice.call(document.querySelectorAll("#builder, .menu-cat")).forEach(function(s){ if(s.offsetTop<=pos) cur=s.id; }); document.querySelectorAll("#catChips .chip").forEach(function(c){ c.classList.toggle("on", c.getAttribute("href")==="#"+cur); }); };
    window.addEventListener("scroll", spy, {passive:true}); setTimeout(spy,200);
    $("modalClose").addEventListener("click", function(){ $("orderModal").classList.remove("open"); });
    $("orderModal").addEventListener("click", function(e){ if(e.target.id==="orderModal") $("orderModal").classList.remove("open"); });
  });
})();
