import { FileTable } from "../db/schema";
import db from "../db";

export const addFileToDb = async ({ filename, mimetype, postId }: { filename: string, mimetype: string, postId: string }) => {
    const newFile = await db.insert(FileTable)
        .values({
            filename: filename,
            type: mimetype,
            postId: postId
        })
        .returning()

    return newFile[0];
};