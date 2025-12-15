/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import("uuid");

    // --- 1️⃣ Insert Roles ---
    const roles = [
      { id: uuidv4(), name: "admin", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "user", createdAt: new Date(), updatedAt: new Date() },
    ];
    await queryInterface.bulkInsert("roles", roles);

    // --- 2️⃣ Insert Permissions ---
    const permissions = [
      { id: uuidv4(), name: "manage_roles", description: "Mengirim pesan", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "manage_permissions", description: "Mengirim pesan", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "manage_users", description: "Mengirim pesan", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "manage_message", description: "Mengirim pesan", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "user_message", description: "Mengirim pesan", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "send_message", description: "Mengirim pesan", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "manage_device", description: "Mengatur perangkat WhatsApp", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "view_logs", description: "Melihat log pesan", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "settings", description: "Mengatur konfigurasi aplikasi", createdAt: new Date(), updatedAt: new Date() },
    ];
    await queryInterface.bulkInsert("permissions", permissions);

    // --- 3️⃣ Insert Role-Permissions ---
    // ambil id berdasarkan nama
    const getRoleId = (name) => roles.find((r) => r.name === name)?.id;
    const getPermissionId = (name) => permissions.find((p) => p.name === name)?.id;

    // relasi: admin punya semua permission, user hanya beberapa
    const rolePermissions = [
      // Admin punya semua
      ...permissions.map((perm) => ({
        id: uuidv4(),
        roleId: getRoleId("admin"),
        permissionId: perm.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),

      // User hanya boleh kirim pesan dan lihat log
      {
        id: uuidv4(),
        roleId: getRoleId("user"),
        permissionId: getPermissionId("send_message"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        roleId: getRoleId("user"),
        permissionId: getPermissionId("user_message"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        roleId: getRoleId("user"),
        permissionId: getPermissionId("view_logs"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("role_permissions", rolePermissions);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("role_permissions", null, {});
    await queryInterface.bulkDelete("permissions", null, {});
    await queryInterface.bulkDelete("roles", null, {});
  },
};
