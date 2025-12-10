// ============================================
// FILE 2: lib/uploadToCloudinary.js
// ============================================

// import { Readable } from 'stream';
// import cloudinary from '../core/config/cloudinary.js'; // Adjust path based on your structure

// const uploadToCloudinary = (buffer, filename, folder) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: folder,
//         public_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         resource_type: 'auto',
//         overwrite: true,
//         quality: 'auto',
//         fetch_format: 'auto',
//       },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );

//     // Convert buffer to stream
//     Readable.from(buffer).pipe(stream);
//   });
// };

// export default uploadToCloudinary;



const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary'); // Adjust path based on your structure

const uploadToCloudinary = (buffer, filename, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        resource_type: 'auto',
        overwrite: true,
        quality: 'auto',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    console.log(stream);
    // Convert buffer to stream
    Readable.from(buffer).pipe(stream);
  });
};

module.exports = {
  uploadToCloudinary
};

