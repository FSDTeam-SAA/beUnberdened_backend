import { Subscribe, Brodcast } from "./broadcast.model.js";
import { createFilter, createPaginationInfo } from "../../lib/pagination.js";
import sendEmail from "../../lib/sendEmail.js";

/**
 * @desc    Create a new subscriber service
 */
export const createSubscriberService = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  // Check if email already exists
  const existingSubscriber = await Subscribe.findOne({ email });
  if (existingSubscriber) {
    throw new Error("Email already subscribed");
  }

  const subscriber = new Subscribe({ email });
  const savedSubscriber = await subscriber.save();
  return savedSubscriber;
};

/**
 * @desc    Get all subscribers with pagination and filters service
 */
export const getAllSubscribersService = async ({
  search,
  date,
  page = 1,
  limit = 4,
  sort = "-createdAt",
}) => {
  const query = createFilter(search, date, "email");
  const skip = (page - 1) * limit;

  const subscribers = await Subscribe.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Subscribe.countDocuments(query);
  const pagination = createPaginationInfo(parseInt(page), parseInt(limit), total);

  return { subscribers, pagination };
};

/**
 * @desc    Get single subscriber by ID service
 */
export const getSubscriberByIdService = async (id) => {
  const subscriber = await Subscribe.findById(id);
  if (!subscriber) {
    throw new Error("Subscriber not found");
  }
  return subscriber;
};

/**
 * @desc    Delete a subscriber service
 */
export const deleteSubscriberService = async (id) => {
  const subscriber = await Subscribe.findById(id);
  if (!subscriber) {
    throw new Error("Subscriber not found");
  }

  await Subscribe.findByIdAndDelete(id);
  return;
};

/**
 * @desc    Send broadcast email service
 */
export const sendBroadcastService = async ({ email, subject, html }) => {
  if (!email || !subject || !html) {
    throw new Error("Email, subject, and html content are required");
  }

  try {
    // Send email
    await sendEmail({
      to: email,
      subject: subject,
      html: html,
    });

    // Save broadcast record
    const broadcast = new Brodcast({
      email,
      subject,
      html,
    });

    const savedBroadcast = await broadcast.save();
    return savedBroadcast;
  } catch (emailError) {
    throw new Error(`Failed to send broadcast email: ${emailError.message}`);
  }
};

/**
 * @desc    Send broadcast to all subscribers service
 */
export const sendBroadcastToAllService = async ({ subject, html }) => {
  if (!subject || !html) {
    throw new Error("Subject and html content are required");
  }

  // Get all subscribers
  const subscribers = await Subscribe.find({});
  
  if (subscribers.length === 0) {
    throw new Error("No subscribers found");
  }

  const results = {
    total: subscribers.length,
    sent: 0,
    failed: 0,
    errors: [],
  };

  // Send email to each subscriber
  for (const subscriber of subscribers) {
    try {
      await sendEmail({
        to: subscriber.email,
        subject: subject,
        html: html,
      });

      // Save broadcast record
      await new Brodcast({
        email: subscriber.email,
        subject,
        html,
      }).save();

      results.sent++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        email: subscriber.email,
        error: error.message,
      });
    }
  }

  return results;
};

/**
 * @desc    Get all broadcasts with pagination service
 */
export const getAllBroadcastsService = async ({
  search,
  date,
  page = 1,
  limit = 10,
  sort = "-createdAt",
}) => {
  const query = createFilter(search, date, "subject");
  const skip = (page - 1) * limit;

  const broadcasts = await Brodcast.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Brodcast.countDocuments(query);
  const pagination = createPaginationInfo(parseInt(page), parseInt(limit), total);

  return { broadcasts, pagination };
};

/**
 * @desc    Get single broadcast by ID service
 */
export const getBroadcastByIdService = async (id) => {
  const broadcast = await Brodcast.findById(id);
  if (!broadcast) {
    throw new Error("Broadcast not found");
  }
  return broadcast;
};

/**
 * @desc    Delete a broadcast service
 */
export const deleteBroadcastService = async (id) => {
  const broadcast = await Brodcast.findById(id);
  if (!broadcast) {
    throw new Error("Broadcast not found");
  }

  await Brodcast.findByIdAndDelete(id);
  return;
};