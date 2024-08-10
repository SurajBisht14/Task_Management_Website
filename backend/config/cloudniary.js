const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.API_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY
  });
  
  const uploadOnCloudinary = async (localFilePath) => {
    try {
      if (!localFilePath) {
        console.log("could not find the path")
        return null
      }
      let response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
      })
    
      return response
    }
    catch (error) {
    
      console.log("can't upload file", error)
      return null
  
    }
  }
  module.exports = { cloudinary, uploadOnCloudinary };