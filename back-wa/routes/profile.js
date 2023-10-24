import { Router } from 'express';
const router = Router();

import changeUsernameController from '../controllers/changeUsernameController.js';
import changePwdController from '../controllers/changePwdController.js';
import changeAvatarController from '../controllers/changeAvatarController.js';

router.post('/username', changeUsernameController);
router.post('/changepass', changePwdController);
router.post('/avatar', changeAvatarController);

export default router;