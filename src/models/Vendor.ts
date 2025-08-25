import { Schema, model, Document } from "mongoose";

export interface IVendor extends Document {
  name: string;
  mobile: string;
  email?: string; 
  gender: "male" | "female" | "other";
  address?: string;
  password: string;
  profile?: string;
  otp?: number;
  otp_status?: number;
  status: number; 
}

const vendorSchema = new Schema<IVendor>(
  {
    name: { type: String },
    mobile: { type: String, unique: true },
    email: { type: String, unique: true, sparse: true }, 
    gender: { type: String, enum: ["male", "female", "other"] },
    address: { type: String },
    password: { type: String },
    profile: { type: String },
    otp: { type: Number },
    otp_status: { type: Number },
    status: { type: Number, enum: [0, 1, 2], default: 1 }
  },
  { timestamps: true }
);

export default model<IVendor>("Vendor", vendorSchema);
