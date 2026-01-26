'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import("uuid");

    // 🔎 ambil role admin
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE name = 'admin' LIMIT 1`
    );

    if (!roles.length) {
      throw new Error("Role 'admin' not found. Please seed Roles first.");
    }

    const adminRoleId = roles[0].id;

    await queryInterface.bulkInsert('Users', [{
      id: uuidv4(),
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      phoneNumber: 'admin123',
      roleId: adminRoleId, // ✅ DINAMIS
      dailyLimit: 999999,
      usedToday: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: 'admin@example.com'
    });
  }
};
