"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import("uuid");
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.default.hash("admin123", 10);

    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'admin' LIMIT 1`,
    );

    if (!roles.length) {
      throw new Error("Role 'admin' not found. Please seed Roles first.");
    }

    const adminRoleId = roles[0].id;
    const adminId = uuidv4(); // ✅ simpan id admin

    try {
      
      await queryInterface.bulkInsert("users", [
        {
          id: adminId,
          name: "Admin",
          email: "admin@example.com",
          phoneNumber: '0812345678910',
          roleId: '9318ff33-b08a-49c7-a210-6fa0acb044be',
          dailyLimit: 999999,
          usedToday: 0,
          lastResetDate: new Date(),
          refreshToken: null,
          image: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } catch (err) {
       console.log("=== USERS ERROR ===");
  console.log(err.parent?.sqlMessage);
  console.log(err.parent);
  throw err;
    }

    try {
      
      await queryInterface.bulkInsert("user_auths", [
        {
          id: uuidv4(),
          userId: adminId, // ✅ pakai UUID, bukan email
          provider: "manual",
          providerUserId: "admin@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } catch (err) {
      console.log("=== USER_AUTHS ERROR ===");
  console.log(err.parent?.sqlMessage);
  console.log(err.parent);
  throw err;
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("user_auths", {}, {});
    await queryInterface.bulkDelete("users", {
      email: "admin@example.com",
    });
  },
};
