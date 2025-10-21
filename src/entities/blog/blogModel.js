import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [200, "Title must be less than 200 characters"],
    },

    readTime: {
      type: String,
      required: [true, "Read time is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Blog description is required"],
      minlength: [10, "Description must be at least 10 characters long"],
    },

    uploadPhoto: {
      type: String, // URL or file path of the uploaded image
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["published", "draft", "pending"],
      default: "draft",
    },
     publicId: {
      type: String,
      default: null,
    },
    cloudinaryId: {
      type: String,
      default: null,
    },
    fileType: {
      type: String,
      enum: ['image', 'video', 'audio', 'document'],
      default: 'image',
    },
    mimeType: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    uploadedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    versionKey: false,
  }
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
// const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
