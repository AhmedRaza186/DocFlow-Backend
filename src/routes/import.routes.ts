import { Router } from 'express';
import { importController } from '../controllers/import.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { importFileMiddleware } from '../services/import.service';

const router = Router();

router.use(authMiddleware);
router.post('/',(req,res,next)=>{
     console.log(req.headers["content-type"]);
  next();
}, importFileMiddleware, importController
);

export default router;
