import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/postgres.js';

const Comment = sequelize.define('Comment', {
    commentID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    text: {
        type: DataTypes.TEXT,
    },
    mediaURL: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
},
    {
        timestamps: false,
    });

export default Comment;