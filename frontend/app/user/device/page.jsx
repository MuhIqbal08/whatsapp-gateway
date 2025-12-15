"use client";
import ModalScanQr from "@/components/user/ModalScanQr";
import ModalUserDevice from "@/components/user/ModalUserDevice";
import api from "@/lib/axios";
import React, { useEffect } from "react";

const UserDevice = () => {
  const [showModal, setShowModal] = React.useState(false);
  // const [showQrModal, setShowQrModal] = React.useState(false);
  const [deviceId, setDeviceId] = React.useState(null);
  const [devices, setDevices] = React.useState([]);
  const getDevice = async () => {
    const res = await api.get("/whatsapp/device");
    console.log(res.data.data);
    setDevices(res.data.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDevice();
    };
    fetchData();
  }, []);

  const handleOpenQr = async (id) => {
    if (!deviceId) return;
    await fetch(`/api/device/connect/${id}`, { method: "POST" });
    setShowQrModal(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/whatsapp/device/${id}`);
    console.log("deleted succesfully!")
    await getDevice();
  };

  return (
    <div className="p-3">
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
      >
        Create Device
      </button>
      {showModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <ModalUserDevice
            closeModal={() => setShowModal(false)}
            onUpdate={getDevice}
          />
        </div>
      )}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs uppercase bg-gray-50 text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3 w-70">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-2 text-gray-700 mx-auto my-auto text-center"
                >
                  No Data
                </td>
              </tr>
            ) : (
              devices.map((device, index) => (
                <tr
                  key={device.id}
                  className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                >
                  <td className="px-6 py-2 font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-2 text-gray-700">{device.name}</td>
                  <td className="px-6 py-2 text-gray-700">
                    {device.phoneNumber}
                  </td>
                  <td className="px-6 py-2 text-gray-700">
                    {device.isActive ? "Connected" : "Disconnected"}
                  </td>
                  <td className="px-6 py-2 space-x-1">
                    <button className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        await fetch(`/api/device/connect/${device.id}`, {
                          method: "POST",
                        });

                        // redirect ke halaman QR dengan deviceId
                        window.location.href = `/user/device/qrcode?deviceId=${device.id}`;
                      }}
                      className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300"
                    >
                      Connect
                    </button>

                    <button onClick={() => handleDelete(device.id)} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* {showQrModal && (
        <div className="fixed inset-0 z-60">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowQrModal(false)}
          />
          <ModalScanQr
            deviceId={deviceId}
            closeModal={() => setShowQrModal(false)}
          />
        </div>
      )} */}
    </div>
  );
};

export default UserDevice;
