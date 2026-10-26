/* Prism Cron Builder · core logic (browser + Node) */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Core = api;
})(typeof self !== "undefined" ? self : this, function () {
  const FIELDS = [
    { name: "minute", min: 0, max: 59 }, { name: "hour", min: 0, max: 23 }, { name: "day", min: 1, max: 31 },
    { name: "month", min: 1, max: 12, names: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"] },
    { name: "weekday", min: 0, max: 6, names: ["SUN","MON","TUE","WED","THU","FRI","SAT"] },
  ];
  const MACROS = { "@yearly": "0 0 1 1 *", "@annually": "0 0 1 1 *", "@monthly": "0 0 1 * *", "@weekly": "0 0 * * 0", "@daily": "0 0 * * *", "@midnight": "0 0 * * *", "@hourly": "0 * * * *" };
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  function parseField(src, f) {
    const set = new Set();
    for (const part of src.split(",")) {
      const m = /^(\*|[\w]+(?:-[\w]+)?)(?:\/(\d+))?$/i.exec(part);
      if (!m) throw new Error(`Invalid ${f.name} "${part}"`);
      const val = (s) => {
        let v = f.names && isNaN(s) ? f.names.indexOf(s.toUpperCase()) + f.min : Number(s);
        if (f.name === "weekday" && v === 7) v = 0;
        if (!Number.isInteger(v) || v < f.min || v > (f.name === "weekday" ? 7 : f.max)) throw new Error(`${f.name} "${s}" is out of range ${f.min}-${f.max}`);
        return v;
      };
      let lo = f.min, hi = f.max;
      if (m[1] !== "*") { const [a, b] = m[1].split("-"); lo = val(a); hi = b != null ? val(b) : m[2] ? f.max : lo; if (b != null && f.name === "weekday" && b === "7") hi = 6, set.add(0); }
      const step = m[2] ? +m[2] : 1;
      if (step < 1) throw new Error(`Step must be ≥ 1 in ${f.name}`);
      if (lo > hi) throw new Error(`Range ${m[1]} is reversed in ${f.name}`);
      for (let v = lo; v <= hi; v += step) set.add(v);
    }
    return [...set].sort((a, b) => a - b);
  }
  function parse(expr) {
    expr = String(expr).trim();
    const src = MACROS[expr.toLowerCase()] || expr;
    const parts = src.split(/\s+/);
    if (parts.length !== 5) throw new Error(`Expected 5 fields (minute hour day month weekday), got ${parts.length}`);
    const out = { source: parts };
    FIELDS.forEach((f, i) => (out[f.name] = parseField(parts[i], f)));
    out.dayStar = parts[2] === "*"; out.weekStar = parts[4] === "*";
    return out;
  }
  function validate(expr) { try { parse(expr); return { ok: true }; } catch (e) { return { ok: false, error: e.message }; } }
  const pad = (n) => String(n).padStart(2, "0");
  const list = (arr, map = String) => arr.length === 1 ? map(arr[0]) : arr.length === 2 ? `${map(arr[0])} and ${map(arr[1])}` : arr.slice(0, -1).map(map).join(", ") + " and " + map(arr[arr.length - 1]);
  function describeStep(src, unit, f) {
    const m = /^(\*|\d+)\/(\d+)$/.exec(src);
    if (m) return `every ${m[2]} ${unit}s${m[1] !== "*" && +m[1] !== f.min ? ` starting at ${m[1]}` : ""}`;
    const r = /^(\d+)-(\d+)$/.exec(src);
    if (r) return `every ${unit} from ${r[1]} through ${r[2]}`;
    return null;
  }
  function describe(expr) {
    const c = parse(expr);
    const [mi, ho, dd, mo, wd] = c.source;
    let time;
    if (mi === "*" && ho === "*") time = "Every minute";
    else if (ho === "*") time = describeStep(mi, "minute", FIELDS[0]) ? cap(describeStep(mi, "minute", FIELDS[0])) : `At minute ${list(c.minute)} of every hour`;
    else if (describeStep(mi, "minute", FIELDS[0]) && /^\d+-\d+$/.test(ho)) time = `${cap(describeStep(mi, "minute", FIELDS[0]))}, between ${pad(c.hour[0])}:00 and ${pad(c.hour[c.hour.length - 1])}:59`;
    else if (mi === "*") time = `Every minute during hour ${list(c.hour)}`;
    else if (c.minute.length * c.hour.length <= 6 && !/[/-]/.test(mi + ho)) time = "At " + list(c.hour.flatMap((h) => c.minute.map((m) => `${pad(h)}:${pad(m)}`)));
    else time = `At minute ${list(c.minute)} past ${describeStep(ho, "hour", FIELDS[1]) || "hour " + list(c.hour)}`;
    const bits = [time];
    if (dd !== "*") bits.push(describeStep(dd, "day", FIELDS[2]) ? describeStep(dd, "day", FIELDS[2]) + " of the month" : `on day ${list(c.day)} of the month`);
    if (wd !== "*") bits.push((dd !== "*" ? "or " : "") + `on ${contig(c.weekday) ? DAYS[c.weekday[0]] + " through " + DAYS[c.weekday[c.weekday.length - 1]] : list(c.weekday, (d) => DAYS[d])}`);
    if (mo !== "*") bits.push(`in ${list(c.month, (m) => MONTHS[m - 1])}`);
    return bits.join(" ");
  }
  const contig = (a) => a.length > 2 && a.every((v, i) => !i || v === a[i - 1] + 1);
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  function matches(c, d) {
    if (!c.minute.includes(d.getMinutes()) || !c.hour.includes(d.getHours()) || !c.month.includes(d.getMonth() + 1)) return false;
    const dom = c.day.includes(d.getDate()), dow = c.weekday.includes(d.getDay());
    if (c.dayStar && c.weekStar) return true;
    if (c.dayStar) return dow;
    if (c.weekStar) return dom;
    return dom || dow;
  }
  function next(expr, from = new Date(), count = 5) {
    const c = parse(expr);
    const d = new Date(from.getTime()); d.setSeconds(0, 0); d.setMinutes(d.getMinutes() + 1);
    const out = [];
    let guard = 0;
    while (out.length < count && guard++ < 600000) {
      if (!c.month.includes(d.getMonth() + 1)) { d.setMonth(d.getMonth() + 1, 1); d.setHours(0, 0, 0, 0); continue; }
      if (!matches({ ...c, minute: c.minute, hour: c.hour }, Object.assign(new Date(d), {})) ) {
        const dayOk = (c.dayStar && c.weekStar) || (c.dayStar ? c.weekday.includes(d.getDay()) : c.weekStar ? c.day.includes(d.getDate()) : c.day.includes(d.getDate()) || c.weekday.includes(d.getDay()));
        if (!dayOk) { d.setDate(d.getDate() + 1); d.setHours(0, 0, 0, 0); continue; }
        if (!c.hour.includes(d.getHours())) { d.setHours(d.getHours() + 1, 0, 0, 0); continue; }
        d.setMinutes(d.getMinutes() + 1); continue;
      }
      out.push(new Date(d)); d.setMinutes(d.getMinutes() + 1);
    }
    return out;
  }
  const PRESETS = [
    ["Every minute", "* * * * *"], ["Every 5 minutes", "*/5 * * * *"], ["Every hour", "0 * * * *"], ["Every day at 9:00", "0 9 * * *"],
    ["Weekdays at 18:30", "30 18 * * 1-5"], ["Every Sunday midnight", "0 0 * * 0"], ["1st of month", "0 0 1 * *"], ["Every 15 min, work hours", "*/15 9-17 * * 1-5"],
  ];
  return { parse, validate, describe, next, matches, PRESETS, FIELDS };
});
