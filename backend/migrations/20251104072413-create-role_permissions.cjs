'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('role_permissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      roleId: {
        type: Sequelize.UUID,
        references: {
          model: 'roles',
          key: 'id'
        },
        allowNull: false
      },
      permissionId: {
        type: Sequelize.UUID,
        references: {
          model: 'permissions',
          key: 'id'
        },
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    }, {
      indexes: [
        {
          unique: true,
          fields: ['roleId', 'permissionId']
        }
      ]
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('role_permissions');
  }
};
