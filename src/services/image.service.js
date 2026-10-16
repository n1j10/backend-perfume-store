const crypto = require("node:crypto");
const path = require("node:path");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const config = require("../config");
const ApiError = require("../utils/ApiError");

// Port of utils/neon-storage.ts: images are stored in Neon Storage (S3 compatible).
const { endpoint, region, accessKeyId, secretAccessKey, bucket } = config.storage;
const bucketUrl = `${endpoint}/${bucket}/`;

let client;

const getClient = () => {
  if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
    throw new ApiError(500, "لم يتم إعداد تخزين الصور");
  }

  if (!client) {
    client = new S3Client({
      endpoint,
      region,
      forcePathStyle: true,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  return client;
};

const uploadImage = async (file) => {
  const key = `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`;

  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return `${bucketUrl}${encodeURIComponent(key)}`;
};

const deleteImage = async (imageUrl) => {
  // Images outside our bucket (e.g. seeded Open Library covers) are left alone.
  if (!imageUrl?.startsWith(bucketUrl)) return;

  const key = decodeURIComponent(imageUrl.slice(bucketUrl.length));
  await getClient().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
};

module.exports = { uploadImage, deleteImage };
