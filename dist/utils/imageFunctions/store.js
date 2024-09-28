"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = __importDefault(require("../../config/config"));
const path_1 = __importDefault(require("path"));
const s3Client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: config_1.default.ACCESS_KEY || "",
        secretAccessKey: config_1.default.SECRET_ACCESS_KEY || "",
    },
    region: config_1.default.BUCKET_REGION || 'us-east-1' || ""
});
exports.s3Client = s3Client;
const s3Storage = (0, multer_s3_1.default)({
    s3: s3Client,
    bucket: config_1.default.BUCKET_NAME,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const fileName = Date.now() + "-" + file.fieldname + "-" + file.originalname;
        cb(null, fileName);
    },
});
function sanitizeFile(file, cb) {
    const fileExts = ['.png', '.jpg', '.jpeg', '.gif'];
    const isAllowedExt = fileExts.includes(path_1.default.extname(file.originalname).toLowerCase());
    const isAllowedMimeType = file.mimetype.startsWith('image/');
    if (isAllowedExt && isAllowedMimeType) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
exports.upload = (0, multer_1.default)({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback);
    },
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});
exports.default = exports.upload;
//# sourceMappingURL=store.js.map