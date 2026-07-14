import { Router } from 'express';
import { loginController, logoutController, registerController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
router.post('/logout', logoutController);

export default router;
