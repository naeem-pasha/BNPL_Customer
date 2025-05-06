const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const User = require("../Model/user.model");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const userValidationSchema = require("../Utils/Validation.js");
const { default: axios } = require("axios");
const { data } = require("autoprefixer");
const { Axis3D } = require("lucide-react");

const createUser = async (req, res) => {
  try {
    // Validate the request body
    // const validatedData = userValidationSchema(req.body);

    const {
      _id,
      name,
      email,
      cnic,
      phoneNo,
      bikeColor,
      bikeVarient,
      bikeModel,
      EmployID,
      price,
      installment_tenure,
    } = req.body;

    console.log(price);

    // Generate random 8-character password
    const randomPassword = Math.random().toString(36).slice(-8);

    // Hash the password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    // Create a new user in the database
    const newUser = new User({
      _id,
      name,
      email,
      cnic,
      phoneNo,
      bikeColor,
      bikeVarient,
      bikeModel,
      password: hashedPassword,
      EmployID,
      price,
      installment_tenure,
    });
    await newUser.save();

    // Send credentials via email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or your email service provider
      auth: {
        user: "kashan.tech.io@gmail.com", // your email address
        pass: "oigk ecfe axuo pfcb", // your email password or app password
      },
    });

    const emailOptions = {
      from: "donotreply@example.com", // Sender's email
      to: email, // User's email
      subject: "Your Account Credentials",
      text: `Hello ${name},\n\nYour account has been created. Here are your credentials:\nEmail: ${email}\nPassword: ${randomPassword}\n\nYou can log in using the following link:\nhttp://3.89.161.124:7000\n\nThank you!`,
    };

    await transporter.sendMail(emailOptions);

    res
      .status(201)
      .json({ message: "User created successfully and credentials sent." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map((err) => ({
        field: err.path[0], // Field name
        message: err.message, // Validation message
      }));
      return res
        .status(400)
        .json({ message: "Validation failed", errors: validationErrors });
    }

    res.status(500).json({ message: "Internal User server error " });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not register with email",
      });
    }

    // 2. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // payload
      process.env.JWT_SECRET, // secret key from environment
      { expiresIn: process.env.JWT_EXPIRES_IN } // expiration time
    );

    // 4. Set cookie with token
    const cookieOptions = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    };

    res.cookie("jwt", token, cookieOptions);

    // 5. Remove password from output
    user.password = undefined;

    // 6. Send response
    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const checkingAuth = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "there is no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({
      success: true,
      message: "you authenticated",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "In Valid Token",
      error: error?.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({
      success: true,
      message: "Logout SuccessFully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "some thing went wrong",
      error: error?.message,
    });
  }
};

const ApprovedByBank = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await User.findByIdAndUpdate(id, { isAprovedByBank: true });

    res.status(200).json({
      success: true,
      message: "update Status Successfully",
      error: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error While Aproving by bank",
      error: error.message,
    });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ _id: id }).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "all good",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const assignNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { chasisNo, engineNo, status, distributerNo } = req.body;

    const responce = await User.findByIdAndUpdate(
      { _id: id },
      {
        chasisNo,
        engineNo,
        status,
        isAprovedByVendor: true,
        distributerNo,
        ownerShipTransfer: true,
      }
    ).select("-password");

    console.log(responce);
    res.status(201).json({
      success: true,
      message: " updated Successfully",
      data: responce,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "some thing wrong in user controller assignNumber",
      data: error?.message,
    });
  }
};

const rejectedBybank = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User is not found With that id",
      });
    }
    const result = await User.findByIdAndUpdate(
      { _id: id },
      { isRejectedByBank: true }
    );
    res.status(200).json({
      success: true,
      message: "Status Update Successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const finalAcceptence = async (req, res) => {
  try {
    const { id } = req.params;

    // Sending a PUT request to the external bank server
    const externalResponse = await axios.put(
      `${process.env.BANK_SERVER_URL}/api/request/update-finalAcceptence/${id}`
    );

    if (externalResponse.status !== 200) {
      return res.status(500).json({
        success: false,
        message: "Failed to update external service.",
        data: externalResponse.data,
      });
    }

    // Update the user's final acceptance and delivery letter status
    const result = await User.findByIdAndUpdate(
      id,
      {
        finalAcceptence: true,
        isPublishedDeliveryLetter: true,
      },
      { new: true, lean: true }
    ).select("-password");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "User final acceptance and delivery letter status updated successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error in finalAcceptence controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error in finalAcceptence controller.",
      error: error.message,
    });
  }
};

const acceptMusawamah = async (req, res) => {
  try {
    const { id } = req.params;

    const { data } = await axios.put(
      `${process.env.BANK_SERVER_URL}/api/request/accept-musawamah-user/${id}`
    );

    if (!data.success) {
      return res.status(500).json({
        success: false,
        message: "Error in acceptMusawamah user bank controller.",
      });
    }

    const result = await User.findByIdAndUpdate(
      id,
      { isAcceptMusawamah: true },
      { new: true, lean: true }
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in acceptMusawamah controller.",
      error: error.message,
    });
  }
};

const sendAutherizedToUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await User.findByIdAndUpdate(
      id,
      { isSendAutherizedToUser: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in sendAutherizedToUser controller.",
      error: error.message,
    });
  }
};

const sendInvoiceToUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await User.findByIdAndUpdate(
      id,
      { isSendInvoiceToUser: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in sendInvoiceToUser controller.",
      error: error.message,
    });
  }
};

const confirmationRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await User.findByIdAndUpdate(
      id,
      {
        confirmationRequest: true,
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const userAcceptDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    // Make PUT request to the bank server
    const bankResponse = await axios.put(
      `${process.env.BANK_SERVER_URL}/api/request/user-accept-delivery/${id}`
    );
    // Check if the bank response is successful
    if (bankResponse.status !== 200) {
      return res.status(400).json({
        success: false,
        message: `Bank service error: ${bankResponse.statusText}`,
      });
    }

    // Make PUT request to the vendor server
    const vendorResponse = await axios.put(
      `${process.env.VENDOR_SERVER_URL}/aprove/user-accept-delivery/${id}`
    );

    // Check if the vendor response is successful
    if (vendorResponse.status !== 200) {
      return res.status(400).json({
        success: false,
        message: `Vendor service error: ${vendorResponse.statusText}`,
      });
    }

    // Make PUT request to the vendor server
    const distributerResponse = await axios.put(
      `${process.env.DISTRIBUTER_SERVER_URL}/api/user-accept-delivery/${id}`
    );

    // Check if the vendor response is successful
    if (distributerResponse.status !== 200) {
      return res.status(400).json({
        success: false,
        message: `distributer service error: ${vendorResponse.statusText}`,
      });
    }

    // Update the User document in the database
    const result = await User.findByIdAndUpdate(
      id,
      {
        isUserAcceptDelivery: true,
      },
      { new: true }
    );

    // Check if the user is found and updated
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send a successful response
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    // Handle errors in the process
    console.error("Error accepting delivery:", error); // Optionally log the error for debugging

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getDistributerDetail = async (req, res) => {
  try {
    const { number } = req.params;

    const response = await axios.get(
      `${process.env.DISTRIBUTER_SERVER_URL}/api/get-distributer-detail/${number}`
    );
    if (response.status === 200) {
      return res.status(200).json({
        success: true,
        data: response.data,
      });
    } else {
      return res.status(response.status).json({
        success: false,
        message: "Failed to fetch distributor details",
        data: response.data,
      });
    }
  } catch (error) {
    console.error("Error fetching distributor detail:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching distributor details",
    });
  }
};

const assaignDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryDate } = req.body;
    if (!id || !deliveryDate) {
      return res
        .status(400)
        .json({ success: false, message: "ID and deliveryDate are required." });
    }

    const result = await User.findByIdAndUpdate(
      id,
      { deliveryDate },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "USer not found." });
    }

    res.status(200).json({
      message: "Delivery date updated successfully.",
      data: result,
      success: true,
    });
  } catch (error) {
    console.error("Error updating delivery date: in user", error);
    res.status(500).json({
      success: false,
      message: "Server error IN USER, please try again later.",
    });
  }
};

const rejectMusawamah = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // Update the user record locally
    const result = await User.findByIdAndUpdate(
      id,
      { isRejectMusawamah: true },
      { new: true }
    );

    // If user not found
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Notify the external bank server
    try {
      const { data } = await axios.put(
        `${process.env.BANK_SERVER_URL}/api/request/reject-musawamah-user/${id}`
      );
      // Optionally check the `data` for success if needed
    } catch (axiosError) {
      console.error("Failed to notify bank server:", axiosError.message);

      return res.status(200).json({
        success: true,
        message: "User rejected locally, but failed to notify bank server.",
        data: result,
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Musawamah request rejected successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Internal error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while rejecting the Musawamah request.",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  checkingAuth,
  logout,
  getUserDetail,
  assignNumber,
  rejectedBybank,
  ApprovedByBank,
  finalAcceptence,
  acceptMusawamah,
  sendAutherizedToUser,
  sendInvoiceToUser,
  confirmationRequest,
  userAcceptDelivery,
  getDistributerDetail,
  assaignDate,
  rejectMusawamah,
};
