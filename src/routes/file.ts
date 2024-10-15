import express, { Request, Response, NextFunction } from 'express'
import errorHandler from "../middleware/error-handler";
import upload from "../utils/upload";
import { ValidationError } from "../utils/errors";
import { deletePost, getAllPosts, newPostWithFiles } from "../service/aws";

const router = express.Router();

/* GET POST */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allPosts = await getAllPosts();
        res.status(200).json(allPosts);
    } catch (error) {
        next(error);
    }
});

/* CREATE A NEW POST */
router.post("/", upload.array("files"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files) {
            throw new ValidationError("No files uploaded");
        }

        const posts = await newPostWithFiles("Placeholder", files);
        res.status(201).json(posts);

    } catch (error) {
        next(error);
    }
});

/* DELETE POST */
router.delete("/:folderId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folderId } = req.params;

        const post = await deletePost(folderId);
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
});

router.use(errorHandler);
export default router;