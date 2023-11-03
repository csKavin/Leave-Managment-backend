const asyncHandler = require("express-async-handler");
const moment = require("moment/moment");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const Contact = require("../models/contactModel");
const leaveModel = require("../models/leaveModel");


const config = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};
const transporter = nodemailer.createTransport(config);
const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "TSquaredC",
    link: "https://mailgen.js/",
  },
});

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.params.id });
  res.status(200).json(contacts);
});

const dashboard = asyncHandler(async (req, res) => {
  try {
    const contacts = await Contact.find();
    const leave = await leaveModel.find();
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    let leaveCount = 0;
    if (contacts && leave) {
      contacts.forEach((item) => {
        if (item.status === "pending") {
          pendingCount++;
        } else if (item.status === "approved") {
          approvedCount++;
        } else if (item.status === "rejected") {
          rejectedCount++;
        }
      });
      leave.forEach((item) => {
        leaveCount++;
      });
    }
    let response = {
      totalLeave: leaveCount,
      pendingLeave: pendingCount,
      approvedLeave: approvedCount,
      rejectedLeave: rejectedCount,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: "Internal error" });
  }

});

const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json(contacts);
});

const createContact = asyncHandler(async (req, res) => {
  const { user_name, email, start_date, end_date, leave_type, description } = req.body;
  if ((!start_date || !end_date || !leave_type, !description, !user_name, !email)) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  const date1 = moment(start_date, 'ddd, DD MMM YYYY HH:mm:ss ZZ');
  const date2 = moment(end_date , 'ddd, DD MMM YYYY HH:mm:ss ZZ');
  const daysDifference = date2.diff(date1, 'days');

  const contact = await Contact.create({
    start_date : start_date,
    end_date : end_date,
    leave_type,
    description,
    status: "pending",
    user_id: req.user.id,
    user_name,
    email,
    daysDifference
  });

  res.status(201).json(contact);
});

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

const getUserContacts = asyncHandler(async (req, res) => {
  const contact = await Contact.find(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

const updateContact = asyncHandler(async (req, res) => {
  try {
    const updatedRequest = await Contact.findByIdAndUpdate(req.params.id, { $set: { status: "approved" } }, { new: true });
    const emailId = await Contact.findById(req.params.id);
    if (!updatedRequest) {
      return res.status(404).json({ error: "Leave request not found" });
    }
    let response = {
      body: {
        intro: "Your leave application approved by the admin",
      },
    };
    let mail = MailGenerator.generate(response);
    if (emailId) {
      let message = {
        from: process.env.EMAIL,
        to: emailId.email,
        subject: "Application for leave",
        html: mail,
      };
      transporter
        .sendMail(message)
        .then(() => {
          return res;
        })
        .catch((error) => {
          res.status(400).json({ error: "mail not send " });
          console.log("error");
        });
      res.status(200).json({ message: "Leave status accepted successfully and send through mail", updatedRequest });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const RejectRequest = asyncHandler(async (req, res) => {
  try {
    const updatedRequest = await Contact.findByIdAndUpdate(req.params.id, { $set: { status: "rejected" } }, { new: true });
    const emailId = await Contact.findById(req.params.id);
    if (!updatedRequest) {
      return res.status(404).json({ error: "Leave request not found" });
    }
    let response = {
      body: {
        intro: "Your leave application Rejected by the admin",
      },
    };
    let mail = MailGenerator.generate(response);
    let message = {
      from: process.env.EMAIL,
      to: emailId.email,
      subject: "Application for leave",
      html: mail,
    };
    transporter
      .sendMail(message)
      .then(() => {
        return res;
      })
      .catch((error) => {
        res.status(400).json({ error: "mail not send " });
      });
    res.status(200).json({ message: "Leave status updated successfully", updatedRequest });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  // if (contact.user_id.toString() !== req.user.id) {
  //   res.status(403);
  //   throw new Error("User don't have permission to update other user contacts");
  // }
  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(contact);
});

module.exports = {
  dashboard,
  getAllContacts,
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
  getUserContacts,
  RejectRequest,
};
