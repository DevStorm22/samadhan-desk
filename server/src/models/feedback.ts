import mongoose, { Document, Schema } from "mongoose";

export interface IFeedback extends Document {
  complaint: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  feedbackDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const FeedbackSchema: Schema = new Schema<IFeedback>(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500, default: "" },
    feedbackDate: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);

