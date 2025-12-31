"use client";
import api from "@/lib/axios";
import React, { useEffect, useState } from "react";

const UserMessageGroup = () => {
  const [deviceId, setDeviceId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [message, setMessage] = useState("");
  const [devices, setDevices] = useState([]);

  const getDevicesFromUserId = async () => {
    try {
      const res = await api.get("/whatsapp/device");
      setDevices(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitHandler = async(e) => {
        e.preventDefault();
        try {
            await api.post('/whatsapp/send/group', {deviceId: deviceId, groupId: groupId, message: message})
            alert('Pesan Berhasil Terkirim!')
            closeModal()
        } catch (error) {
            console.error(error)
        }
    }

  useEffect(() => {
      const fetchData = async () => {
        await getDevicesFromUserId();
      };
      fetchData();
    }, []);

  return (
    <form onSubmit={submitHandler} className="p-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Kirim Pesan WhatsApp
      </h2>

      {/* Device Selection */}
      <div className="mb-4">
        <label
          htmlFor="device"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Pilih Device
        </label>
        <select
          id="device"
          name="device"
        //   value={formData.device}
          onChange={(e) => setDeviceId(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition outline-none"
          required
        >
          <option value="">-- Pilih Device --</option>
          {devices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
      </div>

      {/* Phone Number */}
      <div className="mb-4">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Grup Id
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
        //   value={formData.phone}
          onChange={(e) => setGroupId(e.target.value)}
          placeholder="628123456789"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition outline-none"
          required
        />
      </div>

      {/* Message */}
      <div className="mb-6">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Pesan
        </label>
        <textarea
          id="message"
          name="message"
        //   value={formData.message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan Anda di sini..."
          rows="4"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition outline-none resize-none"
          required
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
      type="submit"
        // onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold py-2.5 rounded-lg hover:from-emerald-700 hover:to-cyan-700 transition shadow-md hover:shadow-lg"
      >
        Kirim Pesan
      </button>
    </form>
  );
};

export default UserMessageGroup;
