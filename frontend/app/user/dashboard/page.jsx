
"use client"

import { Users, MessageSquareMore, ChartNoAxesColumn } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import DashboardChart from "@/components/user/Chart";
import api from "@/lib/axios";

const UserDashboard = () => {
  const messagesChartRef = useRef(null);
  const devicesChartRef = useRef(null);
  const messagesChartInstance = useRef(null);
  const statusMessageChartInstance = useRef(null);
  // const [userCount, setUserCount] = useState(null);
  const [deviceCount, setDeviceCount] = useState(null);
  const [messageCount, setMessageCount] = useState(null);
  const [messagesData, setMessagesData] = useState(Array(12).fill(0));
  const [dailyLimit, setDailyLimit] = useState(null);
  const [usedToday, setUsedToday] = useState(null);
  const [messageSuccess, setMessageSuccess] = useState(null);
  const [messagePending, setMessagePending] = useState(null);
  const [messageFailed, setMessageFailed] = useState(null);
  // const [name, setName] = useState(null);
  // const [role, setRole] = useState(null);

  useEffect(() => {
  const getDashboard = async () => {
    try {
      const response = await api.get("user/dashboard");
      console.log('dashboard', response.data);
      // setUserCount(response.data.userCount);
      setDeviceCount(response.data.devicesCount);
      setMessagesData(response.data.messagesData || Array(12).fill(0));
      setDailyLimit(response.data.dailyLimit);
      setUsedToday(response.data.usedToday);
      setMessageSuccess(response.data.status.success);
      setMessagePending(response.data.status.pending);
      setMessageFailed(response.data.status.failed);
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
  // const messagesData = [
  //   1200, 1900, 1500, 2200, 2800, 2400, 3100, 2900, 3400, 3800, 4200, 4500,
  // ];
  const devicesData = [45, 52, 48, 61, 68, 65, 73, 70, 78, 82, 89, 95];

  useEffect(() => {
    // Gradient untuk Messages Chart
    const messagesCtx = messagesChartRef.current.getContext("2d");
    const messagesGradient = messagesCtx.createLinearGradient(0, 0, 0, 400);
    messagesGradient.addColorStop(0, "rgba(16, 185, 129, 0.8)");
    messagesGradient.addColorStop(1, "rgba(16, 185, 129, 0.1)");

    // Gradient untuk Devices Chart
    const statusMessageCtx = devicesChartRef.current.getContext("2d");
    const devicesGradient = statusMessageCtx.createLinearGradient(0, 0, 0, 400);
    devicesGradient.addColorStop(0, "rgba(0, 172, 193, 0.8)");
    devicesGradient.addColorStop(1, "rgba(0, 172, 193, 0.1)");

    // Destroy existing charts
    if (messagesChartInstance.current) {
      messagesChartInstance.current.destroy();
    }
    if (statusMessageChartInstance.current) {
      statusMessageChartInstance.current.destroy();
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
    // Devices Chart (Pie Chart untuk Status)
    statusMessageChartInstance.current = new Chart(statusMessageCtx, {
      type: "pie",
      data: {
        labels: ["Success", "Pending", "Failed"],
        datasets: [
          {
            label: "Message Status",
            data: [messageSuccess, messagePending, messageFailed], // [success, pending, failed], 450, 180], // Success, Pending, Failed
            backgroundColor: [
              "rgba(16, 185, 129, 0.8)", // Success - emerald
              "rgba(245, 158, 11, 0.8)", // Pending - amber
              "rgba(239, 68, 68, 0.8)", // Failed - red
            ],
            borderColor: [
              "rgb(16, 185, 129)",
              "rgb(245, 158, 11)",
              "rgb(239, 68, 68)",
            ],
            borderWidth: 2,
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
                const label = context.label || "";
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value.toLocaleString()} (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (messagesChartInstance.current) {
        messagesChartInstance.current.destroy();
      }
      if (statusMessageChartInstance.current) {
        statusMessageChartInstance.current.destroy();
      }
    };
  }, [messagesData]);

  // Hitung total dan rata-rata
  const totalMessages = messagesData.reduce((a, b) => a + b, 0);
  const totalDevices = devicesData.reduce((a, b) => a + b, 0);
  const avgMessages = Math.round(totalMessages / 12);
  const avgDevices = Math.round(totalDevices / 12);
  const dailyUsage = dailyLimit > 0 ? Math.round((usedToday / dailyLimit) * 100) : 0;

  return (
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

      <div className="">
        <div className="bg-linear-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6   border border-gray-200">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold bg-linear-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  Daily Usage
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Track your daily progress
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-800">{dailyUsage}</p>
                <p className="text-xs text-gray-500">of limit used</p>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative">
              {/* Background track */}
              <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                {/* Animated gradient bar */}
                <div
                  className="h-full bg-linear-to-r from-cyan-500 via-emerald-500 to-cyan-500 bg-size-[200%_100%] animate-gradient rounded-full flex items-center justify-end pr-3 transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width:  `${dailyUsage}%` }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-30 animate-shine" />

                  {/* Percentage text */}
                  <span className="text-xs font-bold text-white drop-shadow-lg relative z-10">
                    {dailyUsage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-3 bg-linear-to-br bg-cyan-200 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Used</p>
                <p className="text-lg font-bold text-cyan-700">{usedToday}</p>
              </div>
              <div className="text-center p-3 bg-linear-to-br bg-emerald-200 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Remaining</p>
                <p className="text-lg font-bold text-emerald-700">{dailyLimit - usedToday}</p>
              </div>
              <div className="text-center p-3 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Total</p>
                <p className="text-lg font-bold text-gray-700">{dailyLimit}</p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes gradient {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          @keyframes shine {
            0% {
              transform: translateX(-100%) skewX(-15deg);
            }
            100% {
              transform: translateX(200%) skewX(-15deg);
            }
          }

          .animate-gradient {
            animation: gradient 3s ease infinite;
          }

          .animate-shine {
            animation: shine 3s ease-in-out infinite;
          }
        `}</style>
      </div>

      {/* Charts */}
      <DashboardChart
        messagesChartRef={messagesChartRef}
        devicesChartRef={devicesChartRef}
      />
    </div>
  );
};

export default UserDashboard;
