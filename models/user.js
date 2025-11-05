import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";


const User = sequelize.define(
  "User",
  {
    user_uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        user.user_name = user.user_name.toLowerCase();
        user.email = user.email.toLowerCase();
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("user_name")) {
          user.user_name = user.user_name.toLowerCase();
        }
        if (user.changed("email")) {
          user.email = user.email.toLowerCase();
        }
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["user_uuid"],
      },
      {
        unique: true,
        fields: ["user_name"],
      },
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);

User.prototype.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default User;