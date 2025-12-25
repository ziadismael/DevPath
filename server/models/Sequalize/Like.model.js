import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/postgres.js';

const Like = sequelize.define('Like', {
    likeID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    }
},
    {
        timestamps: true,
    });

export default Like;
