// Technology page: D1-D7 animation control, D2 step sequence, D3 "swap the model" toggle.
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-tech-anim]").forEach(function (fig) {
    var svg = fig.querySelector("svg");
    var scroller = fig.querySelector(".tech-scroll");
    var btn = fig.querySelector("[data-tech-motion]");
    var steps = fig.hasAttribute("data-tech-steps") ? fig.querySelectorAll(".step") : [];
    var wanted = !reduce;   // animated by default, static with reduced motion
    var visible = false;
    var timer = null, tick = 0;

    function stepOnce() {
      // 16 ticks of 1 s: steps 1..13 one at a time, then 3 s with all shown
      steps.forEach(function (s, i) {
        s.classList.toggle("is-on", i <= tick);
        s.classList.toggle("is-now", i === tick);
      });
      tick = (tick + 1) % 16;
    }
    function startSteps() {
      if (!steps.length || timer) return;
      stepOnce();
      timer = setInterval(stepOnce, 1000);
    }
    function stopSteps() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function apply() {
      var run = wanted && visible;
      fig.classList.toggle("is-static", !wanted);
      fig.classList.toggle("is-running", wanted);
      fig.classList.toggle("is-live", run);   // Stage 12: CSS timelines (D5-D7) play only while on screen
      if (svg && svg.pauseAnimations) { if (run) svg.unpauseAnimations(); else svg.pauseAnimations(); }
      if (run) startSteps(); else stopSteps();
      if (!wanted) {
        tick = 0;
        steps.forEach(function (s) { s.classList.remove("is-on", "is-now"); });
      }
      if (btn) btn.textContent = wanted ? "Pause animation" : "Play animation";
    }

    if (btn) btn.addEventListener("click", function () { wanted = !wanted; apply(); });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        apply();
      }, { threshold: 0.15 }).observe(fig);
    } else {
      visible = true;
    }
    apply();

    function measure() {
      if (scroller) fig.classList.toggle("is-scrollable", scroller.scrollWidth > scroller.clientWidth + 1);
    }
    measure();
    if ("ResizeObserver" in window && scroller) new ResizeObserver(measure).observe(scroller);
    window.addEventListener("resize", measure);
  });

  // D3: swap the model (the core stays still; only the model adapter changes)
  var swap = document.getElementById("d3-swap");
  var d3 = document.getElementById("d3");
  var state = document.getElementById("d3-state");
  if (swap && d3) {
    swap.addEventListener("click", function () {
      var on = swap.getAttribute("aria-pressed") !== "true";
      swap.setAttribute("aria-pressed", on ? "true" : "false");
      d3.classList.toggle("is-swapped", on);
      if (state) state.textContent = on ? "Model adapter: another model. Core: unchanged." : "Model adapter: Gemini. Core: unchanged.";
    });
  }
})();
