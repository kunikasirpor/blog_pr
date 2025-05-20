import express from 'express';
import { login, logout, checkAuth, initializeUsers } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/check', checkAuth);

initializeUsers();

export default router;
