import {DataTypes} from 'sequelize';
import {sequelize} from '../../database/postgres.js';

const TeamMember = sequelize.define('TeamMember', {
    role:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    },
    {
        timestamps: false,
    });

export default TeamMember;