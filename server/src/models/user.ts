import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: "citizen" | "officer" | "admin" | "politician";
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      maxlength: 100,
    },
    password: { type: String, required: true },
    phone: { type: String, required: true, match: /^[0-9]{10}$/ },
    address: { type: String, required: true, maxlength: 255 },
    role: {
      type: String,
      enum: ["citizen", "officer", "admin", "politician"],
      default: "citizen",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);

