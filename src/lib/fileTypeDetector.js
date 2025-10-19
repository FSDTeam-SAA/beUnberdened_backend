// ============================================
// FILE TYPE DETECTOR - fileTypeDetector.js (FIXED)
// ============================================

const getFileType = (mimeType, filename) => {
  if (!mimeType) return 'document';
  
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  } else if (mimeType.startsWith('audio/')) {
    return 'audio';
  } else {
    return 'document';
  }
};

const getResourceType = (fileType) => {
  switch (fileType) {
    case 'image':
      return 'image';
    case 'video':
      return 'video';
    case 'audio':
      return 'video'; // Cloudinary uses 'video' for audio
    case 'document':
      return 'raw';
    default:
      return 'auto';
  }
};

export { getFileType, getResourceType };