"use client";

import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function AnalyticsPane() {
  const lineRef = useRef(null);
  const donutRef = useRef(null);
  const barRef = useRef(null);
  const instances = useRef({});

  useEffect(() => {
    const rs = getComputedStyle(document.documentElement);
    const COLOR = {
      text: rs.getPropertyValue("--color-text-primary").trim() || "#ffffff",
      border: rs.getPropertyValue("--color-border").trim() || "#2a2a2a",
      primary: rs.getPropertyValue("--color-accent").trim() || "#AAFF00",
      success: rs.getPropertyValue("--color-accent").trim() || "#AAFF00",
      warning: "#ffc107",
      danger: "#dc3545",
      info: "#0d6efd",
    };

    Chart.defaults.color = COLOR.text;
    Chart.defaults.borderColor = COLOR.border;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.font.family =
      'var(--font-kantumruy), system-ui, -apple-system, sans-serif';

    const months = [
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
    ];
    const volunteers = [
      85, 102, 98, 120, 140, 160, 152, 168, 175, 182, 190, 210,
    ];

    // Helper to add alpha to hex
    const withAlpha = (hex, a) => {
      const h = hex.replace("#", "");
      const v =
        h.length === 3
          ? h
              .split("")
              .map((ch) => ch + ch)
              .join("")
          : h;
      const n = parseInt(v, 16);
      const r = (n >> 16) & 255,
        g = (n >> 8) & 255,
        b = n & 255;
      return `rgba(${r},${g},${b},${a})`;
    };

    // Line chart
    instances.current.line = new Chart(lineRef.current, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Volunteers",
            data: volunteers,
            tension: 0.35,
            fill: true,
            backgroundColor: withAlpha(COLOR.info, 0.12),
            borderColor: COLOR.info,
            pointRadius: 4,
            pointBackgroundColor: COLOR.info,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, ticks: { stepSize: 50 } },
        },
        plugins: { legend: { display: false } },
      },
    });

    // Donut chart
    instances.current.donut = new Chart(donutRef.current, {
      type: "doughnut",
      data: {
        labels: ["Pending", "Approved", "Rejected"],
        datasets: [
          {
            data: [96, 312, 24],
            backgroundColor: [COLOR.warning, COLOR.success, COLOR.danger],
            borderWidth: 0,
          },
        ],
      },
      options: { 
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%", 
        plugins: { legend: { position: "bottom" } } 
      },
    });

    // Bar chart
    instances.current.bar = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: [
          "Cleanup",
          "Tree Planting",
          "Forest",
          "Beach",
          "Blood Drive",
          "Tutoring",
        ],
        datasets: [
          {
            label: "Applications",
            data: [120, 86, 64, 58, 54, 50],
            borderRadius: 8,
            backgroundColor: [
              COLOR.info,
              "#0dcaf0",
              "#7c3aed",
              COLOR.warning,
              COLOR.danger,
              COLOR.success,
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, ticks: { stepSize: 20 } },
        },
        plugins: { legend: { display: false } },
      },
    });

    const charts = instances.current;
    return () => {
      Object.values(charts).forEach((c) => c?.destroy());
    };
  }, []);

  return (
    <div className="tab-pane fade show active" id="analytics">
      <div className="vh-section-card p-4">
        {/* Header & filters */}
        <div
          className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4"
          data-aos="fade-up"
        >
          <div>
            <h5 className="mb-0 fw-bold title-theme">ការវិភាគទិន្នន័យ</h5>
          </div>
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-control-premium"
              style={{ minWidth: 120 }}
              defaultValue="90"
            >
              <option value="30">30 ថ្ងៃ</option>
              <option value="90">90 ថ្ងៃ</option>
              <option value="365">១ ឆ្នាំ</option>
            </select>
            <select
              className="form-select form-control-premium"
              style={{ minWidth: 160 }}
              defaultValue="all"
            >
              <option value="all">Segment: ទាំងអស់</option>
              <option value="org">Organization</option>
              <option value="event">Events</option>
            </select>
          </div>
        </div>

        {/* Metric cards */}
        <div className="row g-3 mb-4" data-aos="fade-up" data-aos-delay="50">
          <div className="col-sm-6 col-xl-3">
            <div className="card h-100 border-0 metric-sub-card">
              <div className="card-body">
                <div className="metric-title">Total Volunteers</div>
                <div className="metric-value">1,256</div>
                <div className="metric-trend text-success">
                  <i className="bi bi-arrow-up-right me-1"></i>+8.2%
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card h-100 border-0 metric-sub-card">
              <div className="card-body">
                <div className="metric-title">Applications</div>
                <div className="metric-value">432</div>
                <div className="metric-trend text-success">
                  <i className="bi bi-arrow-up-right me-1"></i>+4.1%
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card h-100 border-0 metric-sub-card">
              <div className="card-body">
                <div className="metric-title">Approval Rate</div>
                <div className="metric-value">72%</div>
                <div className="metric-trend text-danger">
                  <i className="bi bi-arrow-down-right me-1"></i>−1.3%
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card h-100 border-0 metric-sub-card">
              <div className="card-body">
                <div className="metric-title">Active Opportunities</div>
                <div className="metric-value">18</div>
                <div className="metric-trend text-success">
                  <i className="bi bi-plus me-1"></i>+2 new
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row g-3" data-aos="fade-up" data-aos-delay="100">
          <div className="col-lg-8">
            <div className="card border-0 chart-canvas-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-baseline mb-3">
                  <h6 className="mb-0 fw-semibold text-primary-theme">Volunteers by Month</h6>
                  <small className="text-secondary-theme">ជាមួយចន្លោះពេលខាងលើ</small>
                </div>
                <div style={{ position: "relative", height: "260px" }}>
                  <canvas ref={lineRef}></canvas>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 chart-canvas-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-baseline mb-3">
                  <h6 className="mb-0 fw-semibold text-primary-theme">Application Status</h6>
                  <small className="text-secondary-theme">Pending / Approved / Rejected</small>
                </div>
                <div style={{ position: "relative", height: "260px" }}>
                  <canvas ref={donutRef}></canvas>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card border-0 chart-canvas-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-baseline mb-3">
                  <h6 className="mb-0 fw-semibold text-primary-theme">Applications by Opportunity</h6>
                  <small className="text-secondary-theme">Top 6</small>
                </div>
                <div style={{ position: "relative", height: "260px" }}>
                  <canvas ref={barRef}></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .vh-section-card {
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 20px !important;
          box-shadow: var(--shadow-card) !important;
        }

        .title-theme {
          color: var(--color-text-primary) !important;
        }
        .text-primary-theme {
          color: var(--color-text-primary) !important;
        }
        .text-secondary-theme {
          color: var(--color-text-secondary) !important;
          font-size: 11px;
        }

        .form-control-premium {
          background: var(--color-bg-input);
          color: var(--color-text-primary);
          border-radius: 8px;
          border: 1px solid var(--color-border);
          font-size: 13.5px;
          height: 38px;
          padding: 4px 10px;
        }
        .form-control-premium:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-glow);
          background: var(--color-bg-input);
          color: var(--color-text-primary);
        }

        /* Metric cards */
        .metric-sub-card {
          background: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 16px !important;
          transition: all 0.25s ease;
        }
        .metric-sub-card:hover {
          transform: translateY(-2px);
          border-color: var(--color-border-hover) !important;
        }
        .metric-title {
          font-weight: 600;
          color: var(--color-text-secondary);
          font-size: 13px;
        }
        .metric-value {
          font-size: 26px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-top: 4px;
        }
        .metric-trend {
          font-size: 12px;
          font-weight: 600;
          margin-top: 4px;
        }
        .metric-trend.text-success {
          color: var(--color-accent) !important;
        }

        /* Chart card */
        .chart-canvas-card {
          background: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 16px !important;
        }
      `}</style>
    </div>
  );
}
