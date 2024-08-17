// clientRoutes.js
import express from 'express';
import { registerClient, loginClient, getClients, getClient, updateClient, deleteClient, getClientShipments } from '../controllers/clientController.js';
import { authenticate, authenticateClient, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post  ('/login', loginClient); // OK Login
router.post  ('/register',  authenticate,       authorize('admin'),   registerClient);      // OK Registro de clientes
router.get   ('/shipments', authenticateClient, authorize('client'),  getClientShipments);  // OK Detalles de los envios de un cliente
router.get   ('/',          authenticate,       authorize('admin'),   getClients);          // OK Consulta todos los clientes
router.get   ('/:id',       authenticate,       authorize('admin'),   getClient);           // OK Consulta Cliente por ID
router.put   ('/:id',       authenticate,       authorize('admin'),   updateClient);        // OK Actualiza Cliente por ID
router.delete('/:id',       authenticate,       authorize('admin'),   deleteClient);        // OK Elimina Cliente por ID

export default router;