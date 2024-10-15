import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import crypto from "crypto";
import { addFileToDb } from "../dal/file";
import { addPostToDb, deletePostById, getAllPostsInDb, getPostById } from "../dal/post";
import { NotFoundError } from "../utils/errors";

dotenv.config();

const bucketName = process.env.BUCKET_NAME!
const bucketRegion = process.env.BUCKET_REGION!
const accessKey = process.env.ACCESS_KEY!
const secretAccessKey = process.env.SECRET_ACCESS_KEY!

const s3Client = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});

/* Generate unique filename */
const genFilename = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

/* Sign an s3 file url */
const signFileUrl = async (filename: string) => {
    const getObjectParams = {
        Bucket: bucketName,
        Key: filename
    }
    
    const command = new GetObjectCommand(getObjectParams);
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

/* Delete a file from s3 bucket */
const deleteFromBucket = async (filename: string) => {
    const deleteObjParams = {
        Bucket: bucketName,
        Key: filename
    };

    const command = new DeleteObjectCommand(deleteObjParams);
    await s3Client.send(command);
};

/* Create new post in db */
export const createPost = async (title: string) => {
    const newPost = await addPostToDb(title);
    return newPost;
};

/* Upload files to S3 bucket and save metadata to the db */
export const uploadToBucket = async (files: Express.Multer.File[], folderId: string) => {
    const fileUploads = files.map(async (file) => {
        const filename = genFilename();
        
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: filename,
            Body: file.buffer,
            ContentType: file.mimetype
        });
 
        await s3Client.send(command);

        return await addFileToDb({
            filename: filename,
            mimetype: file.mimetype,
            folderId: folderId,
            size: file.size
        });
    });

    return await Promise.all(fileUploads);
};

/* Delete a post along with its associated files from S3 and database */
export const deletePost = async (folderId: string) => {
    const post = await getPostById(folderId);

    if (!post) {
        throw new NotFoundError("Post not found");
    }

    try {
        await Promise.all(post.files.map((file) => deleteFromBucket(file.filename)));
        const delPost = await deletePostById(folderId);
        return delPost;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete post and associated files.");
    }
};

export const newPostWithFiles = async (title: string, files: Express.Multer.File[]) => {
    const newPost = await createPost(title);
    const newFiles = await uploadToBucket(files, newPost.folderId);
    return newFiles;
};

/* Get all posts along with signed URLs for their files */
export const getAllPosts = async () => {
    const posts = await getAllPostsInDb();
    
    const enrichedPosts = await Promise.all(
        posts.map(async post => ({
            ...post,
            files: await Promise.all(
                post.files.map(async file => ({
                    ...file,
                    signedUrl: await signFileUrl(file.filename)
                }))
            )
        }))
    );

    return enrichedPosts;
};