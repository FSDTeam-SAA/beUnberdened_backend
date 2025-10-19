import Blog from "./blogModel.js";
import { getFileType, getResourceType } from "../../lib/fileTypeDetector.js";
import { createFilter, createPaginationInfo } from "../../lib/pagination.js";
import fs from 'fs/promises';
import mongoose from "mongoose";
import cloudinary from "../../core/config/cloudinary.js";


export const createBlog = async (req, res) => {
  try {
    const { title, readTime, description } = req.body;


    const blog = new Blog({
      title,
      readTime,
      description,
    });

    const savedBlog = await blog.save();
    console.log(savedBlog);

    if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
    
        // Delete old file from Cloudinary if it exists
        if (savedBlog.publicId) {
          try {
            const fileType = savedBlog.fileType || getFileType(savedBlog.mimeType, savedBlog.filename);
            const resourceType = getResourceType(fileType);
            
            await cloudinary.uploader.destroy(savedBlog.publicId, {
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

        console.log(fileType, resourceType);
    
        // Upload new file to Cloudinary
        let result;
        try {
          result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blog-images',
            resource_type: resourceType,
            public_id: `blog/${savedBlog._id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        savedBlog.uploadPhoto = result.secure_url;
        savedBlog.publicId = result.public_id;
        savedBlog.cloudinaryId = result.public_id;
        savedBlog.fileType = fileType;
        savedBlog.mimeType = req.file.mimetype;
        savedBlog.fileSize = req.file.size;
        savedBlog.uploadedAt = new Date();
        
        await savedBlog.save();
    
        return res.status(200).json({
          success: true,
          message: 'Profile updated successfully',
          blog: savedBlog
        });
    
      } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
      }
};

export const getAllBlogs = async (req, res) => {
  try {
    const { status, featured, page = 1, limit = 10, sort = "-createdAt" } = req.query;


    const query = {};
    if (status) query.status = status;
    if (featured) query.featured = featured === "true";

    const blogs = await Blog.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      blogs,
    });
  } catch (error) {
    console.error("Get all blogs error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get single blog by ID
 * @route   GET /api/v1/blogs/:id
 * @access  Public
 */
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    return res.status(200).json({ 
        success: true, 
        message:"Get single blog",
        blog: blog 
    });
  } catch (error) {
    console.error("Get blog by ID error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Update a blog
 * @route   PUT /api/v1/blogs/:id
 * @access  Private (e.g., Admin)
 */
export const updateBlog = async (req, res) => {
  try {
    const { title, readTime, description } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    

     if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
    
        // Delete old file from Cloudinary if it exists
        if (blog.publicId) {
          try {
            const fileType = blog.fileType || getFileType(blog.mimeType, blog.filename);
            const resourceType = getResourceType(fileType);
            
            await cloudinary.uploader.destroy(blog.publicId, {
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

        console.log(fileType, resourceType);
    
        // Upload new file to Cloudinary
        let result;
        try {
          result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blog-images',
            resource_type: resourceType,
            public_id: `blog/${blog._id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        blog.uploadPhoto = result.secure_url;
        blog.publicId = result.public_id;
        blog.cloudinaryId = result.public_id;
        blog.fileType = fileType;
        blog.mimeType = req.file.mimetype;
        blog.fileSize = req.file.size;
        blog.uploadedAt = new Date();

        blog.title = title || blog.title;
        blog.readTime = readTime || blog.readTime;
        blog.description = description || blog.description;
        
        const updateBlog =  await blog.save();
    
        return res.status(200).json({
          success: true,
          message: 'Profile updated successfully',
          blog: updateBlog
        });
  } catch (error) {
    console.error("Update blog error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Delete a blog
 * @route   DELETE /api/v1/blogs/:id
 * @access  Private (e.g., Admin)
 */
export const deleteBlog = async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Delete photo from disk
    if (blog.uploadPhoto) {
      const imagePath = path.join("uploads/images", path.basename(blog.uploadPhoto));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await blog.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
