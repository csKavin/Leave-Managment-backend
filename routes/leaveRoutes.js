const express = require("express");

const validateToken = require("../middleware/validateTokenHandler");
const { postLeave, getLeave, deleteLeave } = require("../controllers/leaveController");

const router = express.Router();

router.use(validateToken);
router.route("/postleave").post(postLeave);
router.route("/getleave").get(getLeave);
router.route("/deleteLeave/:id").delete(deleteLeave);


module.exports = router;