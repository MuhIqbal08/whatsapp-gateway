/* eslint-disable react-hooks/refs */
"use client";

import api from "@/lib/axios";
import React, { useEffect, useState, useRef } from "react";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";

export default function QRPage() {
  const [qr, setQr] = useState("");
  const [deviceId, setDeviceId] = useState(null);
  const [connected, setConnected] = useState(false);

  // Socket dibuat sekali
  const socketRef = useRef(null);
  if (!socketRef.current) {
    socketRef.current = io("http://localhost:4000");
  }
  const socket = socketRef.current;

  // Ambil deviceId dari query
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("deviceId");
    setDeviceId(id);
  }, []);

  // Panggil backend untuk memulai koneksi WA
  useEffect(() => {
    if (!deviceId) return;
    setQr("");
    setConnected(false);

    api.get(`/whatsapp/connect/${deviceId}`);
  }, [deviceId]);

  // Listener
  useEffect(() => {
    if (!deviceId) return;

    const handleQR = (data) => {
      if (data.deviceId !== deviceId) return;
      console.log("QR RECEIVED:", data.qr);
      setQr(data.qr);
    };

    const handleConnected = (data) => {
      if (data.deviceId !== deviceId) return;
      console.log("CONNECTED:", data);
      setConnected(true);
      setQr("");
    };

    socket.on("wa:qr", handleQR);
    socket.on("wa:connected", handleConnected);

    return () => {
      socket.off("wa:qr", handleQR);
      socket.off("wa:connected", handleConnected);
    };
  }, [deviceId]);

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-xl font-semibold">Scan QR WhatsApp</h1>

      {!connected ? (
        qr ? (
          <div className="p-4 bg-white rounded shadow">
            <QRCode value={qr} size={300} />
          </div>
        ) : (
          <p className="mt-4 text-gray-600">Menunggu QR code...</p>
        )
      ) : (
        <p className="mt-4 text-green-600 font-bold">WhatsApp Connected!</p>
      )}
    </div>
  );
}
