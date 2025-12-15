"use client"
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import io from "socket.io-client";
import QRCode from "react-qr-code";

const socket = io("http://localhost:4000"); // ganti jika perlu

const ModalScanQr = ({ deviceId, closeModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    if (!deviceId) return;

    const eventName = `qr-${deviceId}`;

    const listener = (data) => {
      if (data.qr) {
        setQrValue(data.qr);
        setIsOpen(true);
      }
    };

    socket.on(eventName, listener);

    return () => socket.off(eventName, listener);
  }, [deviceId]);

  // Jika modal belum dibuka, tidak tampil
  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    closeModal();
  };

  return (
    <div
      id="qrcode-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="
        fixed top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        z-50 w-full h-full 
        bg-black bg-opacity-40
        flex justify-center items-center
      "
    >
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              QR Code
            </h3>

            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BODY */}
          <div className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Tampilkan QR Code kepada pengguna untuk dipindai.
            </p>

            <div className="bg-white p-4 rounded-lg shadow flex items-center justify-center">
              <QRCode value={qrValue || "loading"} size={200} />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end p-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalScanQr;
