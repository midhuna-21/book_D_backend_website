"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedImageUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const store_1 = require("./store");
const getSignedImageUrl = async (imageUrl) => {
    try {
        const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(store_1.s3Client, new client_s3_1.GetObjectCommand({
            Bucket: "bookstore-web-app",
            Key: imageUrl,
        }), { expiresIn: 604800 });
        return signedUrl;
    }
    catch (error) {
        console.error("Error generating signed URL:", error);
        throw new Error("Could not generate signed URL");
    }
};
exports.getSignedImageUrl = getSignedImageUrl;
//# sourceMappingURL=getImageFromS3.js.map