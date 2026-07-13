"use strict";

const byId = (id) => document.getElementById(id);
const arNum = new Intl.NumberFormat("ar-EG");
const enNum = new Intl.NumberFormat("en-US");
const fmtPct = (v) => `${(v * 100).toFixed(2)}%`;

let hotels = [];
let stayRows = [];
let ratingRows = [];
let featureRows = [];
let metrics = null;
let minReviews = 0;

const HOTEL_COUNT = 976;
const REVIEW_COUNT = 93631;

function initControls() {
  byId("minReviewsFilter").innerHTML = options([
    { value: 0, label: "الكل" },
    { value: 10, label: "١٠ مراجعات فأكثر" },
    { value: 20, label: "٢٠ مراجعة فأكثر" },
    { value: 50, label: "٥٠ مراجعة فأكثر" },
  ]);
  byId("minReviewsFilter").addEventListener("change", () => {
    minReviews = parseInt(byId("minReviewsFilter").value, 10) || 0;
    updateDashboard();
  });
  byId("clearFiltersBtn").addEventListener("click", () => {
    minReviews = 0;
    byId("minReviewsFilter").value = "0";
    updateDashboard();
  });
}

function options(items) {
  return items.map((it) => `<option value="${it.value}">${it.label}</option>`).join("");
}

function filteredHotels() {
  return hotels.filter((h) => h.number_of_reviews >= minReviews);
}

function topHotels(n) {
  return [...filteredHotels()].sort((a, b) => b.average_rating - a.average_rating).slice(0, n);
}

function updateDashboard() {
  syncControls();
  drawTopHotels("chartTopHotels", topHotels(12));
  triggerReaction();
}

function renderKpis() {
  const avgRating = hotels.reduce((s, h) => s + h.average_rating, 0) / (hotels.length || 1);
  const highSat = hotels.reduce((s, h) => s + h.high_satisfaction_share, 0) / (hotels.length || 1);
  byId("avgRatingKpi").textContent = avgRating.toFixed(2);
  byId("highSatKpi").textContent = fmtPct(highSat);
  byId("hotelsKpi").textContent = enNum.format(HOTEL_COUNT);
  byId("reviewsKpi").textContent = enNum.format(REVIEW_COUNT);
  byId("avgRatingSub").textContent = `متوسط تقييم ${enNum.format(hotels.length)} فندقًا مُدرجًا`;
}

function syncControls() {
  byId("minReviewsFilter").value = String(minReviews);
}

function drawTopHotels(elementId, items) {
  const svg = byId(elementId);
  if (!svg) return;
  const width = svg.clientWidth || 720;
  const height = svg.clientHeight || 320;
  const pad = { top: 24, right: 16, bottom: 64, left: 44 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  if (!items.length) {
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.innerHTML = `<text class="chart-label" x="${width / 2}" y="${height / 2}" text-anchor="middle">لا توجد فنادق لهذا العامل</text>`;
    return;
  }
  const max = Math.max(...items.map((it) => it.average_rating), 1);
  const y = (v) => pad.top + innerH - (v / 5) * innerH;
  const grid = [0, 1, 2, 3, 4, 5]
    .map((s) => {
      const gy = pad.top + innerH - (s / 5) * innerH;
      return `<line class="grid-line" x1="${pad.left}" x2="${pad.left + innerW}" y1="${gy}" y2="${gy}"></line><text class="chart-label" x="${pad.left - 8}" y="${gy + 4}" text-anchor="end">${s.toFixed(0)}</text>`;
    })
    .join("");
  const group = innerW / items.length;
  const barW = Math.min(46, group * 0.62);
  const bars = items
    .map((it, i) => {
      const x = pad.left + i * group + group / 2 - barW / 2;
      const h = (it.average_rating / 5) * innerH;
      const yy = y(it.average_rating);
      const color = it.average_rating >= 4 ? "var(--green)" : it.average_rating >= 3 ? "var(--accent)" : "var(--red)";
      const label = String(it.hotel_id);
      return `<rect x="${x}" y="${yy}" width="${barW}" height="${Math.max(2, h)}" rx="5" fill="${color}" data-tip="${label}&#10;التقييم: ${it.average_rating.toFixed(2)}&#10;المراجعات: ${enNum.format(it.number_of_reviews)}&#10;الرضا المرتفع: ${fmtPct(it.high_satisfaction_share)}"></rect><text class="chart-label" x="${x + barW / 2}" y="${height - 30}" text-anchor="middle">${label}</text><text class="chart-value" x="${x + barW / 2}" y="${yy - 8}" text-anchor="middle">${it.average_rating.toFixed(2)}</text>`;
    })
    .join("");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = `${grid}<line class="axis" x1="${pad.left}" x2="${pad.left}" y1="${pad.top}" y2="${pad.top + innerH}"></line><line class="axis" x1="${pad.left}" x2="${pad.left + innerW}" y1="${pad.top + innerH}" y2="${pad.top + innerH}"></line>${bars}`;
}

function drawStayBars(elementId, items) {
  const svg = byId(elementId);
  if (!svg) return;
  const width = svg.clientWidth || 520;
  const height = svg.clientHeight || 280;
  const pad = { top: 22, right: 16, bottom: 56, left: 46 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const y = (v) => pad.top + innerH - (v / 5) * innerH;
  const grid = [0, 1, 2, 3, 4, 5]
    .map((s) => {
      const gy = pad.top + innerH - (s / 5) * innerH;
      return `<line class="grid-line" x1="${pad.left}" x2="${pad.left + innerW}" y1="${gy}" y2="${gy}"></line><text class="chart-label" x="${pad.left - 8}" y="${gy + 4}" text-anchor="end">${s.toFixed(0)}</text>`;
    })
    .join("");
  const group = innerW / items.length;
  const barW = Math.min(72, group * 0.6);
  const bars = items
    .map((it, i) => {
      const x = pad.left + i * group + group / 2 - barW / 2;
      const h = (it.average_rating / 5) * innerH;
      const yy = y(it.average_rating);
      return `<rect x="${x}" y="${yy}" width="${barW}" height="${Math.max(2, h)}" rx="5" fill="var(--accent)" data-tip="${it.stay_segment}&#10;متوسط التقييم: ${it.average_rating.toFixed(2)}&#10;الرضا المرتفع: ${fmtPct(it.high_satisfaction_share)}&#10;المراجعات: ${enNum.format(it.number_of_reviews)}"></rect><text class="chart-label" x="${x + barW / 2}" y="${height - 18}" text-anchor="middle">${it.stay_segment}</text><text class="chart-value" x="${x + barW / 2}" y="${yy - 8}" text-anchor="middle">${it.average_rating.toFixed(2)}</text>`;
    })
    .join("");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = `${grid}<line class="axis" x1="${pad.left}" x2="${pad.left}" y1="${pad.top}" y2="${pad.top + innerH}"></line><line class="axis" x1="${pad.left}" x2="${pad.left + innerW}" y1="${pad.top + innerH}" y2="${pad.top + innerH}"></line>${bars}`;
}

function drawRatingDist(elementId, items) {
  const svg = byId(elementId);
  if (!svg) return;
  const width = svg.clientWidth || 520;
  const height = svg.clientHeight || 280;
  const pad = { top: 22, right: 16, bottom: 56, left: 56 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(...items.map((it) => it.number_of_reviews), 1);
  const y = (v) => pad.top + innerH - (v / max) * innerH;
  const grid = [0, 0.25, 0.5, 0.75, 1]
    .map((s) => {
      const gy = pad.top + innerH - s * innerH;
      const val = Math.round(s * max);
      return `<line class="grid-line" x1="${pad.left}" x2="${pad.left + innerW}" y1="${gy}" y2="${gy}"></line><text class="chart-label" x="${pad.left - 8}" y="${gy + 4}" text-anchor="end">${enNum.format(val)}</text>`;
    })
    .join("");
  const group = innerW / items.length;
  const barW = Math.min(72, group * 0.6);
  const bars = items
    .map((it, i) => {
      const x = pad.left + i * group + group / 2 - barW / 2;
      const h = (it.number_of_reviews / max) * innerH;
      const yy = y(it.number_of_reviews);
      const color = it.rating_group === "High satisfaction" ? "var(--green)" : "var(--red)";
      return `<rect x="${x}" y="${yy}" width="${barW}" height="${Math.max(2, h)}" rx="5" fill="${color}" data-tip="${it.rating_group}&#10;التقييم: ${it.rating}&#10;المراجعات: ${enNum.format(it.number_of_reviews)}"></rect><text class="chart-label" x="${x + barW / 2}" y="${height - 18}" text-anchor="middle">${it.rating}</text><text class="chart-value" x="${x + barW / 2}" y="${yy - 8}" text-anchor="middle">${enNum.format(it.number_of_reviews)}</text>`;
    })
    .join("");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = `${grid}<line class="axis" x1="${pad.left}" x2="${pad.left}" y1="${pad.top}" y2="${pad.top + innerH}"></line><line class="axis" x1="${pad.left}" x2="${pad.left + innerW}" y1="${pad.top + innerH}" y2="${pad.top + innerH}"></line>${bars}`;
}

function renderFeatureImportance() {
  const max = Math.max(...featureRows.map((f) => f.abs_coefficient), 1);
  const sorted = [...featureRows].sort((a, b) => b.abs_coefficient - a.abs_coefficient);
  byId("impactList").innerHTML = sorted
    .map((f) => {
      const pct = (f.abs_coefficient / max) * 100;
      const isPos = f.coefficient >= 0;
      const color = isPos ? "var(--green)" : "var(--red)";
      const sign = isPos ? "+" : "−";
      return `<div class="impact-row" data-tip="${f.feature_clean}&#10;المعامل: ${sign}${f.abs_coefficient.toFixed(2)}&#10;${isPos ? "مصطلح إيجابي (رضا)" : "مصطلح سلبي (عدم رضا)"}"><span class="name">${f.feature_clean}</span><span class="impact-track"><span class="impact-fill" style="width:${pct}%;background:linear-gradient(90deg, ${color}, ${color})"></span></span><span class="val">${sign}${f.abs_coefficient.toFixed(1)}</span></div>`;
    })
    .join("");
}

function renderModelTable() {
  const m = metrics;
  const rows = [
    `<tr class="best"><td>نموذج التصنيف (الأفضل)</td><td>${(m.accuracy * 100).toFixed(1)}%</td><td>${(m.precision * 100).toFixed(1)}%</td><td>${(m.recall * 100).toFixed(1)}%</td><td>${(m.f1 * 100).toFixed(1)}%</td><td>${(m.roc_auc * 100).toFixed(1)}%</td></tr>`,
  ].join("");
  byId("modelTable").innerHTML = `<table class="data-table"><thead><tr><th>النموذج</th><th>الدقة</th><th>الدقة (Precision)</th><th>الاستدعاء</th><th>F1</th><th>ROC AUC</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function triggerReaction() {
  document.querySelectorAll(".panel").forEach((target) => {
    target.classList.remove("is-reacting");
    window.requestAnimationFrame(() => target.classList.add("is-reacting"));
  });
}

function initTooltips() {
  const tip = byId("chartTooltip");
  if (!tip) return;
  document.addEventListener("mouseover", (event) => {
    const node = event.target.closest("[data-tip]");
    if (!node) return;
    tip.textContent = node.getAttribute("data-tip").replace(/&#10;/g, "\n");
    tip.classList.add("is-visible");
  });
  document.addEventListener("mousemove", (event) => {
    if (!tip.classList.contains("is-visible")) return;
    const offset = 14;
    let left = event.clientX + offset;
    let top = event.clientY + offset;
    const rect = tip.getBoundingClientRect();
    if (left + rect.width > window.innerWidth) left = event.clientX - rect.width - offset;
    if (top + rect.height > window.innerHeight) top = event.clientY - rect.height - offset;
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  });
  document.addEventListener("mouseout", (event) => {
    const node = event.target.closest("[data-tip]");
    if (!node) return;
    tip.classList.remove("is-visible");
  });
}

async function boot() {
  const [hotelsData, stayData, ratingData, featuresData, metricsData] = await Promise.all([
    fetch("data/hotels.json").then((r) => r.json()),
    fetch("data/stay.json").then((r) => r.json()),
    fetch("data/rating_dist.json").then((r) => r.json()),
    fetch("data/feature_importance.json").then((r) => r.json()),
    fetch("data/model_metrics.json").then((r) => r.json()),
  ]);
  hotels = hotelsData;
  stayRows = stayData;
  ratingRows = ratingData;
  featureRows = featuresData;
  metrics = metricsData;
  initControls();
  initTooltips();
  renderKpis();
  renderFeatureImportance();
  renderModelTable();
  drawStayBars("chartStay", stayRows);
  drawRatingDist("chartRatingDist", ratingRows);
  updateDashboard();
  window.addEventListener("resize", () => {
    drawTopHotels("chartTopHotels", topHotels(12));
    drawStayBars("chartStay", stayRows);
    drawRatingDist("chartRatingDist", ratingRows);
  });
}

boot();
