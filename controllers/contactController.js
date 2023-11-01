const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.params.id });
  res.status(200).json(contacts);
});

const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json(contacts);
});

const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const { user_name, email, start_date, end_date, leave_type, description } = req.body;
  if ((!start_date || !end_date || !leave_type, !description, !user_name, !email)) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  const contact = await Contact.create({
    start_date,
    end_date,
    leave_type,
    description,
    status: "pending",
    user_id: req.user.id,
    user_name,
    email,
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
    if (!updatedRequest) {
      return res.status(404).json({ error: "Leave request not found" });
    }
    res.status(200).json({ message: "Leave status updated successfully", updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const RejectRequest = asyncHandler(async (req, res) => {
  try {
    const updatedRequest = await Contact.findByIdAndUpdate(req.params.id, { $set: { status: "rejected" } }, { new: true });
    console.log(updatedRequest);
    if (!updatedRequest) {
      return res.status(404).json({ error: "Leave request not found" });
    }
    res.status(200).json({ message: "Leave status updated successfully", updatedRequest });
  } catch (error) {
    console.error(error);
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
  getAllContacts,
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
  getUserContacts,
  RejectRequest,
};
