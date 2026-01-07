// src/app/org/dashboard/components/panes/AnalyticsPane.jsx
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
      text: rs.getPropertyValue("--bs-body-color").trim() || "#212529",
      border: rs.getPropertyValue("--bs-border-color").trim() || "#dee2e6",
      primary: rs.getPropertyValue("--bs-primary").trim() || "#0d6efd",
      success: rs.getPropertyValue("--bs-success").trim() || "#198754",
      warning: rs.getPropertyValue("--bs-warning").trim() || "#ffc107",
      danger: rs.getPropertyValue("--bs-danger").trim() || "#dc3545",
      info: rs.getPropertyValue("--bs-info").trim() || "#0dcaf0",
    };

    Chart.defaults.color = COLOR.text;
    Chart.defaults.borderColor = COLOR.border;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.font.family =
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';

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
            backgroundColor: withAlpha(COLOR.primary, 0.15),
            borderColor: COLOR.primary,
            pointRadius: 3,
          },
        ],
      },
      options: {
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
      options: { cutout: "65%", plugins: { legend: { position: "bottom" } } },
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
              COLOR.primary,
              COLOR.info,
              "#6f42c1",
              "#ffd166",
              "#ef476f",
              "#118ab2",
            ],
          },
        ],
      },
      options: {
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
      <div className="card shadow-sm border-0 p-3 vh-analytics">
        {/* Header & filters (static, you can wire later) */}
        <div
          className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3"
          data-aos="fade-up"
        >
          <div>
            <h5 className="mb-0">ការវិភាគទិន្នន័យ</h5>
          </div>
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm"
              style={{ minWidth: 150 }}
              defaultValue="90"
            >
              <option value="30">30 ថ្ងៃ</option>
              <option value="90">90 ថ្ងៃ</option>
              <option value="365">១ ឆ្នាំ</option>
            </select>
            <select
              className="form-select form-select-sm"
              style={{ minWidth: 170 }}
              defaultValue="all"
            >
              <option value="all">Segment: ទាំងអស់</option>
              <option value="org">Organization</option>
              <option value="event">Events</option>
            </select>
          </div>
        </div>

        {/* Metric cards */}
        <div className="row g-3 mb-2" data-aos="fade-up" data-aos-delay="100">
          <div className="col-sm-6 col-xl-3">
            <div className="card h-100 border-0 bg-body-tertiary">
              <div className="card-body">
                <div className="fw-semibold text-body">Total Volunteers</div>
                <div className="fs-3 fw-bold">1,256</div>
                <div className="text-success small">
                  <i className="fa-solid fa-arrow-trend-up me-1"></i>+8.2%
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card h-100 border-0 bg-body-tertiary">
              <div className="card-body">
                <div className="fw-semibold text-body">Applications</div>
                <div className="fs-3 fw-bold">432</div>
                <div className="text-success small">
                  <i className="fa-solid fa-arrow-trend-up me-1"></i>+4.1%
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card h-100 border-0 bg-body-tertiary">
              <div className="card-body">
                <div className="fw-semibold text-body">Approval Rate</div>
                <div className="fs-3 fw-bold">72%</div>
                <div className="text-danger small">
                  <i className="fa-solid fa-arrow-trend-down me-1"></i>−1.3%
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card h-100 border-0 bg-body-tertiary">
              <div className="card-body">
                <div className="fw-semibold text-body">
                  Active Opportunities
                </div>
                <div className="fs-3 fw-bold">18</div>
                <div className="text-success small">
                  <i className="fa-solid fa-plus me-1"></i>+2 new
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row g-3" data-aos="fade-up" data-aos-delay="200">
          <div className="col-lg-8">
            <div className="card border-0 bg-body-tertiary">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-baseline mb-2">
                  <h6 className="mb-0">Volunteers by Month</h6>
                  <small>ជាមួយចន្លោះពេលខាងលើ</small>
                </div>
                <canvas ref={lineRef} height="120"></canvas>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 bg-body-tertiary">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-baseline mb-2">
                  <h6 className="mb-0">Application Status</h6>
                  <small>Pending / Approved / Rejected</small>
                </div>
                <canvas ref={donutRef} height="120"></canvas>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card border-0 bg-body-tertiary">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-baseline mb-2">
                  <h6 className="mb-0">Applications by Opportunity</h6>
                  <small>Top 6</small>
                </div>
                <canvas ref={barRef} height="210"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
