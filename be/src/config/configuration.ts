export default () => ({
  port: parseInt(process.env.PORT) || 5000,
  database: process.env.MONGO_URI,
  cloudinary: {
    name: process.env.CLD_CLOUD_NAME,
    apiKey: process.env.CLD_API_KEY,
    apiSecret: process.env.CLD_API_SECRET
  }
})
