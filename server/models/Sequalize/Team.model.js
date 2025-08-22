import {DataTypes} from 'sequelize';
import {sequelize} from '../../database/postgres.js';

const Team = sequelize.define('Team', {
    teamID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    teamName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    },
    {
        timestamps: false,
    });

export default Team;