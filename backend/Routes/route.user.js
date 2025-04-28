const { Router } = require("express");
const {
  createUser,
  loginUser,
  getUserDetail,
  rejectedBybank,
  ApprovedByBank,
  assignNumber,
  checkingAuth,
  logout,
  finalAcceptence,
  acceptMusawamah,
  sendAutherizedToUser,
  sendInvoiceToUser,
  confirmationRequest,
  userAcceptDelivery,
  getDistributerDetail,
  assaignDate,
  rejectMusawamah,
} = require("../Controller/user.js");
const authMiddleware = require("../Middleware/authmiddleware.js");

const route = Router();

route.post("/create-user", createUser);

route.post("/login", loginUser);

route.get("/check-auth", checkingAuth);

route.get("/logout", authMiddleware, logout);

route.get("/userDetail", authMiddleware, getUserDetail);

route.put("/approveByBank/:id", ApprovedByBank);

route.put("/assign-no/:id", assignNumber);

route.get("/rejectedbybank/:id", rejectedBybank);

route.put("/finalAcceptence/:id", finalAcceptence);

route.put("/accept-musawamah/:id", acceptMusawamah);

route.put("/send-autherized-user/:id", sendAutherizedToUser);

route.put("/send-invoice-user/:id", sendInvoiceToUser);

route.put("/confirmation-request/:id", confirmationRequest);

route.put("/accept-delivery/:id", userAcceptDelivery);

route.get("/get-distributer-detail/:number", getDistributerDetail);

route.put("/assaign-date/:id", assaignDate);

route.put("/rejected-musawamah/:id", rejectMusawamah);

module.exports = route;
