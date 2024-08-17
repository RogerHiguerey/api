import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: 'postgres',
  logging: false, // Cambia a `console.log` para ver las consultas SQL en la consola
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Esto puede cambiar según el entorno de producción o desarrollo
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export { sequelize };
