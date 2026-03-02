"use client";
import api from "@/lib/axios";
import React, { useEffect, useState, useRef } from "react";

const UserMessage = () => {
  const [deviceId, setDeviceId] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [currentNumber, setCurrentNumber] = useState("");
  const [message, setMessage] = useState("");
  const [devices, setDevices] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });
  const [sendResults, setSendResults] = useState([]);
  const textareaRef = useRef(null);

  const getDevicesFromUserId = async () => {
    try {
      const res = await api.get("/whatsapp/device");
      console.log('devices', res.data.data)
      setDevices(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addRecipient = () => {
    if (!currentNumber.trim()) return;
    
    // Validasi format nomor
    if (!/^62\d{9,13}$/.test(currentNumber.trim())) {
      alert("Format nomor tidak valid. Gunakan format: 628123456789");
      return;
    }

    // Cek duplikat
    if (recipients.includes(currentNumber.trim())) {
      alert("Nomor sudah ada dalam daftar");
      return;
    }

    setRecipients([...recipients, currentNumber.trim()]);
    setCurrentNumber("");
  };

  const removeRecipient = (number) => {
    setRecipients(recipients.filter((n) => n !== number));
  };

  const clearAllRecipients = () => {
    if (confirm("Hapus semua nomor penerima?")) {
      setRecipients([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRecipient();
    }
  };

  const submitHandler = async (e) => {
  e.preventDefault();

  if (isSending) return;

  if (!deviceId) {
    alert("Pilih device pengirim terlebih dahulu");
    return;
  }

  if (recipients.length === 0) {
    alert("Tambahkan minimal 1 nomor penerima");
    return;
  }

  if (!message.trim()) {
    alert("Pesan tidak boleh kosong");
    return;
  }

  setIsSending(true);
  setSendProgress({ current: 0, total: recipients.length });
  setSendResults([]);

  const results = [];

  for (let i = 0; i < recipients.length; i++) {
    const phoneNumber = recipients[i];
    setSendProgress({ current: i + 1, total: recipients.length });

    try {
      await api.post("/whatsapp/send", {
        deviceId,
        phoneNumber,
        message,
      });

      results.push({
        number: phoneNumber,
        status: "success",
        message: "Berhasil terkirim",
      });

      if (i < recipients.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      results.push({
        number: phoneNumber,
        status: "failed",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Gagal mengirim",
      });
    }
  }

  setSendResults(results);
  setIsSending(false);
};


  const importFromText = (text) => {
    const numbers = text
      .split(/[\n,;]/)
      .map((n) => n.trim())
      .filter((n) => /^62\d{9,13}$/.test(n));

    const uniqueNumbers = [...new Set([...recipients, ...numbers])];
    setRecipients(uniqueNumbers);
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.includes("\n") || pastedText.includes(",")) {
      e.preventDefault();
      importFromText(pastedText);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDevicesFromUserId();
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 lg:p-6 bg-white">
      {/* Compact Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-linear-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
              {/* <svg
                className="w-5 h-5 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg> */}
              Kirim Pesan Broadcast
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Kirim pesan WhatsApp ke banyak nomor sekaligus
            </p>
          </div>
          {recipients.length > 0 && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-emerald-700 font-bold text-lg">
                {recipients.length}
              </span>
              <span className="text-emerald-600 text-sm font-medium">
                penerima
              </span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column - Form (3 columns) */}
          <div className="lg:col-span-3 space-y-5">
            {/* Device Selection */}
            <div>
              <label
                htmlFor="device"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Device Pengirim
              </label>
              <select
                id="device"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-300 hover:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none bg-white text-gray-700"
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

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Pesan Broadcast
              </label>
              <textarea
                id="message"
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan yang akan dikirim ke semua nomor...&#10;&#10;Contoh:&#10;Halo! Kami ingin menginformasikan promo spesial bulan ini..."
                rows="5"
                className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 hover:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none resize-none bg-white text-gray-700"
                required
              ></textarea>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  <span className="text-emerald-600 font-semibold">
                    {message.length}
                  </span>{" "}
                  karakter
                </p>
                {message.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMessage("")}
                    className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Hapus pesan
                  </button>
                )}
              </div>
            </div>

            {/* Tips */}
            {/* <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                <div>
                  <h4 className="text-sm font-bold text-amber-900 mb-1">
                    Tips Pesan Broadcast
                  </h4>
                  <ul className="text-xs text-amber-800 space-y-1">
                    <li>• Buat pesan yang personal dan relevan</li>
                    <li>• Sertakan nama bisnis/organisasi Anda</li>
                    <li>• Tambahkan call-to-action yang jelas</li>
                    <li>• Jaga kesopanan dan profesionalitas</li>
                  </ul>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Column - Recipients (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Daftar Penerima
                  {recipients.length > 0 && (
                    <span className="ml-2 bg-cyan-100 text-cyan-700 px-2 rounded-full text-xs font-bold">
                      {recipients.length}
                    </span>
                  )}
                </label>
                {recipients.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllRecipients}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
                  >
                    Hapus Semua
                  </button>
                )}
              </div>

              {/* Add Number Input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="tel"
                  value={currentNumber}
                  onChange={(e) => setCurrentNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onPaste={handlePaste}
                  placeholder="628123456789"
                  className="flex-1 text-sm px-4 rounded-lg border border-gray-300 hover:border-cyan-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 outline-none bg-white text-gray-700"
                />
                <button
                  type="button"
                  onClick={addRecipient}
                  className="px-5 py-2.5 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2 whitespace-nowrap"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-xs text-gray-500 mb-4 flex items-start gap-1.5">
                <svg
                  className="w-4 h-4 text-blue-500 mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Tekan{" "}
                  <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">
                    Enter
                  </kbd>{" "}
                  atau paste multiple nomor
                </span>
              </p>

              {/* Recipients List */}
              <div
                className="space-y-2 max-h-[500px] overflow-y-auto pr-1"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#cbd5e1 transparent",
                }}
              >
                {recipients.length === 0 ? (
                  <div className="text-center py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <svg
                      className="w-12 h-12 text-gray-300 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-gray-400 font-medium text-sm">
                      Belum ada nomor penerima
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Tambahkan nomor untuk memulai
                    </p>
                  </div>
                ) : (
                  recipients.map((number, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2.5 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-100 to-blue-100 flex items-center justify-center text-cyan-700 font-bold text-xs">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            +{number}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRecipient(number)}
                        className="w-7 h-7 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Import Guide */}
            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="text-xs font-bold text-blue-900 mb-1">
                    Import Cepat
                  </h4>
                  <p className="text-xs text-blue-700 mb-2">
                    Copy paste dari Excel/Notepad
                  </p>
                  <div className="bg-white/70 rounded p-2 font-mono text-[10px] text-blue-800">
                    628123456789
                    <br />
                    628234567890
                    <br />
                    628345678901
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Submit Section */}
        <div className="">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 bg-linear-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-lg px-5 py-2">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Siap mengirim pesan ke
                  </p>
                  <p className="text-sm font-bold text-emerald-600">
                    {recipients.length} nomor WhatsApp
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending || recipients.length === 0}
              className="w-full md:w-auto px-8 py-3.5 bg-linear-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-cyan-700 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group min-w-[200px]"
            >
              {isSending ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>
                    Mengirim {sendProgress.current}/{sendProgress.total}
                  </span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Kirim Broadcast
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          {isSending && (
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-linear-to-r from-emerald-500 to-cyan-500 h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${
                      (sendProgress.current / sendProgress.total) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 text-center mt-2">
                Mengirim pesan... {sendProgress.current} dari{" "}
                {sendProgress.total}
              </p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {sendResults.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="font-bold text-gray-800 mb-4 text-sm flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              Hasil Pengiriman
            </h3>

            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-700 font-medium">
                      Berhasil
                    </p>
                    <p className="text-xl font-bold text-emerald-600">
                      {
                        sendResults.filter((r) => r.status === "success")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-red-700 font-medium">Gagal</p>
                    <p className="text-xl font-bold text-red-600">
                      {sendResults.filter((r) => r.status === "failed").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="space-y-2 max-h-[300px] overflow-y-auto pr-1"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#cbd5e1 transparent",
              }}
            >
              {sendResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.status === "success"
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        result.status === "success"
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    >
                      {result.status === "success" ? (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-semibold text-sm ${
                          result.status === "success"
                            ? "text-emerald-700"
                            : "text-red-700"
                        }`}
                      >
                        +{result.number}
                      </p>
                      <p
                        className={`text-xs ${
                          result.status === "success"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-out {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }

        .animate-slide-out {
          animation: slide-out 0.3s ease-in forwards;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default UserMessage;