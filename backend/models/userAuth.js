export default (sequelize, DataTypes) => {
  const UserAuth = sequelize.define(
    "UserAuth",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      provider: {
        type: DataTypes.ENUM(
          "manual",
          "google",
          "facebook",
          "github",
          //   "email_link",
          //   "email_otp",
        ),
        allowNull: false,
      },
      providerUserId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "user_auths",
      validate: {
        manualMustHavePassword() {
          if (this.provider === "manual" && !this.password) {
            throw new Error("Manual login must have password");
          }
          if (this.provider !== "manual" && this.password) {
            throw new Error("Only manual provider can have password");
          }
        },
      },
      indexes: [
        {
          name: "unique_user_provider",
          unique: true,
          fields: ["userId", "provider"],
        },
        {
          name: "unique_provider_identity",
          unique: true,
          fields: ["provider", "provider_user_id"],
        },
        {
          name: "idx_userId",
          fields: ["userId"],
        },
      ],
    },
  );

  UserAuth.associate = (models) => {
    UserAuth.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return UserAuth;
};
