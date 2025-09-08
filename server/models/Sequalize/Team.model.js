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
    isPersonal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // normal teams are collaborative unless specified
    }
    },
    {
        timestamps: false,
    });

export default Team;