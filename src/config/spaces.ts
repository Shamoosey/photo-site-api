// config/spaces.ts
import { S3Client } from "@aws-sdk/client-s3";

// Spaces is S3-compatible, so the AWS SDK works with a custom endpoint.
// SPACES_ENDPOINT example: https://tor1.digitaloceanspaces.com
// SPACES_REGION example:   tor1
const spaces = new S3Client({
  region: process.env.SPACES_REGION!,
  endpoint: process.env.SPACES_ENDPOINT!,
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
});

export const SPACES_BUCKET = process.env.SPACES_BUCKET!;
export const SPACES_UPLOAD_FOLDER = process.env.SPACES_UPLOAD_FOLDER ?? "uploads";
// CDN-enabled origin, e.g. https://my-bucket.tor1.cdn.digitaloceanspaces.com
// (or your custom domain pointed at the CDN)
export const SPACES_PUBLIC_URL = process.env.SPACES_PUBLIC_URL!;

export default spaces;
