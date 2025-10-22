import { generateResponse } from "../../lib/responseFormate.js";
import mongoose from "mongoose";
import {
  createPodcastService,
  getAllPodcastsService,
  getPodcastByIdService,
  updatePodcastService,
  deletePodcastService,
} from "./podcast.service.js";

/**
 * @desc    Create a new podcast
 * @route   POST /api/v1/podcasts
 * @access  Private (e.g., Admin)
 */
export const createPodcast = async (req, res, next) => {
  const { title, mediaName, linkName, description, linkUrl } = req.body;
  const podcastCreatorName = req.user.fullName;

  try {
    const podcast = await createPodcastService({
      title,
      mediaName,
      linkName,
      description,
      linkUrl,
      file: req.file,
      podcastCreatorName,
    });

    generateResponse(res, 201, true, "Podcast created successfully", podcast);
  } catch (error) {
    if (error.message.includes("are required")) {
      generateResponse(res, 400, false, error.message, null);
    } else {
      next(error);
    }
  }
};

/**
 * @desc    Get all podcasts with pagination and filters
 * @route   GET /api/v1/podcasts
 * @access  Public
 */
export const getAllPodcasts = async (req, res, next) => {
  try {
    const { search, date, page = 1, limit = 10, sort = "-createdAt", mediaName } = req.query;

    const { podcasts, pagination } = await getAllPodcastsService({
      search,
      date,
      page,
      limit,
      sort,
      mediaName
    });

    generateResponse(res, 200, true, "Podcasts retrieved successfully", {
      podcasts,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single podcast by ID
 * @route   GET /api/v1/podcasts/:id
 * @access  Public
 */
export const getPodcastById = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return generateResponse(res, 400, false, "Invalid podcast ID", null);
    }

    const podcast = await getPodcastByIdService(id);

    generateResponse(res, 200, true, "Podcast retrieved successfully", podcast);
  } catch (error) {
    if (error.message === "Podcast not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};

/**
 * @desc    Update a podcast
 * @route   PUT /api/v1/podcasts/:id
 * @access  Private (e.g., Admin)
 */
export const updatePodcast = async (req, res, next) => {
  const { id } = req.params;
  const { title, mediaName, linkName, description, linkUrl } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return generateResponse(res, 400, false, "Invalid podcast ID", null);
    }

    const updatedPodcast = await updatePodcastService(id, {
      title,
      mediaName,
      linkName,
      description,
      linkUrl,
      file: req.file,
    });

    generateResponse(res, 200, true, "Podcast updated successfully", updatedPodcast);
  } catch (error) {
    if (error.message === "Podcast not found") {
      return generateResponse(res, 404, false, error.message, null);
    } else if (error.message.includes("Cloudinary")) {
      return generateResponse(res, 500, false, error.message, null);
    } else {
      next(error);
    }
  }
};

/**
 * @desc    Delete a podcast
 * @route   DELETE /api/v1/podcasts/:id
 * @access  Private (e.g., Admin)
 */
export const deletePodcast = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return generateResponse(res, 400, false, "Invalid podcast ID", null);
    }

    await deletePodcastService(id);

    generateResponse(res, 200, true, "Podcast deleted successfully", null);
  } catch (error) {
    if (error.message === "Podcast not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};