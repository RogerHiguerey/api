import express from 'express';
import { createShipment, getShipments, getShipment, updateShipment, deleteShipment } from '../controllers/shipmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router(); 

router.post  ('/',    authenticate, authorize('admin'), createShipment);
router.get   ('/',    authenticate, authorize('admin'), getShipments);
router.get   ('/:id', authenticate, authorize('admin'), getShipment);
router.put   ('/:id', authenticate, authorize('admin'), updateShipment);
router.delete('/:id', authenticate, authorize('admin'), deleteShipment);

export default router;