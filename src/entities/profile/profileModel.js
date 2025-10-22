
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    fullName: {  
        type: String,
        min:3,
        max:50,
        default: "",
    },
    userName: {  
        type: String,
        min:3,
    },
    email: {  
        type: String,
        default: "",
        unique: true,
    },
    phoneNumber: {  
        type: String,
        default: "",
    },
    bio: {  
        type: String,
        default: "",
    },
    profileImage: {
        type: String,
        default: "",
    },
    occupation:{
      type: String,
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
}, { timestamps: true });

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
// const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
