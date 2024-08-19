// import express from 'express';
// import dotenv from 'dotenv';
// import { sequelize } from './config/database.js';
// import userRoutes from './routes/userRoutes.js';
// import clientRoutes from './routes/clientRoutes.js';
// import shipmentRoutes from './routes/shipmentRoutes.js';
// import { errorHandler } from './middleware/errorHandler.js';

// dotenv.config();
// const app = express();
// app.use(express.json());

// // Rutas
// app.use('/api/users', userRoutes);
// app.use('/api/clients', clientRoutes);
// app.use('/api/shipments', shipmentRoutes);

// // Manejador de errores
// app.use(errorHandler);

// const PORT = process.env.PORT || 3000;

// async function startServer() {
//   try {
//     await sequelize.authenticate();
//     console.log('Conexión a la base de datos establecida correctamente.');
//     await sequelize.sync();
//     console.log('Modelos sincronizados con la base de datos.');
//     app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
//   } catch (error) {
//     console.error('No se pudo conectar a la base de datos:', error);
//   }
// }

// startServer();

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Importa el paquete cors
import { sequelize } from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();
const app = express();
app.use(express.json());

// Configuración de CORS
const corsOptions = {
  origin: '*', // Permite cualquier origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true, // Permitir cookies o autenticación
};

// app.use(cors(corsOptions));

// const corsOptions = {
//   origin: 'http://localhost:8081', // Origen permitido
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Métodos permitidos
//   credentials: true, // Permitir cookies o autenticación
// };
app.use(cors(corsOptions)); // Aplica CORS a todas las rutas

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/shipments', shipmentRoutes);

// Manejador de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    await sequelize.sync();
    console.log('Modelos sincronizados con la base de datos.');
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
}

startServer();
