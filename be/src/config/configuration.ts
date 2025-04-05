export default () => ({
  port: parseInt(process.env.PORT) || 5000,
  database: process.env.MONGO_URI,
  cloudinary: {
    name: process.env.CLD_CLOUD_NAME,
    apiKey: process.env.CLD_API_KEY,
    apiSecret: process.env.CLD_API_SECRET
  },
  minio_client: {
    endpoint: process.env.MINIO_ENDPOINT,
    port: process.env.MINIO_PORT,
    access_key: process.env.MINIO_ACCESS_KEY,
    secret_key: process.env.MINIO_SECRET_KEY,
    ssl: process.env.MINIO_USE_SSL,
    bucket_name: process.env.MINIO_BUCKET_NAME
  },
  log: {
    env: process.env.LOG,
    file_log_name_info: process.env.FILE_LOG_NAME_INFO,
    file_log_name_err: process.env.FILE_LOG_NAME_ERR, 
    max_size_file_log_info: process.env.MAX_SIZE_FILE_LOG_INFO
  },
})
