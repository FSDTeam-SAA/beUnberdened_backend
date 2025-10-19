import User from "../auth/auth.model.js";
import Profile from "./profileModel.js";
import mongoose from "mongoose";
import cloudinary from "../../core/config/cloudinary.js";
import fs from 'fs/promises';
import { getFileType, getResourceType } from "../../lib/fileTypeDetector.js";




const updateProfile = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, bio, userName } = req.body;
    const userId = req.user.id;;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update User
    const updatedUserFields = {};
    if (fullName) updatedUserFields.fullName = fullName;
    if (email) updatedUserFields.email = email;
    if (userName) updatedUserFields.userName = userName;
    // if (profileImagePath) updatedUserFields.profileImage = profileImagePath;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedUserFields },
      { new: true, runValidators: true }
    );
    

    // Update Profile
    const profileFields = {};
    if (fullName) profileFields.fullName = fullName;
    if (email) profileFields.email = email;
    if (userName) profileFields.userName = userName;
    if (phoneNumber) profileFields.phoneNumber = phoneNumber;
    if (bio) profileFields.bio = bio;
    // if (profileImagePath) profileFields.profileImage = profileImagePath;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { $set: profileFields },
      { new: true, upsert: true }
    );
    console.log(updatedProfile);
     // Check if file exists before processing
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Delete old file from Cloudinary if it exists
    if (updatedProfile.publicId) {
      try {
        const fileType = updatedProfile.fileType || getFileType(updatedProfile.mimeType, updatedProfile.filename);
        const resourceType = getResourceType(fileType);
        
        await cloudinary.uploader.destroy(updatedProfile.publicId, {
          resource_type: resourceType,
          invalidate: true,
        });
      } catch (error) {
        console.error('Error deleting old file from Cloudinary:', error);
      }
    }

    // Detect new file type
    const fileType = getFileType(req.file.mimetype, req.file.filename);
    const resourceType = getResourceType(fileType);

    // Upload new file to Cloudinary
    let result;
    try {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile-images',
        resource_type: resourceType,
        public_id: `profile/${updatedProfile._id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        overwrite: true,
        quality: 'auto',
        fetch_format: 'auto',
      });
    } catch (uploadError) {
      await fs.unlink(req.file.path).catch(console.error);
      return res.status(500).json({ 
        error: 'Failed to upload file to Cloudinary', 
        details: uploadError.message 
      });
    }

    // Update profile with Cloudinary URL only (not local path)
    updatedProfile.profileImage = result.secure_url;
    updatedProfile.publicId = result.public_id;
    updatedProfile.cloudinaryId = result.public_id;
    updatedProfile.fileType = fileType;
    updatedProfile.mimeType = req.file.mimetype;
    updatedProfile.fileSize = req.file.size;
    updatedProfile.uploadedAt = new Date();
    
    await updatedProfile.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
      profile: updatedProfile
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProfile = async (req, res, next) => {
  const userId = req.user.id; // take user ID from auth middleware

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find and delete Profile
    const profile = await Profile.findOneAndDelete({ userId }, { session });
    if (!profile) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    // Delete User
    const user = await User.findByIdAndDelete(userId, { session });
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "User and profile deleted successfully",
      data: { userId, profileId: profile._id },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Delete profile error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check if file exists before processing
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Delete old file from Cloudinary if it exists
    if (profile.publicId) {
      try {
        const fileType = profile.fileType || getFileType(profile.mimeType, profile.filename);
        const resourceType = getResourceType(fileType);
        
        await cloudinary.uploader.destroy(profile.publicId, {
          resource_type: resourceType,
          invalidate: true,
        });
      } catch (error) {
        console.error('Error deleting old file from Cloudinary:', error);
      }
    }

    // Detect new file type
    const fileType = getFileType(req.file.mimetype, req.file.filename);
    const resourceType = getResourceType(fileType);

    // Upload new file to Cloudinary
    let result;
    try {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile-images',
        resource_type: resourceType,
        public_id: `profile/${profile._id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        overwrite: true,
        quality: 'auto',
        fetch_format: 'auto',
      });
    } catch (uploadError) {
      await fs.unlink(req.file.path).catch(console.error);
      return res.status(500).json({ 
        error: 'Failed to upload file to Cloudinary', 
        details: uploadError.message 
      });
    }

    // Update profile with Cloudinary URL only (not local path)
    profile.profileImage = result.secure_url;
    profile.publicId = result.public_id;
    profile.cloudinaryId = result.public_id;
    profile.fileType = fileType;
    profile.mimeType = req.file.mimetype;
    profile.fileSize = req.file.size;
    profile.uploadedAt = new Date();

    await profile.save();

    // Clean up local file
    try {
      await fs.unlink(req.file.path);
    } catch (error) {
      console.error('Error deleting local file:', error);
    }

    res.status(200).json({
      message: 'Profile image updated successfully',
      data: {
        _id: profile._id,
        userId: profile.userId,
        profileImage: profile.profileImage,
        fileType: profile.fileType,
        fileSize: profile.fileSize,
        uploadedAt: profile.uploadedAt,
        fullName: profile.fullName,
        email: profile.email,
        bio: profile.bio,
        phoneNumber: profile.phoneNumber,
      },
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    console.error('Error in updateProfileImage:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile image' });
  }
};

const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    
    const profile = await Profile.findOne({ userId});
    // console.log(profile);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Delete from Cloudinary if file exists
    if (profile.publicId) {
      try {
        const fileType = profile.fileType || 'image';
        const resourceType = getResourceType(fileType);
        console.log(fileType, resourceType);
        await cloudinary.uploader.destroy(profile.publicId, {
          resource_type: resourceType,
          invalidate: true,
        });
      } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
      }
    }

    // Reset profile image fields
    profile.profileImage = null;
    profile.publicId = null;
    profile.cloudinaryId = null;
    profile.fileType = 'image';
    profile.mimeType = null;
    profile.fileSize = null;
    profile.uploadedAt = null;

    await profile.save();

    res.status(200).json({
      message: 'Profile image deleted successfully',
      data: {
        _id: profile._id,
        userId: profile.userId,
        profileImage: profile.profileImage,
        fullName: profile.fullName,
        email: profile.email,
        bio: profile.bio,
      },
    });
  } catch (error) {
    console.error('Error in deleteProfileImage:', error);
    res.status(500).json({ error: error.message || 'Failed to delete profile image' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: {
        _id: profile._id,
        userId: profile.userId,
        profileImage: profile.profileImage,
        fullName: profile.fullName,
        email: profile.email,
        bio: profile.bio,
        phoneNumber: profile.phoneNumber,
        fileType: profile.fileType,
        uploadedAt: profile.uploadedAt,
      },
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve profile' });
  }
};


export { 
    updateProfile, 
    getProfile, 
    deleteProfile,
    updateProfileImage,
    deleteProfileImage
};