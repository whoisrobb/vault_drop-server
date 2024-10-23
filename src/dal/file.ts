import { file } from "../db/schema";
import db from "../db";
import { eq } from "drizzle-orm";

export const addFileToDb = async ({ filename, mimetype, folderId, size, key }: { filename: string, mimetype: string, folderId: string, size: number, key: string }) => {
    const newFile = await db.insert(file)
        .values({
            filename: filename,
            type: mimetype,
            folderId: folderId,
            key: key,
            size: size
        })
        .returning()

    return newFile[0];
};

export const getFilesByFolderId = async (folderId: string) => {
    const folderFiles = await db.query
        .file
        .findMany({
            where: eq(file.folderId, folderId)
        });
    
    return folderFiles;
};

export const getFileById = async (fileId: string) => {
    const queryFile = await db.query
        .file
        .findFirst({
            where: eq(file.fileId, fileId)
        });

    return queryFile;
};

export const getFileByKey = async (key: string) => {
    const queryFile = await db.query
        .file
        .findFirst({
            where: eq(file.key, key)
        });

    return queryFile;
};

export const deleteFileById = async (fileId: string) => {
    const deletedFile = await db.delete(file)
        .where(
            eq(file.fileId, fileId)
        )
        .returning()

    return deletedFile;
};