import {DataTypes} from 'sequelize';
import {sequelize} from '../../database/postgres.js';

const Project = sequelize.define('Project', {
    projectID:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    techStack: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
    },
    gitHubRepo:{
        type: DataTypes.STRING,
        validate: {
            isUrl: true,
        }
    },
    liveDemoURL: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    screenshots: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
    },
},
    {
 timestamps: true,
});

export default Project;