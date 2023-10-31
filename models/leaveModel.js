const mongoose = require("mongoose");

const LeaveSchema = mongoose.Schema(
  {
    leavetype: {
      type: String,
      required: [true, "Please add the leave type"],
    },
    content: {
      type: String,
      required: [true, "Please add the leave content"]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Leave", LeaveSchema);
