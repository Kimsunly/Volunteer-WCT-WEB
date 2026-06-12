"use client";

import React, { useEffect, useState } from "react";
import { getDashboardMetrics } from "@/services/admin";
import { useAuth } from "@/context/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      fetchData();

      const interval = setInterval(fetchData, 15000);

      return () => clearInterval(interval);
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    // Donations per month (Line chart
    const donationsMonths = Object.keys(metrics?.donations_per_month || {});
    const donationsTotals = Object.values(metrics?.donations_per_month || {});

    // Opportunities per category (Pie chart
    const categories = Object.keys(metrics?.opportunities_per_category || {});
    const categoryCounts = Object.values(
      metrics?.opportunities_per_category || {},
    );

    // Applications status (Doughnut chart
    const appStatuses = Object.keys(metrics?.applications_status || {});
    const appCounts = Object.values(metrics?.applications_status || {});

    // Users per month (Bar chart
    const userMonths = Object.keys(metrics?.users_per_month || {});
    const userCounts = Object.values(metrics?.users_per_month || {});

    return {
      donations: {
        labels: donationsMonths,
        data: donationsTotals,
      },
      opportunities: {
        labels: categories,
        data: categoryCounts,
      },
      applications: {
        labels: appStatuses,
        data: appCounts,
      },
      users: {
        labels: userMonths,
        data: userCounts,
      },
    };
  };

  const chartData = getChartData();

  const lineChartData = {
    labels: chartData.donations.labels,
    datasets: [
      {
        label: "Donations ($)",
        data: chartData.donations.data,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: chartData.opportunities.labels,
    datasets: [
      {
        label: "Opportunities",
        data: chartData.opportunities.data,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const doughnutChartData = {
    labels: chartData.applications.labels,
    datasets: [
      {
        label: "Applications",
        data: chartData.applications.data,
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  const barChartData = {
    labels: chartData.users.labels,
    datasets: [
      {
        label: "New Users",
        data: chartData.users.data,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Donations</div>
          <div className="kpi-value">
            $
            {loading ? "..." : (metrics?.donations_total || 0).toLocaleString()}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Total Users</div>
          <div className="kpi-value">
            {loading ? "..." : (metrics?.users_count || 0).toLocaleString()}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Active Opportunities</div>
          <div className="kpi-value">
            {loading
              ? "..."
              : (metrics?.opportunities_count?.active || 0).toLocaleString()}
          </div>
          <div className="flex items-center justify-between">
            <span
              className="status-badge pending"
              style={{ padding: "2px 8px" }}
            >
              {loading
                ? "..."
                : (
                    metrics?.opportunities_count?.pending || 0
                  ).toLocaleString()}{" "}
              pending
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Verified Organizers</div>
          <div className="kpi-value">
            {loading
              ? "..."
              : (metrics?.organizers_count?.verified || 0).toLocaleString()}
          </div>
          <div className="flex items-center justify-between">
            <span
              className="status-badge pending"
              style={{ padding: "2px 8px" }}
            >
              {loading
                ? "..."
                : (
                    metrics?.organizers_count?.pending || 0
                  ).toLocaleString()}{" "}
              pending
            </span>
          </div>
        </div>
      </div>

      <div className="two-col-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Opportunities Status</div>
          </div>
          <div style={{ height: "250px" }}>
            <Bar
              data={{
                labels: ["Active", "Pending"],
                datasets: [
                  {
                    label: "Count",
                    data: [
                      metrics?.opportunities_count?.active || 0,
                      metrics?.opportunities_count?.pending || 0,
                    ],
                    backgroundColor: ["#10b981", "#f59e0b"],
                  },
                ],
              }}
              options={{
                ...chartOptions,
                indexAxis: "y",
                plugins: {
                  ...chartOptions.plugins,
                  legend: { display: false },
                },
              }}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Organizers Status</div>
          </div>
          <div style={{ height: "250px" }}>
            <Bar
              data={{
                labels: ["Verified", "Pending", "Rejected"],
                datasets: [
                  {
                    label: "Count",
                    data: [
                      metrics?.organizers_count?.verified || 0,
                      metrics?.organizers_count?.pending || 0,
                      metrics?.organizers_count?.rejected || 0,
                    ],
                    backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
                  },
                ],
              }}
              options={{
                ...chartOptions,
                indexAxis: "y",
                plugins: {
                  ...chartOptions.plugins,
                  legend: { display: false },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="two-col-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Donations Over Time</div>
          </div>
          <div style={{ height: "300px" }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Opportunities by Category</div>
          </div>
          <div style={{ height: "300px" }}>
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="two-col-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Applications Status</div>
          </div>
          <div style={{ height: "300px" }}>
            <Doughnut data={doughnutChartData} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">New Users Per Month</div>
          </div>
          <div style={{ height: "300px" }}>
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
