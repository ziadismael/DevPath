import {DataTypes} from 'sequelize';
import {sequelize} from '../../database/postgres.js';

const Project = sequelize.define('Project', {
    projectID:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gitHubRepo:{
        type: DataTypes.STRING,
    }
},
    {
 timestamps: false,
});

export default Project;