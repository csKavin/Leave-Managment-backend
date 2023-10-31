const express = require("express");
const router = express.Router();
const { getContacts, createContact, getContact, updateContact, deleteContact, getAllContacts, getUserContacts, RejectRequest } = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getContacts).post(createContact);
router.route("/all").get(getAllContacts).get(getUserContacts);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);
router.route("/reject/:id").put(RejectRequest);


module.exports = router;
