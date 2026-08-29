import { Router } from 'express';
import { register, login, getMe, changePassword } from '../controllers/authController.js';
import protect from '../middleware/auth.js';

const router = Router();

// Public
router.post('/register', register);
router.post('/login', login);

// Protected (need JWT)
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

export default router;
