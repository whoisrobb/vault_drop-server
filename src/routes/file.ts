import express, { Request, Response, NextFunction } from 'express'
import errorHandler from "../middleware/error-handler";
import upload from "../utils/upload";
import { ValidationError } from "../utils/errors";
import { newPostWithFiles } from "../service/aws";

const router = express.Router();

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
})

router.use(errorHandler);
export default router;