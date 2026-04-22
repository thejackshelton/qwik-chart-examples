import type { DocumentHead } from "@qwik.dev/router";
import { routeLoader$ } from "@qwik.dev/router";
import { component$, useStore } from "@qwik.dev/core";
import * as Plot from "@observablehq/plot";
import { parseHTML } from "linkedom";

type ChartSpec = {
  title: string;
  kind: string;
  svg: string;
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const ink = "#e5e7eb";
const muted = "#9ca3af";
const grid = "rgba(255,255,255,0.08)";
const accent = "#0084ff";
const mint = "#54e7a6";
const coral = "#e95a51";
const gold = "#e3a82f";
const violet = "#8196d8";

const currency = (n: number) =>
  `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export const useChartSvgs = routeLoader$(async (): Promise<ChartSpec[]> => {
  const { document } = parseHTML(
    "<!DOCTYPE html><html><body></body></html>",
  );

  const commonAxis = { color: muted, fontSize: 10 };

  const render = (opts: Plot.PlotOptions): string => {
    const el = Plot.plot({
      width: 560,
      height: 300,
      marginTop: 20,
      marginRight: 20,
      marginBottom: 32,
      marginLeft: 44,
      style: {
        background: "transparent",
        color: ink,
        fontFamily:
          'ui-sans-serif, -apple-system, "Segoe UI", Roboto, sans-serif',
        fontSize: "11px",
        overflow: "visible",
      },
      ...opts,
      document: document as unknown as Document,
    });
    return (el as unknown as { outerHTML: string }).outerHTML;
  };

  const revenue = months.map((m, i) => ({
    month: m,
    revenue: [65, 59, 80, 81, 56, 55, 72][i],
    expenses: [28, 48, 40, 19, 86, 27, 60][i],
  }));

  const stacked = months.flatMap((m, i) => [
    { month: m, channel: "Desktop", value: [20, 30, 25, 40, 35, 50, 45][i] },
    { month: m, channel: "Mobile", value: [15, 25, 20, 30, 25, 35, 40][i] },
    { month: m, channel: "Tablet", value: [5, 8, 6, 10, 9, 12, 11][i] },
  ]);

  const browsers = [
    { name: "Chrome", share: 63 },
    { name: "Safari", share: 19 },
    { name: "Edge", share: 5 },
    { name: "Firefox", share: 4 },
    { name: "Other", share: 9 },
  ];

  const scatter = Array.from({ length: 120 }, (_, i) => {
    const group = i % 2 === 0 ? "A" : "B";
    const x = (Math.sin(i * 0.9) + Math.cos(i * 0.3)) * 5 + i * 0.06;
    const y = Math.cos(i * 0.6) * 4 + i * 0.05 + (group === "A" ? 0 : 3);
    return { group, x: +x.toFixed(2), y: +y.toFixed(2) };
  });

  const bubbles = Array.from({ length: 18 }, (_, i) => ({
    company: `Co. ${i + 1}`,
    growth: +(Math.sin(i * 1.3) * 8 + 12).toFixed(1),
    revenue: +(Math.cos(i * 0.7) * 40 + 60).toFixed(0),
    headcount: Math.round(Math.abs(Math.sin(i * 0.5)) * 500 + 20),
  }));

  const hist = Array.from({ length: 1000 }, () => {
    const u1 = Math.random();
    const u2 = Math.random();
    return {
      value:
        Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * 8 + 50,
    };
  });

  const heat: { day: string; hour: number; load: number }[] = [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  for (const d of days) {
    for (let h = 0; h < 24; h++) {
      const base = h > 8 && h < 20 ? 60 : 15;
      const weekend = d === "Sat" || d === "Sun" ? 0.5 : 1;
      heat.push({
        day: d,
        hour: h,
        load: Math.round((base + Math.random() * 40) * weekend),
      });
    }
  }

  const area = months.flatMap((m, i) => [
    { month: m, team: "Team A", value: [10, 20, 15, 25, 22, 30, 28][i] },
    { month: m, team: "Team B", value: [8, 12, 18, 14, 20, 18, 24][i] },
    { month: m, team: "Team C", value: [5, 7, 10, 12, 9, 14, 16][i] },
  ]);

  return [
    {
      title: "Line",
      kind: "line",
      svg: render({
        x: { label: null, ...commonAxis },
        y: { grid: true, label: "USD (k)", ...commonAxis },
        marks: [
          Plot.ruleY([0], { stroke: grid }),
          Plot.lineY(revenue, {
            x: "month",
            y: "revenue",
            stroke: accent,
            strokeWidth: 2,
            curve: "catmull-rom",
          }),
          Plot.lineY(revenue, {
            x: "month",
            y: "expenses",
            stroke: coral,
            strokeWidth: 2,
            curve: "catmull-rom",
          }),
          Plot.dot(revenue, {
            x: "month",
            y: "revenue",
            fill: accent,
            r: 4,
            title: (d) => `Revenue · ${d.month}: ${currency(d.revenue)}`,
          }),
          Plot.dot(revenue, {
            x: "month",
            y: "expenses",
            fill: coral,
            r: 4,
            title: (d) => `Expenses · ${d.month}: ${currency(d.expenses)}`,
          }),
        ],
      }),
    },
    {
      title: "Area",
      kind: "area",
      svg: render({
        x: { label: null, ...commonAxis },
        y: { grid: true, label: "Revenue", ...commonAxis },
        marks: [
          Plot.areaY(revenue, {
            x: "month",
            y: "revenue",
            fill: accent,
            fillOpacity: 0.2,
            curve: "catmull-rom",
          }),
          Plot.lineY(revenue, {
            x: "month",
            y: "revenue",
            stroke: accent,
            strokeWidth: 2,
            curve: "catmull-rom",
          }),
          Plot.dot(revenue, {
            x: "month",
            y: "revenue",
            fill: accent,
            r: 4,
            title: (d) => `${d.month}: ${currency(d.revenue)}`,
          }),
        ],
      }),
    },
    {
      title: "Bar",
      kind: "bar",
      svg: render({
        x: { label: null, ...commonAxis },
        y: { grid: true, label: "Revenue", ...commonAxis },
        marks: [
          Plot.ruleY([0], { stroke: grid }),
          Plot.barY(revenue, {
            x: "month",
            y: "revenue",
            fill: accent,
            title: (d) => `${d.month}: ${currency(d.revenue)}`,
            insetLeft: 2,
            insetRight: 2,
          }),
        ],
      }),
    },
    {
      title: "Horizontal Bar",
      kind: "barX",
      svg: render({
        marginLeft: 72,
        y: { label: null, ...commonAxis },
        x: { grid: true, label: "Share (%)", ...commonAxis },
        marks: [
          Plot.ruleX([0], { stroke: grid }),
          Plot.barX(browsers, {
            y: "name",
            x: "share",
            fill: accent,
            sort: { y: "x", reverse: true },
            title: (d) => `${d.name}: ${d.share}%`,
            insetTop: 2,
            insetBottom: 2,
          }),
          Plot.text(browsers, {
            y: "name",
            x: "share",
            text: (d) => `${d.share}%`,
            dx: 6,
            textAnchor: "start",
            fill: muted,
          }),
        ],
      }),
    },
    {
      title: "Stacked Bar",
      kind: "stacked",
      svg: render({
        x: { label: null, ...commonAxis },
        y: { grid: true, label: "Sessions", ...commonAxis },
        color: {
          domain: ["Desktop", "Mobile", "Tablet"],
          range: [accent, mint, gold],
          legend: true,
        },
        marks: [
          Plot.ruleY([0], { stroke: grid }),
          Plot.barY(stacked, {
            x: "month",
            y: "value",
            fill: "channel",
            title: (d) => `${d.channel} · ${d.month}: ${d.value}`,
            insetLeft: 2,
            insetRight: 2,
          }),
        ],
      }),
    },
    {
      title: "Grouped Bar",
      kind: "grouped",
      svg: render({
        x: { label: null, ...commonAxis },
        y: { grid: true, label: "USD (k)", ...commonAxis },
        color: {
          domain: ["Revenue", "Expenses"],
          range: [accent, coral],
          legend: true,
        },
        marks: [
          Plot.ruleY([0], { stroke: grid }),
          Plot.barY(
            revenue.flatMap((d) => [
              { month: d.month, series: "Revenue", value: d.revenue },
              { month: d.month, series: "Expenses", value: d.expenses },
            ]),
            {
              x: "series",
              y: "value",
              fill: "series",
              fx: "month",
              title: (d) => `${d.series} · ${d.month}: ${currency(d.value)}`,
            },
          ),
          Plot.axisFx({ label: null, tickSize: 0 }),
          Plot.axisX({ ticks: [] }),
        ],
      }),
    },
    {
      title: "Stacked Area",
      kind: "stackedArea",
      svg: render({
        x: { label: null, ...commonAxis },
        y: { grid: true, label: "Output", ...commonAxis },
        color: {
          domain: ["Team A", "Team B", "Team C"],
          range: [accent, mint, violet],
          legend: true,
        },
        marks: [
          Plot.areaY(area, {
            x: "month",
            y: "value",
            fill: "team",
            fillOpacity: 0.85,
            title: (d) => `${d.team} · ${d.month}: ${d.value}`,
            curve: "catmull-rom",
          }),
        ],
      }),
    },
    {
      title: "Scatter",
      kind: "scatter",
      svg: render({
        x: { grid: true, label: "x →", ...commonAxis },
        y: { grid: true, label: "↑ y", ...commonAxis },
        color: {
          domain: ["A", "B"],
          range: [accent, coral],
          legend: true,
        },
        marks: [
          Plot.dot(scatter, {
            x: "x",
            y: "y",
            fill: "group",
            r: 3,
            fillOpacity: 0.8,
            title: (d) => `Group ${d.group} · (${d.x}, ${d.y})`,
          }),
        ],
      }),
    },
    {
      title: "Bubble",
      kind: "bubble",
      svg: render({
        x: { grid: true, label: "Revenue ($m)", ...commonAxis },
        y: { grid: true, label: "Growth (%)", ...commonAxis },
        r: { range: [3, 22] },
        marks: [
          Plot.dot(bubbles, {
            x: "revenue",
            y: "growth",
            r: "headcount",
            fill: accent,
            fillOpacity: 0.55,
            stroke: accent,
            title: (d) =>
              `${d.company} · $${d.revenue}m · ${d.growth}% · ${d.headcount} staff`,
          }),
        ],
      }),
    },
    {
      title: "Histogram",
      kind: "histogram",
      svg: render({
        x: { label: "Latency (ms)", ...commonAxis },
        y: { grid: true, label: "Requests", ...commonAxis },
        marks: [
          Plot.ruleY([0], { stroke: grid }),
          Plot.rectY(
            hist,
            Plot.binX<Plot.RectYOptions>(
              { y: "count" },
              {
                x: "value",
                fill: accent,
                thresholds: 30,
                title: (bin: unknown[]) => `${bin.length} requests`,
              },
            ),
          ),
        ],
      }),
    },
    {
      title: "Heatmap",
      kind: "heatmap",
      svg: render({
        marginLeft: 52,
        x: { label: "Hour", tickSize: 0, ...commonAxis },
        y: { label: null, tickSize: 0, ...commonAxis },
        color: {
          type: "quantize",
          n: 5,
          range: ["#0b1a2f", "#10325e", "#0084ff", "#54e7a6", "#a3f4cb"],
          legend: true,
        },
        marks: [
          Plot.cell(heat, {
            x: "hour",
            y: "day",
            fill: "load",
            inset: 0.5,
            title: (d) => `${d.day} ${d.hour}:00 · load ${d.load}`,
          }),
        ],
      }),
    },
    {
      title: "Mixed (Rule + Dot)",
      kind: "mixed",
      svg: render({
        x: { label: null, ...commonAxis },
        y: { grid: true, label: "USD (k)", ...commonAxis },
        marks: [
          Plot.ruleY([0], { stroke: grid }),
          Plot.ruleX(revenue, {
            x: "month",
            y1: "expenses",
            y2: "revenue",
            stroke: muted,
            strokeDasharray: "2,2",
          }),
          Plot.dot(revenue, {
            x: "month",
            y: "revenue",
            fill: accent,
            r: 5,
            title: (d) => `Revenue · ${d.month}: ${currency(d.revenue)}`,
          }),
          Plot.dot(revenue, {
            x: "month",
            y: "expenses",
            fill: coral,
            r: 5,
            title: (d) => `Expenses · ${d.month}: ${currency(d.expenses)}`,
          }),
        ],
      }),
    },
  ];
});

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  text: string;
};

const ChartCard = component$<ChartSpec>(({ title, svg }) => {
  const tooltip = useStore<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  return (
    <section
      class="chart-card"
      onPointerOver$={(e, currentTarget) => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        let cur: Element | null = target;
        let text: string | null = null;
        while (cur && cur !== currentTarget && cur.tagName !== "svg") {
          const t = cur.querySelector(":scope > title");
          if (t && t.textContent) {
            text = t.textContent;
            break;
          }
          cur = cur.parentElement;
        }
        if (!text) return;
        const rect = currentTarget.getBoundingClientRect();
        tooltip.visible = true;
        tooltip.text = text;
        tooltip.x = e.clientX - rect.left;
        tooltip.y = e.clientY - rect.top;
      }}
      onPointerMove$={(e, currentTarget) => {
        if (!tooltip.visible) return;
        const rect = currentTarget.getBoundingClientRect();
        tooltip.x = e.clientX - rect.left;
        tooltip.y = e.clientY - rect.top;
      }}
      onPointerOut$={(e, currentTarget) => {
        const related = e.relatedTarget as Node | null;
        if (related && currentTarget.contains(related)) return;
        tooltip.visible = false;
      }}
    >
      <h2>{title}</h2>
      <div class="chart-wrapper" dangerouslySetInnerHTML={svg} />
      {tooltip.visible ? (
        <div
          class="chart-tooltip"
          style={{
            transform: `translate(${tooltip.x + 12}px, ${tooltip.y + 12}px)`,
          }}
        >
          {tooltip.text}
        </div>
      ) : null}
    </section>
  );
});

export default component$(() => {
  const charts = useChartSvgs();
  return (
    <main class="page">
      <header class="page-header">
        <h1>Observable Plot — SSR Gallery</h1>
        <p>
          Server-rendered via linkedom. Hover any mark — Qwik
          <code> onPointerOver$ </code>
          lazy-loads and reads the <code>&lt;title&gt;</code> to drive the
          tooltip.
        </p>
      </header>
      <div class="chart-grid">
        {charts.value.map((c) => (
          <ChartCard key={c.kind} {...c} />
        ))}
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Observable Plot SSR",
  meta: [
    {
      name: "description",
      content:
        "Observable Plot charts server-rendered with linkedom; tooltips hydrated on pointer over with Qwik.",
    },
  ],
};
