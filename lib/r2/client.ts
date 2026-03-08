import { S3Client } from "@aws-sdk/client-s3";

function requiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getR2Client() {
  const accountId = requiredEnv("R2_ACCOUNT_ID");

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

export const BUCKET_NAME = process.env.R2_BUCKET_NAME ?? "amaros";
export const PUBLIC_URL = process.env.R2_PUBLIC_URL ?? "";
