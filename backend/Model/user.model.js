const mongoose = require("mongoose");
const { type } = require("os");
const { boolean } = require("zod");

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    cnic: { type: String, required: true, unique: true },
    EmployID: { type: String, required: true },
    phoneNo: { type: String, required: true },
    isAprovedByBank: { type: Boolean, default: false },
    isAprovedByVendor: { type: Boolean, default: false },
    isRejectedByBank: { type: Boolean, default: false },
    ownerShipTransfer: { type: Boolean, default: false },
    bikeVarient: { type: String, require: true },
    bikeColor: { type: String, require: true },
    bikeModel: { type: Number },
    engineNo: { type: Number },
    chasisNo: { type: Number },
    status: { type: String },
    distributerNo: { type: Number },
    finalAcceptence: { type: Boolean, default: false },
    deliveryDate: { type: String },
    isPublishedDeliveryLetter: { type: Boolean, default: false },
    isAcceptMusawamah: { type: Boolean, default: false },
    isSendAutherizedToUser: { type: Boolean },
    isSendInvoiceToUser: { type: Boolean },
    confirmationRequest: { type: Boolean },
    isUserAcceptDelivery: { type: Boolean },
    price: { type: Number },
    installment_tenure: { type: Number },
    isRejectMusawamah: { type: Boolean },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
