import {DataTypes} from 'sequelize';
import {sequelize} from '../../database/postgres.js';

const Follows = sequelize.define("Follows", {
    id: {
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey: true,
    },
    followerID: {
        type:DataTypes.UUID,
        allowNull:false,
    },
    followingID:{
        type:DataTypes.UUID,
        allowNull:false,
    },

}, {
    indexes: [
        {
            unique:true,
            fields: ['followerID','followingID'],
        },
    ],
    });

export default Follows;