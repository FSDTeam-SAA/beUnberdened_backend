import Blog from "./blogModel.js";
import { getFileType, getResourceType } from "../../lib/fileTypeDetector.js";
import uploadToCloudinary from "../../lib/uploadToCloudinary.js";
import mongoose from "mongoose";
import cloudinary from "../../core/config/cloudinary.js";
import { createFilter, createPaginationInfo} from "../../lib/pagination.js";

/**
 * @desc    Create a new blog
 * @route   POST /api/v1/blogs
 * @access  Private (e.g., Admin)
 */
export const createBlog = async (req, res) => {
  try {
    const { title, readTime, description } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Check if file exists
    // if (!req.file) {
    //   return res.status(400).json({ error: 'No file uploaded' });
    // }

    // Create blog document without image first
    const blog = new Blog({
      title,
      readTime: readTime || 0,
      description,
    });

    const savedBlog = await blog.save();

    try {
     if(req.file){
      // Detect file type
      const fileType = getFileType(req.file.mimetype, req.file.originalname);
      const resourceType = getResourceType(fileType);

      // Upload to Cloudinary directly from buffer (NO LOCAL STORAGE)
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        'blog-images'
      );

      // Update blog with Cloudinary data
      savedBlog.uploadPhoto = result.secure_url;
      savedBlog.publicId = result.public_id;
      savedBlog.cloudinaryId = result.public_id;
      savedBlog.fileType = fileType;
      savedBlog.mimeType = req.file.mimetype;
      savedBlog.fileSize = req.file.size;
      savedBlog.filename = req.file.originalname;
      savedBlog.uploadedAt = new Date();

      await savedBlog.save();
    }

      return res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        blog: savedBlog,
      });

    } catch (uploadError) {
      // If upload fails, delete the blog document
      await Blog.findByIdAndDelete(savedBlog._id);
      console.error('Upload error:', uploadError);
      return res.status(500).json({
        error: 'Failed to upload file to Cloudinary',
        details: uploadError.message,
      });
  }

  } catch (error) {
    console.error('Create blog error:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get all blogs with pagination and filters
 * @route   GET /api/v1/blogs
 * @access  Public
 */
export const getAllBlogs = async (req, res) => {
  try {
    const { 
      search, 
      date, 
      status, 
      featured, 
      page = 1, 
      limit = 10, 
      sort = "-createdAt" 
    } = req.query;

    // ✅ create dynamic filter
    const query = createFilter(req.query.search, req.query.date, "title");

    // Add extra filters if needed
    // if (status) query.status = status;
    // if (featured) query.featured = featured === "true";

    // ✅ pagination
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    // ✅ create pagination info
    const pagination = createPaginationInfo(parseInt(page), parseInt(limit), total);

    return res.status(200).json({
      success: true,
      pagination,
      blogs,
    });
  } catch (error) {
    console.error("Get all blogs error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
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

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog retrieved successfully',
      blog,
    });
  } catch (error) {
    console.error('Get blog by ID error:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
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

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Update text fields
    if (title) blog.title = title;
    if (readTime) blog.readTime = readTime;
    if (description) blog.description = description;

    // Handle file upload if provided
    if (req.file) {
      try {
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
        const fileType = getFileType(req.file.mimetype, req.file.originalname);
        const resourceType = getResourceType(fileType);

        // Upload new file to Cloudinary directly from buffer (NO LOCAL STORAGE)
        const result = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname,
          'blog-images'
        );

        // Update blog with new Cloudinary data
        blog.uploadPhoto = result.secure_url;
        blog.publicId = result.public_id;
        blog.cloudinaryId = result.public_id;
        blog.fileType = fileType;
        blog.mimeType = req.file.mimetype;
        blog.fileSize = req.file.size;
        blog.filename = req.file.originalname;
        blog.uploadedAt = new Date();

      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(500).json({
          error: 'Failed to upload file to Cloudinary',
          details: uploadError.message,
        });
      }
    }

    // Save updated blog
    const updatedBlog = await blog.save();

    return res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog: updatedBlog,
    });

  } catch (error) {
    console.error('Update blog error:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Delete a blog
 * @route   DELETE /api/v1/blogs/:id
 * @access  Private (e.g., Admin)
 */
export const deleteBlog = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete image from Cloudinary if it exists
    if (blog.publicId) {
      try {
        const fileType = blog.fileType || 'image';
        const resourceType = getResourceType(fileType);

        await cloudinary.uploader.destroy(blog.publicId, {
          resource_type: resourceType,
          invalidate: true,
        });
      } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
      }
    }

    // Delete blog document
    await Blog.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });

  } catch (error) {
    console.error('Delete blog error:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};