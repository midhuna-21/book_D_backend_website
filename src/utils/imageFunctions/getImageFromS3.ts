import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./store";

export const getSignedImageUrl = async (imageUrl: string): Promise<string> => {
    try {
        const signedUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: "bookstore-web-app",
                Key: imageUrl,
            }),
            { expiresIn: 604800 }
        );

        return signedUrl;
    } catch (error) {
        console.error("Error generating signed URL:", error);
        throw new Error("Could not generate signed URL");
    }
};
