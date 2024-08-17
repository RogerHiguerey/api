import express from 'express';
import { registerUser, loginUser, getUser } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post ('/login',    loginUser); // OK
router.post ('/register', authenticate, authorize('admin'), registerUser); // OK
router.get  ('/me',       authenticate, authorize('admin'), getUser); // OK
router.get  ('/',         authenticate, authorize('admin'), getUser); // OK

export default router;