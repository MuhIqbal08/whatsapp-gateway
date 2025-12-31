"use client";

import {
  Users,
  MessageSquareMore,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import DashboardChart from "@/components/admin/Chart";

const AdminDashboard = () => {
  const messagesChartRef = useRef(null);
  const devicesChartRef = useRef(null);
  const messagesChartInstance = useRef(null);
  const devicesChartInstance = useRef(null);

  // Data untuk 12 bulan
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const messagesData = [
    1200, 1900, 1500, 2200, 2800, 2400, 3100, 2900, 3400, 3800, 4200, 4500,
  ];
  const devicesData = [45, 52, 48, 61, 68, 65, 73, 70, 78, 82, 89, 95];

  useEffect(() => {
    // Gradient untuk Messages Chart
    const messagesCtx = messagesChartRef.current.getContext("2d");
    const messagesGradient = messagesCtx.createLinearGradient(0, 0, 0, 400);
    messagesGradient.addColorStop(0, "rgba(16, 185, 129, 0.8)");
    messagesGradient.addColorStop(1, "rgba(16, 185, 129, 0.1)");

    // Gradient untuk Devices Chart
    const devicesCtx = devicesChartRef.current.getContext("2d");
    const devicesGradient = devicesCtx.createLinearGradient(0, 0, 0, 400);
    devicesGradient.addColorStop(0, "rgba(0, 172, 193, 0.8)");
    devicesGradient.addColorStop(1, "rgba(0, 172, 193, 0.1)");

    // Destroy existing charts
    if (messagesChartInstance.current) {
      messagesChartInstance.current.destroy();
    }
    if (devicesChartInstance.current) {
      devicesChartInstance.current.destroy();
    }

    // Messages Chart
    messagesChartInstance.current = new Chart(messagesCtx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Total Messages",
            data: messagesData,
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: messagesGradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBackgroundColor: "rgb(16, 185, 129)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(16, 185, 129)",
            pointHoverBorderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            callbacks: {
              label: function (context) {
                return "Messages: " + context.parsed.y.toLocaleString();
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false,
            },
            ticks: {
              font: {
                size: 12,
              },
              color: "#6b7280",
              callback: function (value) {
                return value >= 1000 ? value / 1000 + "k" : value;
              },
            },
          },
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              font: {
                size: 12,
              },
              color: "#6b7280",
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      },
    });

    // Devices Chart
    devicesChartInstance.current = new Chart(devicesCtx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Total Devices",
            data: devicesData,
            backgroundColor: devicesGradient,
            borderColor: "rgb(0, 172, 193)",
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            callbacks: {
              label: function (context) {
                return "Devices: " + context.parsed.y;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false,
            },
            ticks: {
              font: {
                size: 12,
              },
              color: "#6b7280",
            },
          },
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              font: {
                size: 12,
              },
              color: "#6b7280",
            },
          },
        },
      },
    });

    return () => {
      if (messagesChartInstance.current) {
        messagesChartInstance.current.destroy();
      }
      if (devicesChartInstance.current) {
        devicesChartInstance.current.destroy();
      }
    };
  }, []);

  // Hitung total dan rata-rata
  const totalMessages = messagesData.reduce((a, b) => a + b, 0);
  const totalDevices = devicesData.reduce((a, b) => a + b, 0);
  const avgMessages = Math.round(totalMessages / 12);
  const avgDevices = Math.round(totalDevices / 12);

  return (
    <>
      {/* Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {totalMessages.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Messages
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {totalMessages.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MessageSquareMore className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Devices</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {totalDevices}
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Avg. Devices/Month
                  </p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {avgDevices}
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <DashboardChart messagesChartRef={messagesChartRef} devicesChartRef={devicesChartRef} />
    </>
  );
};

export default AdminDashboard;
