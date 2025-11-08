export default (sequelize, DataTypes) => {
  const WhatsAppMessage = sequelize.define(
    "WhatsAppMessage",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      deviceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: DataTypes.STRING,
      sender: DataTypes.STRING,
      recipient: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      notes: DataTypes.STRING,
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
      tableName: "whatsapp_message",
    }
  );

  WhatsAppMessage.associate = (models) => {
    WhatsAppMessage.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return WhatsAppMessage;
};
