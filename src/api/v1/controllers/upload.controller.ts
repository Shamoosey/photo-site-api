import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getAuth } from "@clerk/express";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { Body, Controller, Post, Req, Res } from "routing-controllers";
import spaces, { SPACES_BUCKET, SPACES_PUBLIC_URL, SPACES_UPLOAD_FOLDER } from "../../../config/spaces";
import { successResponse } from "../models/responseModel";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const URL_TTL_SECONDS = 300;

@Controller("/uploads")
export class UploadController {
  @Post("/sign")
  async signUpload(@Req() req: Request, @Res() res: Response, @Body() body: { contentType?: string; size?: number }) {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ext = body?.contentType ? ALLOWED_TYPES[body.contentType] : undefined;
    if (!ext) {
      return res.status(400).json({ message: "Unsupported image type" });
    }
    if (!body.size || body.size > MAX_BYTES) {
      return res.status(400).json({ message: "File too large" });
    }

    const key = `${SPACES_UPLOAD_FOLDER}/${randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: SPACES_BUCKET,
      Key: key,
      ContentType: body.contentType,
      ContentLength: body.size,
      ACL: "public-read", // needed so the CDN can serve it publicly
      CacheControl: "public, max-age=31536000, immutable",
    });

    const uploadUrl = await getSignedUrl(spaces, command, {
      expiresIn: URL_TTL_SECONDS,
    });

    return res.status(200).json(
      successResponse(
        {
          uploadUrl,
          key,
          url: `${SPACES_PUBLIC_URL}/${key}`,
          headers: {
            "Content-Type": body.contentType,
            "x-amz-acl": "public-read",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        },
        "Upload URL created",
      ),
    );
  }
}
