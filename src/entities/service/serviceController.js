import Service from "./serviceModel.js";
import { getFileType, getResourceType } from "../../lib/fileTypeDetector.js";
import uploadToCloudinary from "../../lib/uploadToCloudinary.js";
import mongoose from "mongoose";
import cloudinary from "../../core/config/cloudinary.js";
import { createFilter, createPaginationInfo} from "../../lib/pagination.js";

/**
 * @desc    Create a new service
 * @route   POST /api/v1/services
 * @access  Private (e.g., Admin)
 */
export const createService = async (req, res) => {
  try {
    const { serviceName, sessionInfo, description } = req.body;

    // Validate required fields
    if (!serviceName || !sessionInfo) {
      return res.status(400).json({ error: 'Service name and session info are required' });
    }

    // Create service document without image first
    const service = new Service({
      serviceName,
      sessionInfo,
      description: description || "",
    });

    const savedService = await service.save();

    try {
      if(req.file){
        // Detect file type
        const fileType = getFileType(req.file.mimetype, req.file.originalname);
        const resourceType = getResourceType(fileType);

        // Upload to Cloudinary directly from buffer (NO LOCAL STORAGE)
        const result = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname,
          'service-images'
        );

        // Update service with Cloudinary data
        savedService.uploadPhoto = result.secure_url;
        savedService.publicId = result.public_id;
        savedService.cloudinaryId = result.public_id;
        savedService.fileType = fileType;
        savedService.mimeType = req.file.mimetype;
        savedService.fileSize = req.file.size;
        savedService.uploadedAt = new Date();

        await savedService.save();
      }

      return res.status(201).json({
        success: true,
        message: 'Service created successfully',
        service: savedService,
      });

    } catch (uploadError) {
      // If upload fails, delete the service document
      await Service.findByIdAndDelete(savedService._id);
      console.error('Upload error:', uploadError);
      return res.status(500).json({
        error: 'Failed to upload file to Cloudinary',
        details: uploadError.message,
      });
    }

  } catch (error) {
    console.error('Create service error:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get all services with pagination and filters
 * @route   GET /api/v1/services
 * @access  Public
 */
export const getAllServices = async (req, res) => {
  try {
    const { 
      search, 
      date, 
      page = 1, 
      limit = 10, 
      sort = "-createdAt" 
    } = req.query;

    // ✅ create dynamic filter
    const query = createFilter(req.query.search, req.query.date, "serviceName");

    // ✅ pagination
    const skip = (page - 1) * limit;

    const services = await Service.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(query);

    // ✅ create pagination info
    const pagination = createPaginationInfo(parseInt(page), parseInt(limit), total);

    return res.status(200).json({
      success: true,
      pagination,
      services,
    });
  } catch (error) {
    console.error("Get all services error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single service by ID
 * @route   GET /api/v1/services/:id
 * @access  Public
 */
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid service ID' });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Service retrieved successfully',
      service,
    });
  } catch (error) {
    console.error('Get service by ID error:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Update a service
 * @route   PUT /api/v1/services/:id
 * @access  Private (e.g., Admin)
 */
export const updateService = async (req, res) => {
  try {
    const { serviceName, sessionInfo, description } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid service ID' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Update text fields
    if (serviceName) service.serviceName = serviceName;
    if (sessionInfo) service.sessionInfo = sessionInfo;
    if (description) service.description = description;

    // Handle file upload if provided
    if (req.file) {
      try {
        // Delete old file from Cloudinary if it exists
        if (service.publicId) {
          try {
            const fileType = service.fileType || getFileType(service.mimeType, service.filename);
            const resourceType = getResourceType(fileType);

            await cloudinary.uploader.destroy(service.publicId, {
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
          'service-images'
        );

        // Update service with new Cloudinary data
        service.uploadPhoto = result.secure_url;
        service.publicId = result.public_id;
        service.cloudinaryId = result.public_id;
        service.fileType = fileType;
        service.mimeType = req.file.mimetype;
        service.fileSize = req.file.size;
        service.uploadedAt = new Date();

      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(500).json({
          error: 'Failed to upload file to Cloudinary',
          details: uploadError.message,
        });
      }
    }

    // Save updated service
    const updatedService = await service.save();

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service: updatedService,
    });

  } catch (error) {
    console.error('Update service error:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Delete a service
 * @route   DELETE /api/v1/services/:id
 * @access  Private (e.g., Admin)
 */
export const deleteService = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid service ID' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Delete image from Cloudinary if it exists
    if (service.publicId) {
      try {
        const fileType = service.fileType || 'image';
        const resourceType = getResourceType(fileType);

        await cloudinary.uploader.destroy(service.publicId, {
          resource_type: resourceType,
          invalidate: true,
        });
      } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
      }
    }

    // Delete service document
    await Service.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });

  } catch (error) {
    console.error('Delete service error:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};