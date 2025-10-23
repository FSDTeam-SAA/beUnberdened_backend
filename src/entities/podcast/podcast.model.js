import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema(
    {
     title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [200, "Title must be less than 200 characters"],
    },

    mediaName: {
      type: String,
      enum: ['Youtube Videos', 'Spotify Audios'],
      default: 'Youtube Videos',
    },

    description: {
      type: String,
      default: ""
    },

    uploadThumbnail: {
      type: String, // URL or file path of the uploaded image
      default: "",
    },
    linkName:{
        type:String,
        required:[true, "link name is required"]
    },
    linkUrl:{
        type:String,
        default: " "
    },
    podcastCreatorName:{
      type:String,
      default: " "
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

const Podcast = mongoose.models.Podcast || mongoose.model('Podcast', podcastSchema);

export default Podcast;