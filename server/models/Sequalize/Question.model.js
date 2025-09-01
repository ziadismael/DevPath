import {DataTypes} from 'sequelize';
import {sequelize} from '../../database/postgres.js';

const Question = sequelize.define('Question', {
        problemID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title:{
            type: DataTypes.STRING,
            allowNull: false
        },
        difficulty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        }
    },
    {
        timestamps: false,
    });

export default Question;