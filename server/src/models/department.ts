import mongoose, { Document, Schema } from "mongoose";

export interface IDepartment extends Document {
  deptName: string;
  deptHead: string;
  email: string;
  phone: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const DepartmentSchema: Schema = new Schema<IDepartment>(
  {
    deptName: { type: String, required: true, unique: true, maxlength: 100 },
    deptHead: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 100 },
    phone: { type: String, required: true, match: /^[0-9]{10}$/ },
    description: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.model<IDepartment>("Department", DepartmentSchema);

