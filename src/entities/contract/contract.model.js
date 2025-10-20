import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema(
    {
     fullName: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [200, "Title must be less than 200 characters"],
    },

    email: {
      type: String,
      required: [true, "Read time is required"],
      trim: true,
    },

    phoneNumber: {
      type: String,
      default: ""
    },

    occupation: {
      type: String, // URL or file path of the uploaded image
      default: "",
    },
     message:{
        type: String,
        required:[true, "Message must be wirte"],
        minlength:[3, "Message at lest 3 character"],
        maxlength:[300, "Message max 300 character"]
     },
     status:{
        type:String,
        enum: ['New', 'Respond'],
        default: 'New',
     }
},
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    versionKey: false,
  }

);

const Contract = mongoose.models.Contract || mongoose.model('Contract', contractSchema);

export default Contract;