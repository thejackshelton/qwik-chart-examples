import type { DocumentHead } from "@qwik.dev/router";
import {
  component$,
  useSignal,
  useVisibleTask$,
  type Signal,
} from "@qwik.dev/core";
import type { ChartConfiguration } from "chart.js";

type ChartCardProps = {
  title: string;
  config: ChartConfiguration;
};

const ChartCard = component$<ChartCardProps>(({ title, config }) => {
  const canvasRef = useSignal<HTMLCanvasElement>();

  useVisibleTask$(async ({ cleanup }) => {
    if (!canvasRef.value) return;
    const { Chart, registerables } = await import("chart.js");
    Chart.register(...registerables);
    const chart = new Chart(canvasRef.value, config);
    cleanup(() => chart.destroy());
  });

  return (
    <section class="chart-card">
      <h2>{title}</h2>
      <div class="chart-wrapper">
        <canvas ref={canvasRef as Signal<Element | undefined>} />
      </div>
    </section>
  );
});

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const palette = {
  blue: "rgba(54, 162, 235, 0.6)",
  blueBorder: "rgb(54, 162, 235)",
  red: "rgba(255, 99, 132, 0.6)",
  redBorder: "rgb(255, 99, 132)",
  green: "rgba(75, 192, 192, 0.6)",
  greenBorder: "rgb(75, 192, 192)",
  yellow: "rgba(255, 206, 86, 0.6)",
  yellowBorder: "rgb(255, 206, 86)",
  purple: "rgba(153, 102, 255, 0.6)",
  purpleBorder: "rgb(153, 102, 255)",
  orange: "rgba(255, 159, 64, 0.6)",
  orangeBorder: "rgb(255, 159, 64)",
};

const charts: ChartCardProps[] = [
  {
    title: "Line",
    config: {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Revenue",
            data: [65, 59, 80, 81, 56, 55, 72],
            borderColor: palette.blueBorder,
            backgroundColor: palette.blue,
            tension: 0.3,
            fill: true,
          },
          {
            label: "Expenses",
            data: [28, 48, 40, 19, 86, 27, 60],
            borderColor: palette.redBorder,
            backgroundColor: palette.red,
            tension: 0.3,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    },
  },
  {
    title: "Bar",
    config: {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Signups",
            data: [12, 19, 3, 5, 2, 3, 9],
            backgroundColor: palette.blue,
            borderColor: palette.blueBorder,
            borderWidth: 1,
          },
          {
            label: "Churn",
            data: [2, 3, 20, 5, 1, 4, 2],
            backgroundColor: palette.red,
            borderColor: palette.redBorder,
            borderWidth: 1,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    },
  },
  {
    title: "Horizontal Bar",
    config: {
      type: "bar",
      data: {
        labels: ["Chrome", "Safari", "Firefox", "Edge", "Other"],
        datasets: [
          {
            label: "Browser share %",
            data: [63, 19, 4, 5, 9],
            backgroundColor: [
              palette.blue,
              palette.green,
              palette.orange,
              palette.purple,
              palette.yellow,
            ],
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
      },
    },
  },
  {
    title: "Stacked Bar",
    config: {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Desktop",
            data: [20, 30, 25, 40, 35, 50, 45],
            backgroundColor: palette.blue,
          },
          {
            label: "Mobile",
            data: [15, 25, 20, 30, 25, 35, 40],
            backgroundColor: palette.green,
          },
          {
            label: "Tablet",
            data: [5, 8, 6, 10, 9, 12, 11],
            backgroundColor: palette.orange,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      },
    },
  },
  {
    title: "Pie",
    config: {
      type: "pie",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
        datasets: [
          {
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
              palette.red,
              palette.blue,
              palette.yellow,
              palette.green,
              palette.purple,
            ],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    },
  },
  {
    title: "Doughnut",
    config: {
      type: "doughnut",
      data: {
        labels: ["Direct", "Referral", "Search", "Social"],
        datasets: [
          {
            data: [300, 50, 100, 80],
            backgroundColor: [
              palette.blue,
              palette.red,
              palette.yellow,
              palette.green,
            ],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    },
  },
  {
    title: "Radar",
    config: {
      type: "radar",
      data: {
        labels: [
          "Speed",
          "Reliability",
          "Comfort",
          "Safety",
          "Efficiency",
          "Style",
        ],
        datasets: [
          {
            label: "Model A",
            data: [65, 59, 90, 81, 56, 55],
            borderColor: palette.blueBorder,
            backgroundColor: palette.blue,
          },
          {
            label: "Model B",
            data: [28, 48, 40, 19, 96, 87],
            borderColor: palette.redBorder,
            backgroundColor: palette.red,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    },
  },
  {
    title: "Polar Area",
    config: {
      type: "polarArea",
      data: {
        labels: ["Red", "Green", "Yellow", "Grey", "Blue"],
        datasets: [
          {
            data: [11, 16, 7, 3, 14],
            backgroundColor: [
              palette.red,
              palette.green,
              palette.yellow,
              "rgba(201, 203, 207, 0.6)",
              palette.blue,
            ],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    },
  },
  {
    title: "Bubble",
    config: {
      type: "bubble",
      data: {
        datasets: [
          {
            label: "Dataset 1",
            data: [
              { x: 20, y: 30, r: 15 },
              { x: 40, y: 10, r: 10 },
              { x: 25, y: 25, r: 20 },
              { x: 10, y: 40, r: 8 },
              { x: 50, y: 50, r: 25 },
            ],
            backgroundColor: palette.blue,
            borderColor: palette.blueBorder,
          },
          {
            label: "Dataset 2",
            data: [
              { x: 15, y: 35, r: 12 },
              { x: 45, y: 15, r: 18 },
              { x: 30, y: 5, r: 10 },
            ],
            backgroundColor: palette.red,
            borderColor: palette.redBorder,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    },
  },
  {
    title: "Scatter",
    config: {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Group A",
            data: [
              { x: -10, y: 0 },
              { x: 0, y: 10 },
              { x: 10, y: 5 },
              { x: 0.5, y: 5.5 },
              { x: 7, y: -3 },
            ],
            backgroundColor: palette.blueBorder,
          },
          {
            label: "Group B",
            data: [
              { x: -5, y: 4 },
              { x: 3, y: 8 },
              { x: 8, y: -2 },
              { x: -2, y: -4 },
            ],
            backgroundColor: palette.redBorder,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { type: "linear", position: "bottom" },
        },
      },
    },
  },
  {
    title: "Mixed (Bar + Line)",
    config: {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            type: "bar",
            label: "Units sold",
            data: [40, 55, 60, 70, 65, 80, 90],
            backgroundColor: palette.blue,
            borderColor: palette.blueBorder,
            borderWidth: 1,
          },
          {
            type: "line",
            label: "Target",
            data: [50, 55, 60, 65, 70, 75, 80],
            borderColor: palette.redBorder,
            backgroundColor: palette.red,
            tension: 0.2,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    },
  },
  {
    title: "Area (Stacked Line)",
    config: {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Team A",
            data: [10, 20, 15, 25, 22, 30, 28],
            borderColor: palette.blueBorder,
            backgroundColor: palette.blue,
            fill: true,
          },
          {
            label: "Team B",
            data: [8, 12, 18, 14, 20, 18, 24],
            borderColor: palette.greenBorder,
            backgroundColor: palette.green,
            fill: true,
          },
          {
            label: "Team C",
            data: [5, 7, 10, 12, 9, 14, 16],
            borderColor: palette.orangeBorder,
            backgroundColor: palette.orange,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { stacked: true } },
      },
    },
  },
];

export default component$(() => {
  return (
    <main class="page">
      <header class="page-header">
        <h1>Chart.js Examples</h1>
        <p>The most common chart types, rendered with Chart.js.</p>
      </header>
      <div class="chart-grid">
        {charts.map((c) => (
          <ChartCard key={c.title} title={c.title} config={c.config} />
        ))}
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Chart.js Examples",
  meta: [
    {
      name: "description",
      content: "A gallery of the most common Chart.js chart types.",
    },
  ],
};
