// Company page: copy the contact email to the clipboard, with visible feedback.
(function () {
  var buttons = document.querySelectorAll("button[data-copy]");
  if (!buttons.length) return;
  var status = document.querySelector(".cp-copy-status");

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function selectText(el) {
    try {
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) {}
  }

  Array.prototype.forEach.call(buttons, function (btn) {
    var label = btn.textContent;
    var timer;
    function show(ok, el) {
      btn.textContent = ok ? "Copied" : "Select and copy";
      btn.classList.toggle("is-copied", ok);
      if (status) status.textContent = ok ? "Email address copied." : "Could not copy. The address is selected; press Ctrl+C or Cmd+C.";
      if (!ok && el) selectText(el);
      clearTimeout(timer);
      timer = setTimeout(function () {
        btn.textContent = label;
        btn.classList.remove("is-copied");
        if (status) status.textContent = "";
      }, 2400);
    }
    btn.addEventListener("click", function () {
      var el = document.querySelector(btn.getAttribute("data-copy"));
      if (!el) return;
      var text = el.textContent.trim();
      try {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(
            function () { show(true); },
            function () { show(fallbackCopy(text), el); }
          );
        } else {
          show(fallbackCopy(text), el);
        }
      } catch (e) {
        show(false, el);
      }
    });
  });
})();
