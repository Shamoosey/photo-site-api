import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import spaces, { SPACES_BUCKET, SPACES_UPLOAD_FOLDER } from "../../../config/spaces";

export class SpacesService {
  static async deleteImage(key: string): Promise<void> {
    if (!key.startsWith(`${SPACES_UPLOAD_FOLDER}/`)) {
      console.error("Spaces delete refused, key outside upload folder:", key);
      return;
    }
    try {
      await spaces.send(new DeleteObjectCommand({ Bucket: SPACES_BUCKET, Key: key }));
    } catch (error) {
      console.error("Spaces delete failed:", error);
    }
  }
}
