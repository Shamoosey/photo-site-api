import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { Controller, Post, Req, Res } from "routing-controllers";
import { successResponse } from "../models/responseModel";

@Controller("/uploads")
export class UploadController {
  @Post("/sign")
  async signUpload(@Req() req: Request, @Res() res: Response) {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: process.env.CLOUDINARY_UPLOAD_FOLDER },
      process.env.CLOUDINARY_API_SECRET!,
    );

    return res.status(200).json(
      successResponse(
        {
          signature,
          timestamp,
          folder: process.env.CLOUDINARY_UPLOAD_FOLDER,
          apiKey: process.env.CLOUDINARY_API_KEY,
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        },
        "Upload signature created",
      ),
    );
  }
}
