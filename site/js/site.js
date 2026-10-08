(function () {
  "use strict";

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  // Project photo strips: arrow buttons scroll one photo at a time
  document.querySelectorAll("[data-strip]").forEach(function (wrap) {
    var strip = wrap.querySelector(".strip");
    var prev = wrap.querySelector("[data-strip-prev]");
    var next = wrap.querySelector("[data-strip-next]");
    if (!strip || !prev || !next) return;

    var step = function (dir) {
      var first = strip.querySelector("button");
      var amount = first ? first.getBoundingClientRect().width + 10 : strip.clientWidth * 0.8;
      strip.scrollBy({ left: dir * amount, behavior: "smooth" });
    };
    var update = function () {
      var max = strip.scrollWidth - strip.clientWidth - 2;
      prev.disabled = strip.scrollLeft <= 2;
      next.disabled = strip.scrollLeft >= max;
      var hide = strip.scrollWidth <= strip.clientWidth + 2;
      prev.hidden = hide;
      next.hidden = hide;
    };
    prev.addEventListener("click", function () { step(-1); });
    next.addEventListener("click", function () { step(1); });
    strip.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    strip.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) img.addEventListener("load", update, { once: true });
    });
    update();
  });

  // Lightbox for project photos
  var box = document.getElementById("lightbox");
  if (box && typeof box.showModal === "function") {
    var img = document.createElement("img");
    box.querySelector("figure").appendChild(img);
    var caption = box.querySelector("[data-lb-caption]");
    var count = box.querySelector("[data-lb-count]");
    var group = [];
    var index = 0;

    var show = function (i) {
      index = (i + group.length) % group.length;
      var item = group[index];
      img.src = item.getAttribute("data-full");
      img.alt = item.querySelector("img").alt;
      caption.textContent = item.getAttribute("data-project");
      count.textContent = "Photo " + (index + 1) + " of " + group.length;
    };

    document.querySelectorAll(".strip button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var strip = btn.closest(".strip");
        group = Array.prototype.slice.call(strip.querySelectorAll("button"));
        show(group.indexOf(btn));
        box.showModal();
        box._opener = btn;
      });
    });

    box.querySelector("[data-lb-prev]").addEventListener("click", function () { show(index - 1); });
    box.querySelector("[data-lb-next]").addEventListener("click", function () { show(index + 1); });
    box.querySelector("[data-lb-close]").addEventListener("click", function () { box.close(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.tagName === "FIGURE") box.close();
    });
    box.addEventListener("close", function () {
      img.src = "data:,";
      if (box._opener) box._opener.focus();
    });
  }

  // Contact form: Formspree when an endpoint is set, WhatsApp otherwise
  var form = document.getElementById("contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    var submit = form.querySelector("button[type=submit]");
    var endpoint = form.getAttribute("action") || "";
    var pending = endpoint.indexOf("YOUR_FORM_ID") !== -1;

    var setStatus = function (state, text) {
      status.setAttribute("data-state", state);
      status.textContent = text;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector(".hp input").value) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var data = new FormData(form);

      if (pending) {
        var lines = [
          "Hello Manifeso, I'm " + data.get("name") + (data.get("company") ? " from " + data.get("company") : "") + ".",
          "Service: " + data.get("service"),
          data.get("message"),
          "Phone: " + data.get("phone") + (data.get("email") ? "  Email: " + data.get("email") : "")
        ];
        window.open("https://wa.me/97450581621?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
        setStatus("ok", "WhatsApp opened with your message. Press send there to reach us.");
        return;
      }

      submit.disabled = true;
      setStatus("sending", "Sending…");
      fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("bad status");
          form.reset();
          setStatus("ok", "Thank you. Your message has been sent and we will reply soon.");
        })
        .catch(function () {
          setStatus("error", "The message could not be sent. Please try again, or message us on WhatsApp at +974 5058 1621.");
        })
        .then(function () { submit.disabled = false; });
    });
  }
})();
