(function () {
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll("form[data-email]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = form.getAttribute("data-email");
      var parts = [];
      form.querySelectorAll("input, textarea").forEach(function (field) {
        if (!field.name || field.type === "hidden") return;
        var label = field.previousElementSibling && field.previousElementSibling.tagName === "LABEL"
          ? field.previousElementSibling.textContent
          : field.name;
        parts.push(label + ": " + (field.value || ""));
      });
      var subject = form.getAttribute("data-subject") || "Website inquiry — Palm Beach RV & Boat Storage";
      var href = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(parts.join("\n"));
      window.location.href = href;
    });
  });

  // Gentle scroll fade-ins. Skipped when the visitor prefers reduced motion,
  // and never hides content if this script does not run.
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var targets = document.querySelectorAll("main > .section, main > .ask-band, main > .cta-band");
    if (targets.length && "IntersectionObserver" in window) {
      document.documentElement.classList.add("js-reveal");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      targets.forEach(function (el) {
        el.classList.add("reveal");
        io.observe(el);
      });
    }
  }
})();
