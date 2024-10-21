
import { addFileToDb } from "../dal/file";
import { NotFoundError, ValidationError } from "../utils/errors";
import { addFolderToDb, deleteFolderById, getAllFoldersInDb, getFolderById, getSingleFolderInDb } from "../dal/folder";
import { createFile, deleteFromBucket, signFileUrl } from "./file";


/* Create new folder in db */
// export const createFolder = async (title: string, folderId?: string) => {
//     const newFolder = await addFolderToDb(title);
//     return newFolder;
// };

/* Upload files to S3 bucket and save metadata to the db */
export const createFolderWithFiles = async (name: string, files: Express.Multer.File[]) => {
    try {
        const folder = await createNewFolder(name)

        const fileUploads = files.map(async (file) => {
            return createFile(file, folder.folderId)
        });

        const enrichedFolder = {
            ...folder,
            files: await Promise.all(fileUploads)
        }

        return enrichedFolder;
    } catch(error: any) {
        console.error("error: ", error);
        throw new Error(error.message);
    }
};

/* Delete a folder along with its associated files from S3 and database */
export const deleteFolder = async (folderId: string) => {
    const folder = await getFolderById(folderId);

    if (!folder) {
        throw new NotFoundError("Folder not found");
    }

    try {
        await Promise.all(folder.files.map((file) => deleteFromBucket(file.key)));
        const delFolder = await deleteFolderById(folderId);
        return delFolder;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete folder and associated files.");
    }
};

// export const createNewFolderWithFiles = async (name: string, files: Express.Multer.File[], folderId?: string) => {
//     if (!name) {
//         throw new ValidationError("Folder name is required");
//     };

//     const newFolder = await createFolder(name, folderId);
//     await uploadToBucket(files, newFolder.folderId);
    
//     return newFolder;
// };

export const createNewFolder = async (name: string) => {
    if (!name) {
        throw new ValidationError("Folder name is required");
    }

    const newFolder = await addFolderToDb(name);
    return newFolder;
};

/* Get all folders along with signed URLs for their files */
export const getAllFolders = async () => {
    const folders = await getAllFoldersInDb();
    
    const enrichedFolders = await Promise.all(
        folders.map(async folder => ({
            ...folder,
            files: await Promise.all(
                folder.files.map(async file => ({
                    ...file,
                    signedUrl: await signFileUrl(file.key)
                }))
            )
        }))
    );

    return enrichedFolders;
};

/* Get a folder along with signed URLs for its files */
export const getSingleFolder = async (folderId: string) => {
    const folder = await getSingleFolderInDb(folderId);

    if (!folder) {
        throw new NotFoundError("Folder not found");
    }
    
    const enrichedFolder = {
        ...folder,
        files: folder?.files.map(async file => ({
            ...file,
            signedUrl: await signFileUrl(file.key)
        }))
    };

    return enrichedFolder;
};