/* Palm Beach RV & Boat Storage — Enquiries chat
   No external dependencies.
*/
(function () {
  "use strict";

  // Set this to the AI backend URL when it is ready.
  // While empty, the widget runs in OFFLINE MODE: answers come only from
  // the FAQ below (published site facts). Callback requests use mailto.
  const CHAT_ENDPOINT = "";

  const PHONE_TEL = "tel:+12395230756";
  const PHONE_DISPLAY = "(239) 523-0756";
  const EMAIL = "palmbeachstorage@gmail.com";
  const OFFICE_HOURS = "Monday–Sunday, 9am–5pm";
  const GATE_HOURS = "24 hours a day, 7 days a week";
  const ADDRESS = "11190 Palm Beach Boulevard, Fort Myers, Florida 33905";

  const SCRIPT_EL = document.currentScript;

  function isOfflineMode() {
    return !CHAT_ENDPOINT || !String(CHAT_ENDPOINT).trim();
  }

  function assetBase() {
    var src = (SCRIPT_EL && SCRIPT_EL.getAttribute("src")) || "js/chat.js";
    return src.replace(/js\/chat\.js(\?.*)?$/, "");
  }

  function rentUrl() {
    return assetBase() + "units.html#rent";
  }

  /* FAQ used only in offline mode. Every answer is a published site fact.
     Do not add prices, sizes, hours, or amenities that are not on the site. */
  const FAQ = [
    {
      id: "hours",
      keywords: ["hour", "hours", "open", "office", "when are you", "business hours", "9am", "9 am"],
      answer: "The office is open Monday–Sunday, 9am–5pm. Gate access is 24 hours a day, 7 days a week. Staff is on site Monday through Sunday during business hours. For an urgent gate problem after office hours, please call (239) 523-0756."
    },
    {
      id: "gate",
      keywords: ["gate", "access", "gate code", "keypad", "24 hour", "24-hour", "24/7", "get in", "get in and out", "in and out", "how do i get in", "stuck", "locked out", "won't open", "after hours", "after-hours", "urgent", "emergency"],
      answer: "Gate access runs 24 hours a day, 7 days a week. You get your own gate code when you move in — not shared. If you’re not a tenant with a gate code, you’re not getting in. For an urgent gate problem after office hours, please call (239) 523-0756."
    },
    {
      id: "address",
      keywords: ["address", "location", "where", "directions", "i-75", "i75", "map", "find you", "palm beach"],
      answer: "We’re at 11190 Palm Beach Boulevard, Fort Myers, Florida 33905, between I-75 and SR-31. From I-75 (north or south), take Exit 141 for FL-80/Palm Beach Blvd toward Fort Myers/LaBelle, then head east on Palm Beach Blvd (FL-80 E) for about 1.5 miles. The facility is on the right. From downtown Fort Myers, head east on First St/FL-80, continue on FL-80 E / Palm Beach Blvd past I-75, and go 1.5 miles past the interstate — we’ll be on your right."
    },
    {
      id: "prices",
      keywords: ["price", "prices", "pricing", "rate", "rates", "cost", "how much", "availability", "available", "unit", "units", "size", "sizes", "spot", "spaces"],
      answer: "Published monthly rates from the current rental listing:\n\n• 9' × 28.75' — 20 amp electric, Building 2 — $220/mo\n• 11' × 28.75' — 20 amp electric, Building 2 — $270/mo\n• 11' × 29.5' — 20 amp electric, Building 3 — $275/mo\n\nThere are 362 covered spots. More sizes may be available. You can check live availability and reserve a space in the rental system."
    },
    {
      id: "electric",
      keywords: ["electric", "electricity", "amp", "power", "outlet", "hookup", "50-amp", "50 amp", "20-amp", "20 amp", "30-amp", "30 amp"],
      answer: "Electric is included in the monthly rate, at no extra fee. Buildings 2, 3, and 5 have 20-amp outlets. All other buildings have 30-amp. A standard 30-to-50 amp adapter works on the 30-amp spots, which gives you enough power to run one AC unit during storage. That’s what most owners use to keep the interior dry and batteries maintained. Running multiple AC units at the same time needs a full 50-amp connection, which these spots don’t have."
    },
    {
      id: "covered",
      keywords: ["covered", "cover", "roof", "canopy", "sun", "rain", "uv", "shade"],
      answer: "Every spot has a roof over it. Sun and rain protection comes standard, not as an upgrade. The facility has ten steel canopy structures, built for high winds and heavy rain."
    },
    {
      id: "clearance",
      keywords: ["clearance", "height", "15-foot", "15 foot", "40-foot", "40 foot", "motorhome", "pull-through", "pull through", "back in", "class a"],
      answer: "Our clearance height is 15 feet, which covers anything street-legal. You can back in a 40-foot motorhome. Pull-through spots are also available if you’d rather not back in. When you come in the first time, someone will show you exactly where to go."
    },
    {
      id: "amenities",
      keywords: ["amenity", "amenities", "wash", "wash bay", "ice", "dump", "compressor", "paved", "camera", "security", "surveillance", "fence", "fenced", "wall"],
      answer: "The facility is fully paved, with a concrete block perimeter and a single gated entry. Amenities include an enclosed boat wash bay with a motor flush station, a 200-lb ice machine, an RV dump station, and an air compressor. There is HD camera surveillance throughout, and the facility is well lit at night. The wash bay, dump station, and service area are at the rear of the property. The office and ice machine are at the entrance."
    },
    {
      id: "insurance",
      keywords: ["insurance", "coverage", "policy", "insured"],
      answer: "Yes. We require all tenants to carry their own coverage on their vehicle. Your existing auto, boat, or RV policy typically covers stored vehicles. Check with your provider to confirm you’re covered before move-in."
    },
    {
      id: "food",
      keywords: ["food truck", "food trailer", "food-truck"],
      answer: "We don’t store food trucks or food trailers. Everything else is welcome — cars, trucks, trailers, ATVs, boats, and RVs. If it can be driven on a Florida road, it fits here."
    },
    {
      id: "payment",
      keywords: ["cancel", "cancellation", "payment", "due", "pro-rate", "prorate", "pro rate", "rent due"],
      answer: "Payment is due on the first of each month. If you move in mid-month, your rent will be pro-rated."
    },
    {
      id: "contact",
      keywords: ["phone", "call", "email", "contact", "number"],
      answer: "You can ask for a call back or talk to a person at any time using the button below. You can also call the office at (239) 523-0756 or email palmbeachstorage@gmail.com. Office hours are Monday–Sunday, 9am–5pm. For an urgent gate problem after office hours, please call (239) 523-0756."
    },
    {
      id: "about",
      keywords: ["who owns", "family", "about you", "how long", "local"],
      answer: "Palm Beach RV and Boat Storage is family-owned and family-run, with someone on site every day of the week. The team grew up in Fort Myers and has watched Lee County grow for over 30 years. It is not a chain or an out-of-town investment."
    },
    {
      id: "reserve",
      keywords: ["reserve", "rent a space", "rent now", "book", "sign up"],
      answer: "You can reserve a space in our online rental system."
    }
  ];

  const GREETING = "Hi — welcome to Palm Beach RV & Boat Storage. How can we help you today? You can check availability, reserve a space, or ask a question. You can request a call back or talk to a person at any time.\n\nFor an urgent gate problem after office hours, please call (239) 523-0756.\n\nOr ask me anything in the box below, for example \"Is electric included?\".";

  const UNKNOWN = "I don’t have that information here, but a team member will follow up with you. What’s the best name and a phone number or email to reach you?";

  const ASK_PROMPT = "Of course — type your question below and we’ll help if we can. You can request a call back or talk to a person at any time. For an urgent gate problem after office hours, please call (239) 523-0756.";

  var state = {
    open: false,
    started: false,
    history: [],
    awaitingContact: false,
    lastOpener: null
  };

  function el(html) {
    var wrap = document.createElement("div");
    wrap.innerHTML = html.trim();
    return wrap.firstElementChild;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatText(text) {
    var safe = escapeHtml(text);
    safe = safe.replace(/\n/g, "<br>");
    var rent = rentUrl();
    safe = safe.replace(
      /online rental system/g,
      '<a href="' + escapeHtml(rent) + '">online rental system</a>'
    );
    return safe;
  }

  function mount() {
    if (document.getElementById("pbrv-chat-panel")) return;
    var base = assetBase();
    var root = el(
      '<div class="pbrv-chat-root" id="pbrv-chat-root">' +
        '<button type="button" class="pbrv-chat-bubble" data-open-chat aria-haspopup="dialog" aria-controls="pbrv-chat-panel" aria-expanded="false">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6.5A3.5 3.5 0 0 1 7.5 3h9A3.5 3.5 0 0 1 20 6.5v6A3.5 3.5 0 0 1 16.5 16H12l-4.5 4v-4H7.5A3.5 3.5 0 0 1 4 12.5v-6Z"/></svg>' +
          "Enquiries" +
        "</button>" +
        '<section class="pbrv-chat-panel" id="pbrv-chat-panel" role="dialog" aria-modal="true" aria-labelledby="pbrv-chat-title" hidden>' +
          '<div class="pbrv-chat-header">' +
            '<img src="' + escapeHtml(base + "images/logo.png") + '" alt="">' +
            '<div class="pbrv-chat-header-text">' +
              '<h2 id="pbrv-chat-title">Enquiries</h2>' +
              "<p>Palm Beach RV &amp; Boat Storage</p>" +
            "</div>" +
            '<button type="button" class="pbrv-chat-close" data-close-chat aria-label="Close chat">&times;</button>' +
          "</div>" +
          '<div class="pbrv-chat-log" id="pbrv-chat-log" aria-live="polite"></div>' +
          '<form class="pbrv-chat-composer" id="pbrv-chat-composer">' +
            '<label class="visually-hidden" for="pbrv-chat-input" style="position:absolute;left:-999px;width:1px;height:1px;overflow:hidden">Type a message</label>' +
            '<input id="pbrv-chat-input" type="text" autocomplete="off" placeholder="Type a message…">' +
            '<button type="submit" class="pbrv-chat-send" aria-label="Send">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.4 20.6 21 12 3.4 3.4 3 10.3 15 12 3 13.7z"/></svg>' +
            "</button>" +
          "</form>" +
          '<div class="pbrv-chat-footer">' +
            '<button type="button" class="pbrv-chat-talk" data-talk-person>Talk to a person</button>' +
          "</div>" +
        "</section>" +
      "</div>"
    );
    document.body.appendChild(root);

    root.querySelectorAll("[data-open-chat]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openChat(btn);
      });
    });
    root.querySelector("[data-close-chat]").addEventListener("click", closeChat);
    root.querySelector("[data-talk-person]").addEventListener("click", function () {
      showTalkToPerson(true);
    });
    document.getElementById("pbrv-chat-composer").addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("pbrv-chat-input");
      var text = (input.value || "").trim();
      if (!text) return;
      input.value = "";
      handleUserText(text);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.open) closeChat();
    });

    document.addEventListener("click", function (e) {
      var opener = e.target.closest("[data-open-chat]");
      if (!opener || root.contains(opener)) return;
      e.preventDefault();
      openChat(opener);
    });
  }

  function setExpanded(open) {
    document.querySelectorAll("[data-open-chat]").forEach(function (btn) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function openChat(opener) {
    var panel = document.getElementById("pbrv-chat-panel");
    state.lastOpener = opener || state.lastOpener;
    state.open = true;
    panel.hidden = false;
    requestAnimationFrame(function () {
      panel.classList.add("is-open");
    });
    document.body.classList.add("pbrv-chat-open");
    setExpanded(true);
    if (!state.started) startConversation();
    var closeBtn = panel.querySelector("[data-close-chat]");
    if (closeBtn) closeBtn.focus();
  }

  function closeChat() {
    var panel = document.getElementById("pbrv-chat-panel");
    state.open = false;
    panel.classList.remove("is-open");
    document.body.classList.remove("pbrv-chat-open");
    setExpanded(false);
    var hide = function () {
      if (!state.open) panel.hidden = true;
    };
    setTimeout(hide, 280);
    if (state.lastOpener && typeof state.lastOpener.focus === "function") {
      state.lastOpener.focus();
    }
  }

  function startConversation() {
    state.started = true;
    addBot(GREETING, { chips: true });
  }

  function chipsHtml() {
    var rent = rentUrl();
    var examples = [
      "Is electric included?",
      "Can I back in a 40-foot motorhome?",
      "How do I get in and out?"
    ];
    var exampleHtml = examples.map(function (q) {
      return (
        '<button type="button" class="pbrv-chat-chip pbrv-chat-chip--example" data-chip="faq" data-question="' +
        escapeHtml(q) +
        '">' +
        escapeHtml(q) +
        "</button>"
      );
    }).join("");
    return (
      '<div class="pbrv-chat-chip-block">' +
        '<div class="pbrv-chat-chips">' +
          '<button type="button" class="pbrv-chat-chip" data-chip="availability">Check availability &amp; prices</button>' +
          '<a class="pbrv-chat-chip" data-chip="reserve" href="' + escapeHtml(rent) + '">Reserve a space</a>' +
          '<button type="button" class="pbrv-chat-chip" data-chip="ask">Ask a question</button>' +
          '<button type="button" class="pbrv-chat-chip" data-chip="person">Talk to a person</button>' +
        "</div>" +
        '<div class="pbrv-chat-chips pbrv-chat-chips--examples">' +
          exampleHtml +
        "</div>" +
      "</div>"
    );
  }

  function bindChips(node) {
    node.querySelectorAll("[data-chip]").forEach(function (chip) {
      chip.addEventListener("click", function (e) {
        var kind = chip.getAttribute("data-chip");
        if (kind === "reserve") {
          // Let the link navigate to the rental widget. Also confirm in chat.
          addUser("Reserve a space");
          addBot("You can reserve a space in our online rental system.");
          return;
        }
        e.preventDefault();
        if (kind === "availability") {
          addUser("Check availability & prices");
          replyAvailability();
        } else if (kind === "ask") {
          addUser("Ask a question");
          addBot(ASK_PROMPT);
          var input = document.getElementById("pbrv-chat-input");
          if (input) input.focus();
        } else if (kind === "person") {
          addUser("Talk to a person");
          showTalkToPerson(false);
        } else if (kind === "faq") {
          var question = chip.getAttribute("data-question") || chip.textContent.trim();
          if (question) handleUserText(question);
        }
      });
    });
  }

  function addUser(text) {
    state.history.push({ role: "user", text: text });
    var log = document.getElementById("pbrv-chat-log");
    var msg = el('<div class="pbrv-chat-msg pbrv-chat-msg--user"><p></p></div>');
    msg.querySelector("p").textContent = text;
    log.appendChild(msg);
    scrollLog();
  }

  function addBot(text, opts) {
    opts = opts || {};
    state.history.push({ role: "bot", text: text });
    var log = document.getElementById("pbrv-chat-log");
    var msg = el('<div class="pbrv-chat-msg pbrv-chat-msg--bot"></div>');
    msg.innerHTML = "<p>" + formatText(text).replace(/<br>/g, "</p><p>") + "</p>";
    if (opts.chips) {
      var chips = el(chipsHtml());
      bindChips(chips);
      msg.appendChild(chips);
    }
    if (opts.extra) msg.appendChild(opts.extra);
    log.appendChild(msg);
    scrollLog();
    return msg;
  }

  function scrollLog() {
    var log = document.getElementById("pbrv-chat-log");
    log.scrollTop = log.scrollHeight;
  }

  function replyAvailability() {
    var item = FAQ.filter(function (f) { return f.id === "prices"; })[0];
    var extra = el(
      '<p style="margin-top:0.7rem"><a class="pbrv-chat-chip" href="' +
        escapeHtml(rentUrl()) +
        '">Reserve a space</a></p>'
    );
    addBot(item.answer, { extra: extra });
  }

  function personCard() {
    var card = el(
      '<div class="pbrv-chat-person" id="pbrv-person-card">' +
        "<h3>Talk to a person</h3>" +
        "<p>You can request a call back or talk to a person at any time. Call the office during office hours. For an urgent gate problem after hours, please call " + PHONE_DISPLAY + ".</p>" +
        '<a class="pbrv-chat-call" href="' + PHONE_TEL + '">Call ' + PHONE_DISPLAY + "</a>" +
        "<p><strong>Office hours:</strong> " + OFFICE_HOURS + "<br><strong>Gate access:</strong> " + GATE_HOURS + "</p>" +
        "<h3>Request a call back</h3>" +
        '<form class="pbrv-chat-form" id="pbrv-callback-form">' +
          '<label for="pbrv-cb-name">Name</label>' +
          '<input id="pbrv-cb-name" name="name" type="text" required autocomplete="name">' +
          '<label for="pbrv-cb-phone">Phone</label>' +
          '<input id="pbrv-cb-phone" name="phone" type="tel" required autocomplete="tel">' +
          '<label for="pbrv-cb-time">Best time</label>' +
          '<input id="pbrv-cb-time" name="bestTime" type="text" required placeholder="For example, weekday mornings">' +
          '<label for="pbrv-cb-msg">Message</label>' +
          '<textarea id="pbrv-cb-msg" name="message" rows="3" required></textarea>' +
          '<button type="submit">Request a call back</button>' +
        "</form>" +
      "</div>"
    );
    card.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      submitCallback({
        name: card.querySelector("[name=name]").value.trim(),
        phone: card.querySelector("[name=phone]").value.trim(),
        bestTime: card.querySelector("[name=bestTime]").value.trim(),
        message: card.querySelector("[name=message]").value.trim()
      });
    });
    return card;
  }

  function showTalkToPerson(fromFooter) {
    if (fromFooter) {
      var already = document.getElementById("pbrv-person-card");
      if (already) {
        already.scrollIntoView({ block: "nearest" });
        already.querySelector("input, a").focus();
        return;
      }
    }
    var intro = "You can request a call back or talk to a person at any time. You can also call the office during office hours (" + OFFICE_HOURS + "). For an urgent gate problem after hours, please call " + PHONE_DISPLAY + ".";
    addBot(intro, { extra: personCard() });
  }

  function payloadBase() {
    return {
      page: location.pathname,
      url: location.href,
      history: state.history.slice()
    };
  }

  function submitCallback(fields) {
    var body = Object.assign({ type: "callback" }, fields, payloadBase());
    if (isOfflineMode()) {
      var lines = [
        "Name: " + fields.name,
        "Phone: " + fields.phone,
        "Best time: " + fields.bestTime,
        "Message: " + fields.message
      ];
      var href =
        "mailto:" +
        EMAIL +
        "?subject=" +
        encodeURIComponent("Call back request — Palm Beach RV & Boat Storage") +
        "&body=" +
        encodeURIComponent(lines.join("\n"));
      window.location.href = href;
      addBot(
        "Thanks, " +
          fields.name +
          ". We’ve prepared an email to " +
          EMAIL +
          " with your call-back request. If it didn’t open, please email that address or call " +
          PHONE_DISPLAY +
          "."
      );
      return;
    }
    postToEndpoint(body)
      .then(function () {
        addBot("Thanks, " + fields.name + ". A team member will call you back.");
      })
      .catch(function () {
        addBot(
          "We couldn’t send that just now. Please call " +
            PHONE_DISPLAY +
            " or email " +
            EMAIL +
            "."
        );
      });
  }

  function looksLikeContact(text) {
    var email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text);
    var phone = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
    return email || phone;
  }

  function handleContactFollowup(text) {
    state.awaitingContact = false;
    if (isOfflineMode()) {
      var href =
        "mailto:" +
        EMAIL +
        "?subject=" +
        encodeURIComponent("Website enquiry follow-up — Palm Beach RV & Boat Storage") +
        "&body=" +
        encodeURIComponent("Visitor contact / message:\n" + text);
      window.location.href = href;
      addBot(
        "Thank you. We’ll use that to follow up. If an email didn’t open, you can reach us at " +
          EMAIL +
          " or call " +
          PHONE_DISPLAY +
          "."
      );
      return;
    }
    postToEndpoint(Object.assign({ type: "lead", text: text }, payloadBase()))
      .then(function () {
        addBot("Thank you. A team member will follow up.");
      })
      .catch(function () {
        addBot("Thank you. If we can’t reach you, please call " + PHONE_DISPLAY + " or email " + EMAIL + ".");
      });
  }

  function normalize(text) {
    return text.toLowerCase().replace(/[’]/g, "'");
  }

  function matchFaq(text) {
    var q = normalize(text);
    var best = null;
    var bestScore = 0;
    FAQ.forEach(function (item) {
      var score = 0;
      item.keywords.forEach(function (kw) {
        if (q.indexOf(kw) !== -1) score += kw.length >= 8 ? 2 : 1;
      });
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    });
    // Conservative: require a clear match so we never invent an answer.
    if (bestScore >= 2) return best;
    return null;
  }

  function isGreeting(text) {
    return /^(hi|hello|hey|good (morning|afternoon|evening)|howdy)\b/i.test(text.trim());
  }

  function handleUserText(text) {
    addUser(text);
    if (state.awaitingContact) {
      if (looksLikeContact(text)) {
        handleContactFollowup(text);
        return;
      }
      // If they asked another published question instead, answer that.
      var followHit = isOfflineMode() ? matchFaq(text) : null;
      if (followHit) {
        state.awaitingContact = false;
        if (followHit.id === "prices") { replyAvailability(); return; }
        if (followHit.id === "contact") { addBot(followHit.answer, { extra: personCard() }); return; }
        addBot(followHit.answer);
        return;
      }
      handleContactFollowup(text);
      return;
    }

    if (!isOfflineMode()) {
      postToEndpoint(Object.assign({ type: "message", text: text }, payloadBase()))
        .then(function (data) {
          var reply = (data && (data.reply || data.message)) || "";
          if (reply) addBot(reply);
          else addBot(UNKNOWN);
        })
        .catch(function () {
          addBot(UNKNOWN);
          state.awaitingContact = true;
        });
      return;
    }

    // OFFLINE MODE — answers only from the FAQ JSON above.
    if (isGreeting(text) && text.trim().split(/\s+/).length <= 4) {
      addBot(GREETING, { chips: true });
      return;
    }
    var hit = matchFaq(text);
    if (hit) {
      if (hit.id === "prices") {
        replyAvailability();
        return;
      }
      if (hit.id === "reserve") {
        addBot(hit.answer);
        return;
      }
      if (hit.id === "contact") {
        addBot(hit.answer, { extra: personCard() });
        return;
      }
      addBot(hit.answer);
      return;
    }
    addBot(UNKNOWN);
    state.awaitingContact = true;
  }

  function postToEndpoint(payload) {
    return fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error("Chat endpoint returned " + res.status);
      var ct = res.headers.get("content-type") || "";
      if (ct.indexOf("application/json") !== -1) return res.json();
      return res.text().then(function (t) { return { reply: t }; });
    });
  }

  function openChatPrefill(opts) {
    opts = opts || {};
    function fill() {
      openChat();
      if (opts.prefill) {
        var input = document.getElementById("pbrv-chat-input");
        if (input) {
          input.value = opts.prefill;
          input.focus();
          if (typeof input.setSelectionRange === "function") {
            var n = input.value.length;
            input.setSelectionRange(n, n);
          }
        }
      }
    }
    if (!document.getElementById("pbrv-chat-panel")) {
      mount();
    }
    fill();
  }

  window.PBRVChat = {
    open: openChatPrefill
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
