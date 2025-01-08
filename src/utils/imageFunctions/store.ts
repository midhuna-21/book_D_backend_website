import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import config from "../../config/config";

const s3Client = new S3Client({
    credentials: {
        accessKeyId: config.ACCESS_KEY || "",
        secretAccessKey: config.SECRET_ACCESS_KEY || "",
    },
    region: config.BUCKET_REGION || "",
});

const s3Storage = multerS3({
    s3: s3Client,
    bucket: config.BUCKET_NAME as string,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const fileName =
            Date.now() + "-" + file.fieldname + "-" + file.originalname;
        cb(null, fileName);
    },
});

function sanitizeFile(file: Express.Multer.File, cb: FileFilterCallback) {
    // const fileExts = [".png", ".jpg", ".jpeg", ".gif"];
    // const isAllowedExt = fileExts.includes(
    //     path.extname(file.originalname).toLowerCase()
    // );
    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if ( isAllowedMimeType) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
export const upload = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback: FileFilterCallback) => {
        sanitizeFile(file, callback);
    },
    limits: {
        fileSize: 1024 * 1024 * 100,
    },
});

export default upload;
export { s3Client };
