const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../js/core.js");

test("parses ranges, steps, lists and names", () => {
  const c = C.parse("*/15 9-17 1,15 JAN-MAR MON-FRI");
  assert.deepEqual(c.minute, [0, 15, 30, 45]);
  assert.equal(c.hour.length, 9);
  assert.deepEqual(c.day, [1, 15]);
  assert.deepEqual(c.month, [1, 2, 3]);
  assert.deepEqual(c.weekday, [1, 2, 3, 4, 5]);
});
test("macros and 7 as Sunday", () => {
  assert.deepEqual(C.parse("@daily").hour, [0]);
  assert.deepEqual(C.parse("0 0 * * 7").weekday, [0]);
});
test("validation errors are friendly", () => {
  assert.match(C.validate("61 * * * *").error, /minute/);
  assert.match(C.validate("* *").error, /5 fields/);
});
test("describe reads naturally", () => {
  assert.equal(C.describe("* * * * *"), "Every minute");
  assert.equal(C.describe("0 9 * * *"), "At 09:00");
  assert.equal(C.describe("30 18 * * 1-5"), "At 18:30 on Monday through Friday");
  assert.equal(C.describe("*/5 * * * *"), "Every 5 minutes");
  assert.equal(C.describe("*/15 9-17 * * 1-5"), "Every 15 minutes, between 09:00 and 17:59 on Monday through Friday");
  assert.equal(C.describe("0 0 * * 0,6"), "At 00:00 on Sunday and Saturday");
});
test("next runs are computed", () => {
  const from = new Date(2026, 0, 1, 10, 7);
  const runs = C.next("*/15 * * * *", from, 3);
  assert.deepEqual(runs.map((d) => d.getMinutes()), [15, 30, 45]);
  const w = C.next("0 9 * * 1", new Date(2026, 0, 1), 1)[0];
  assert.equal(w.getDay(), 1); assert.equal(w.getHours(), 9);
  const leap = C.next("0 0 29 2 *", new Date(2026, 0, 1), 1)[0];
  assert.equal(leap.getFullYear(), 2028);
});
