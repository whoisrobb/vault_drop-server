import express, { Request, Response, NextFunction } from 'express';
import errorHandler from '../middleware/error-handler';
import upload from '../utils/upload';
import { addFilesToFolder } from '../service/file';

const router = express.Router();

router.post("/", upload.array("files"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const folderId = "e34d88d0-95b5-40ca-817c-119275e07965";
        const files = req.files as Express.Multer.File[];
        const newFiles = await addFilesToFolder(files, folderId);
        res.status(200).json(newFiles);

    } catch (error) {
        next(error)
    }
});

router.use(errorHandler);
export default router;