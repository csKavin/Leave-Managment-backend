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

module.exports = {
  postLeave,
  getLeave
};
