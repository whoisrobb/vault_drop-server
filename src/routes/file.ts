import express, { Request, Response, NextFunction } from 'express';
import errorHandler from "../middleware/error-handler";
import { addFilesToFolder, deleteFile, getAllFolderFiles, getSingleFile } from '../service/file';
import upload from '../utils/upload';

const router = express.Router();

/* GET SINGLE FILE */
router.get("/files/file/:key", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key } = req.params;
        const file = await getSingleFile(key);
        res.status(200).json(file);
    } catch (error) {
        next(error)
    }
});

/* UPLOAD FILES TO A FOLDER */
router.post("/files/:folderId", upload.array("files"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folderId } = req.params;
        const files = req.files as Express.Multer.File[];
        const newFiles = await addFilesToFolder(files, folderId);
        res.status(200).json(newFiles);
    } catch (error) {
        next(error)
    }
});

/* GET ALL FILES IN A FOLDER */
router.get("/files/:folderId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folderId } = req.params;
        const files = await getAllFolderFiles(folderId);
        res.status(200).json(files);
    } catch (error) {
        next(error)
    }
});

/* DELETE SINGLE FILE */
router.delete("/files/:fileId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fileId } = req.params;

        const file = await deleteFile(fileId);
        res.status(200).json(file);
    } catch (error) {
        next(error);
    }
});


router.use(errorHandler);
export default router;