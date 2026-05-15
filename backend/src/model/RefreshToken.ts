import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const refreshTokenSchema = new mongoose.Schema(
  {
    token:{
        type:String,
        required:true,
        unique:true,
    }
  },
  { timestamps: true }
);

refreshTokenSchema.plugin(uniqueValidator);

const token = mongoose.model("RefreshToken", refreshTokenSchema);
export default token;