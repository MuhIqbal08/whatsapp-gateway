/* eslint-disable react-hooks/refs */
"use client";

import api from "@/lib/axios";
import React, { useEffect, useState, useRef } from "react";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function QRPage() {
  const router = useRouter();
  const [qr, setQr] = useState(null);
  const [connected, setConnected] = useState(false);
  const [resetFlag, setResetFlag] = useState(false);
  const [deviceId, setDeviceId] = useState(null);

  const socketRef = useRef(null);
  if (!socketRef.current) socketRef.current = io("http://localhost:4000");
  const socket = socketRef.current;

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("deviceId");
    setDeviceId(id);
  }, []);

  useEffect(() => {
    if (!deviceId) return;

    setQr(null);
    setConnected(false);
    setResetFlag(false);

    api.get(`/whatsapp/connect/${deviceId}`);
  }, [deviceId]);

  useEffect(() => {
    if (!deviceId) return;
    const eventName = `qr-${deviceId}`;

    const handleQR = (data) => {
      console.log("QR EVENT:", data);

      if (data.reset) {
        setResetFlag(true);
        setQr(null);
        setConnected(false);
        return;
      }

      if (data.connected) {
        setConnected(true);

        // Redirect ke halaman sebelumnya setelah 1 detik
        setTimeout(() => {
          router.back(); // atau router.push("/dashboard")
        }, 1000);

        return;
      }

      if (data.qr) {
        setQr(data.qr);
        setConnected(false);
      } else {
        setQr(null);
      }
    };

    socket.on(eventName, handleQR);

    return () => socket.off(eventName, handleQR);
  }, [deviceId, router]);

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-xl font-semibold mb-4">
        Scan QR WhatsApp (Device {deviceId})
      </h1>

      {resetFlag && (
        <p className="text-red-600 mb-3">
          Session reset. Silakan scan ulang.
        </p>
      )}

      {connected && (
        <p className="text-green-600 font-bold text-lg">
          WhatsApp Connected 🎉 | Mengarahkan...
        </p>
      )}

      {!connected && qr && (
        <div className="p-4 bg-white rounded shadow">
          <QRCode value={qr} size={300} />
        </div>
      )}

      {!connected && !qr && (
        <p className="mt-4 text-gray-500">
          Menunggu QR atau sedang menghubungkan...
        </p>
      )}
    </div>
  );
}
