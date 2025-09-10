import {DataTypes} from 'sequelize';
import {sequelize} from '../../database/postgres.js';
import User from './User.model.js';
import Team from './Team.model.js';

const TeamMember = sequelize.define('TeamMember', {
    role:{
        type: DataTypes.STRING,
        allowNull: false,
    },
        teamID: {
            type: DataTypes.UUID,
            references: {
                model: Team,
                key: 'teamID'
            }
        },
        userID: {
            type: DataTypes.UUID,
            references: {
                model: User,
                key: 'userID'
            }
        },
    },
    {
        timestamps: false,
    });

export default TeamMember;