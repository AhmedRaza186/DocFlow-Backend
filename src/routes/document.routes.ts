import { Router } from 'express';
import { createDocumentController, deleteDocumentController, getDocumentController, getSharedUsersController, listDocumentsController, listSharedDocumentsController, shareDocumentController, updateDocumentController } from '../controllers/document.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createDocumentSchema, shareDocumentSchema, updateDocumentSchema } from '../validators/document.validator';

const router = Router();

router.use(authMiddleware);
router.post('/', validate(createDocumentSchema), createDocumentController);
router.get('/shared', listSharedDocumentsController);
router.get('/:id/shared-users', getSharedUsersController);
router.post('/:id/share', validate(shareDocumentSchema), shareDocumentController);
router.get('/', listDocumentsController);
router.get('/:id', getDocumentController);
router.patch('/:id', validate(updateDocumentSchema), updateDocumentController);
router.delete('/:id', deleteDocumentController);

export default router;
