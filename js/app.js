(() => {
  const { $, copy, store, esc, debounce, tabs } = Prism;
  const expr = $("#expr");
  let snip = "crontab";
  const MODES = { every: "Every", at: "At specific", step: "Every N", range: "Range" };
  $("#presets").innerHTML = Core.PRESETS.map(([n, e]) => `<button class="pill acc" data-e="${e}">${n}</button>`).join("");
  $("#presets").onclick = (e) => { const b = e.target.closest("button"); if (b) { expr.value = b.dataset.e; render(true); } };
  $("#builder").innerHTML = Core.FIELDS.map((f, i) => `<div class="bf" data-i="${i}"><b>${f.name}</b><div class="row">
      <select class="mode">${Object.entries(MODES).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select>
      <input class="val code" placeholder="${f.min}-${f.max}" />
    </div></div>`).join("");
  function syncBuilder() {
    const parts = expr.value.trim().split(/\s+/);
    if (parts.length !== 5) return;
    document.querySelectorAll(".bf").forEach((el, i) => {
      const p = parts[i], mode = el.querySelector(".mode"), val = el.querySelector(".val");
      if (p === "*") { mode.value = "every"; val.value = ""; }
      else if (/^\*\/\d+$/.test(p)) { mode.value = "step"; val.value = p.slice(2); }
      else if (/^\d+-\d+$/.test(p)) { mode.value = "range"; val.value = p; }
      else { mode.value = "at"; val.value = p; }
      val.disabled = mode.value === "every";
    });
  }
  $("#builder").addEventListener("input", (e) => {
    const parts = [...document.querySelectorAll(".bf")].map((el) => {
      const m = el.querySelector(".mode").value, v = el.querySelector(".val").value.trim();
      el.querySelector(".val").disabled = m === "every";
      if (m === "every" || !v) return "*";
      return m === "step" ? `*/${v}` : v;
    });
    expr.value = parts.join(" "); render(false);
  });
  function snippetFor(e) {
    if (snip === "gha") return `on:\n  schedule:\n    - cron: "${e}"   # UTC\n  workflow_dispatch:`;
    if (snip === "node") return `import cron from "node-cron";\n\ncron.schedule("${e}", () => {\n  console.log("Prism job running");\n});`;
    return `# ${safeDesc(e)}\n${e} /usr/bin/node /home/prism/job.js >> /var/log/prism.log 2>&1`;
  }
  const safeDesc = (e) => { try { return Core.describe(e); } catch { return ""; } };
  function render(sync) {
    const e = expr.value.trim().replace(/\s+/g, " ");
    store.set("cron:expr", expr.value);
    const v = Core.validate(e);
    if (!v.ok) { $("#human").className = "human bad"; $("#human").textContent = v.error; $("#runs").innerHTML = ""; return; }
    if (sync) syncBuilder();
    $("#human").className = "human"; $("#human").textContent = Core.describe(e);
    const fmt = new Intl.DateTimeFormat(undefined, { weekday: "short", year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    const now = Date.now();
    $("#runs").innerHTML = Core.next(e, new Date(), 6).map((d) => {
      const mins = Math.round((d - now) / 60000);
      const rel = mins < 60 ? `in ${mins}m` : mins < 1440 ? `in ${Math.round(mins / 60)}h` : `in ${Math.round(mins / 1440)}d`;
      return `<li>${esc(fmt.format(d))}<span>${rel}</span></li>`;
    }).join("") || '<div class="empty">No run in the next year</div>';
    $("#snippet").textContent = snippetFor(e);
  }
  $("#tz").textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
  tabs($("#snipTabs"), (v) => { snip = v; render(false); });
  expr.addEventListener("input", debounce(() => render(true), 120));
  $("#copy").onclick = () => copy(expr.value.trim());
  expr.value = store.get("cron:expr", expr.value);
  render(true);
})();
