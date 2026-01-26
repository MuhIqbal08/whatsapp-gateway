export default (sequelize, DataTypes) => {
  const ApiKeys = sequelize.define(
    "ApiKeys",
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apiKeysHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apiKeyHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      lastUsedAt: {
        type: DataTypes.DATE
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
      tableName: "api_keys",
    }
  );

  ApiKeys.associate = (models) => {
    ApiKeys.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return ApiKeys;
};
