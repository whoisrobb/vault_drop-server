import db from "../db";
import { PostTable } from "../db/schema";

export const addPostToDb = async (title: string) => {
    const newPost = await db.insert(PostTable)
        .values({
            title
        })
        .returning()

    return newPost[0];
};

export const getAllPostsInDb = async () => {
    const allPosts = await db.query
        .PostTable
        .findMany({
            with: {
                files: true
            }
        })

    return allPosts;
};