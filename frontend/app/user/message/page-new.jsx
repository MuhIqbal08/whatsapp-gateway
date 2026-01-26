"use client";

import { assets } from "@/lib/assets";
import api from "@/lib/axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const UserMessage = () => {
  const [deviceId, setDeviceId] = useState("");
  const [numbers, setNumbers] = useState([]); // ARRAY nomor tujuan
  const [tempNumber, setTempNumber] = useState(""); // input sementara
  const [message, setMessage] = useState("");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  // ======================
  // FETCH DEVICES
  // ======================
  const getDevicesFromUserId = async () => {
    try {
      const res = await api.get("/whatsapp/device");
      setDevices(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDevicesFromUserId();
  }, []);

  // ======================
  // ADD NUMBER
  // ======================
  const addNumber = () => {
    if (!tempNumber) return;

    const clean = tempNumber.replace(/\D/g, "");

    if (clean.length < 10 || clean.length > 15) {
      alert("Nomor tidak valid");
      return;
    }

    if (numbers.includes(clean)) {
      alert("Nomor sudah ditambahkan");
      return;
    }

    setNumbers([...numbers, clean]);
    setTempNumber("");
  };

  // ======================
  // REMOVE NUMBER
  // ======================
  const removeNumber = (index) => {
    setNumbers(numbers.filter((_, i) => i !== index));
  };

  // ======================
  // SUBMIT
  // ======================
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!deviceId) {
      alert("Pilih device terlebih dahulu");
      return;
    }

    if (numbers.length === 0) {
      alert("Minimal 1 nomor tujuan");
      return;
    }

    if (!message) {
      alert("Pesan tidak boleh kosong");
      return;
    }

    try {
      setLoading(true);

      await api.post("/whatsapp/send", {
        deviceId,
        phoneNumber: numbers, // ARRAY dikirim ke backend
        message,
      });

      alert("Pesan berhasil dikirim!");

      // reset
      setNumbers([]);
      setMessage("");
      setTempNumber("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal mengirim pesan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-0">
    <div className="bg-linear-to-r from-emerald-800 to-cyan-800 w-full rounded-t-lg">
      <div className="flex gap-4 items-center py-5 px-4 sm:px-2 lg:px-8">
        <Image src={assets.logoTest} className="text-white" color={"#000000"} width={40} height={40} alt="logo" />
        <h2 className="text-xl font-extrabold text-white">Kirim Pesan Whatsapp</h2>
      </div>
    </div>
    <form onSubmit={submitHandler} className="p-6 bg-white rounded-b-lg shadow">

      {/* ================= DEVICE ================= */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-900">Pilih Device</label>
        <select
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-300 bg-white text-gray-900 appearance-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none hover:border-gray-400"
          required
        >
          <option value="" className="text-gray-500">-- Pilih Device --</option>
          {devices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= PHONE INPUT ================= */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Nomor Telepon</label>

        <div className="flex gap-2">
          <input
            type="tel"
            value={tempNumber}
            onChange={(e) => setTempNumber(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addNumber();
              }
            }}
            placeholder="628123456789"
            className="flex-1 px-4 py-2 rounded border border-gray-300 bg-white text-gray-900 appearance-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none hover:border-gray-400"
          />

          <button
            type="button"
            onClick={addNumber}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-all duration-200 ease-in-out cursor-pointer"
          >
            Tambah
          </button>
        </div>

        {/* LIST NUMBER */}
        {numbers.length > 0 && (
          <ul className="mt-3 space-y-2">
            {numbers.map((n, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
              >
                <span>{n}</span>
                <button
                  type="button"
                  onClick={() => removeNumber(i)}
                  className="text-red-600 hover:text-red-800 text-sm cursor-pointer transition-all duration-200 ease-in-out"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}

        {numbers.length > 0 && (
          <div className="flex mt-1 items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
            <svg
              className="w-4 h-4 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              <strong>{numbers.length}</strong> nomor siap dikirim
            </span>
          </div>
        )}
      </div>

      {/* ================= MESSAGE ================= */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Pesan</label>
        <textarea
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan Anda..."
          className="w-full px-4 py-2 rounded border border-gray-300 bg-white text-gray-900 appearance-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none hover:border-gray-400 resize-none"
          required
        />
      </div>

      {/* ================= SUBMIT ================= */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold py-2.5 rounded hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </form>
    </div>
  );
};

export default UserMessage;
