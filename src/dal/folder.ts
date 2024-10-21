import { eq } from "drizzle-orm";
import db from "../db";
import { folder } from "../db/schema";

export const addFolderToDb = async (name: string) => {
    const newFolder = await db.insert(folder)
        .values({
            name: name,
        })
        .returning()

    return newFolder[0];
};

export const getFolderById = async (folderId: string) => {
    const singleFolder = await db.query
        .folder
        .findFirst({
            where: eq(folder.folderId, folderId),
            with: {
                files: true
            }
        });

    return singleFolder;
};

export const getAllFoldersInDb = async () => {
    const allFolders = await db.query
        .folder
        .findMany({
            with: {
                files: true
            }
        })

    return allFolders;
};

export const getSingleFolderInDb = async (folderId: string) => {
    const singleFolder = await db.query
        .folder
        .findFirst({
            with: {
                files: true
            },
            where: eq(folder.folderId, folderId)
        });

    return singleFolder;
};

export const deleteFolderById = async (folderId: string) => {
    const delFolder = await db.delete(folder)
        .where(
            eq(folder.folderId, folderId)
        )
        .returning()

    return delFolder[0];
};