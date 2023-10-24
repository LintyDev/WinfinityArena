import { Router } from 'express';
const router = Router();
import registerController from '../controllers/registerController.js';
import loginController from '../controllers/loginController.js';
import logoutController from '../controllers/logoutController.js';

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/logout', logoutController);

export default router;