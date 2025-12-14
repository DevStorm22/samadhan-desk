import mongoose, { Document, Schema } from "mongoose";

export interface IPolitician extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PoliticianSchema: Schema = new Schema<IPolitician>(
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
  },
  { timestamps: true }
);

export default mongoose.model<IPolitician>("Politician", PoliticianSchema);

