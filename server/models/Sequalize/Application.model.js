import {DataTypes} from 'sequelize';
import {sequelize} from '../../database/postgres.js';

const Application = sequelize.define('Application', {
        status:{
            type: DataTypes.ENUM('PENDING', 'REJECTED', 'INTERVIEW', 'ACCEPTED'),
            allowNull: false,
        },
    },
    {
        timestamps: {createdAt: 'appliedAt', updatedAt: false},
    });

export default Application;