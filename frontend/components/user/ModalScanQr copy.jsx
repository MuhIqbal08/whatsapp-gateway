import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import io from "socket.io-client";
import QRCode from "react-qr-code";

const socket = io("http://localhost:5000"); // ganti jika perlu

const ModalScanQr = ({ deviceId, closeModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    if (!deviceId) return;

    const eventName = `qr-${deviceId}`;

    socket.on(eventName, (data) => {
      if (data.qr) {
        setQrValue(data.qr);
        setIsOpen(true);
      }
    });

    return () => socket.off(eventName);
  }, [deviceId]);

  if (!isOpen) return null;

  return (
    <div className="overflow-y-auto overflow-x-hidden fixed top-1/2 left-1/2 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">

        {/* CLOSE */}
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 z-10 p-2.5 bg-white hover:bg-gray-50 rounded-xl shadow-md"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* CONTENT */}
        <div className="p-10">
          <div className="flex justify-center mb-6 bg-white p-4 rounded-xl shadow">
            <QRCode
              value={qrValue}
              size={240}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          </div>

          <p className="text-center text-gray-700 font-medium text-lg">
            Scan QR Code with{" "}
            <span className="bg-linear-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent font-bold">
              WhatsApp
            </span>
          </p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </div>
  );
};

export default ModalScanQr;
