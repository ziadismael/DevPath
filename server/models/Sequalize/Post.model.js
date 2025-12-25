import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/postgres.js';

const Post = sequelize.define('Post', {
    postID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    bodyText: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    mediaURL: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
        defaultValue: [],
    }
},
    {
        timestamps: true,
    });

export default Post;