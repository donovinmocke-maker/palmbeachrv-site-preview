/* Palm Beach RV & Boat Storage — interactive lot map (demo)
   Clean redrawn SVG schematic. Loads js/lot-data.json.
*/
(function () {
  "use strict";

  // When the Storable Edge availability API is ready, set this to its URL.
  // Expected JSON: { "449": "available", "300": "rented" }
  // or { "spaces": [{ "id": "449", "status": "available" }] }.
  // While empty, the map uses clearly labeled example availability.
  const AVAILABILITY_ENDPOINT = "";

  const DEMO_SEED = 20261117;
  const AVAILABLE_RATE = 0.38;
  const MIN_SCALE = 1;
  const MAX_SCALE = 7;
  const NUMBER_ZOOM = 1.65;

  function assetBase() {
    var el = document.querySelector('script[src*="lot-map.js"]');
    var src = (el && el.getAttribute("src")) || "js/lot-map.js";
    return src.replace(/js\/lot-map\.js(\?.*)?$/, "");
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function demoAvailability(ids) {
    var rand = mulberry32(DEMO_SEED);
    var map = {};
    ids.forEach(function (id) {
      map[id] = rand() < AVAILABLE_RATE ? "available" : "rented";
    });
    map["449"] = "available";
    return map;
  }

  function parseAvailability(data) {
    var map = {};
    if (!data) return map;
    if (Array.isArray(data.spaces)) {
      data.spaces.forEach(function (s) {
        if (s && s.id != null) map[String(s.id)] = normalizeStatus(s.status);
      });
      return map;
    }
    Object.keys(data).forEach(function (k) {
      if (k === "spaces") return;
      map[String(k)] = normalizeStatus(data[k]);
    });
    return map;
  }

  function normalizeStatus(v) {
    var s = String(v || "").toLowerCase();
    if (s === "available" || s === "vacant" || s === "open" || s === "yes" || s === "true") {
      return "available";
    }
    return "rented";
  }

  function loadAvailability(ids) {
    if (AVAILABILITY_ENDPOINT && String(AVAILABILITY_ENDPOINT).trim()) {
      return fetch(AVAILABILITY_ENDPOINT)
        .then(function (res) {
          if (!res.ok) throw new Error("Availability " + res.status);
          return res.json();
        })
        .then(function (data) {
          var parsed = parseAvailability(data);
          if (Object.keys(parsed).length === 0) return demoAvailability(ids);
          return parsed;
        })
        .catch(function () {
          return demoAvailability(ids);
        });
    }
    return Promise.resolve(demoAvailability(ids));
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stallTransform(s) {
    return "translate(" + s.x + "," + s.y + ") rotate(" + s.rotation + ")";
  }

  function openChatWith(text) {
    if (window.PBRVChat && typeof window.PBRVChat.open === "function") {
      window.PBRVChat.open({ prefill: text });
      return;
    }
    var btn = document.querySelector("[data-open-chat]");
    if (btn) btn.click();
    setTimeout(function () {
      if (window.PBRVChat && typeof window.PBRVChat.open === "function") {
        window.PBRVChat.open({ prefill: text });
        return;
      }
      var input = document.getElementById("pbrv-chat-input");
      if (input) {
        input.value = text;
        input.focus();
      }
    }, 200);
  }

  function iconMarkup(type, x, y) {
    var r = 11;
    var body;
    if (type === "office") {
      return "";
    }
    if (type === "dumpsters") {
      body = '<rect x="-4" y="-3" width="8" height="8" rx="1"/><rect x="-5" y="-5" width="10" height="2.2" rx="0.7"/><path d="M-1.5 -5 V-6.5 H1.5 V-5"/>';
    } else if (type === "compressor") {
      body = '<circle r="3.2" fill="none" stroke="#1a2456" stroke-width="1.4"/><path d="M0 -3.2 V-5.5 M-2 5 H2" fill="none" stroke="#1a2456" stroke-width="1.3" stroke-linecap="round"/><path d="M-4.5 1.5 H-6.5 M4.5 1.5 H6.5" fill="none" stroke="#1a2456" stroke-width="1.3" stroke-linecap="round"/>';
    } else if (type === "flush") {
      body = '<path d="M0 -6 C3.6 -6 5.5 -3 5.5 0 C5.5 3.8 0 7.5 0 7.5 S-5.5 3.8 -5.5 0 C-5.5 -3 -3.6 -6 0 -6Z" fill="none" stroke="#1a2456" stroke-width="1.35"/>';
    } else if (type === "wash") {
      body = '<path d="M-3.5 -2 C-3.5 -4.5 -1.5 -6 0 -6 C1.5 -6 3.5 -4.5 3.5 -2 C3.5 1 0 3 0 3S-3.5 1 -3.5 -2Z" fill="none" stroke="#1a2456" stroke-width="1.3"/><path d="M-5 6 Q-2.5 3.5 0 6 Q2.5 3.5 5 6" fill="none" stroke="#1a2456" stroke-width="1.2" stroke-linecap="round"/>';
    } else {
      body = '<circle r="3"/>';
    }
    return (
      '<g class="lot-amenity__icon" transform="translate(' + x + "," + y + ')">' +
        '<circle class="lot-amenity__disc" r="' + r + '"/>' +
        '<g class="lot-amenity__glyph" fill="#1a2456">' + body + "</g>" +
      "</g>"
    );
  }

  function labelPill(text, x, y, anchor, klass) {
    var fs = klass === "lot-amenity__label" ? 11 : 13.5;
    var tw = String(text).length * fs * 0.62 + 10;
    var th = fs + 8;
    var px;
    if (anchor === "end") px = x - tw;
    else if (anchor === "start") px = x;
    else px = x - tw / 2;
    var py = y - th / 2;
    return (
      '<g class="' + (klass || "lot-row-label") + '">' +
        '<rect x="' + px.toFixed(1) + '" y="' + py.toFixed(1) + '" width="' + tw.toFixed(1) + '" height="' + th + '" rx="5" ry="5"/>' +
        '<text x="' + x + '" y="' + y + '" text-anchor="' + anchor + '" dominant-baseline="middle">' +
          escapeHtml(text) +
        "</text>" +
      "</g>"
    );
  }

  function init(root) {
    var viewport = root.querySelector("[data-lot-viewport]");
    var cardEl = root.querySelector("[data-lot-card]");
    if (!viewport || !cardEl) return;

    var base = assetBase();
    var dataUrl = base + "js/lot-data.json";
    var view = { scale: 1, x: 0, y: 0 };
    var state = {
      data: null,
      availability: {},
      openId: null,
      pointers: new Map(),
      lastPinch: 0,
      panning: false,
      moved: false
    };

    fetch(dataUrl)
      .then(function (res) {
        if (!res.ok) throw new Error("Could not load lot data");
        return res.json();
      })
      .then(function (data) {
        state.data = data;
        var ids = data.spaces.map(function (s) { return String(s.id); });
        return loadAvailability(ids).then(function (avail) {
          state.availability = avail;
          renderMap(data, avail);
        });
      })
      .catch(function () {
        viewport.innerHTML =
          '<p style="padding:2rem;text-align:center;color:#5b5852">The site plan could not be loaded. Please refresh, or use Reserve a space below.</p>';
      });

    root.querySelectorAll("[data-lot-zoom]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = btn.getAttribute("data-lot-zoom");
        if (action === "in") zoomAt(1.3, viewport.clientWidth / 2, viewport.clientHeight / 2);
        else if (action === "out") zoomAt(1 / 1.3, viewport.clientWidth / 2, viewport.clientHeight / 2);
        else resetView();
      });
    });

    function renderMap(data, avail) {
      var w = data.imageWidth;
      var h = data.imageHeight;

      var shells = (data.buildings || []).map(function (b) {
        return (
          '<g class="lot-building" transform="translate(' + b.x + "," + b.y + ") rotate(" + b.rotation + ')">' +
            '<rect class="lot-building__shell" x="' + (-b.w / 2) + '" y="' + (-b.h / 2) + '" width="' + b.w + '" height="' + b.h + '" rx="6" ry="6"/>' +
          "</g>"
        );
      }).join("");

      var wash = (data.washSlots || []).map(function (s) {
        return (
          '<g class="lot-wash" transform="' + stallTransform(s) + '">' +
            '<rect x="' + (-s.w / 2) + '" y="' + (-s.h / 2) + '" width="' + s.w + '" height="' + s.h + '" rx="1.5"/>' +
          "</g>"
        );
      }).join("");

      var stalls = data.spaces.map(function (s) {
        var status = avail[String(s.id)] === "available" ? "available" : "rented";
        var tight = s.w < 18;
        var fs = tight ? 8.5 : 10.5;
        var hitW = Math.max(s.w, 14);
        var hitH = Math.max(s.h, 14);
        var label = "Space " + s.id + ", " + (status === "available" ? "available" : "rented") + " (example)";
        return (
          '<g class="lot-space lot-space--' + status + (tight ? " lot-space--tight" : "") + '" data-space="' + escapeHtml(s.id) + '"' +
            ' transform="' + stallTransform(s) + '"' +
            ' role="button" tabindex="0" aria-label="' + escapeHtml(label) + '">' +
            '<rect class="lot-space__hit" x="' + (-hitW / 2) + '" y="' + (-hitH / 2) + '" width="' + hitW + '" height="' + hitH + '" />' +
            '<rect class="lot-space__body" x="' + (-s.w / 2) + '" y="' + (-s.h / 2) + '" width="' + s.w + '" height="' + s.h + '" rx="1.4" />' +
            '<text class="lot-space__label" transform="rotate(' + (-s.rotation) + ')" font-size="' + fs + '">' + escapeHtml(s.id) + "</text>" +
          "</g>"
        );
      }).join("");

      var rowLabels = (data.buildings || []).map(function (b) {
        return labelPill(b.label, b.labelX, b.labelY, b.labelAnchor || "middle", "lot-row-label");
      }).join("");

      var amenitySvg = (data.amenities || []).map(function (a) {
        if (a.icon === "office") {
          var ow = a.w || 56, oh = a.h || 36;
          return (
            '<g class="lot-office" transform="translate(' + a.x + "," + a.y + ')">' +
              '<rect class="lot-office__bldg" x="' + (-ow / 2) + '" y="' + (-oh / 2) + '" width="' + ow + '" height="' + oh + '" rx="6"/>' +
              '<text class="lot-office__word" y="-2" text-anchor="middle" dominant-baseline="middle">Office</text>' +
              '<text class="lot-office__sub" y="11" text-anchor="middle">Entrance</text>' +
            "</g>"
          );
        }
        var side = a.labelSide || "right";
        var anchor = side === "left" ? "end" : (side === "top" ? "middle" : "start");
        var lx = a.labelX != null ? a.labelX : a.x + (side === "left" ? -16 : 16);
        var ly = a.labelY != null ? a.labelY : a.y;
        return (
          '<g class="lot-amenity" data-amenity="' + escapeHtml(a.id) + '">' +
            iconMarkup(a.icon, a.x, a.y) +
            labelPill(a.label, lx, ly, anchor, "lot-amenity__label") +
          "</g>"
        );
      }).join("");

      viewport.innerHTML =
        '<div class="lot-map-stage" data-lot-stage>' +
          '<svg class="lot-map-svg" viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Simplified facility map with clickable spaces">' +
            '<rect class="lot-ground" width="' + w + '" height="' + h + '"/>' +
            '<g class="lot-buildings">' + shells + "</g>" +
            '<g class="lot-wash-group">' + wash + "</g>" +
            '<g class="lot-spaces">' + stalls + "</g>" +
            '<g class="lot-row-labels">' + rowLabels + "</g>" +
            '<g class="lot-amenities">' + amenitySvg + "</g>" +
          "</svg>" +
        "</div>";

      var stage = viewport.querySelector("[data-lot-stage]");
      bindSpaces();
      bindPanZoom(stage);
      resetView();
    }

    function bindSpaces() {
      viewport.querySelectorAll(".lot-space").forEach(function (g) {
        g.addEventListener("click", function (e) {
          e.stopPropagation();
          if (state.moved) return;
          openSpace(g.getAttribute("data-space"), g);
        });
        g.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openSpace(g.getAttribute("data-space"), g);
          }
        });
      });
      viewport.addEventListener("click", function (e) {
        if (!e.target.closest(".lot-space")) closeCard();
      });
    }

    function statusOf(id) {
      return state.availability[String(id)] === "available" ? "available" : "rented";
    }

    function openSpace(id, node) {
      var space = (state.data.spaces || []).find(function (s) { return String(s.id) === String(id); });
      if (!space) return;
      var status = statusOf(id);
      state.openId = String(id);
      viewport.querySelectorAll(".lot-space.is-open").forEach(function (el) {
        el.classList.remove("is-open");
      });
      if (node) node.classList.add("is-open");

      var sizeLine = space.size
        ? escapeHtml(space.size)
        : "Size and price shown at checkout";
      var statusLabel = status === "available" ? "Available (example)" : "Rented (example)";
      var actions;
      if (status === "available") {
        actions =
          '<div class="lot-card-actions">' +
            '<a class="btn btn-primary" href="units.html#rent">Reserve this space</a>' +
            '<button type="button" class="btn btn-outline" data-lot-ask>Ask about this space</button>' +
          "</div>";
      } else {
        actions =
          '<div class="lot-card-actions">' +
            '<button type="button" class="btn btn-primary" data-lot-waitlist>Rented — ask to join the waitlist</button>' +
          "</div>";
      }

      cardEl.hidden = false;
      cardEl.innerHTML =
        '<button type="button" class="lot-card-close" data-lot-close aria-label="Close">&times;</button>' +
        "<h3>Space " + escapeHtml(id) + "</h3>" +
        '<span class="lot-card-status lot-card-status--' + status + '">' + statusLabel + "</span>" +
        "<p>" + sizeLine + "</p>" +
        actions;

      cardEl.querySelector("[data-lot-close]").addEventListener("click", function (e) {
        e.stopPropagation();
        closeCard();
      });
      var ask = cardEl.querySelector("[data-lot-ask]");
      if (ask) {
        ask.addEventListener("click", function () {
          openChatWith("I'm interested in space " + id);
        });
      }
      var wait = cardEl.querySelector("[data-lot-waitlist]");
      if (wait) {
        wait.addEventListener("click", function () {
          openChatWith("I'd like to join the waitlist for space " + id);
        });
      }

      positionCard(node);
    }

    function positionCard(node) {
      if (window.matchMedia("(max-width: 720px)").matches) {
        cardEl.style.left = "";
        cardEl.style.top = "";
        cardEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
        return;
      }
      var rootR = root.getBoundingClientRect();
      var vr = viewport.getBoundingClientRect();
      var nr = node ? node.getBoundingClientRect() : vr;
      var cw = cardEl.offsetWidth;
      var ch = cardEl.offsetHeight;
      var left = nr.right - rootR.left + 12;
      var top = nr.top - rootR.top;
      var maxL = rootR.width - cw - 8;
      var maxT = rootR.height - ch - 8;
      if (left > maxL) left = nr.left - rootR.left - cw - 12;
      if (left < 8) left = 8;
      if (top > maxT) top = Math.max(8, maxT);
      if (top < 8) top = 8;
      cardEl.style.left = left + "px";
      cardEl.style.top = top + "px";
    }

    function closeCard() {
      state.openId = null;
      cardEl.hidden = true;
      cardEl.innerHTML = "";
      viewport.querySelectorAll(".lot-space.is-open").forEach(function (el) {
        el.classList.remove("is-open");
      });
    }

    function applyView() {
      var stage = viewport.querySelector("[data-lot-stage]");
      if (!stage) return;
      view.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, view.scale));
      var sw = viewport.clientWidth;
      var sh = viewport.clientHeight;
      var cw = stage.offsetWidth * view.scale;
      var ch = stage.offsetHeight * view.scale;
      var minX = Math.min(0, sw - cw);
      var minY = Math.min(0, sh - ch);
      view.x = Math.min(0, Math.max(minX, view.x));
      view.y = Math.min(0, Math.max(minY, view.y));
      stage.style.transform = "translate(" + view.x + "px," + view.y + "px) scale(" + view.scale + ")";
      stage.classList.toggle("is-zoomed-in", view.scale >= NUMBER_ZOOM);
      if (state.openId) {
        var node = viewport.querySelector('.lot-space[data-space="' + state.openId + '"]');
        if (node) positionCard(node);
      }
    }

    function resetView() {
      view.scale = 1;
      view.x = 0;
      view.y = 0;
      applyView();
    }

    function zoomAt(factor, cx, cy) {
      var next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, view.scale * factor));
      var real = next / view.scale;
      view.x = cx - (cx - view.x) * real;
      view.y = cy - (cy - view.y) * real;
      view.scale = next;
      applyView();
    }

    function bindPanZoom(stage) {
      viewport.addEventListener("wheel", function (e) {
        e.preventDefault();
        var rect = viewport.getBoundingClientRect();
        var factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
        zoomAt(factor, e.clientX - rect.left, e.clientY - rect.top);
      }, { passive: false });

      viewport.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        viewport.setPointerCapture(e.pointerId);
        state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        state.moved = false;
        if (state.pointers.size === 1) {
          state.panning = true;
          viewport.classList.add("is-panning");
        } else if (state.pointers.size === 2) {
          state.panning = false;
          var pts = Array.from(state.pointers.values());
          state.lastPinch = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        }
      });

      viewport.addEventListener("pointermove", function (e) {
        if (!state.pointers.has(e.pointerId)) return;
        var prev = state.pointers.get(e.pointerId);
        var dx = e.clientX - prev.x;
        var dy = e.clientY - prev.y;
        state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (state.pointers.size === 2) {
          var pts = Array.from(state.pointers.values());
          var dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
          if (state.lastPinch > 0 && dist > 0) {
            var rect = viewport.getBoundingClientRect();
            var mx = (pts[0].x + pts[1].x) / 2 - rect.left;
            var my = (pts[0].y + pts[1].y) / 2 - rect.top;
            zoomAt(dist / state.lastPinch, mx, my);
          }
          state.lastPinch = dist;
          state.moved = true;
          return;
        }

        if (state.panning) {
          if (Math.abs(dx) + Math.abs(dy) > 8) state.moved = true;
          view.x += dx;
          view.y += dy;
          applyView();
        }
      });

      function endPointer(e) {
        state.pointers.delete(e.pointerId);
        if (state.pointers.size < 2) state.lastPinch = 0;
        if (state.pointers.size === 0) {
          state.panning = false;
          viewport.classList.remove("is-panning");
          setTimeout(function () { state.moved = false; }, 0);
        }
      }
      viewport.addEventListener("pointerup", endPointer);
      viewport.addEventListener("pointercancel", endPointer);
      viewport.addEventListener("lostpointercapture", endPointer);

      window.addEventListener("resize", function () { applyView(); });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeCard();
    });
  }

  function boot() {
    document.querySelectorAll("[data-lot-map]").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
