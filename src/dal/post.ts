import { eq } from "drizzle-orm";
import db from "../db";
import { FolderTable } from "../db/schema";

export const addPostToDb = async (name: string) => {
    const newPost = await db.insert(FolderTable)
        .values({
            name
        })
        .returning()

    return newPost[0];
};

export const getPostById = async (folderId: string) => {
    const post = await db.query
        .FolderTable
        .findFirst({
            where: eq(FolderTable.folderId, folderId),
            with: {
                files: true
            }
        });

    return post;
};

export const getAllPostsInDb = async () => {
    const allPosts = await db.query
        .FolderTable
        .findMany({
            with: {
                files: true
            }
        })

    return allPosts;
};

export const deletePostById = async (folderId: string) => {
    const post = await db.delete(FolderTable)
        .where(
            eq(FolderTable.folderId, folderId)
        )
        .returning()

    return post;
};