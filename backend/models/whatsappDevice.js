export default (sequelize, DataTypes) => {
  const WhatsAppDevice = sequelize.define(
    "WhatsAppDevice",
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }, 
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sessionData: DataTypes.JSON,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "whatsapp_devices",
    }
  );

  WhatsAppDevice.associate = (models) => {
    WhatsAppDevice.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return WhatsAppDevice;
};
