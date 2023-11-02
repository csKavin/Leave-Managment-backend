const asyncHandler = require("express-async-handler");
const leaveModel = require("../models/leaveModel");

const getLeave = asyncHandler(async (req, res) => {
  const leave = await leaveModel.find();
  res.status(200).json(leave);
});

const postLeave = asyncHandler(async (req, res) => {
  const { leavetype, content } = req.body;
  if (!leavetype || !content) {
    res.status(400);
    throw new Error("All fields are manditory");
  }
  const Leave = await leaveModel.create({
    leavetype,
    content,
  });
  res.status(201).json(Leave);
});

const deleteLeave = asyncHandler(async (req, res) => {
  console.log("wee");
  const delLeave = await leaveModel.findById(req.params.id);
  if (!delLeave) {
    res.status(404);
    throw new Error("Leave not found");
  }
  // if (contact.user_id.toString() !== req.user.id) {
  //   res.status(403);
  //   throw new Error("User don't have permission to update other user contacts");
  // }
  await leaveModel.deleteOne({ _id: req.params.id });
  res.status(200).json(delLeave);
});

module.exports = {
  postLeave,
  getLeave,
  deleteLeave
};
