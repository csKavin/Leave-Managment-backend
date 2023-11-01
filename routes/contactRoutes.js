const express = require("express");
const router = express.Router();
const { getContacts,
    createContact, getContact, updateContact, deleteContact,
     getAllContacts,
      getUserContacts, RejectRequest
     } = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").post(createContact);
router.route("/user/:id").get(getContacts)
router.route("/all").get(getAllContacts);
router.route("/all").get(getUserContacts);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);
router.route("/reject/:id").put(RejectRequest);


module.exports = router;
