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
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.firstName} ${this.lastName}`;
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Ensures the value is a valid email format
        }
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
    country: {
       type: DataTypes.STRING,
        allowNull: true,
    }
    },
    {
    timestamps: false,
});

export default User;

