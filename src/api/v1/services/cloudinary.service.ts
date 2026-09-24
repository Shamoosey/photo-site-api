import cloudinary from "../../../config/cloudinary";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

export class CloudinaryService {
  static async uploadImage(
    imageBase64: string,
    folder: string = "photo-site",
    publicId?: string,
  ): Promise<CloudinaryUploadResult> {
    try {
      // Client sends raw base64 (no "data:" prefix). Cloudinary treats a bare
      // string as a file path, so wrap it in a data URI.
      const dataUri = imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: "auto",
        transformation: [{ quality: "auto" }],
        ...(publicId && { public_id: publicId, overwrite: true }),
      });

      return result;
    } catch (error) {
      console.error("Cloudinary error details:", error);
      throw new Error(`Cloudinary upload failed: ${formatCloudinaryError(error)}`);
    }
    function formatCloudinaryError(error: unknown): string {
      if (error instanceof Error) return error.message;
      if (typeof error === "object" && error !== null) {
        const e =
          (error as { error?: { message?: string; code?: string } }).error ??
          (error as { message?: string; code?: string });
        return e.message ?? e.code ?? "Unknown Cloudinary error";
      }
      return String(error);
    }
  }

  static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary delete failed:", error);
    }
  }
}
