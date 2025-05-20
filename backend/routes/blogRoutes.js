import express from 'express';
import { saveDraft, publish, getAll, getById ,checkDuplicate,deleteBlog} from '../controllers/blogController.js';

const router = express.Router();

router.post('/save-draft', saveDraft);
router.post('/publish', publish);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/check-duplicate', checkDuplicate);
router.delete('/:id', deleteBlog);



export default router;
