import mongoose, { Document, Schema } from "mongoose";

export interface IComplaint extends Document {
  user: mongoose.Types.ObjectId;
  department?: mongoose.Types.ObjectId;
  complaintType:
    | "Sanitation & Cleanliness"
    | "Water Supply"
    | "Electricity Issues"
    | "Roads & Infrastructure"
    | "Public Safety & Security"
    | "Environmental Issues"
    | "Government Service Issues"
    | "Health & Hygiene"
    | "Transport & Traffic"
    | "Other";
  description: string;
  location: string;
  submissionDate: Date;
  status: "Pending" | "Processing" | "Resolved" | "Solved";
  attachments?: Array<{ url: string; filename: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}

const ComplaintSchema: Schema = new Schema<IComplaint>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: false,
    },
    complaintType: {
      type: String,
      enum: [
        "Sanitation & Cleanliness",
        "Water Supply",
        "Electricity Issues",
        "Roads & Infrastructure",
        "Public Safety & Security",
        "Environmental Issues",
        "Government Service Issues",
        "Health & Hygiene",
        "Transport & Traffic",
        "Other",
      ],
      default: "Other",
    },
    description: { type: String, required: true, maxlength: 1000 },
    location: { type: String, required: true, maxlength: 255 },
    submissionDate: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Resolved", "Solved"],
      default: "Pending",
    },
    attachments: [{ url: String, filename: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IComplaint>("Complaint", ComplaintSchema);

