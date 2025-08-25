import { Request, Response } from "express";
import User from "../../models/User";
import Vendor from "../../models/Vendor";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { mobile, password, userType } = req.body;

   
    if (!mobile || !password || !userType) {
      return res.status(400).json({
        success: false,
        message: "mobile, password and userType are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this mobile"
      });
    }

    const existingVendor = await Vendor.findOne({ mobile });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor already exists with this mobile"
      });
    }

   
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    let newData;

    if (userType == 1) {
    
      newData = new User({
        mobile,
        password,
        otp,
        otp_status: 1,
        status: 1
      });
    } else if (userType == 2) {
    
      newData = new Vendor({
        mobile,
        password,
        otp,
        otp_status: 1,
        status: 1
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid userType. Use 1 for User, 2 for Vendor"
      });
    }

    await newData.save();

    res.status(201).json({
  success: true,
  message: userType == 1 ? "User created successfully" : "Vendor created successfully",
  data: userType == 1 
    ? {
        userId: newData._id,
        otp: newData.otp,
        mobile: newData.mobile,
        userType: userType
      }
    : {
        vendorId: newData._id,
        otp: newData.otp,
        mobile: newData.mobile,
        userType: userType
      }
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: (error as Error).message
    });
  }
};




export const Otpvalidate = async (req: Request, res: Response) => {
  try {
    const { userType, otp, userId, vendorId } = req.body;

    if (!userType || !otp) {
      return res.status(400).json({
        success: false,
        message: "userType and otp are required",
      });
    }

    let data;

    if (userType == 1) {
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "userId is required for userType 1",
        });
      }

      data = await User.findOne({ _id: userId, otp, otp_status: 1 });

      if (!data) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP or already verified For User",
        });
      }

      data.otp_status = 2;
      await data.save();

      return res.status(200).json({
        success: true,
         userId:data._id,
        userType: 1,
        message: "OTP verified successfully",
      });
    } 
    
    else if (userType == 2) {
      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "vendorId is required for userType 2",
        });
      }

      data = await Vendor.findOne({ _id: vendorId, otp, otp_status: 1 });

      if (!data) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP or already verified  For Vendor",
        });
      }

      data.otp_status = 2;
      await data.save();

      return res.status(200).json({
        success: true,
        vendorId:data._id,
        userType: 2,
        message: "OTP verified successfully",
      });
    } 
    
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid userType",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};


const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { userType, userId, vendorId } = req.body;

    if (!userType) {
      return res.status(400).json({
        success: false,
        message: "userType is required",
      });
    }

    let otp = generateOtp();
    let data;

    if (userType == 1) {
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "userId is required when userType = 1",
        });
      }

      data = await User.findOneAndUpdate(
        { _id: userId },
        { otp: otp, otp_status: 1 }, 
        { new: true }
      );

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        userType,
        otp,
        userId,
        message: "OTP resent successfully to User",
      });
    } 
    
    else if (userType == 2) {
      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "vendorId is required when userType = 2",
        });
      }

      data = await Vendor.findOneAndUpdate(
        { _id: vendorId },
        { otp: otp, otp_status: 1 },
        { new: true }
      );

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      return res.status(200).json({
        success: true,
        userType,
        otp,
        vendorId,
        message: "OTP resent successfully to Vendor",
      });
    } 
    
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid userType. Use 1 for User, 2 for Vendor",
      });
    }

  } catch (error) {
    console.error("Error in resendOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};