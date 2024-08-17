import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Client from './Client.js';

const Shipment = sequelize.define('Shipment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('maritime', 'air'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_transit', 'delivered'),
    defaultValue: 'pending'
  },
  statusHistory: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estimatedDeliveryDate: {
    type: DataTypes.DATE
  },
  note: {
    type: DataTypes.TEXT
  }
});

Shipment.belongsTo(Client);
Client.hasMany(Shipment);

export default Shipment;