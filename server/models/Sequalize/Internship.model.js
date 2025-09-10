import {DataTypes} from 'sequelize';
import {sequelize} from '../../database/postgres.js';

const Internship = sequelize.define('Internship', {
        internshipID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        description: {
            type: DataTypes.TEXT,
        },
        title: {
            type: DataTypes.STRING,
        },
        company: {
            type: DataTypes.STRING,
        },
        location:{
            type: DataTypes.STRING,
        },
        mediaURL: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        applyLink: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: false,
    });

export default Internship;