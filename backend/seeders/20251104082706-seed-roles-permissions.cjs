module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import("uuid");

    const roles = [
      { id: uuidv4(), name: "admin", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "user", createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert("roles", roles);

    const permissions = [
      { id: uuidv4(), name: "send_message", description: "Mengirim pesan", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "manage_device", description: "Mengatur perangkat WhatsApp", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "view_logs", description: "Melihat log pesan", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "settings", description: "Mengatur konfigurasi aplikasi", createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert("permissions", permissions);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
