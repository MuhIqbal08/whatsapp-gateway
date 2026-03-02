"use client";

import { Users, MessageSquareMore, ChartNoAxesColumn } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import DashboardChart from "@/components/admin/Chart";
import api from "@/lib/axios";

const AdminDashboard = () => {
  const statusMessageChartRef = useRef(null);
  const messagesChartRef = useRef(null);
  const devicesChartRef = useRef(null);

  const messagesChartInstance = useRef(null);
  const devicesChartInstance = useRef(null);
  const statusMessageChartInstance = useRef(null);

  // const [userCount, setUserCount] = useState(null);
  const [deviceCount, setDeviceCount] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [messageCount, setMessageCount] = useState(null);
  const [messagesData, setMessagesData] = useState(Array(12).fill(0));
  const [devicesData, setDevicesData] = useState(Array(12).fill(0));
  const [dailyLimit, setDailyLimit] = useState(null);
  const [usedToday, setUsedToday] = useState(null);
  const [messageSuccess, setMessageSuccess] = useState(null);
  const [messagePending, setMessagePending] = useState(null);
  const [messageFailed, setMessageFailed] = useState(null);

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const response = await api.get("user/dashboard/admin");
        console.log("dashboard", response.data);
        // setUserCount(response.data.userCount);
        setDeviceCount(response.data.totals.devices);
        setUserCount(response.data.totals.users);
        setMessageCount(response.data.totals.messages);
        setMessagesData(response.data.messagesPerMonth || Array(12).fill(0));
        setDevicesData(response.data.devicesPerMonth || Array(12).fill(0));
        // setDailyLimit(response.data.dailyLimit);
        // setUsedToday(response.data.usedToday);
        setMessageSuccess(response.data.messageStatus.success);
        setMessagePending(response.data.messageStatus.pending);
        setMessageFailed(response.data.messageStatus.failed);
        // setName(response.data.user.name);
        // setRole(response.data.user.role);
        // setMessageCount(response.data.messageCount.count);
      } catch (error) {
        console.error(error);
      }
    };

    getDashboard();
  }, []);

  // Data untuk 12 bulan
  // const months = [
  //   "Jan",
  //   "Feb",
  //   "Mar",
  //   "Apr",
  //   "May",
  //   "Jun",
  //   "Jul",
  //   "Aug",
  //   "Sep",
  //   "Oct",
  //   "Nov",
  //   "Dec",
  // ];
  // const messagesData = [
  //   1200, 1900, 1500, 2200, 2800, 2400, 3100, 2900, 3400, 3800, 4200, 4500,
  // ];
  // const devicesData = [45, 52, 48, 61, 68, 65, 73, 70, 78, 82, 89, 95];

  useEffect(() => {
    if (
      !messagesChartRef.current ||
      !devicesChartRef.current ||
      !statusMessageChartRef.current
    )
      return;

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

    // Gradient untuk Devices Chart
    const devicesCtx = devicesChartRef.current.getContext("2d");
    const devicesGradient = devicesCtx.createLinearGradient(0, 0, 0, 400);
    devicesGradient.addColorStop(0, "rgba(0, 172, 193, 0.8)");
    devicesGradient.addColorStop(1, "rgba(0, 172, 193, 0.1)");

    // ======================
    // DESTROY OLD CHART
    // ======================
    messagesChartInstance.current?.destroy();
    devicesChartInstance.current?.destroy();
    statusMessageChartInstance.current?.destroy();

    // ======================
    // MESSAGES LINE CHART
    // ======================
    const messagesCtx = messagesChartRef.current.getContext("2d");

    messagesChartInstance.current = new Chart(messagesCtx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Total Messages",
            data: messagesData,
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    // ======================
    // STATUS PIE CHART
    // ======================
    const statusCtx = statusMessageChartRef.current.getContext("2d");

    statusMessageChartInstance.current = new Chart(statusCtx, {
      type: "pie",
      data: {
        labels: ["Success", "Pending", "Failed"],
        datasets: [
          {
            data: [
              messageSuccess || 0,
              messagePending || 0,
              messageFailed || 0,
            ],
            backgroundColor: [
              "rgba(16, 185, 129, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
      },
    });

    // ======================
    // DEVICES BAR CHART
    // ======================
    // const devicesCtx = devicesChartRef.current.getContext("2d");

    devicesChartInstance.current = new Chart(devicesCtx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Devices",
            data: devicesData,
            backgroundColor: devicesGradient,
            borderColor: "rgb(0, 172, 193)",
            // backgroundColor: "rgba(0, 172, 193, 0.6)",
             borderWidth: 1,
            borderRadius: 4,
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
  }, [messagesData, messageSuccess, messagePending, messageFailed]);

  // Hitung total dan rata-rata
  const totalMessages = messageCount || 0;
const totalDevices = deviceCount || 0;

const avgMessages =
  messagesData.length > 0
    ? Math.round(messagesData.reduce((a, b) => a + b, 0) / 12)
    : 0;

const avgDevices =
  devicesData.length > 0
    ? Math.round(devicesData.reduce((a, b) => a + b, 0) / 12)
    : 0;

  return (
    <>
    <div className="space-y-6">
      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Messages</p>
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
              <p className="text-sm text-gray-600 mb-1">Avg. Messages/Month</p>
              <p className="text-2xl font-bold text-emerald-600">
                {avgMessages.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <ChartNoAxesColumn className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Devices</p>
              <p className="text-2xl font-bold text-cyan-600">{deviceCount}</p>
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

        {/* <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Devices/Month</p>
              <p className="text-2xl font-bold text-cyan-600">{avgDevices}</p>
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
        </div> */}
      </div>
    </div>

      {/* Charts */}
      <DashboardChart
        messagesChartRef={messagesChartRef}
        devicesChartRef={devicesChartRef}
        statusMessageChartRef={statusMessageChartRef}
      />
    </>
  );
};

export default AdminDashboard;
