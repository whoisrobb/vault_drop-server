import { FileTable } from "../db/schema";
import db from "../db";

export const addFileToDb = async ({ filename, mimetype, folderId, size }: { filename: string, mimetype: string, folderId: string, size: number }) => {
    const newFile = await db.insert(FileTable)
        .values({
            filename: filename,
            type: mimetype,
            folderId: folderId,
            size: size
        })
        .returning()

    return newFile[0];
};