import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import crypto from "crypto";
import {addFileToDb} from "../dal/file";
import {addPostToDb, getAllPostsInDb} from "../dal/post";

dotenv.config();

const bucketName = process.env.BUCKET_NAME!
const bucketRegion = process.env.BUCKET_REGION!
const accessKey = process.env.ACCESS_KEY!
const secretAccessKey = process.env.SECRET_ACCESS_KEY!

const genFilename = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

const s3Client = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});

export const createPost = async (title: string) => {
    const newPost = await addPostToDb(title);
    return newPost;
};

export const uploadToBucket = async (files: Express.Multer.File[], postId: string) => {
    const fileArray = [];

    for (const file of files) {
       const command = new PutObjectCommand({
           Bucket: bucketName,
           Key: file.originalname,
           Body: file.buffer,
           ContentType: file.mimetype
       })

       await s3Client.send(command);

        const newFile = await addFileToDb({
            filename: genFilename(),
            mimetype: file.mimetype,
            postId: postId
        });

        fileArray.push(newFile);
    }

    return fileArray;
};

export const newPostWithFiles = async (title: string, files: Express.Multer.File[]) => {
    const newPost = await createPost(title);
    const newFiles = await uploadToBucket(files, newPost.postId);
    return newFiles;
};

export const getAllPosts = async () => {
    const posts = await getAllPostsInDb();
    
    const updatedPosts = await Promise.all(
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

    return updatedPosts;
};

const signFileUrl = async (filename: string) => {
    const getObjectParams = {
        Bucket: bucketName,
        Key: filename
    }
    
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
};