import { MessageSquareMore } from "lucide-react";
import React from "react";

const DashboardChart = ({
  messagesChartRef,
  devicesChartRef,
  statusMessageChartRef,
}) => {
  return (
    <>
    <div>

      {/* ===================== */}
      {/* Monthly Messages Chart */}
      {/* ===================== */}
      <div className="grid grid-cols-1">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Monthly Messages
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Overview of total messages sent each month
            </p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <MessageSquareMore className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="h-64 md:h-80">
          <canvas ref={messagesChartRef}></canvas>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span>Message activity trend per month</span>
        </div>
      </div>
      </div>

      {/* ===================== */}
      {/* Status & Devices Grid */}
      {/* ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* Message Status Pie */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Message Status Distribution
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Success, pending, and failed message comparison
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <MessageSquareMore className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="h-64 md:h-80">
            <canvas ref={statusMessageChartRef}></canvas>
          </div>

          <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span>Success</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Failed</span>
            </div>
          </div>
        </div>

        {/* Devices Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Monthly Devices
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Total registered devices per month
              </p>
            </div>
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-cyan-600"
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

          <div className="h-64 md:h-80">
            <canvas ref={devicesChartRef}></canvas>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
            <span>Device growth trend per month</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DashboardChart;