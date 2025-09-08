import {DataTypes} from 'sequelize';
import {sequelize} from '../../database/postgres.js';

const User = sequelize.define("User", {
   userID:{
       type:DataTypes.UUID,
       defaultValue:DataTypes.UUIDV4,
       primaryKey: true,
   },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    university: {
        type: DataTypes.STRING,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("Admin", "User"),
        defaultValue: "User",
   },

    },
    {
    timestamps: false,
});

export default User;

