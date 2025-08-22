import {DataTypes} from 'sequelize';
import {sequelize} from '../../database/postgres.js';

const Interview = sequelize.define('Interview', {
    interviewID:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    weakPoints:{
        type: DataTypes.TEXT,
    },
    score:{
        type: DataTypes.INTEGER,
    },
    typeOfInterview:{
        type: DataTypes.ENUM("HR", "Tech"),
        allowNull: false,
    },
    transcript:{
        type: DataTypes.TEXT,
    }
    },
    {
        timestamps: false,
    });

export default Interview;