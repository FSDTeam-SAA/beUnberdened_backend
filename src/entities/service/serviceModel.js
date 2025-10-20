import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
     serviceName: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [200, "Title must be less than 200 characters"],
    },

    sessionInfo: {
      type: String,
      required: [true, "Read time is required"],
      trim: true,
    },

    description: {
      type: String,
      default: ""
    },

    uploadPhoto: {
      type: String, // URL or file path of the uploaded image
      default: "",
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

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

export default Service;