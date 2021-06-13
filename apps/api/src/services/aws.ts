export const defaultConfig = {
  region: process.env.AWS_BUCKET_REGION || "",
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  },
};
