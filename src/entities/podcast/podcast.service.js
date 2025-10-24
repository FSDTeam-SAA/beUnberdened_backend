import Podcast from "./podcast.model.js";
import { getFileType, getResourceType } from "../../lib/fileTypeDetector.js";
import uploadToCloudinary from "../../lib/uploadToCloudinary.js";
import cloudinary from "../../core/config/cloudinary.js";
import { createFilter, createPaginationInfo } from "../../lib/pagination.js";

/**
 * @desc    Create a new podcast service
 */
export const createPodcastService = async ({
  title,
  mediaName,
  linkName,
  description,
  linkUrl,
  file,
  podcastCreatorName,
}) => {
  const podcast = new Podcast({
    title,
    mediaName,
    linkName,
    description: description || "",
    linkUrl: linkUrl || "",
    podcastCreatorName,
  });

  const savedPodcast = await podcast.save();

  if (file) {
    try {
      const fileType = getFileType(file.mimetype, file.originalname);
      const resourceType = getResourceType(fileType);

      const result = await uploadToCloudinary(
        file.buffer,
        file.originalname,
        "podcast-thumbnails"
      );

      savedPodcast.uploadThumbnail = result.secure_url;
      savedPodcast.publicId = result.public_id;
      savedPodcast.cloudinaryId = result.public_id;
      savedPodcast.fileType = fileType;
      savedPodcast.mimeType = file.mimetype;
      savedPodcast.fileSize = file.size;
      savedPodcast.uploadedAt = new Date();

      await savedPodcast.save();
    } catch (uploadError) {
      await Podcast.findByIdAndDelete(savedPodcast._id);
      throw new Error(`Failed to upload file to Cloudinary: ${uploadError.message}`);
    }
  }

  return savedPodcast;
};

/**
 * @desc    Get all podcasts with pagination and filters service
 */
export const getAllPodcastsService = async ({ search, date, page = 1, limit = 4, sort = "-createdAt", mediaName}) => {

    const query = {};

  // Check if search term is a date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const isDateSearch = dateRegex.test(search);

  // Search across multiple columns
  if (search && !isDateSearch) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { mediaName: { $regex: search, $options: 'i' } },
      { linkName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { linkUrl: { $regex: search, $options: 'i' } },
      { podcastCreatorName: { $regex: search, $options: 'i' } }
    ];
  }

  // If search term is a date, search by date
  if (search && isDateSearch) {
    const startDate = new Date(search);
    const endDate = new Date(search);
    endDate.setDate(endDate.getDate() + 1);
    
    query.createdAt = {
      $gte: startDate,
      $lt: endDate
    };
  }

  // Filter by specific mediaName
  if (mediaName) {
    query.mediaName = { $regex: mediaName, $options: 'i' };
  }

  // Separate date parameter (if you still want to support it)
  if (date && !isDateSearch) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    
    query.createdAt = {
      $gte: startDate,
      $lt: endDate
    };
  }
  // const query = createFilter(search, date, "title");
  // if (mediaName) query.mediaName = { $regex: mediaName, $options: "i" }

  const skip = (page - 1) * limit;

  const podcasts = await Podcast.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Podcast.countDocuments(query);
  const pagination = createPaginationInfo(parseInt(page), parseInt(limit), total);

  return { podcasts, pagination };
};

/**
 * @desc    Get single podcast by ID service
 */
export const getPodcastByIdService = async (id) => {
  const podcast = await Podcast.findById(id);
  if (!podcast) {
    throw new Error("Podcast not found");
  }
  return podcast;
};

/**
 * @desc    Update a podcast service
 */
export const updatePodcastService = async (id, { title, mediaName, linkName, description, linkUrl, file }) => {
  const podcast = await Podcast.findById(id);
  if (!podcast) {
    throw new Error("Podcast not found");
  }

  if (title) podcast.title = title;
  if (mediaName) podcast.mediaName = mediaName;
  if (linkName) podcast.linkName = linkName;
  if (description) podcast.description = description;
  if (linkUrl) podcast.linkUrl = linkUrl;

  if (file) {
    try {
      if (podcast.publicId) {
        try {
          const fileType = podcast.fileType || getFileType(podcast.mimeType, podcast.filename);
          const resourceType = getResourceType(fileType);

          await cloudinary.uploader.destroy(podcast.publicId, {
            resource_type: resourceType,
            invalidate: true,
          });
        } catch (error) {
          console.error("Error deleting old file from Cloudinary:", error);
        }
      }

      const fileType = getFileType(file.mimetype, file.originalname);
      const resourceType = getResourceType(fileType);

      const result = await uploadToCloudinary(
        file.buffer,
        file.originalname,
        "podcast-thumbnails"
      );

      podcast.uploadThumbnail = result.secure_url;
      podcast.publicId = result.public_id;
      podcast.cloudinaryId = result.public_id;
      podcast.fileType = fileType;
      podcast.mimeType = file.mimetype;
      podcast.fileSize = file.size;
      podcast.uploadedAt = new Date();
    } catch (uploadError) {
      throw new Error(`Failed to upload file to Cloudinary: ${uploadError.message}`);
    }
  }

  const updatedPodcast = await podcast.save();
  return updatedPodcast;
};

/**
 * @desc    Delete a podcast service
 */
export const deletePodcastService = async (id) => {
  const podcast = await Podcast.findById(id);
  if (!podcast) {
    throw new Error("Podcast not found");
  }

  if (podcast.publicId) {
    try {
      const fileType = podcast.fileType || "image";
      const resourceType = getResourceType(fileType);

      await cloudinary.uploader.destroy(podcast.publicId, {
        resource_type: resourceType,
        invalidate: true,
      });
    } catch (error) {
      console.error("Error deleting file from Cloudinary:", error);
    }
  }

  await Podcast.findByIdAndDelete(id);
  return;
};