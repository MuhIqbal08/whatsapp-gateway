"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Phone, CheckCheck, Clock, Send, Users, Zap } from "lucide-react";
import StatCard from "@/components/user/StatCard";

const DashboardPage = () => {
  const router = useRouter();

  const stats = [
      { label: "Messages Sent", value: "24,567", change: "+12.5%", positive: true, icon: Send, color: "green" },
      { label: "Delivery Rate", value: "98.7%", change: "+2.3%", positive: true, icon: CheckCheck, color: "blue" },
      { label: "Active Contacts", value: "8,942", change: "+18.2%", positive: true, icon: Users, color: "purple" },
      { label: "Avg Response Time", value: "2.4s", change: "-15.3%", positive: true, icon: Zap, color: "orange" },
    ];

  const recentMessages = [
    { id: '1', contact: '+62 812-3456-7890', message: 'Thank you for your service!', status: 'delivered', time: '2 min ago' },
    { id: '2', contact: '+62 813-9876-5432', message: 'When will the order arrive?', status: 'read', time: '5 min ago' },
    { id: '3', contact: '+62 821-1234-5678', message: 'Please send more information', status: 'sent', time: '8 min ago' },
    { id: '4', contact: '+62 822-8765-4321', message: 'Order confirmation received', status: 'delivered', time: '12 min ago' },
  ];

  const devices = [
    { name: "Device 1", number: "+62 812-xxx-1234", status: "online", messages: 1234 },
    { name: "Device 2", number: "+62 813-xxx-5678", status: "online", messages: 987 },
    { name: "Device 3", number: "+62 821-xxx-9012", status: "offline", messages: 756 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "read":
        return "bg-green-100 text-green-700";
      case "delivered":
        return "bg-blue-100 text-blue-700";
      case "sent":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Grid utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Message Activity</h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg font-medium">Today</button>
              <button className="px-3 py-1 text-sm text-gray-600 rounded-lg hover:bg-gray-100">Week</button>
              <button className="px-3 py-1 text-sm text-gray-600 rounded-lg hover:bg-gray-100">Month</button>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2">
            {[60, 80, 65, 90, 75, 95, 85].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {height * 10} msgs
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Devices */}
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Connected Devices</h2>
          <div className="space-y-3">
            {devices.map((device, i) => (
              <div
                key={i}
                className="p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-800 text-sm">{device.name}</span>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      device.status === "online" ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    }`}
                  ></span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{device.number}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{device.messages} messages</span>
                  <span
                    className={`text-xs font-medium ${
                      device.status === "online" ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {device.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-green-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Recent Messages</h2>
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Message</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentMessages.map((msg) => (
                <tr key={msg.id} className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{msg.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{msg.message}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        msg.status
                      )}`}
                    >
                      {msg.status === "delivered" && <CheckCheck className="w-3 h-3" />}
                      {msg.status === "read" && <CheckCheck className="w-3 h-3" />}
                      {msg.status === "sent" && <Clock className="w-3 h-3" />}
                      {msg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{msg.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
