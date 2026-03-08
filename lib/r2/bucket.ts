import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client, BUCKET_NAME } from "./client";

const client = getR2Client();

/** Upload a file/buffer to R2 */
export async function putObject(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType?: string,
  metadata?: Record<string, string>,
) {
  const params: PutObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: metadata,
  };

  return client.send(new PutObjectCommand(params));
}

/** Get an object from R2 */
export async function getObject(key: string) {
  return client.send(
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
  );
}

/** Check if an object exists and return its metadata */
export async function headObject(key: string) {
  try {
    return await client.send(
      new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }),
    );
  } catch {
    return null;
  }
}

/** Delete an object from R2 */
export async function deleteObject(key: string) {
  return client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
  );
}

/** List objects under a prefix */
export async function listObjects(prefix: string, maxKeys = 1000) {
  return client.send(
    new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: maxKeys,
    }),
  );
}

/** Generate a presigned download URL (default 1 hour) */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 3600,
) {
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
    { expiresIn },
  );
}

/** Generate a presigned upload URL (default 15 min) */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 900,
) {
  return getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn },
  );
}
