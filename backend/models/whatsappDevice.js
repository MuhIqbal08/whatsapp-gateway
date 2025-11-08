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
      name: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      sessionData: DataTypes.JSON,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      tableName: "whatsapp_device",
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
