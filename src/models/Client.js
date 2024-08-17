import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcrypt';

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.ENUM('admin', 'user', 'client'),
    defaultValue: 'client'
  },
  status: { 
    type: DataTypes.ENUM('active', 'suspended', 'deactivated'),
    defaultValue: 'active'
  }
}, {
  hooks: {
    beforeCreate: async (client) => {
      if (client.password) {
        const salt = await bcrypt.genSalt(10);
        client.password = await bcrypt.hash(client.password, salt);
      }
    },
    beforeUpdate: async (client) => {
      if (client.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        client.password = await bcrypt.hash(client.password, salt);
      }
    }
  }
});

Client.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default Client;