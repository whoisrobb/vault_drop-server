import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import crypto from "crypto";
import { addFileToDb, deleteFileById, getFileById, getFileByKey, getFilesByFolderId } from "../dal/file";
import { NotFoundError, ValidationError } from "../utils/errors";
import { getFolderById } from "../dal/folder";

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
export const genFilename = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

/* Sign an s3 file url */
export const signFileUrl = async (filename: string) => {
    const params = {
        Bucket: bucketName,
        Key: filename
    }
    
    const command = new GetObjectCommand(params);
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

/* Delete a file from s3 bucket */
export const deleteFromBucket = async (key: string) => {
    const deleteObjParams = {
        Bucket: bucketName,
        Key: key
    };

    const command = new DeleteObjectCommand(deleteObjParams);
    await s3Client.send(command);
};

export const uploadToBucket = async (file: Express.Multer.File, key: string) => {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    });

    await s3Client.send(command);
};

export const createFile = async (file: Express.Multer.File, folderId: string) => {
    const filekey = genFilename();
    await uploadToBucket(file, filekey);

    return await addFileToDb({
        key: filekey,
        filename: file.originalname,
        mimetype: file.mimetype,
        folderId: folderId,
        size: file.size
    });
};

export const getSingleFile = async (key: string) => {
    const file = await getFileByKey(key);

    if (!file) {
        throw new NotFoundError("File not found");
    }

    const signedUrl = await signFileUrl(file.key);

    return {
        ...file,
        signedUrl
    }
};

export const addFilesToFolder = async (files: Express.Multer.File[], folderId: string) => {
    const folder = await getFolderById(folderId);

    if (!folder) {
        throw new NotFoundError("Folder does not exist");
    }

    if (!files || files.length < 1) {
        throw new ValidationError("Must include files to be added")
    }

    const newFiles = files.map(async (file) => {
        return createFile(file, folderId);
    });

    return await Promise.all(newFiles);
}

export const getAllFolderFiles = async (folderId: string) => {
    const folder = await getFolderById(folderId);
    if (!folder) {
        throw new NotFoundError("Folder not found");
    }

    const files = await getFilesByFolderId(folderId);

    const secureFiles = files.map(async (file) => ({
        ...file,
        signedUrl: await signFileUrl(file.key)
    }));

    return Promise.all(secureFiles);
};

export const deleteFile = async (fileId: string) => {
    try {
        const file = await getFileById(fileId);

        if(!file) {
            throw new NotFoundError("File not found");
        }

        await deleteFromBucket(file.key);
        const delFile = await deleteFileById(fileId);
        return delFile;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete folder and associated files.");
    }
};