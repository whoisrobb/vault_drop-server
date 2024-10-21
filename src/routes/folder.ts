import express, { Request, Response, NextFunction } from 'express';
import { deleteFolder, getAllFolders, createNewFolder, createFolderWithFiles, getSingleFolder } from '../service/folder';
import upload from '../utils/upload';
import errorHandler from '../middleware/error-handler';

const router = express.Router();

/* GET ALL FOLDERS */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allFolders = await getAllFolders();
        res.status(200).json(allFolders);
    } catch (error) {
        next(error);
    }
});

/* GET FOLDER */
router.get("/:folderId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folderId } = req.params;
        const folder = await getSingleFolder(folderId);
        res.status(200).json(folder);
    } catch (error) {
        next(error);
    }
});

/* CREATE A NEW FOLDER */
router.post("/", upload.array("files"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const files = req.files as Express.Multer.File[];

        let folders;

        if (files.length > 0) {
            folders = await createFolderWithFiles(name, files);
        } else {
            folders = await createNewFolder(name);
        }

        res.status(201).json(folders);
    } catch (error) {
        next(error);
    }
});

/* CREATE A NEW SUB-FOLDER 
router.post("/:folderId/subfolders", upload.array("files"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const { folderId } = req.params;

        const files = req.files as Express.Multer.File[];

        let folders;

        if (files) {
            folders = await createFolderWithFiles(name, files);
        } else {
            folders = await createNewFolder(name, folderId);
        }

        res.status(201).json(folders);

    } catch (error) {
        next(error);
    }
}); */

/* DELETE FOLDER */
router.delete("/:folderId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folderId } = req.params;

        const folder = await deleteFolder(folderId);
        res.status(200).json(folder);
    } catch (error) {
        next(error);
    }
});

router.use(errorHandler);
export default router;