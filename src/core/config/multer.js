// // ============================================
// // MULTER - multer.js (FIXED)
// // ============================================

// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // Create uploads directory if it doesn't exist
// const uploadsDir = 'uploads/';
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Set storage engine (temporary storage)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadsDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// // FIX 12: Improved file filter with better regex
// const fileFilter = (req, file, cb) => {
//   const imageTypes = /jpeg|jpg|png|gif|webp|bmp|svg/i;
//   const videoTypes = /mp4|avi|mov|mkv|flv|wmv|webm|m4v|3gp/i;
//   const audioTypes = /mp3|wav|aac|flac|ogg|m4a|wma|aiff|opus/i;
//   const documentTypes = /pdf|doc|docx|txt|xlsx|xls|ppt|pptx|csv|zip|rar/i;

//   const extname = path.extname(file.originalname).toLowerCase().substring(1);

//   if (
//     imageTypes.test(extname) ||
//     videoTypes.test(extname) ||
//     audioTypes.test(extname) ||
//     documentTypes.test(extname)
//   ) {
//     return cb(null, true);
//   } else {
//     cb(new Error('File type not supported. Please upload image, video, audio, or document files only.'));
//   }
// };

// const multerUpload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 500 * 1024 * 1024, // 500MB limit
//   },
//   fileFilter: fileFilter,
// });

// export { multerUpload };

// ============================================
// MULTER - multer.js (MEMORY STORAGE)
// ============================================

import multer from 'multer';
import path from 'path';

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// File filter with validation
const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|gif|webp|bmp|svg/i;
  const videoTypes = /mp4|avi|mov|mkv|flv|wmv|webm|m4v|3gp/i;
  const audioTypes = /mp3|wav|aac|flac|ogg|m4a|wma|aiff|opus/i;
  const documentTypes = /pdf|doc|docx|txt|xlsx|xls|ppt|pptx|csv|zip|rar/i;

  const extname = path.extname(file.originalname).toLowerCase().substring(1);

  if (
    imageTypes.test(extname) ||
    videoTypes.test(extname) ||
    audioTypes.test(extname) ||
    documentTypes.test(extname)
  ) {
    return cb(null, true);
  } else {
    cb(new Error('File type not supported. Please upload image, video, audio, or document files only.'));
  }
};

const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: fileFilter,
});

export { multerUpload };

