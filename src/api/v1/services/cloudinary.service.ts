import cloudinary from "../../../config/cloudinary";

export class CloudinaryService {
  static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary delete failed:", error);
    }
  }
}
